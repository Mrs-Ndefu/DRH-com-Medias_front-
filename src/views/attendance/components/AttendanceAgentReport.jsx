import { useState } from 'react';
import useSWR from 'swr';

import Badge   from 'react-bootstrap/Badge';
import Button  from 'react-bootstrap/Button';
import Col     from 'react-bootstrap/Col';
import Form    from 'react-bootstrap/Form';
import Row     from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Table   from 'react-bootstrap/Table';

import MainCard  from 'components/MainCard';
import { fetcher } from 'api/client';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

const TRIMESTRES = [
  { value: 1, label: 'T1 — Janvier à Mars'    },
  { value: 2, label: 'T2 — Avril à Juin'      },
  { value: 3, label: 'T3 — Juillet à Septembre' },
  { value: 4, label: 'T4 — Octobre à Décembre' },
];

const STATUT = {
  PRESENT:    { label: 'Présent',    bg: 'success',   text: undefined, row: 'table-success' },
  RETARD:     { label: 'Retard',     bg: 'warning',   text: 'dark',   row: 'table-warning' },
  ABSENT:     { label: 'Absent',     bg: 'danger',    text: undefined, row: 'table-danger'  },
  CONGE:      { label: 'En congé',   bg: 'info',      text: undefined, row: 'table-info'    },
};

