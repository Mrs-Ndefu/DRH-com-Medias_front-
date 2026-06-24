import { useState } from 'react';
import useSWR from 'swr';

import Badge   from 'react-bootstrap/Badge';
import Col     from 'react-bootstrap/Col';
import Form    from 'react-bootstrap/Form';
import Row     from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Table   from 'react-bootstrap/Table';

import MainCard from 'components/MainCard';
import { fetcher } from 'api/client';

const todayStr = () => new Date().toISOString().split('T')[0];

const fmtHeure = (str) => (str ? str.substring(0, 5) : '—');
const fmtDate  = (str) =>
  new Date(str + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

function calcDuree(entree, sortie) {
  if (!entree || !sortie) return '—';
  const [hE, mE] = entree.split(':').map(Number);
  const [hS, mS] = sortie.split(':').map(Number);
  const diff = hS * 60 + mS - (hE * 60 + mE);
  if (diff <= 0) return '—';
  return `${Math.floor(diff / 60)}h${String(diff % 60).padStart(2, '0')}`;
}

const STATUT = {
  PRESENT: { label: 'Présent',  bg: 'success',   text: undefined },
  RETARD:  { label: 'Retard',   bg: 'warning',   text: 'dark'    },
  ABSENT:  { label: 'Absent',   bg: 'secondary', text: undefined },
  CONGE:   { label: 'En congé', bg: 'info',      text: undefined },
};

// ==============================|| POINTAGE — RAPPORT ||============================== //

export default function AttendanceReport() {
  const [dateFilter, setDateFilter] = useState(todayStr());

  const { data, isLoading } = useSWR(`/presences?date=${dateFilter}`, fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: true,
  });

  const presences   = data || [];
  const nbPresents  = presences.filter(p => p.statut === 'PRESENT').length;
  const nbRetards   = presences.filter(p => p.statut === 'RETARD').length;
  const nbSortis    = presences.filter(p => p.heure_sortie).length;
  const total       = presences.length;

  const kpis = [
    { label: 'Total pointages',      value: total,      icon: 'ph-users',          color: 'primary'   },
    { label: 'À l\'heure',           value: nbPresents, icon: 'ph-check-circle',   color: 'success'   },
    { label: 'Retards signalés',     value: nbRetards,  icon: 'ph-warning-circle', color: 'warning'   },
    { label: 'Sorties enregistrées', value: nbSortis,   icon: 'ph-sign-out',       color: 'secondary' },
  ];

  return (
    <>
      {/* Sélecteur de date */}
      <Row className="g-3 mb-4 align-items-end">
        <Col xs={12} sm={6} md={3}>
          <Form.Label className="small mb-1">Date du rapport</Form.Label>
          <Form.Control
            type="date"
            size="sm"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </Col>
        {dateFilter && (
          <Col xs={12} sm={6} md={6}>
            <p className="text-muted small mb-0">
              <i className="ph ph-calendar me-1" />{fmtDate(dateFilter)}
            </p>
          </Col>
        )}
      </Row>

      {/* KPI cards */}
      <Row className="g-3 mb-4">
        {kpis.map(kpi => (
          <Col key={kpi.label} xs={6} xl={3}>
            <MainCard>
              <div className="d-flex align-items-center gap-3">
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center bg-${kpi.color} bg-opacity-10 flex-shrink-0`}
                  style={{ width: 48, height: 48 }}
                >
                  <i className={`ph ${kpi.icon} f-20 text-${kpi.color}`} />
                </div>
                <div>
                  <h4 className="mb-0">{kpi.value}</h4>
                  <small className="text-muted">{kpi.label}</small>
                </div>
              </div>
            </MainCard>
          </Col>
        ))}
      </Row>

      {/* Tableau */}
      {isLoading ? (
        <div className="text-center py-4">
          <Spinner variant="primary" />
          <p className="text-muted small mt-2">Chargement du rapport…</p>
        </div>
      ) : (
        <Table hover responsive className="align-middle">
          <thead className="table-light">
            <tr>
              <th>Matricule</th>
              <th>Nom &amp; Prénom</th>
              <th>Direction</th>
              <th className="text-center">Entrée</th>
              <th className="text-center">Sortie</th>
              <th className="text-center">Durée</th>
              <th className="text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            {presences.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-5">
                  <i className="ph ph-chart-bar f-36 d-block mb-2" />
                  Aucune donnée de présence pour cette date
                </td>
              </tr>
            ) : (
              presences.map(p => {
                const s = STATUT[p.statut] || { label: p.statut, bg: 'secondary', text: undefined };
                return (
                  <tr key={p.id} className={p.statut === 'RETARD' ? 'table-warning' : ''}>
                    <td><code className="text-muted small">{p.matricule}</code></td>
                    <td>
                      <span className="fw-semibold">{p.prenom} {p.nom_famille}</span>
                      {p.statut === 'RETARD' && (
                        <Badge bg="warning" text="dark" className="ms-2 small">
                          <i className="ph ph-clock me-1" />Retard
                        </Badge>
                      )}
                    </td>
                    <td className="text-muted small">{p.direction_libelle || '—'}</td>
                    <td className="text-center fw-semibold">{fmtHeure(p.heure_entree)}</td>
                    <td className="text-center text-muted">{fmtHeure(p.heure_sortie)}</td>
                    <td className="text-center">{calcDuree(p.heure_entree, p.heure_sortie)}</td>
                    <td className="text-center">
                      <Badge bg={s.bg} text={s.text}>{s.label}</Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      )}
    </>
  );
}
