import PropTypes from 'prop-types';
import { useState } from 'react';

// react-bootstrap
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { LEAVE_TYPES, STATUSES } from '../data/leaves';

const fmt = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

// ==============================|| CONGÉS — LISTE DES DEMANDES ||============================== //

export default function LeavesTable({ leaves, onSelect }) {
  const [search,     setSearch]     = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStat, setFilterStat] = useState('');

  const filtered = leaves.filter((l) => {
    const matchSearch = !search || l.nom.toLowerCase().includes(search.toLowerCase()) || l.matricule.includes(search);
    const matchType   = !filterType || l.type === filterType;
    const matchStat   = !filterStat || l.status === filterStat;
    return matchSearch && matchType && matchStat;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const reset = () => { setSearch(''); setFilterType(''); setFilterStat(''); };

  return (
    <>
      {/* ── Filtres ── */}
      <Row className="g-2 mb-4 align-items-end">
        <Col xs={12} md={4}>
          <InputGroup size="sm">
            <InputGroup.Text><i className="ph ph-magnifying-glass" /></InputGroup.Text>
            <Form.Control
              placeholder="Rechercher par nom, matricule…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col xs={6} md={3}>
          <Form.Select size="sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Tous les types</option>
            {Object.entries(LEAVE_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={6} md={3}>
          <Form.Select size="sm" value={filterStat} onChange={(e) => setFilterStat(e.target.value)}>
            <option value="">Tous les statuts</option>
            {Object.entries(STATUSES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} md={2} className="d-flex gap-2 align-items-center">
          <Badge bg="secondary">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</Badge>
          {(search || filterType || filterStat) && (
            <Button variant="link" size="sm" className="p-0 text-muted" onClick={reset}>
              <i className="ph ph-x-circle" /> Réinitialiser
            </Button>
          )}
        </Col>
      </Row>

      {/* ── Tableau ── */}
      <Table hover responsive className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Employé</th>
            <th>Service</th>
            <th>Type</th>
            <th className="text-center">Début</th>
            <th className="text-center">Fin</th>
            <th className="text-center">Jours</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center text-muted py-5">
                <i className="ph ph-calendar-x f-36 d-block mb-2" />
                Aucune demande ne correspond aux filtres
              </td>
            </tr>
          ) : (
            filtered.map((l) => {
              const lt = LEAVE_TYPES[l.type];
              const st = STATUSES[l.status];
              return (
                <tr key={l.id} style={{ borderLeft: `3px solid var(--bs-${st.color})` }}>
                  <td>
                    <div className="fw-semibold">{l.nom}</div>
                    <code className="text-muted small">{l.matricule}</code>
                  </td>
                  <td className="text-muted small">{l.service}</td>
                  <td>
                    <Badge bg={lt.color} className="fw-normal">
                      <i className={`ph ${lt.icon} me-1`} />{lt.label}
                    </Badge>
                  </td>
                  <td className="text-center small">{fmt(l.dateDebut)}</td>
                  <td className="text-center small">{fmt(l.dateFin)}</td>
                  <td className="text-center fw-semibold">{l.nbJours}j</td>
                  <td className="text-center">
                    <Badge bg={st.color}>{st.label}</Badge>
                  </td>
                  <td className="text-center">
                    <Button variant="outline-primary" size="sm" onClick={() => onSelect(l)}>
                      <i className="ph ph-eye me-1" />Voir
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </>
  );
}

LeavesTable.propTypes = {
  leaves:   PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};
