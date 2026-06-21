import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';

import MainCard from 'components/MainCard';

import { FAKE_BULLETINS, FAKE_DECLARATIONS, FAKE_ELEMENTS, FAKE_VIREMENTS, MOIS_NOMS } from './data/payroll';
import BulletinsList  from './components/BulletinsList';
import Declarations   from './components/Declarations';
import ElementsPaie   from './components/ElementsPaie';
import Virements      from './components/Virements';

// ── Formatters ────────────────────────────────────────────────────────────────

const fmt  = (n) => new Intl.NumberFormat('fr-FR').format(Math.round(n || 0)) + ' FCFA';
const fmtD = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

// ── Vue d'ensemble ────────────────────────────────────────────────────────────

function VueEnsemble({ bulletins, virements, declarations }) {
  const masseBrute = bulletins.reduce((s,b) => s + b.salaireBrut,  0);
  const masseNette = bulletins.reduce((s,b) => s + b.salaireNet,   0);
  const totalRet   = bulletins.reduce((s,b) => s + b.totalRetenues,0);

  const nbVires    = bulletins.filter(b => b.statut === 'VIRE').length;
  const nbValides  = bulletins.filter(b => b.statut === 'VALIDE').length;
  const nbCalcules = bulletins.filter(b => b.statut === 'CALCULE').length;

  const virAtente  = virements.filter(v => v.statut === 'EN_ATTENTE').length;
  const decAtente  = declarations.filter(d => d.statut === 'EN_ATTENTE' || d.statut === 'SOUMISE').length;

  const prochDec   = declarations
    .filter(d => d.statut === 'EN_ATTENTE')
    .sort((a,b) => (a.dateLimite||'').localeCompare(b.dateLimite||''))[0];

  // ── SVG barre horizontale par agent ──────────────────────────────────────
  const maxNet = Math.max(...bulletins.map(b => b.salaireNet), 1);
  const BAR_W  = 340;

  // ── Donut répartition ────────────────────────────────────────────────────
  const pctRet  = masseBrute > 0 ? totalRet / masseBrute : 0;
  const pctNet  = 1 - pctRet;
  const R = 54; const CX = 65; const CY = 65;
  const circ  = 2 * Math.PI * R;
  const dashN = circ * pctNet;
  const dashR = circ * pctRet;

  return (
    <>
      {/* ── KPI cards ── */}
      <Row className="g-3 mb-4">
        {[
          { label: 'Masse salariale brute', value: fmt(masseBrute), icon: 'ph-money',         color: 'primary', sub: `Juin 2026` },
          { label: 'Masse salariale nette', value: fmt(masseNette), icon: 'ph-wallet',         color: 'success', sub: `${bulletins.length} agents` },
          { label: 'Bulletins validés',     value: nbValides,       icon: 'ph-check-circle',   color: 'info',    sub: `${nbCalcules} à valider` },
          { label: 'Bulletins virés',       value: nbVires,         icon: 'ph-paper-plane-tilt',color: 'warning', sub: `${virAtente} ordre(s) en attente` },
          { label: 'Déclarations en attente',value: decAtente,      icon: 'ph-file-text',      color: 'danger',  sub: prochDec ? `Échéance ${fmtD(prochDec.dateLimite)}` : 'Aucune urgente' },
        ].map(k => (
          <Col key={k.label} xs={12} sm={6} md={4} lg>
            <div className={`border border-${k.color} border-opacity-25 rounded p-3 h-100 bg-${k.color} bg-opacity-10`}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <small className="text-muted fw-semibold">{k.label}</small>
                <div className={`bg-${k.color} bg-opacity-20 rounded p-1`}>
                  <i className={`ph ${k.icon} text-${k.color}`} style={{ fontSize: 18 }} />
                </div>
              </div>
              <div className={`fw-bold fs-5 text-${k.color}`}>{k.value}</div>
              <small className="text-muted">{k.sub}</small>
            </div>
          </Col>
        ))}
      </Row>

      <Row className="g-3">
        {/* ── Barres par agent ── */}
        <Col xs={12} md={7}>
          <div className="border rounded p-3 h-100">
            <h6 className="mb-3 text-muted">
              <i className="ph ph-chart-bar me-2 text-primary" />Net à payer par agent — Juin 2026
            </h6>
            <svg viewBox={`0 0 420 ${bulletins.length * 36 + 10}`} width="100%">
              {bulletins.map((b, i) => {
                const bw = (b.salaireNet / maxNet) * BAR_W;
                const y  = i * 36 + 6;
                const col = b.statut === 'VIRE' ? '#0d6efd' : b.statut === 'VALIDE' ? '#198754' : '#6c757d';
                return (
                  <g key={b.id}>
                    <text x={0} y={y + 13} fontSize={10} fill="#6c757d">{b.prenom[0]}. {b.nom}</text>
                    <rect x={75} y={y} width={Math.max(bw, 4)} height={22} rx={4} fill={col} fillOpacity={0.8} />
                    <text x={75 + Math.max(bw, 4) + 4} y={y + 14} fontSize={9} fill="#333">
                      {new Intl.NumberFormat('fr-FR').format(Math.round(b.salaireNet))}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="d-flex gap-3 mt-2">
              {[['#0d6efd','Viré'],['#198754','Validé'],['#6c757d','Calculé']].map(([c,l]) => (
                <span key={l} className="d-flex align-items-center gap-1" style={{ fontSize: 11 }}>
                  <span style={{ width:10, height:10, background:c, borderRadius:2, display:'inline-block' }} />
                  <span className="text-muted">{l}</span>
                </span>
              ))}
            </div>
          </div>
        </Col>

        {/* ── Donut + récapitulatif ── */}
        <Col xs={12} md={5}>
          <div className="border rounded p-3 h-100">
            <h6 className="mb-3 text-muted">
              <i className="ph ph-chart-pie me-2 text-primary" />Répartition de la masse salariale
            </h6>
            <div className="d-flex align-items-center gap-4">
              <svg viewBox="0 0 130 130" width={130} height={130}>
                <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e9ecef" strokeWidth={18} />
                <circle cx={CX} cy={CY} r={R} fill="none" stroke="#198754" strokeWidth={18}
                  strokeDasharray={`${dashN} ${circ}`} strokeDashoffset={circ * 0.25}
                  strokeLinecap="round" />
                <circle cx={CX} cy={CY} r={R} fill="none" stroke="#dc3545" strokeWidth={18}
                  strokeDasharray={`${dashR} ${circ}`} strokeDashoffset={circ * 0.25 - dashN}
                  strokeLinecap="round" />
                <text x={CX} y={CY - 5}  textAnchor="middle" fontSize={11} fill="#333" fontWeight="600">
                  {Math.round(pctNet * 100)}%
                </text>
                <text x={CX} y={CY + 10} textAnchor="middle" fontSize={9} fill="#6c757d">Net</text>
              </svg>
              <div className="flex-grow-1">
                {[
                  { label: 'Salaire brut',  value: fmt(masseBrute), color: '#0d6efd' },
                  { label: 'Net à payer',   value: fmt(masseNette), color: '#198754' },
                  { label: 'Total retenues',value: fmt(totalRet),   color: '#dc3545' },
                ].map(r => (
                  <div key={r.label} className="d-flex justify-content-between align-items-center py-1 border-bottom">
                    <span className="d-flex align-items-center gap-1" style={{ fontSize: 12 }}>
                      <span style={{ width:8, height:8, background:r.color, borderRadius:'50%', display:'inline-block' }} />
                      {r.label}
                    </span>
                    <span className="fw-semibold" style={{ fontSize: 11 }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tableau récap par statut */}
            <div className="mt-3">
              <div className="d-flex justify-content-between text-muted mb-1" style={{ fontSize: 11 }}>
                <span>Avancement Juin 2026</span>
                <span>{bulletins.length} agents</span>
              </div>
              <div className="progress" style={{ height: 8 }}>
                {[
                  { key:'VIRE',    pct: nbVires/bulletins.length*100,   color:'primary' },
                  { key:'VALIDE',  pct: nbValides/bulletins.length*100, color:'success' },
                  { key:'CALCULE', pct: nbCalcules/bulletins.length*100,color:'secondary'},
                ].map(s => (
                  <div key={s.key} className={`progress-bar bg-${s.color}`} style={{ width:`${s.pct}%` }} />
                ))}
              </div>
              <div className="d-flex gap-3 mt-1">
                {[['primary','Viré',nbVires],['success','Validé',nbValides],['secondary','Calculé',nbCalcules]].map(([c,l,n])=>(
                  <span key={l} style={{ fontSize:10 }} className="text-muted">
                    <Badge bg={c} className="me-1">{n}</Badge>{l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Col>

        {/* ── Prochaines échéances ── */}
        <Col xs={12}>
          <div className="border rounded p-3">
            <h6 className="mb-3 text-muted">
              <i className="ph ph-calendar-check me-2 text-primary" />Prochaines échéances déclaratives
            </h6>
            <Row className="g-2">
              {declarations.filter(d => ['EN_ATTENTE','SOUMISE'].includes(d.statut)).map(d => {
                const isLate = d.dateLimite && new Date(d.dateLimite) < new Date();
                return (
                  <Col key={d.id} xs={12} md={4}>
                    <div className={`border border-${isLate ? 'danger' : 'warning'} border-opacity-50 rounded p-2`}>
                      <div className="d-flex justify-content-between align-items-center">
                        <Badge bg={d.type === 'INPS' ? 'primary' : d.type === 'CANAM' ? 'info' : 'warning'}>
                          {d.type}
                        </Badge>
                        <small className={`fw-bold ${isLate ? 'text-danger' : 'text-warning'}`}>
                          {isLate && <i className="ph ph-warning me-1" />}
                          {fmtD(d.dateLimite)}
                        </small>
                      </div>
                      <div className="small fw-semibold mt-1">{d.libelle}</div>
                      <div className="text-muted" style={{ fontSize: 11 }}>
                        Montant : {fmt(d.montantTotal)}
                      </div>
                    </div>
                  </Col>
                );
              })}
              {declarations.filter(d => ['EN_ATTENTE','SOUMISE'].includes(d.statut)).length === 0 && (
                <Col>
                  <div className="text-center text-muted py-2">
                    <i className="ph ph-check-circle text-success me-2" />Aucune déclaration en attente
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
}

// ── Onglets config ────────────────────────────────────────────────────────────

const TABS = [
  { key: 'apercu',       label: "Vue d'ensemble",    icon: 'ph-squares-four'      },
  { key: 'bulletins',    label: 'Bulletins de paie', icon: 'ph-file-text'         },
  { key: 'elements',     label: "Éléments de paie",  icon: 'ph-list-bullets'      },
  { key: 'virements',    label: 'Virements',          icon: 'ph-paper-plane-tilt'  },
  { key: 'declarations', label: 'Déclarations',       icon: 'ph-stamp'             },
];

// ==============================|| PAIE — PAGE PRINCIPALE ||============================== //

export default function PayrollPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('apercu');

  const [bulletins,    setBulletins]    = useState(FAKE_BULLETINS);
  const [elements,     setElements]     = useState(FAKE_ELEMENTS);
  const [virements,    setVirements]    = useState(FAKE_VIREMENTS);
  const [declarations, setDeclarations] = useState(FAKE_DECLARATIONS);

  // Nb badges
  const nbCalcules = bulletins.filter(b => b.statut === 'CALCULE').length;
  const nbValides  = bulletins.filter(b => b.statut === 'VALIDE').length;
  const nbDecPend  = declarations.filter(d => d.statut === 'EN_ATTENTE' || d.statut === 'SOUMISE').length;
  const nbVirPend  = virements.filter(v => v.statut === 'EN_ATTENTE').length;

  const badges = {
    bulletins:    nbCalcules + nbValides > 0 ? nbCalcules + nbValides : null,
    virements:    nbVirPend  > 0 ? nbVirPend  : null,
    declarations: nbDecPend  > 0 ? nbDecPend  : null,
  };

  // Sync tab with ?tab= param
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && TABS.some(t => t.key === tab)) setActiveTab(tab);
  }, [searchParams]);

  const goTab = (key) => {
    setActiveTab(key);
    setSearchParams(key === 'apercu' ? {} : { tab: key });
  };

  return (
    <Row>
      <Col xs={12}>
        <MainCard
          title={
            <span>
              <i className="ph ph-money me-2 text-primary" />
              Service de la paie — Juin 2026
            </span>
          }
        >
          {/* ── Navigation onglets ── */}
          <Nav variant="tabs" className="mb-4" activeKey={activeTab} onSelect={goTab}>
            {TABS.map(t => (
              <Nav.Item key={t.key}>
                <Nav.Link eventKey={t.key} className="d-flex align-items-center gap-2">
                  <i className={`ph ${t.icon}`} />
                  {t.label}
                  {badges[t.key] && (
                    <Badge bg="danger" pill style={{ fontSize: 10 }}>{badges[t.key]}</Badge>
                  )}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {/* ── Contenu ── */}
          {activeTab === 'apercu' && (
            <VueEnsemble bulletins={bulletins} virements={virements} declarations={declarations} />
          )}
          {activeTab === 'bulletins' && (
            <BulletinsList bulletins={bulletins} setBulletins={setBulletins} />
          )}
          {activeTab === 'elements' && (
            <ElementsPaie elements={elements} setElements={setElements} />
          )}
          {activeTab === 'virements' && (
            <Virements virements={virements} setVirements={setVirements} bulletins={bulletins} />
          )}
          {activeTab === 'declarations' && (
            <Declarations declarations={declarations} setDeclarations={setDeclarations} />
          )}
        </MainCard>
      </Col>
    </Row>
  );
}
