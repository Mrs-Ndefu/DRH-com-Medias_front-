import { useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from 'api/client';

import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';

import MainCard from 'components/MainCard';

// ── Données fictives ──────────────────────────────────────────────────────────

const TOTAL_AGENTS = 130;

const KPI = [
  { label: 'Total agents',     value: 130, sub: 'Effectif global',     icon: 'ph-users',          color: 'primary', bg: '#4680ff', trend: '+3 ce mois',  up: true  },
  { label: 'Présents',         value: 98,  sub: '75,4% de présence',   icon: 'ph-check-circle',   color: 'success', bg: '#2ca87f', trend: '+5 vs hier',  up: true  },
  { label: 'Absents',          value: 12,  sub: '9,2% absentéisme',    icon: 'ph-x-circle',       color: 'danger',  bg: '#dc3545', trend: '-2 vs hier',  up: false },
  { label: 'En congé',         value: 20,  sub: '15,4% de l\'effectif',icon: 'ph-calendar-check', color: 'warning', bg: '#e58a00', trend: '5 en attente',up: null  },
  { label: 'Recrutements',     value: 4,   sub: 'Offres ouvertes',     icon: 'ph-briefcase',      color: 'info',    bg: '#3ec9a7', trend: '+1 cette sem.',up: true  },
];

const PRESENCE_SEMAINE = [
  { jour: 'Lun 15', present: 105, absents: 8,  conge: 17 },
  { jour: 'Mar 16', present: 98,  absents: 12, conge: 20 },
  { jour: 'Mer 17', present: 110, absents: 5,  conge: 15 },
  { jour: 'Jeu 18', present: 102, absents: 10, conge: 18 },
  { jour: 'Ven 19', present: 95,  absents: 15, conge: 20 },
  { jour: 'Sam 20', present: 42,  absents: 0,  conge: 0  },
  { jour: 'Dim 21', present: 10,  absents: 0,  conge: 0  },
];

const DIRECTIONS = [
  { sigle: 'DRH', nom: 'Direction des Ressources Humaines',          agents: 45, color: 'primary' },
  { sigle: 'DAF', nom: 'Direction des Affaires Financières',         agents: 30, color: 'info'    },
  { sigle: 'DIT', nom: "Direction de l'Informatique",                agents: 22, color: 'success' },
  { sigle: 'DPL', nom: 'Direction de la Planification',              agents: 18, color: 'warning' },
  { sigle: 'DIJ', nom: "Direction de l'Inspection et du Juridique",  agents: 15, color: 'danger'  },
];

const ALERTES = [
  { id: 1, niveau: 'warning', icon: 'ph-clock',       titre: 'Congés en attente',   message: '5 demandes de congé en attente de validation DRH', lien: '/leaves'      },
  { id: 2, niveau: 'danger',  icon: 'ph-file-x',      titre: 'Contrats expirants',  message: '3 contrats arrivent à terme dans les 30 prochains jours', lien: '/agents' },
  { id: 3, niveau: 'warning', icon: 'ph-stethoscope', titre: 'Visites médicales',   message: '2 agents : visite médicale à renouveler avant le 30 juin', lien: null     },
  { id: 4, niveau: 'info',    icon: 'ph-briefcase',   titre: 'Poste vacant',        message: 'DIT : 1 poste vacant depuis 45 jours, aucun candidat retenu', lien: '/recruitment' },
  { id: 5, niveau: 'success', icon: 'ph-user-plus',   titre: 'Intégrations',        message: '2 nouvelles recrues en cours d\'intégration cette semaine', lien: null    },
];

const ACTIVITES = [
  { id: 1, icon: 'ph-calendar-check', color: 'warning',   time: 'Il y a 10 min',   msg: 'Demande de congé — Aminata Traoré (DRH) soumise pour validation'     },
  { id: 2, icon: 'ph-clock',          color: 'success',   time: 'Il y a 30 min',   msg: 'Pointage du matin — 98 agents présents enregistrés'                   },
  { id: 3, icon: 'ph-user-plus',      color: 'primary',   time: 'Il y a 1h',       msg: 'Nouvel agent créé : Ibrahim Coulibaly — Direction DRH'                },
  { id: 4, icon: 'ph-calendar',       color: 'info',      time: 'Il y a 2h',       msg: 'Entretien planifié : Moussa Koné — Poste DIT, le 25 juin 2026'       },
  { id: 5, icon: 'ph-check-circle',   color: 'success',   time: 'Hier, 16h30',     msg: 'Congé de Jean-Baptiste Yao approuvé par le Secrétaire Général'       },
  { id: 6, icon: 'ph-pencil',         color: 'secondary', time: 'Hier, 14h00',     msg: 'Dossier agent mis à jour : Fatoumata Camara — Grade modifié'          },
  { id: 7, icon: 'ph-briefcase',      color: 'primary',   time: 'Hier, 11h15',     msg: "Offre publiée : Administrateur Civil — Cat. A, 2 postes (DRH)"       },
  { id: 8, icon: 'ph-user-minus',     color: 'danger',    time: '20 juin, 09h00',  msg: 'Alerte absence injustifiée — Seydou Diabaté (DIT), 2e jour consécutif'},
];

// Juin 2026 — le 1er juin est un lundi
const CAL_EVENTS = {
  '2026-06-03': [{ label: 'Congé Traoré A.',  color: '#2ca87f' }],
  '2026-06-04': [{ label: 'Congé Traoré A.',  color: '#2ca87f' }],
  '2026-06-05': [{ label: 'Congé Traoré A.',  color: '#2ca87f' }],
  '2026-06-10': [{ label: 'Entretien Koné',   color: '#4680ff' }],
  '2026-06-11': [{ label: 'Entretien Diallo', color: '#4680ff' }],
  '2026-06-16': [{ label: 'Congé Yao J-B.',   color: '#e58a00' }],
  '2026-06-17': [{ label: 'Congé Yao J-B.',   color: '#e58a00' }],
  '2026-06-18': [{ label: 'Congé Yao J-B.',   color: '#e58a00' }],
  '2026-06-19': [{ label: 'Congé Yao J-B.',   color: '#e58a00' }],
  '2026-06-24': [{ label: 'Intégration Barry', color: '#7265e6'}],
  '2026-06-25': [{ label: 'Entretien Koné M.', color: '#4680ff'}],
  '2026-06-29': [{ label: 'Congé Sow N.',      color: '#2ca87f'}],
  '2026-06-30': [{ label: 'Congé Sow N.',      color: '#2ca87f'}],
};

// ── Composants internes ───────────────────────────────────────────────────────

function KpiCard({ kpi }) {
  return (
    <Card className="h-100 border-0 shadow-sm overflow-hidden">
      <Card.Body className="p-0">
        <div className="d-flex h-100">
          {/* Bande colorée gauche */}
          <div style={{ width: 6, background: `var(--bs-${kpi.color})`, flexShrink: 0 }} />
          <div className="flex-grow-1 p-3">
            <div className="d-flex align-items-start justify-content-between mb-2">
              <div className={`rounded d-flex align-items-center justify-content-center text-white`}
                style={{ width: 44, height: 44, background: kpi.bg, opacity: 0.9 }}>
                <i className={`ph ${kpi.icon} f-22`} />
              </div>
              {kpi.up !== null && (
                <Badge bg={kpi.up ? 'success' : 'danger'} className="d-flex align-items-center gap-1 fw-normal">
                  <i className={`ph ph-trend-${kpi.up ? 'up' : 'down'} f-12`} />
                  {kpi.trend}
                </Badge>
              )}
              {kpi.up === null && (
                <Badge bg="warning" text="dark" className="fw-normal">{kpi.trend}</Badge>
              )}
            </div>
            <h3 className="mb-0 fw-bold">{kpi.value.toLocaleString('fr-FR')}</h3>
            <div className="fw-semibold text-muted small">{kpi.label}</div>
            <div style={{ fontSize: 11, color: '#aaa' }}>{kpi.sub}</div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function PresenceChart({ data }) {
  const total   = TOTAL_AGENTS;
  const chartH  = 160;
  const padL    = 36;
  const padB    = 28;
  const nbBars  = data.length;
  const W       = 500;
  const barZone = W - padL;
  const barW    = Math.floor(barZone / nbBars * 0.55);
  const step    = barZone / nbBars;

  const yLines = [0, 25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${W} ${chartH + padB + 10}`} width="100%" style={{ display: 'block' }}>
      {/* Grille horizontale */}
      {yLines.map(pct => {
        const y = chartH - (pct / 100) * chartH;
        return (
          <g key={pct}>
            <line x1={padL} y1={y} x2={W} y2={y} stroke="#e9ecef" strokeWidth={1} />
            <text x={padL - 4} y={y + 4} textAnchor="end" fontSize={9} fill="#adb5bd">{pct}%</text>
          </g>
        );
      })}

      {/* Barres */}
      {data.map((d, i) => {
        const pct    = Math.round((d.present / total) * 100);
        const barH   = (pct / 100) * chartH;
        const x      = padL + i * step + (step - barW) / 2;
        const y      = chartH - barH;
        const color  = pct >= 80 ? '#2ca87f' : pct >= 50 ? '#e58a00' : '#dc3545';
        const isWE   = i >= 5;

        return (
          <g key={d.jour}>
            {/* Fond */}
            <rect x={x} y={0} width={barW} height={chartH} fill={isWE ? '#f8f9fa' : '#f1f3f5'} rx={4} />
            {/* Barre présence */}
            <rect x={x} y={y} width={barW} height={barH} fill={isWE ? '#ced4da' : color} rx={4} />
            {/* Valeur */}
            {!isWE && (
              <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize={9} fontWeight="600" fill={color}>
                {pct}%
              </text>
            )}
            {/* Jour */}
            <text x={x + barW / 2} y={chartH + padB - 6} textAnchor="middle" fontSize={9} fill={isWE ? '#adb5bd' : '#495057'}>
              {d.jour}
            </text>
          </g>
        );
      })}

      {/* Axe Y */}
      <line x1={padL} y1={0} x2={padL} y2={chartH} stroke="#dee2e6" strokeWidth={1} />
    </svg>
  );
}

function MiniCalendrier() {
  const [moisOffset, setMoisOffset] = useState(0);
  const today = new Date(2026, 5, 21); // 21 juin 2026

  const base = new Date(today.getFullYear(), today.getMonth() + moisOffset, 1);
  const annee = base.getFullYear();
  const mois  = base.getMonth();

  const nomsMois = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const joursNoms = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

  const premier = new Date(annee, mois, 1);
  const offset  = (premier.getDay() + 6) % 7; // lundi = 0
  const nbJours = new Date(annee, mois + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= nbJours; d++) cells.push(d);

  const isToday = (d) =>
    d && moisOffset === 0 &&
    new Date(annee, mois, d).toDateString() === today.toDateString();

  const eventsOf = (d) => {
    if (!d) return [];
    const ds = `${annee}-${String(mois + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    return CAL_EVENTS[ds] || [];
  };

  return (
    <div>
      {/* Navigation mois */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <button className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => setMoisOffset(p => p - 1)}>
          <i className="ph ph-caret-left" />
        </button>
        <span className="fw-semibold">{nomsMois[mois]} {annee}</span>
        <button className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => setMoisOffset(p => p + 1)}>
          <i className="ph ph-caret-right" />
        </button>
      </div>

      {/* En-tête jours */}
      <div className="d-grid mb-1" style={{ gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
        {joursNoms.map(j => (
          <div key={j} className="text-center text-muted" style={{ fontSize: 10, fontWeight: 600 }}>{j}</div>
        ))}
      </div>

      {/* Grille */}
      <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
        {cells.map((d, idx) => {
          const evts = eventsOf(d);
          const td = isToday(d);
          return (
            <div key={idx} style={{ minHeight: 36, position: 'relative' }}>
              {d && (
                <div className={`rounded d-flex flex-column align-items-center justify-content-start pt-1 h-100
                  ${td ? 'bg-primary text-white' : 'hover-bg'}`}
                  style={{ fontSize: 11, cursor: evts.length ? 'pointer' : 'default' }}>
                  <span className={`fw-${td ? 'bold' : 'normal'}`}>{d}</span>
                  <div className="d-flex gap-1 flex-wrap justify-content-center mt-auto pb-1">
                    {evts.slice(0, 2).map((e, i) => (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: td ? '#fff' : e.color,
                        flexShrink: 0,
                      }} title={e.label} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="d-flex flex-wrap gap-3 mt-3 pt-2 border-top">
        {[
          { color: '#2ca87f', label: 'Congé approuvé' },
          { color: '#e58a00', label: 'Congé en cours'  },
          { color: '#4680ff', label: 'Entretien'       },
          { color: '#7265e6', label: 'Intégration'     },
        ].map(l => (
          <div key={l.label} className="d-flex align-items-center gap-1">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: '#6c757d' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: stats } = useSWR('/dashboard', fetcher);
  const totalDir = DIRECTIONS.reduce((s, d) => s + d.agents, 0);

  // Surcharger les KPI statiques avec les vraies données si disponibles
  const kpiData = stats ? [
    { ...KPI[0], value: parseInt(stats.agents?.total || KPI[0].value),    sub: `${stats.agents?.actifs || 0} en activité` },
    { ...KPI[1], value: parseInt(stats.presences?.presents || KPI[1].value), sub: `Présents aujourd'hui` },
    { ...KPI[2], value: parseInt(stats.presences?.absents || KPI[2].value),  sub: `Absents aujourd'hui` },
    { ...KPI[3], value: parseInt(stats.conges?.en_cours || KPI[3].value),    sub: `${stats.conges?.en_attente_chef || 0} en attente chef` },
    { ...KPI[4], value: parseInt(stats.recrutement?.offres_ouvertes || KPI[4].value), sub: `Offres ouvertes` },
  ] : KPI;

  return (
    <>
      {/* ── Section 1 : KPI cards ── */}
      <Row className="g-3 mb-4">
        {kpiData.map((kpi) => (
          <Col key={kpi.label} xs={12} sm={6} xl>
            <KpiCard kpi={kpi} />
          </Col>
        ))}
      </Row>

      {/* ── Section 2+3 : Graphique présence + Répartition directions ── */}
      <Row className="g-3 mb-4">
        {/* Graphique présence */}
        <Col xs={12} xl={8}>
          <MainCard
            title={
              <div className="d-flex align-items-center gap-2">
                <i className="ph ph-chart-bar f-20 text-primary" />
                <span>Présence — 7 derniers jours</span>
              </div>
            }
            secondary={
              <div className="d-flex gap-3 align-items-center">
                <span className="d-flex align-items-center gap-1" style={{ fontSize: 12 }}>
                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#2ca87f' }} />
                  <span className="text-muted">≥ 80% présence</span>
                </span>
                <span className="d-flex align-items-center gap-1" style={{ fontSize: 12 }}>
                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#e58a00' }} />
                  <span className="text-muted">50–79%</span>
                </span>
                <span className="d-flex align-items-center gap-1" style={{ fontSize: 12 }}>
                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#dc3545' }} />
                  <span className="text-muted">&lt; 50%</span>
                </span>
              </div>
            }
          >
            <PresenceChart data={PRESENCE_SEMAINE} />
            {/* Récapitulatif ligne du bas */}
            <div className="d-flex gap-4 mt-3 pt-3 border-top flex-wrap">
              {[
                { label: "Moy. semaine", value: `${Math.round(PRESENCE_SEMAINE.slice(0,5).reduce((s,d)=>s+d.present,0)/5)}`, sub: 'agents/jour (jours ouvrés)' },
                { label: "Meilleur jour", value: 'Mer 17', sub: `110 présents (84,6%)` },
                { label: "Jour le plus bas", value: 'Ven 19', sub: `95 présents (73,1%)` },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-muted" style={{ fontSize: 11 }}>{s.label}</div>
                  <div className="fw-bold">{s.value}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </MainCard>
        </Col>

        {/* Répartition par direction */}
        <Col xs={12} xl={4}>
          <MainCard
            title={
              <div className="d-flex align-items-center gap-2">
                <i className="ph ph-buildings f-20 text-primary" />
                <span>Répartition par direction</span>
              </div>
            }
          >
            {/* Donut SVG simplifié */}
            <div className="text-center mb-3">
              <svg viewBox="0 0 120 120" width={120} height={120}>
                {(() => {
                  const R = 45, cx = 60, cy = 60;
                  let startAngle = -Math.PI / 2;
                  const colors = { primary:'#4680ff', info:'#3ec9a7', success:'#2ca87f', warning:'#e58a00', danger:'#dc3545' };
                  return DIRECTIONS.map((d) => {
                    const angle = (d.agents / totalDir) * 2 * Math.PI;
                    const x1 = cx + R * Math.cos(startAngle);
                    const y1 = cy + R * Math.sin(startAngle);
                    const x2 = cx + R * Math.cos(startAngle + angle);
                    const y2 = cy + R * Math.sin(startAngle + angle);
                    const large = angle > Math.PI ? 1 : 0;
                    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
                    startAngle += angle;
                    return <path key={d.sigle} d={path} fill={colors[d.color]} stroke="#fff" strokeWidth={2} />;
                  });
                })()}
                {/* Centre */}
                <circle cx={60} cy={60} r={28} fill="white" />
                <text x={60} y={57} textAnchor="middle" fontSize={14} fontWeight="700" fill="#333">{totalDir}</text>
                <text x={60} y={69} textAnchor="middle" fontSize={8}  fill="#888">agents</text>
              </svg>
            </div>

            {/* Barres de progression */}
            <div className="d-flex flex-column gap-3">
              {DIRECTIONS.map((d) => {
                const pct = Math.round((d.agents / totalDir) * 100);
                return (
                  <div key={d.sigle}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="d-flex align-items-center gap-2">
                        <Badge bg={d.color} style={{ width: 32 }}>{d.sigle}</Badge>
                        <span className="small text-muted text-truncate" style={{ maxWidth: 130, fontSize: 11 }}>{d.nom}</span>
                      </div>
                      <span className="fw-semibold small">{d.agents}</span>
                    </div>
                    <ProgressBar now={pct} variant={d.color} style={{ height: 6 }} />
                  </div>
                );
              })}
            </div>
          </MainCard>
        </Col>
      </Row>

      {/* ── Section 4+5+6 : Alertes + Activités + Calendrier ── */}
      <Row className="g-3">
        {/* Alertes RH */}
        <Col xs={12} lg={4}>
          <MainCard
            title={
              <div className="d-flex align-items-center gap-2">
                <i className="ph ph-warning f-20 text-warning" />
                <span>Alertes RH</span>
                <Badge bg="warning" text="dark" pill>{ALERTES.filter(a => a.niveau !== 'success').length}</Badge>
              </div>
            }
          >
            <div className="d-flex flex-column gap-2">
              {ALERTES.map((a) => (
                <div key={a.id}
                  className={`d-flex gap-3 p-3 rounded border-start border-4 border-${a.niveau}`}
                  style={{ background: `var(--bs-${a.niveau === 'warning' ? 'warning' : a.niveau === 'danger' ? 'danger' : a.niveau === 'success' ? 'success' : 'info'}, rgba(0,0,0,0.03))`, backgroundColor: `rgba(var(--bs-${a.niveau}-rgb),0.07)` }}>
                  <div className={`text-${a.niveau} flex-shrink-0 mt-1`}>
                    <i className={`ph ${a.icon} f-18`} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold small">{a.titre}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>{a.message}</div>
                    {a.lien && (
                      <Link to={a.lien} className={`text-${a.niveau} text-decoration-none`} style={{ fontSize: 11 }}>
                        Voir le détail <i className="ph ph-arrow-right ms-1" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </MainCard>
        </Col>

        {/* Activités récentes */}
        <Col xs={12} lg={4}>
          <MainCard
            title={
              <div className="d-flex align-items-center gap-2">
                <i className="ph ph-activity f-20 text-primary" />
                <span>Activités récentes</span>
              </div>
            }
          >
            <div className="position-relative">
              {/* Ligne verticale timeline */}
              <div style={{ position: 'absolute', left: 15, top: 8, bottom: 8, width: 2, background: '#e9ecef' }} />

              <div className="d-flex flex-column gap-0">
                {ACTIVITES.map((a, i) => (
                  <div key={a.id} className="d-flex gap-3 position-relative"
                    style={{ paddingBottom: i < ACTIVITES.length - 1 ? 16 : 0 }}>
                    {/* Icône */}
                    <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-white bg-${a.color}`}
                      style={{ width: 32, height: 32, fontSize: 13, zIndex: 1, flexShrink: 0 }}>
                      <i className={`ph ${a.icon}`} />
                    </div>
                    {/* Texte */}
                    <div className="flex-grow-1 pt-1">
                      <div className="small">{a.msg}</div>
                      <div className="text-muted" style={{ fontSize: 11 }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MainCard>
        </Col>

        {/* Calendrier RH */}
        <Col xs={12} lg={4}>
          <MainCard
            title={
              <div className="d-flex align-items-center gap-2">
                <i className="ph ph-calendar f-20 text-primary" />
                <span>Calendrier RH</span>
              </div>
            }
          >
            <MiniCalendrier />
          </MainCard>
        </Col>
      </Row>
    </>
  );
}