const MOIS = ['','Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

const fmtH = (s) => s ? s.substring(0, 5) : '—';
function calcDuree(e, s) {
  if (!e || !s) return '—';
  const [hE, mE] = e.split(':').map(Number);
  const [hS, mS] = s.split(':').map(Number);
  const d = hS*60+mS - (hE*60+mE);
  if (d <= 0) return '—';
  return `${Math.floor(d/60)}h${String(d%60).padStart(2,'0')}`;
}

async function downloadExport(format, agentId, trimestre, annee) {
  const token = localStorage.getItem('sirh_token');
  const suffix = format === 'excel' ? 'excel-trimestriel' : 'pdf-trimestriel';
  const url = `${API_BASE}/api/presences/export/${suffix}?agent_id=${agentId}&trimestre=${trimestre}&annee=${annee}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Erreur export`);
  const blob = await res.blob();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `rapport_T${trimestre}_${annee}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

// ==============================|| RAPPORT TRIMESTRIEL PAR AGENT ||============================== //

export default function AttendanceAgentReport({ agents }) {
  const anneeActuelle = new Date().getFullYear();
  const trimestreActuel = Math.ceil((new Date().getMonth() + 1) / 3);

  const [agentId,   setAgentId]   = useState('');
  const [trimestre, setTrimestre] = useState(trimestreActuel);
  const [annee,     setAnnee]     = useState(anneeActuelle);
  const [exportXls, setExportXls] = useState(false);
  const [exportPdf, setExportPdf] = useState(false);
  const [exportErr, setExportErr] = useState(null);

  const annees = Array.from({ length: 4 }, (_, i) => anneeActuelle - i);

  const swrKey = agentId
    ? `/presences/rapport-trimestriel?agent_id=${agentId}&trimestre=${trimestre}&annee=${annee}`
    : null;

  const { data, isLoading, error } = useSWR(swrKey, fetcher);

  const handleExport = async (format) => {
    setExportErr(null);
    if (format === 'excel') setExportXls(true);
    else                    setExportPdf(true);
    try { await downloadExport(format, agentId, trimestre, annee); }
    catch (e) { setExportErr(e.message); }
    finally {
      if (format === 'excel') setExportXls(false);
      else                    setExportPdf(false);
    }
  };

  // Grouper les jours par mois
  const moisGroupes = {};
  if (data?.jours) {
    data.jours.forEach(j => {
      if (!moisGroupes[j.mois]) moisGroupes[j.mois] = [];
      moisGroupes[j.mois].push(j);
    });
  }

  const { stats, agent } = data || {};

  const kpis = stats ? [
    { label: 'Jours ouvrés',    value: stats.nb_jours_ouvres,  color: 'primary',   icon: 'ph-calendar-blank' },
    { label: 'Présents',        value: stats.nb_presents,      color: 'success',   icon: 'ph-check-circle'   },
    { label: 'Retards',         value: stats.nb_retards,       color: 'warning',   icon: 'ph-warning-circle' },
    { label: 'Absents',         value: stats.nb_absents,       color: 'danger',    icon: 'ph-x-circle'       },
    { label: 'Congés',          value: stats.nb_conges,        color: 'info',      icon: 'ph-beach'          },
    { label: 'Taux présence',   value: `${stats.taux_presence}%`, color: 'secondary', icon: 'ph-chart-pie'  },
  ] : [];

  return (
    <>
      {/* Filtres */}
      <Row className="g-3 mb-4 align-items-end">
        <Col xs={12} sm={6} md={4}>
          <Form.Label className="small fw-semibold mb-1">Agent</Form.Label>
          <Form.Select
            value={agentId}
            onChange={e => setAgentId(e.target.value)}
            size="sm"
          >
            <option value="">— Sélectionner un agent —</option>
            {agents.map(a => (
              <option key={a.id} value={a.id}>
                {a.prenom} {a.nom_famille} — {a.matricule}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={6} sm={3} md={3}>
          <Form.Label className="small fw-semibold mb-1">Trimestre</Form.Label>
          <Form.Select size="sm" value={trimestre} onChange={e => setTrimestre(Number(e.target.value))}>
            {TRIMESTRES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={6} sm={3} md={2}>
          <Form.Label className="small fw-semibold mb-1">Année</Form.Label>
          <Form.Select size="sm" value={annee} onChange={e => setAnnee(Number(e.target.value))}>
            {annees.map(a => <option key={a} value={a}>{a}</option>)}
          </Form.Select>
        </Col>
        {data && (
          <Col xs={12} md="auto" className="ms-auto">
            <div className="d-flex gap-2">
              <Button variant="outline-success" size="sm" onClick={() => handleExport('excel')} disabled={exportXls}>
                {exportXls ? <><Spinner size="sm" className="me-1" />…</> : <><i className="ph ph-file-xls me-1" />Excel</>}
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => handleExport('pdf')} disabled={exportPdf}>
                {exportPdf ? <><Spinner size="sm" className="me-1" />…</> : <><i className="ph ph-file-pdf me-1" />PDF</>}
              </Button>
            </div>
            {exportErr && <p className="text-danger small mt-1 mb-0">{exportErr}</p>}
          </Col>
        )}
      </Row>

      {/* Placeholder initial */}
      {!agentId && (
        <div className="text-center text-muted py-5">
          <i className="ph ph-user-list f-48 d-block mb-3" style={{ fontSize: 64, opacity: 0.3 }} />
          <p>Sélectionnez un agent pour générer son rapport trimestriel</p>
        </div>
      )}

      {/* Chargement */}
      {agentId && isLoading && (
        <div className="text-center py-5">
          <Spinner variant="primary" />
          <p className="text-muted small mt-2">Génération du rapport…</p>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="alert alert-danger">
          <i className="ph ph-warning-circle me-2" />Erreur lors du chargement du rapport.
        </div>
      )}

      {/* Résultats */}
      {data && !isLoading && (
        <>
          {/* Fiche agent */}
          <div className="p-3 mb-4 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded d-flex align-items-center gap-3">
            <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
              style={{ width: 50, height: 50, fontSize: 18 }}>
              {agent?.prenom?.[0]}{agent?.nom_famille?.[0]}
            </div>
            <div>
              <h5 className="mb-0 fw-bold">{agent?.prenom} {agent?.nom_famille}</h5>
              <p className="text-muted small mb-0">
                <code className="me-2">{agent?.matricule}</code>
                {agent?.poste && <span className="me-2">{agent.poste}</span>}
                {agent?.direction_libelle && <span className="text-muted">· {agent.direction_libelle}</span>}
              </p>
            </div>
            <Badge bg="primary" className="ms-auto fs-6 px-3 py-2">
              {data.label} {data.annee}
            </Badge>
          </div>

          {/* KPIs */}
          <Row className="g-3 mb-4">
            {kpis.map(k => (
              <Col key={k.label} xs={6} sm={4} xl={2}>
                <MainCard>
                  <div className="text-center">
                    <div className={`rounded-circle bg-${k.color} bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-2`}
                      style={{ width: 44, height: 44 }}>
                      <i className={`ph ${k.icon} f-20 text-${k.color}`} />
                    </div>
                    <h4 className="mb-0 fw-bold">{k.value}</h4>
                    <small className="text-muted">{k.label}</small>
                  </div>
                </MainCard>
              </Col>
            ))}
          </Row>

          {/* Barre de progression */}
          <div className="mb-4">
            <div className="d-flex justify-content-between small mb-1">
              <span className="text-muted">Taux de présence</span>
              <span className="fw-semibold">{stats.taux_presence}%</span>
            </div>
            <div className="progress" style={{ height: 12, borderRadius: 6 }}>
              <div
                className={`progress-bar ${stats.taux_presence >= 80 ? 'bg-success' : stats.taux_presence >= 60 ? 'bg-warning' : 'bg-danger'}`}
                style={{ width: `${stats.taux_presence}%`, transition: 'width 0.6s ease' }}
              />
            </div>
          </div>

          {/* Tableaux par mois */}
          {Object.entries(moisGroupes).map(([mois, jours]) => (
            <div key={mois} className="mb-4">
              <h6 className="fw-bold text-primary border-bottom pb-2 mb-2">
                <i className="ph ph-calendar me-2" />{mois} {data.annee}
              </h6>
              <Table hover responsive className="align-middle" style={{ fontSize: 13 }}>
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Jour</th>
                    <th className="text-center">Entrée</th>
                    <th className="text-center">Sortie</th>
                    <th className="text-center">Durée</th>
                    <th className="text-center">Statut</th>
                    <th>Observation</th>
                  </tr>
                </thead>
                <tbody>
                  {jours.map(j => {
                    if (j.is_weekend) {
                      return (
                        <tr key={j.date} className="text-muted" style={{ background: '#f8f8f8' }}>
                          <td className="small">{new Date(j.date+'T12:00:00').toLocaleDateString('fr-FR', { day:'2-digit', month:'short' })}</td>
                          <td className="small">{j.jour}</td>
                          <td colSpan={5} className="text-center text-muted small fst-italic">Week-end</td>
                        </tr>
                      );
                    }
                    const p = j.presence;
                    const s = p ? (STATUT[p.statut] || { label: p.statut, bg: 'secondary', text: undefined, row: '' }) : null;
                    return (
                      <tr key={j.date} className={s?.row || ''}>
                        <td className="fw-semibold small">
                          {new Date(j.date+'T12:00:00').toLocaleDateString('fr-FR', { day:'2-digit', month:'short' })}
                        </td>
                        <td className="small">{j.jour}</td>
                        <td className="text-center fw-semibold">{p ? fmtH(p.heure_entree) : '—'}</td>
                        <td className="text-center text-muted">{p ? fmtH(p.heure_sortie) : '—'}</td>
                        <td className="text-center">{p ? calcDuree(p.heure_entree, p.heure_sortie) : '—'}</td>
                        <td className="text-center">
                          {p
                            ? <Badge bg={s.bg} text={s.text}>{s.label}</Badge>
                            : <span className="text-muted small fst-italic">Non pointé</span>}
                        </td>
                        <td className="text-muted small" title={p?.observation || ''}>
                          {p?.observation ? p.observation.substring(0, 40) + (p.observation.length > 40 ? '…' : '') : ''}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          ))}
        </>
      )}
    </>
  );
}
