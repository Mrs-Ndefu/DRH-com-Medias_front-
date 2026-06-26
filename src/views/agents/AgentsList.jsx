import { useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';

// react-bootstrap
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

// project-imports
import MainCard from 'components/MainCard';
import TablePagination from 'components/TablePagination';
import { fetcher, api } from 'api/client';
import { SITUATIONS_ADMIN } from './data/agents';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';
import { exportAgentsToExcel } from 'utils/exportExcel';

const PAGE_LIMIT = 20;

const STATUS_COLORS = {
  'En activité':        'success',
  'En congé maladie':   'warning',
  'En congé maternité': 'info',
};

// ==============================|| AGENTS — LISTE ||============================== //

export default function AgentsList() {
  const [search,     setSearch]     = useState('');
  const [filterStat, setFilterStat] = useState('');
  const [page,       setPage]       = useState(1);
  const [exporting,  setExporting]  = useState(false);
  const [archiving,  setArchiving]  = useState(null);

  const query = new URLSearchParams();
  if (search)     query.set('search', search);
  if (filterStat) query.set('situation_admin', filterStat);
  query.set('page',  String(page));
  query.set('limit', String(PAGE_LIMIT));

  const { data, error, isLoading, mutate } = useSWR(`/agents?${query}`, fetcher);

  const agents      = data?.data  || [];
  const total       = data?.total ?? 0;
  const activeCount = agents.filter((a) => a.situation_admin === 'En activité').length;

  const handleSearch     = (v) => { setSearch(v);     setPage(1); };
  const handleFilterStat = (v) => { setFilterStat(v); setPage(1); };

  const handleExportExcel = () => {
    if (!agents.length) return;
    setExporting(true);
    setTimeout(() => { exportAgentsToExcel(agents); setExporting(false); }, 50);
  };

  const handleArchive = async (id) => {
    if (!confirm('Archiver cet agent ? Il sera visible dans la Gestion des archives.')) return;
    setArchiving(id);
    try { await api.delete(`/agents/${id}`); mutate(); } finally { setArchiving(null); }
  };

  return (
    <Row>
      <Col xs={12}>
        <MainCard
          title={
            <div className="d-flex align-items-center gap-3">
              <i className="ph ph-users f-24 text-primary" />
              <span>Agents de l'État</span>
              <Badge bg="primary">{total} agent{total > 1 ? 's' : ''}</Badge>
              <Badge bg="success">{activeCount} en activité</Badge>
            </div>
          }
          secondary={
            <div className="d-flex gap-2">
              <Button
                size="sm" variant="outline-success"
                disabled={exporting || !agents.length}
                onClick={handleExportExcel}
                title="Exporter au format Excel"
              >
                {exporting
                  ? <Spinner size="sm" animation="border" className="me-1" />
                  : <i className="ph ph-file-xls me-1" />}
                Excel
              </Button>
              <Button as={Link} to="/agents/create" size="sm" variant="primary">
                <i className="ph ph-user-plus me-2" />Nouvel agent
              </Button>
            </div>
          }
        >
          {/* ── États de chargement ── */}
          {isLoading && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" size="sm" className="me-2" />
              <span className="text-muted small">Chargement…</span>
            </div>
          )}
          {error && (
            <Alert variant="danger" className="small py-2">
              <i className="ph ph-warning me-2" />
              Impossible de contacter le serveur. Vérifiez que le backend est démarré sur le port 4000.
            </Alert>
          )}

          {/* ── Filtres ── */}
          <Row className="g-2 mb-4 align-items-end">
            <Col xs={12} md={5}>
              <InputGroup size="sm">
                <InputGroup.Text><i className="ph ph-magnifying-glass" /></InputGroup.Text>
                <Form.Control
                  placeholder="Nom, matricule, poste…"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col xs={6} md={3}>
              <Form.Select size="sm" value={filterStat} onChange={(e) => handleFilterStat(e.target.value)}>
                <option value="">Toutes situations</option>
                {SITUATIONS_ADMIN.map((s) => <option key={s} value={s}>{s}</option>)}
              </Form.Select>
            </Col>
            <Col xs={6} md={2}>
              <Badge bg="secondary">{agents.length} résultat{agents.length > 1 ? 's' : ''}</Badge>
            </Col>
          </Row>

          {/* ── Tableau ── */}
          <Table hover responsive className="align-middle" style={{ minWidth: 700 }}>
            <thead className="table-light">
              <tr>
                <th>Matricule</th>
                <th>Nom & Prénom</th>
                <th>Poste</th>
                <th>Service / Direction</th>
                <th>Corps / Catégorie</th>
                <th className="text-center">Recrutement</th>
                <th className="text-center">Situation</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && agents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-5">
                    <i className="ph ph-users f-36 d-block mb-2" />
                    Aucun agent ne correspond à la recherche
                  </td>
                </tr>
              ) : (
                agents.map((a) => (
                  <tr key={a.id}>
                    <td><code className="text-muted">{a.matricule}</code></td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle overflow-hidden flex-shrink-0 d-flex align-items-center justify-content-center bg-primary bg-opacity-10"
                          style={{ width: 36, height: 36, fontSize: 13, fontWeight: 600, color: 'var(--bs-primary)' }}
                        >
                          {a.photo_url
                            ? <img src={`${API_BASE}${a.photo_url}`} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                            : <>{a.prenom?.[0]}{a.nom_famille?.[0]}</>
                          }
                        </div>
                        <div>
                          <div className="fw-semibold">{a.prenom} {a.nom_famille}</div>
                          <small className="text-muted">{a.grade}</small>
                        </div>
                      </div>
                    </td>
                    <td className="small">{a.poste || '—'}</td>
                    <td className="small text-muted">{a.direction_libelle || '—'}</td>
                    <td className="small">
                      <div>{a.corps || '—'}</div>
                      {a.categorie && <Badge bg="light" text="dark" className="mt-1">Cat. {a.categorie}</Badge>}
                    </td>
                    <td className="text-center small text-muted">
                      {a.date_recrutement ? new Date(a.date_recrutement).getFullYear() : '—'}
                    </td>
                    <td className="text-center">
                      <Badge bg={STATUS_COLORS[a.situation_admin] || 'secondary'}>
                        {a.situation_admin || 'En activité'}
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
                        <Button
                          variant="outline-danger" size="sm" title="Archiver l'agent"
                          disabled={archiving === a.id}
                          onClick={() => handleArchive(a.id)}
                        >
                          {archiving === a.id
                            ? <Spinner size="sm" animation="border" />
                            : <i className="ph ph-archive" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          <TablePagination page={page} setPage={setPage} total={total} limit={PAGE_LIMIT} />
        </MainCard>
      </Col>
    </Row>
  );
}
