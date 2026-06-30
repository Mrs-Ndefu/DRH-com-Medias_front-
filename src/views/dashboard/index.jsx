import { useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from 'api/client';

import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import MainCard from 'components/MainCard';

// ── Palette atténuée (moins vive que les couleurs Bootstrap par défaut) ────────

const PALETTE = {
  primary: '#5b7fb0',
  success: '#5e9c7e',
  danger:  '#bb5f5f',
  warning: '#c0954f',
  info:    '#5fa39a',
  purple:  '#8580b3',
  muted:   '#9aa1a8',
};

const KPI_BASE = [
  { label: 'Total agents', icon: 'ph-users',          bg: PALETTE.primary },
  { label: 'Présents',     icon: 'ph-check-circle',   bg: PALETTE.success },
  { label: 'Absents',      icon: 'ph-x-circle',       bg: PALETTE.danger  },
  { label: 'En congé',     icon: 'ph-calendar-check', bg: PALETTE.warning },
  { label: 'Recrutements', icon: 'ph-briefcase',      bg: PALETTE.info    },
];

const CAL_TYPE_COLOR = {
  'conge-approuve': PALETTE.success,
  'conge-attente':  PALETTE.warning,
  'entretien':      PALETTE.primary,
};

// ── Composants internes ───────────────────────────────────────────────────────

function KpiCard({ kpi }) {
  return (
    <Card className="h-100 border-0 shadow-sm overflow-hidden">
      <Card.Body className="p-0">
        <div className="d-flex h-100">
          {/* Bande colorée gauche */}
          <div style={{ width: 6, background: kpi.bg, flexShrink: 0 }} />
          <div className="flex-grow-1 p-3">
            <div className="d-flex align-items-start justify-content-between mb-2">
              <div className={`rounded d-flex align-items-center justify-content-center text-white`}
                style={{ width: 44, height: 44, background: kpi.bg, opacity: 0.9 }}>
                <i className={`ph ${kpi.icon} f-22`} />
              </div>
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

function PresenceChart({ data, total }) {
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
        const pct    = total ? Math.round((d.present / total) * 100) : 0;
        const barH   = (pct / 100) * chartH;
        const x      = padL + i * step + (step - barW) / 2;
        const y      = chartH - barH;
        const color  = pct >= 80 ? PALETTE.success : pct >= 50 ? PALETTE.warning : PALETTE.danger;
        const isWE   = d.is_weekend;

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

function MiniCalendrier({ events = {} }) {
  const [moisOffset, setMoisOffset] = useState(0);
  const today = new Date();

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
    return events[ds] || [];
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
                <div className="rounded d-flex flex-column align-items-center justify-content-start pt-1 h-100"
                  style={{
                    fontSize: 11,
                    cursor: evts.length ? 'pointer' : 'default',
                    background: td ? PALETTE.primary : undefined,
                    color: td ? '#fff' : undefined,
                  }}>
                  <span className={`fw-${td ? 'bold' : 'normal'}`}>{d}</span>
                  <div className="d-flex gap-1 flex-wrap justify-content-center mt-auto pb-1">
                    {evts.slice(0, 2).map((e, i) => (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: td ? '#fff' : CAL_TYPE_COLOR[e.type] || PALETTE.muted,
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
          { color: PALETTE.success, label: 'Congé approuvé' },
          { color: PALETTE.warning, label: 'Congé en attente' },
          { color: PALETTE.primary, label: 'Entretien' },
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

const DIR_COLORS = [PALETTE.primary, PALETTE.info, PALETTE.success, PALETTE.warning, PALETTE.danger, PALETTE.purple];

function formatRelative(dateStr) {
  const d = new Date(dateStr);
  const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1)   return "À l'instant";
  if (diffMin < 60)  return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24)    return `Il y a ${diffH}h`;
  const diffJ = Math.floor(diffH / 24);
  if (diffJ === 1)   return `Hier, ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

export default function DashboardPage() {
  const { data: stats } = useSWR('/dashboard', fetcher);

  const directions = (stats?.directions || []).map(d => ({ ...d, agents: parseInt(d.agents) }));
  const totalDir    = directions.reduce((s, d) => s + d.agents, 0);
  const totalActifs = parseInt(stats?.agents?.actifs || 0);
  const presenceSemaine = stats?.presence_semaine || [];
  const alertes  = stats?.alertes  || [];
  const activites = stats?.activites || [];
  const calendrier = stats?.calendrier || {};

  const joursOuvres = presenceSemaine.filter(d => !d.is_weekend);
  const moyJour = joursOuvres.length ? Math.round(joursOuvres.reduce((s, d) => s + d.present, 0) / joursOuvres.length) : 0;
  const meilleurJour = joursOuvres.reduce((best, d) => (!best || d.present > best.present) ? d : best, null);
  const pireJour      = joursOuvres.reduce((worst, d) => (!worst || d.present < worst.present) ? d : worst, null);
  const pct = (d) => totalActifs ? Math.round((d.present / totalActifs) * 100) : 0;

  // Surcharger les KPI statiques avec les vraies données si disponibles
  const kpiData = stats ? [
    { ...KPI_BASE[0], value: parseInt(stats.agents?.total || 0),    sub: `${stats.agents?.actifs || 0} en activité` },
    { ...KPI_BASE[1], value: parseInt(stats.presences?.presents || 0), sub: `Présents aujourd'hui` },
    { ...KPI_BASE[2], value: parseInt(stats.presences?.absents || 0),  sub: `Absents aujourd'hui` },
    { ...KPI_BASE[3], value: parseInt(stats.conges?.en_cours || 0),    sub: `${stats.conges?.en_attente_chef || 0} en attente chef` },
    { ...KPI_BASE[4], value: parseInt(stats.recrutement?.offres_ouvertes || 0), sub: 'Offres ouvertes' },
  ] : KPI_BASE.map(k => ({ ...k, value: 0, sub: '…' }));

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
                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: PALETTE.success }} />
                  <span className="text-muted">≥ 80% présence</span>
                </span>
                <span className="d-flex align-items-center gap-1" style={{ fontSize: 12 }}>
                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: PALETTE.warning }} />
                  <span className="text-muted">50–79%</span>
                </span>
                <span className="d-flex align-items-center gap-1" style={{ fontSize: 12 }}>
                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: PALETTE.danger }} />
                  <span className="text-muted">&lt; 50%</span>
                </span>
              </div>
            }
          >
            <PresenceChart data={presenceSemaine} total={totalActifs} />
            {/* Récapitulatif ligne du bas */}
            <div className="d-flex gap-4 mt-3 pt-3 border-top flex-wrap">
              {[
                { label: 'Moy. semaine',     value: `${moyJour}`,                  sub: 'agents/jour (jours ouvrés)' },
                { label: 'Meilleur jour',    value: meilleurJour?.jour || '—',     sub: meilleurJour ? `${meilleurJour.present} présents (${pct(meilleurJour)}%)` : '—' },
                { label: 'Jour le plus bas', value: pireJour?.jour || '—',         sub: pireJour ? `${pireJour.present} présents (${pct(pireJour)}%)` : '—' },
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
            {directions.length === 0 ? (
              <p className="text-muted small text-center py-4 mb-0">Aucune donnée de répartition disponible.</p>
            ) : (
              <>
                {/* Donut SVG simplifié */}
                <div className="text-center mb-3">
                  <svg viewBox="0 0 120 120" width={120} height={120}>
                    {(() => {
                      const R = 45, cx = 60, cy = 60;
                      let startAngle = -Math.PI / 2;
                      return directions.map((d, i) => {
                        const angle = (d.agents / totalDir) * 2 * Math.PI;
                        const x1 = cx + R * Math.cos(startAngle);
                        const y1 = cy + R * Math.sin(startAngle);
                        const x2 = cx + R * Math.cos(startAngle + angle);
                        const y2 = cy + R * Math.sin(startAngle + angle);
                        const large = angle > Math.PI ? 1 : 0;
                        const path = `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
                        startAngle += angle;
                        return <path key={d.id} d={path} fill={DIR_COLORS[i % DIR_COLORS.length]} stroke="#fff" strokeWidth={2} />;
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
                  {directions.map((d, i) => {
                    const pctDir = totalDir ? Math.round((d.agents / totalDir) * 100) : 0;
                    const color  = DIR_COLORS[i % DIR_COLORS.length];
                    return (
                      <div key={d.id}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="d-flex align-items-center gap-2">
                            <span className="text-white text-center small fw-semibold rounded"
                              style={{ width: 40, background: color, padding: '2px 4px' }}>{d.sigle}</span>
                            <span className="small text-muted text-truncate" style={{ maxWidth: 130, fontSize: 11 }}>{d.nom}</span>
                          </div>
                          <span className="fw-semibold small">{d.agents}</span>
                        </div>
                        <div className="rounded-pill bg-light" style={{ height: 6, overflow: 'hidden' }}>
                          <div className="rounded-pill" style={{ width: `${pctDir}%`, height: '100%', background: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
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
                {alertes.length > 0 && <Badge bg="warning" text="dark" pill>{alertes.filter(a => a.niveau !== 'success').length}</Badge>}
              </div>
            }
          >
            {alertes.length === 0 ? (
              <p className="text-muted small text-center py-4 mb-0">Aucune alerte en cours.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {alertes.map((a) => (
                  <div key={a.id}
                    className={`d-flex gap-3 p-3 rounded border-start border-4 border-${a.niveau}`}
                    style={{ backgroundColor: `rgba(var(--bs-${a.niveau}-rgb),0.07)` }}>
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
            )}
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
            {activites.length === 0 ? (
              <p className="text-muted small text-center py-4 mb-0">Aucune activité récente.</p>
            ) : (
              <div className="position-relative">
                {/* Ligne verticale timeline */}
                <div style={{ position: 'absolute', left: 15, top: 8, bottom: 8, width: 2, background: '#e9ecef' }} />

                <div className="d-flex flex-column gap-0">
                  {activites.map((a, i) => (
                    <div key={a.id} className="d-flex gap-3 position-relative"
                      style={{ paddingBottom: i < activites.length - 1 ? 16 : 0 }}>
                      {/* Icône */}
                      <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-white bg-${a.color}`}
                        style={{ width: 32, height: 32, fontSize: 13, zIndex: 1, flexShrink: 0 }}>
                        <i className={`ph ${a.icon}`} />
                      </div>
                      {/* Texte */}
                      <div className="flex-grow-1 pt-1">
                        <div className="small">{a.msg}</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>{formatRelative(a.date)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            <MiniCalendrier events={calendrier} />
          </MainCard>
        </Col>
      </Row>
    </>
  );
}
