import PropTypes from 'prop-types';
import { useState } from 'react';

// react-bootstrap
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Table from 'react-bootstrap/Table';

const fmtTime = (d) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const fmtDate = (str) => new Date(str).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
const todayStr = () => new Date().toISOString().split('T')[0];

// ==============================|| POINTAGE — JOURNAL DES ÉVÉNEMENTS ||============================== //

export default function AttendanceList({ records }) {
  const [dateFilter, setDateFilter] = useState(todayStr());

  const filtered = [...records]
    .filter((r) => r.date === dateFilter)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <>
      {/* ── Barre de filtres ── */}
      <Row className="g-3 mb-4 align-items-end">
        <Col xs={12} sm={6} md={4}>
          <Form.Label className="small mb-1">Filtrer par date</Form.Label>
          <Form.Control
            type="date"
            size="sm"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Stack direction="horizontal" gap={2}>
            <Badge bg="secondary">{filtered.length} événement{filtered.length > 1 ? 's' : ''}</Badge>
            <Button variant="outline-secondary" size="sm" onClick={() => setDateFilter(todayStr())}>
              Aujourd'hui
            </Button>
          </Stack>
        </Col>
      </Row>

      {dateFilter && (
        <p className="text-muted small mb-3">
          <i className="ph ph-calendar me-1" />
          {fmtDate(dateFilter)}
        </p>
      )}

      {/* ── Tableau des événements ── */}
      <Table hover responsive className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Heure</th>
            <th>Nom & Prénom</th>
            <th>Matricule</th>
            <th>Poste</th>
            <th className="text-center">Type</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-muted py-5">
                <i className="ph ph-clock f-36 d-block mb-2" />
                Aucun pointage enregistré pour cette date
              </td>
            </tr>
          ) : (
            filtered.map((r) => (
              <tr key={r.id}>
                <td>
                  <span className="fw-semibold">{fmtTime(r.timestamp)}</span>
                </td>
                <td>{r.nom}</td>
                <td>
                  <code className="text-muted">{r.matricule}</code>
                </td>
                <td className="text-muted small">{r.poste}</td>
                <td className="text-center">
                  <Badge bg={r.type === 'IN' ? 'success' : 'danger'} className="px-3">
                    <i className={`ph ph-${r.type === 'IN' ? 'sign-in' : 'sign-out'} me-1`} />
                    {r.type === 'IN' ? 'Entrée' : 'Sortie'}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
}

AttendanceList.propTypes = { records: PropTypes.array.isRequired };
