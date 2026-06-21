import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// react-bootstrap
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';

// project-imports
import MainCard from 'components/MainCard';
import { FAKE_BUREAUX, FAKE_DIRECTIONS, FAKE_DIVISIONS, FAKE_FONCTIONS, FAKE_GRADES, FAKE_SG_BUREAUX, FAKE_SG_DIVISIONS } from './data/org';
import OrgTree            from './components/OrgTree';
import SecretariatGeneral from './components/SecretariatGeneral';
import DirectionsList     from './components/DirectionsList';
import DivisionsList      from './components/DivisionsList';
import GradesList         from './components/GradesList';
import FonctionsList      from './components/FonctionsList';

const TABS = [
  { id: 'orgchart',    icon: 'ph-tree-structure', label: 'Organigramme'        },
  { id: 'secretariat', icon: 'ph-user-gear',      label: 'Secrétariat Général' },
  { id: 'directions',  icon: 'ph-buildings',      label: 'Directions'          },
  { id: 'divisions',   icon: 'ph-layout',         label: 'Divisions'           },
  { id: 'grades',      icon: 'ph-graduation-cap', label: 'Grades'              },
  { id: 'fonctions',   icon: 'ph-briefcase',      label: 'Fonctions'           },
];

// ==============================|| MODULE ORGANISATION ||============================== //

export default function OrganisationPage() {
  const [searchParams] = useSearchParams();
  const [activeTab,  setActiveTab]  = useState(searchParams.get('tab') || 'orgchart');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);
  const [directions,   setDirections]   = useState(FAKE_DIRECTIONS);
  const [divisions,    setDivisions]    = useState(FAKE_DIVISIONS);
  const [bureaux,      setBureaux]      = useState(FAKE_BUREAUX);
  const [grades,       setGrades]       = useState(FAKE_GRADES);
  const [fonctions,    setFonctions]    = useState(FAKE_FONCTIONS);
  const [sgDivisions,  setSgDivisions]  = useState(FAKE_SG_DIVISIONS);
  const [sgBureaux,    setSgBureaux]    = useState(FAKE_SG_BUREAUX);

  const pendingDirs = directions.filter(d => d.active).length;

  return (
    <Row>
      <Col xs={12}>
        <MainCard
          title={
            <div className="d-flex align-items-center gap-3">
              <i className="ph ph-tree-structure f-24 text-primary" />
              <span>Organisation du Ministère</span>
              <Badge bg="primary">{pendingDirs} directions</Badge>
              <Badge bg="info">{divisions.filter(d => d.active).length} divisions</Badge>
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
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {/* ── Contenu ── */}
          {activeTab === 'orgchart'    && <OrgTree            directions={directions} divisions={divisions} bureaux={bureaux} sgDivisions={sgDivisions} sgBureaux={sgBureaux} />}
          {activeTab === 'secretariat' && <SecretariatGeneral sgDivisions={sgDivisions} setSgDivisions={setSgDivisions} sgBureaux={sgBureaux} setSgBureaux={setSgBureaux} />}
          {activeTab === 'directions'  && <DirectionsList     directions={directions} divisions={divisions} setDirections={setDirections} />}
          {activeTab === 'divisions'   && <DivisionsList      divisions={divisions} bureaux={bureaux} directions={directions} setDivisions={setDivisions} />}
          {activeTab === 'grades'      && <GradesList         grades={grades} setGrades={setGrades} />}
          {activeTab === 'fonctions'   && <FonctionsList      fonctions={fonctions} setFonctions={setFonctions} />}
        </MainCard>
      </Col>
    </Row>
  );
}
