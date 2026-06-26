import { useState } from 'react';
import useSWR from 'swr';

// react-bootstrap
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

// project-imports
import MainCard from 'components/MainCard';
import { fetcher, api } from 'api/client';
import { useAuth } from 'contexts/AuthContext';
import LeavesDashboard from './components/LeavesDashboard';
import LeavesTable     from './components/LeavesTable';
import LeaveCalendar   from './components/LeaveCalendar';
import LeaveForm       from './components/LeaveForm';
import LeaveDetail     from './components/LeaveDetail';

const CONGES_KEY = '/conges';

const TABS = [
  { id: 'dashboard',  icon: 'ph-squares-four', label: 'Tableau de bord' },
  { id: 'demandes',   icon: 'ph-list',         label: 'Demandes'        },
  { id: 'calendrier', icon: 'ph-calendar',     label: 'Calendrier'      },
];

// Adapte les données API → format attendu par les composants enfants
function adaptLeave(c) {
  return {
    id:             c.id,
    employeeId:     c.agent_id,
    nom:            `${c.prenom || ''} ${c.nom_famille || ''}`.trim(),
    poste:          c.poste || '',
    matricule:      c.matricule || '',
    service:        c.direction_libelle || '',
    type:           c.type,
    dateDebut:      c.date_debut,
    dateFin:        c.date_fin,
    nbJours:        c.nb_jours,
    motif:          c.motif,
    status:         c.status,
    createdAt:      c.created_at,
    validationChef: c.validation_chef_date ? {
      date:        c.validation_chef_date,
      validatedBy: c.validation_chef_par,
      comment:     c.validation_chef_com,
    } : null,
    validationDRH: c.validation_drh_date ? {
      date:        c.validation_drh_date,
      validatedBy: c.validation_drh_par,
      comment:     c.validation_drh_com,
    } : null,
    rejection: c.rejet_date ? {
      date:       c.rejet_date,
      rejectedBy: c.rejet_par,
      motif:      c.rejet_motif,
    } : null,
  };
}

// ==============================|| MODULE LEAVE MANAGEMENT ||============================== //

export default function LeavesPage() {
  const { user }                        = useAuth();
  const [activeTab,     setActiveTab]   = useState('dashboard');
  const [showForm,      setShowForm]    = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const { data: raw, isLoading, mutate } = useSWR(CONGES_KEY, fetcher);
  const leaves = (raw?.data || []).map(adaptLeave);

  const refresh = () => mutate();

  const createLeave = async (data) => {
    await api.post('/conges', {
      agent_id:   data.employeeId,
      type:       data.type,
      date_debut: data.dateDebut,
      date_fin:   data.dateFin,
      nb_jours:   data.nbJours,
      motif:      data.motif,
      telephone:  data.telephone,
    });
    refresh();
  };

  const approveDRH = async (id, comment) => {
    await api.patch(`/conges/${id}/valider-drh`, {
      par: `${user?.prenom} ${user?.nom} — SG/DRH`,
      commentaire: comment,
      approuve: true,
    });
    refresh();
  };

  const rejectLeave = async (id, rejectedBy, motif) => {
    await api.patch(`/conges/${id}/valider-drh`, {
      par: rejectedBy,
      commentaire: motif,
      approuve: false,
    });
    refresh();
  };

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
                {isLoading && <Spinner animation="border" size="sm" variant="primary" />}
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
          onApproveDRH={approveDRH}
          onReject={rejectLeave}
        />
      )}
    </Row>
  );
}
