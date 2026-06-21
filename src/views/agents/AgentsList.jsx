import { useState } from 'react';
import { Link } from 'react-router-dom';

// react-bootstrap
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

// project-imports
import MainCard from 'components/MainCard';
import { FAKE_AGENTS, SITUATIONS_ADMIN } from './data/agents';

const STATUS_COLORS = {
  'En activité':        'success',
  'En congé maladie':   'warning',
  'En congé maternité': 'info',
  'En détachement':     'info',
  'En disponibilité':   'secondary',
  'Suspendu':           'danger',
  'À la retraite':      'dark',
};

// ==============================|| AGENTS — LISTE ||============================== //

export default function AgentsList() {
  const [search,     setSearch]     = useState('');
  const [filterStat, setFilterStat] = useState('');

  const filtered = FAKE_AGENTS.filter((a) => {
    const q  = search.toLowerCase();
    const ok = !search ||
      `${a.prenom} ${a.nomFamille}`.toLowerCase().includes(q) ||
      a.matricule.includes(q) ||
      a.poste?.toLowerCase().includes(q) ||
      a.service?.toLowerCase().includes(q);
    return ok && (!filterStat || a.situationAdmin === filterStat);
  });

  const activeCount = FAKE_AGENTS.filter((a) => a.situationAdmin === 'En activité').length;

  return (
    <Row>
      <Col xs={12}>
        <MainCard
          title={
            <div className="d-flex align-items-center gap-3">
              <i className="ph ph-users f-24 text-primary" />
              <span>Agents de l'État</span>
              <Badge bg="primary">{FAKE_AGENTS.length} agents</Badge>
              <Badge bg="success">{activeCount} en activité</Badge>
            </div>
          }
          secondary={
            <Button as={Link} to="/agents/create" size="sm" variant="primary">
              <i className="ph ph-user-plus me-2" />Nouvel agent
            </Button>
          }
        >
          {/* ── Filtres ── */}
          <Row className="g-2 mb-4 align-items-end">
            <Col xs={12} md={5}>
              <InputGroup size="sm">
                <InputGroup.Text><i className="ph ph-magnifying-glass" /></InputGroup.Text>
                <Form.Control
                  placeholder="Nom, matricule, poste…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col xs={6} md={3}>
              <Form.Select size="sm" value={filterStat} onChange={(e) => setFilterStat(e.target.value)}>
                <option value="">Toutes situations</option>
                {SITUATIONS_ADMIN.map((s) => <option key={s} value={s}>{s}</option>)}
              </Form.Select>
            </Col>
            <Col xs={6} md={2}>
              <Badge bg="secondary">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</Badge>
            </Col>
          </Row>

          {/* ── Tableau ── */}
          <Table hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Matricule</th>
                <th>Nom & Prénom</th>
                <th>Poste</th>
                <th>Service / Direction</th>
                <th>Corps / Catégorie</th>
                <th className="text-center">Situation</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-5">
                    <i className="ph ph-users f-36 d-block mb-2" />
                    Aucun agent ne correspond à la recherche
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <code className="text-muted">{a.matricule}</code>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: 36, height: 36, fontSize: 13, fontWeight: 600, color: 'var(--bs-primary)' }}
                        >
                          {a.prenom[0]}{a.nomFamille[0]}
                        </div>
                        <div>
                          <div className="fw-semibold">{a.prenom} {a.nomFamille}</div>
                          <small className="text-muted">{a.grade}</small>
                        </div>
                      </div>
                    </td>
                    <td className="small">{a.poste || '—'}</td>
                    <td className="small text-muted">
                      {a.direction || a.service || '—'}
                    </td>
                    <td className="small">
                      {a.corps && <div>{a.corps}</div>}
                      {a.categorie && (
                        <Badge bg="light" text="dark">Cat. {a.categorie} — Cl. {a.classe}</Badge>
                      )}
                    </td>
                    <td className="text-center">
                      <Badge bg={STATUS_COLORS[a.situationAdmin] || 'secondary'}>
                        {a.situationAdmin}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <div className="d-flex gap-1 justify-content-center">
                        <Button as={Link} to={`/agents/${a.id}`} variant="outline-primary" size="sm" title="Voir le dossier">
                          <i className="ph ph-eye" />
                        </Button>
                        <Button as={Link} to={`/agents/${a.id}/edit`} variant="outline-secondary" size="sm" title="Modifier">
                          <i className="ph ph-pencil" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </MainCard>
      </Col>
    </Row>
  );
}
