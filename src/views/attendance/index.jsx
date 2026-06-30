import { useState } from 'react';
import useSWR, { mutate as swrMutate } from 'swr';

import Badge   from 'react-bootstrap/Badge';
import Col     from 'react-bootstrap/Col';
import Nav     from 'react-bootstrap/Nav';
import Row     from 'react-bootstrap/Row';

import MainCard               from 'components/MainCard';
import AttendanceScanner      from './components/AttendanceScanner';
import AttendanceList         from './components/AttendanceList';
import AttendanceReport       from './components/AttendanceReport';
import AttendanceAgentReport  from './components/AttendanceAgentReport';
import { fetcher }            from 'api/client';

const todayStr = new Date().toISOString().split('T')[0];

const TABS = [
  { id: 'scanner', icon: 'ph-fingerprint', label: 'Pointage'        },
  { id: 'list',    icon: 'ph-list',        label: 'Journal'         },
  { id: 'report',  icon: 'ph-chart-bar',   label: 'Rapport journalier' },
  { id: 'agent',   icon: 'ph-user-list',   label: 'Rapport agent'   },
];

// ==============================|| MODULE ATTENDANCE ||============================== //

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState('scanner');

  const { data: agentsData }   = useSWR('/agents?limit=500', fetcher);
  const { data: todayPresData } = useSWR(`/presences?date=${todayStr}`, fetcher, { refreshInterval: 30000 });

  const agents         = agentsData?.data || [];
  const todayPresences = todayPresData || [];
  const totalAujdhui   = todayPresences.filter(p => ['PRESENT', 'RETARD'].includes(p.statut)).length;

  const handleScanDone = () => {
    swrMutate(key => typeof key === 'string' && key.includes('/presences'));
  };

  return (
    <Row>
      <Col xs={12}>
        <MainCard
          title={
            <div className="d-flex align-items-center gap-3">
              <i className="ph ph-clock f-24 text-primary" />
              <span>Gestion des présences</span>
              <Badge bg="primary" className="ms-1">
                {totalAujdhui} présence{totalAujdhui > 1 ? 's' : ''} aujourd'hui
              </Badge>
            </div>
          }
        >
          {/* Bannière règles horaires */}
          <div className="alert alert-info d-flex align-items-center gap-3 py-2 mb-3 small">
            <i className="ph ph-clock f-18 flex-shrink-0" />
            <div>
              <strong>Règles de pointage :</strong>{' '}
              Entrée autorisée <span className="fw-semibold">06h00 – 09h45</span>{' '}
              (après 09h45 = <span className="text-warning fw-semibold">RETARD</span>) &bull;{' '}
              Sortie à partir de <span className="fw-semibold">15h45</span>{' '}
              (avant = sortie anticipée)
            </div>
          </div>

          {/* Navigation */}
          <Nav variant="tabs" className="mb-4" activeKey={activeTab} onSelect={setActiveTab}>
            {TABS.map((tab) => (
              <Nav.Item key={tab.id}>
                <Nav.Link eventKey={tab.id} className="d-flex align-items-center gap-2">
                  <i className={`ph ${tab.icon}`} />
                  <span>{tab.label}</span>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {activeTab === 'scanner' && (
            <AttendanceScanner onScanDone={handleScanDone} todayPresences={todayPresences} />
          )}
          {activeTab === 'list'    && <AttendanceList />}
          {activeTab === 'report'  && <AttendanceReport />}
          {activeTab === 'agent'   && <AttendanceAgentReport agents={agents} />}
        </MainCard>
      </Col>
    </Row>
  );
}
