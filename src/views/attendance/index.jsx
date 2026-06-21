import { useState } from 'react';

// react-bootstrap
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';

// project-imports
import MainCard from 'components/MainCard';
import AttendanceScanner from './components/AttendanceScanner';
import AttendanceList    from './components/AttendanceList';
import AttendanceReport  from './components/AttendanceReport';

// ── Données initiales (simulées) ────────────────────────────────────────────────
const todayStr = new Date().toISOString().split('T')[0];
const t = (h, m) => new Date(`${todayStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);

const INITIAL_RECORDS = [
  { id: 1, employeeId: 'EMP001', nom: 'Mamadou Koné',      poste: 'Directeur adjoint',       matricule: '2019045', type: 'IN',  timestamp: t(7, 45), date: todayStr },
  { id: 2, employeeId: 'EMP002', nom: 'Aminata Traoré',    poste: 'Chef de service RH',       matricule: '2020112', type: 'IN',  timestamp: t(8,  2), date: todayStr },
  { id: 3, employeeId: 'EMP003', nom: 'Jean-Baptiste Yao', poste: 'Administrateur principal', matricule: '2018033', type: 'IN',  timestamp: t(8, 15), date: todayStr },
  { id: 4, employeeId: 'EMP001', nom: 'Mamadou Koné',      poste: 'Directeur adjoint',       matricule: '2019045', type: 'OUT', timestamp: t(12,30), date: todayStr },
  { id: 5, employeeId: 'EMP004', nom: 'Fatoumata Camara',  poste: 'Secrétaire de direction', matricule: '2021089', type: 'IN',  timestamp: t(8, 55), date: todayStr },
  { id: 6, employeeId: 'EMP007', nom: 'Abdoulaye Barry',   poste: 'Inspecteur principal',    matricule: '2017022', type: 'IN',  timestamp: t(9, 10), date: todayStr },
  { id: 7, employeeId: 'EMP007', nom: 'Abdoulaye Barry',   poste: 'Inspecteur principal',    matricule: '2017022', type: 'OUT', timestamp: t(12,15), date: todayStr },
  { id: 8, employeeId: 'EMP006', nom: 'Ndeye Sow',         poste: 'Chargée de mission',      matricule: '2020078', type: 'IN',  timestamp: t(8, 30), date: todayStr },
];

const TABS = [
  { id: 'scanner', icon: 'ph-fingerprint', label: 'Pointage'     },
  { id: 'list',    icon: 'ph-list',        label: 'Journal'      },
  { id: 'report',  icon: 'ph-chart-bar',   label: 'Rapport'      },
];

// ==============================|| MODULE ATTENDANCE ||============================== //

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [records,   setRecords]   = useState(INITIAL_RECORDS);

  const addRecord = (record) => setRecords((prev) => [record, ...prev]);

  const todayCount = records.filter((r) => r.date === todayStr && r.type === 'IN').length;

  return (
    <Row>
      <Col xs={12}>
        <MainCard
          title={
            <div className="d-flex align-items-center gap-3">
              <i className="ph ph-clock f-24 text-primary" />
              <span>Gestion des présences</span>
              <Badge bg="primary" className="ms-1">{todayCount} présence{todayCount > 1 ? 's' : ''} aujourd'hui</Badge>
            </div>
          }
        >
          {/* ── Navigation ── */}
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

          {/* ── Contenu ── */}
          {activeTab === 'scanner' && <AttendanceScanner records={records} onScan={addRecord} />}
          {activeTab === 'list'    && <AttendanceList    records={records} />}
          {activeTab === 'report'  && <AttendanceReport  records={records} />}
        </MainCard>
      </Col>
    </Row>
  );
}
