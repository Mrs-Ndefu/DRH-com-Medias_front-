import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';

import MainCard from 'components/MainCard';

import { FAKE_CANDIDATS, FAKE_ENTRETIENS, FAKE_INTEGRATIONS, FAKE_OFFRES } from './data/recruitment';
import OffresList    from './components/OffresList';
import CandidatsList from './components/CandidatsList';
import EntretiensList from './components/EntretiensList';
import IntegrationList from './components/IntegrationList';

const TABS = [
  { id: 'offres',      icon: 'ph-briefcase',  label: "Offres d'emploi" },
  { id: 'candidats',   icon: 'ph-users',       label: 'Candidats'       },
  { id: 'entretiens',  icon: 'ph-calendar',    label: 'Entretiens'      },
  { id: 'integration', icon: 'ph-user-plus',   label: 'Intégration'     },
];

// ==============================|| MODULE RECRUTEMENT ||============================== //

export default function RecruitmentPage() {
  const [searchParams] = useSearchParams();
  const [activeTab,    setActiveTab]    = useState(searchParams.get('tab') || 'offres');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const [offres,       setOffres]       = useState(FAKE_OFFRES);
  const [candidats,    setCandidats]    = useState(FAKE_CANDIDATS);
  const [entretiens,   setEntretiens]   = useState(FAKE_ENTRETIENS);
  const [integrations, setIntegrations] = useState(FAKE_INTEGRATIONS);
  const [filtreOffreId, setFiltreOffreId] = useState('');

  const goToCandidats = (offre) => {
    setFiltreOffreId(offre.id);
    setActiveTab('candidats');
  };

  const nbAttente    = candidats.filter(c => c.statut === 'EN_ATTENTE').length;
  const nbPlanifies  = entretiens.filter(e => e.statut === 'PLANIFIE').length;
  const nbIntegration = integrations.filter(i => i.statut === 'EN_COURS').length;

  const badgeTab = { offres: null, candidats: nbAttente, entretiens: nbPlanifies, integration: nbIntegration };

  return (
    <Row>
      <Col xs={12}>
        <MainCard
          title={
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <i className="ph ph-briefcase f-24 text-primary" />
              <span>Recrutement</span>
              <Badge bg="success">{offres.filter(o => o.statut === 'OUVERTE').length} offres ouvertes</Badge>
              <Badge bg="info">{candidats.length} candidats</Badge>
              {nbPlanifies > 0 && <Badge bg="warning" text="dark">{nbPlanifies} entretien{nbPlanifies > 1 ? 's' : ''} à venir</Badge>}
            </div>
          }
        >
          {/* ── Onglets ── */}
          <Nav variant="tabs" className="mb-4" activeKey={activeTab} onSelect={setActiveTab}>
            {TABS.map((tab) => (
              <Nav.Item key={tab.id}>
                <Nav.Link eventKey={tab.id} className="d-flex align-items-center gap-2">
                  <i className={`ph ${tab.icon}`} />
                  <span className="d-none d-sm-inline">{tab.label}</span>
                  {badgeTab[tab.id] > 0 && (
                    <Badge bg={tab.id === 'candidats' ? 'warning' : tab.id === 'entretiens' ? 'primary' : 'info'}
                      text={tab.id === 'candidats' ? 'dark' : 'white'} pill>
                      {badgeTab[tab.id]}
                    </Badge>
                  )}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {/* ── Contenu ── */}
          {activeTab === 'offres'      && <OffresList     offres={offres} candidats={candidats} setOffres={setOffres} onSelectOffre={goToCandidats} />}
          {activeTab === 'candidats'   && <CandidatsList  candidats={candidats} offres={offres} setCandidats={setCandidats} filtreOffreId={filtreOffreId} setFiltreOffreId={setFiltreOffreId} />}
          {activeTab === 'entretiens'  && <EntretiensList entretiens={entretiens} candidats={candidats} offres={offres} setEntretiens={setEntretiens} />}
          {activeTab === 'integration' && <IntegrationList integrations={integrations} setIntegrations={setIntegrations} />}
        </MainCard>
      </Col>
    </Row>
  );
}
