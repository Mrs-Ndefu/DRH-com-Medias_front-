import { useState } from 'react';
import useSWR from 'swr';

import Badge   from 'react-bootstrap/Badge';
import Button  from 'react-bootstrap/Button';
import Col     from 'react-bootstrap/Col';
import Form    from 'react-bootstrap/Form';
import Row     from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Stack   from 'react-bootstrap/Stack';
import Table   from 'react-bootstrap/Table';

import { fetcher } from 'api/client';
import TablePagination from 'components/TablePagination';

const PAGE_LIMIT = 15;

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

// ==============================|| POINTAGE — JOURNAL ||============================== //

export default function AttendanceList() {
  const [dateFilter, setDateFilter] = useState(todayStr());
  const [page,       setPage]       = useState(1);

  const { data, isLoading } = useSWR(`/presences?date=${dateFilter}`, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });

  const presences = data || [];
  const paged     = presences.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT);

  const handleDateChange = (v) => { setDateFilter(v); setPage(1); };

  return (
    <>
      {/* Barre de filtres */}
      <Row className="g-3 mb-4 align-items-end">
        <Col xs={12} sm={6} md={4}>
          <Form.Label className="small mb-1">Filtrer par date</Form.Label>
          <Form.Control
            type="date"
            size="sm"
            value={dateFilter}
            onChange={e => handleDateChange(e.target.value)}
          />
        </Col>
        <Col xs="auto">
          <Stack direction="horizontal" gap={2}>
            <Badge bg="secondary">{presences.length} agent{presences.length > 1 ? 's' : ''}</Badge>
            <Button variant="outline-secondary" size="sm" onClick={() => { setDateFilter(todayStr()); setPage(1); }}>
              Aujourd'hui
            </Button>
          </Stack>
        </Col>
      </Row>

      {dateFilter && (
        <p className="text-muted small mb-3">
          <i className="ph ph-calendar me-1" />{fmtDate(dateFilter)}
        </p>
      )}

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner variant="primary" />
          <p className="text-muted small mt-2">Chargement des pointages…</p>
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
              <th>Observation</th>
            </tr>
          </thead>
          <tbody>
            {presences.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-muted py-5">
                  <i className="ph ph-clock f-36 d-block mb-2" />
                  Aucun pointage enregistré pour cette date
                </td>
              </tr>
            ) : (
              paged.map(p => {
                const s = STATUT[p.statut] || { label: p.statut, bg: 'secondary', text: undefined };
                return (
                  <tr key={p.id} className={p.statut === 'RETARD' ? 'table-warning' : ''}>
                    <td><code className="text-muted small">{p.matricule}</code></td>
                    <td className="fw-semibold">{p.prenom} {p.nom_famille}</td>
                    <td className="text-muted small">{p.direction_libelle || '—'}</td>
                    <td className="text-center fw-semibold">{fmtHeure(p.heure_entree)}</td>
                    <td className="text-center text-muted">{fmtHeure(p.heure_sortie)}</td>
                    <td className="text-center">{calcDuree(p.heure_entree, p.heure_sortie)}</td>
                    <td className="text-center">
                      <Badge bg={s.bg} text={s.text}>{s.label}</Badge>
                    </td>
                    <td
                      className="text-muted small"
                      style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      title={p.observation || ''}
                    >
                      {p.observation || '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      )}
      {!isLoading && <TablePagination page={page} setPage={setPage} total={presences.length} limit={PAGE_LIMIT} />}
    </>
  );
}
