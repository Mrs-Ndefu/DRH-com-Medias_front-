import { useState } from 'react';

// react-bootstrap
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';

// project-imports
import MainCard from 'components/MainCard';
import { INITIAL_LEAVES } from './data/leaves';
import LeavesDashboard from './components/LeavesDashboard';
import LeavesTable     from './components/LeavesTable';
import LeaveCalendar   from './components/LeaveCalendar';
import LeaveForm       from './components/LeaveForm';
import LeaveDetail     from './components/LeaveDetail';

const nowStr = () => new Date().toISOString().split('T')[0];
let nextId = 100;

const TABS = [
  { id: 'dashboard',  icon: 'ph-squares-four', label: 'Tableau de bord' },
  { id: 'demandes',   icon: 'ph-list',         label: 'Demandes'        },
  { id: 'calendrier', icon: 'ph-calendar',     label: 'Calendrier'      },
];

// ==============================|| MODULE LEAVE MANAGEMENT ||============================== //

export default function LeavesPage() {
  const [activeTab,     setActiveTab]     = useState('dashboard');
  const [leaves,        setLeaves]        = useState(INITIAL_LEAVES);
  const [showForm,      setShowForm]      = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const updateLeave = (id, updates) =>
    setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));

  const createLeave = (data) => {
    const leaf = {
      id:             `LV${++nextId}`,
      createdAt:      nowStr(),
      validationChef: null,
      validationDRH:  null,
      rejection:      null,
      ...data,
    };
    setLeaves((prev) => [leaf, ...prev]);
  };

  const approveChef = (id, comment) =>
    updateLeave(id, {
      status:         'PENDING_DRH',
      validationChef: { date: nowStr(), validatedBy: 'Chef de service (vous)', comment },
    });

  const approveDRH = (id, comment) =>
    updateLeave(id, {
      status:        'APPROVED',
      validationDRH: { date: nowStr(), validatedBy: 'Directeur RH (vous)', comment },
    });

  const rejectLeave = (id, rejectedBy, motif) =>
    updateLeave(id, {
      status:    'REJECTED',
      rejection: { date: nowStr(), rejectedBy, motif },
    });

  const pendingCount = leaves.filter(
    (l) => l.status === 'PENDING_CHEF' || l.status === 'PENDING_DRH'
  ).length;

  const detailLeave = selectedLeave
    ? leaves.find((l) => l.id === selectedLeave.id) || null
    : null;

  return (
    <Row>
      <Col xs={12}>
        <MainCard
          title={
            <div className="d-flex align-items-center justify-content-between w-100 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-3">
                <i className="ph ph-calendar-check f-24 text-primary" />
                <span>Gestion des congés</span>
                {pendingCount > 0 && (
                  <Badge bg="warning" text="dark">
                    <i className="ph ph-clock me-1" />{pendingCount} en attente
                  </Badge>
                )}
              </div>
              <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
                <i className="ph ph-plus me-2" />Nouvelle demande
              </Button>
            </div>
          }
        >
          {/* ── Onglets ── */}
          <Nav variant="tabs" className="mb-4" activeKey={activeTab} onSelect={setActiveTab}>
            {TABS.map((tab) => (
              <Nav.Item key={tab.id}>
                <Nav.Link eventKey={tab.id} className="d-flex align-items-center gap-2">
                  <i className={`ph ${tab.icon}`} />
                  <span>{tab.label}</span>
                  {tab.id === 'demandes' && pendingCount > 0 && (
                    <Badge bg="warning" text="dark" pill>{pendingCount}</Badge>
                  )}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {/* ── Contenu ── */}
          {activeTab === 'dashboard'  && (
            <LeavesDashboard
              leaves={leaves}
              onSelect={setSelectedLeave}
              onNewRequest={() => setShowForm(true)}
            />
          )}
          {activeTab === 'demandes'   && <LeavesTable   leaves={leaves} onSelect={setSelectedLeave} />}
          {activeTab === 'calendrier' && <LeaveCalendar leaves={leaves} />}
        </MainCard>
      </Col>

      {/* ── Modals ── */}
      <LeaveForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={createLeave}
      />

      {detailLeave && (
        <LeaveDetail
          leave={detailLeave}
          onHide={() => setSelectedLeave(null)}
          onApproveChef={approveChef}
          onApproveDRH={approveDRH}
          onReject={rejectLeave}
        />
      )}
    </Row>
  );
}
