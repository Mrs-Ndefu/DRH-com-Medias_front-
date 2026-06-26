import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useSWR, { mutate } from 'swr';

import Alert      from 'react-bootstrap/Alert';
import Badge       from 'react-bootstrap/Badge';
import Button      from 'react-bootstrap/Button';
import Col         from 'react-bootstrap/Col';
import Form        from 'react-bootstrap/Form';
import InputGroup  from 'react-bootstrap/InputGroup';
import Modal       from 'react-bootstrap/Modal';
import Nav         from 'react-bootstrap/Nav';
import Row         from 'react-bootstrap/Row';
import Spinner     from 'react-bootstrap/Spinner';
import Table       from 'react-bootstrap/Table';

import Dropdown from 'react-bootstrap/Dropdown';
import MainCard from 'components/MainCard';
import TablePagination from 'components/TablePagination';
import { fetcher, api } from 'api/client';
import { useAuth } from 'contexts/AuthContext';
import { exportAgentFiche, exportAttestationService } from 'utils/exportAgentPdf';

const PAGE_LIMIT = 15;

// ── Constantes ────────────────────────────────────────────────────────────────

const SITUATIONS = ['À la retraite', 'En disponibilité', 'En détachement', 'Suspendu', 'Décédé'];
const SIT_COLOR  = {
  'À la retraite':    'secondary',
  'En disponibilité': 'warning',
  'En détachement':   'info',
  'Suspendu':         'danger',
  'Décédé':           'dark',
};

const DOC_TYPES  = ['Décision', 'Arrêté', 'Circulaire', 'Note', 'PV', 'Rapport', 'Lettre', 'Autre'];
const TYPE_COLOR = {
  Décision: 'primary', Arrêté: 'danger', Circulaire: 'info',
  Note: 'warning', PV: 'secondary', Rapport: 'success', Lettre: 'dark', Autre: 'light',
};

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const fmt    = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';
const fmtDT  = (d) => d ? new Date(d).toLocaleString('fr-FR') : '—';
const fmtSize = (b) => {
  if (!b) return '—';
  if (b < 1024)        return `${b} o`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} Ko`;
  return `${(b / (1024 * 1024)).toFixed(1)} Mo`;
};

const mimeIcon = (mime) => {
  if (!mime) return 'ph-file';
  if (mime === 'application/pdf') return 'ph-file-pdf';
  if (mime.startsWith('image/'))  return 'ph-image';
  if (mime.includes('word'))      return 'ph-file-doc';
  if (mime.includes('excel') || mime.includes('spreadsheet')) return 'ph-file-xls';
  return 'ph-file-text';
};

// ── Auth helper pour les requêtes avec fichiers ───────────────────────────────
function getToken() { return localStorage.getItem('sirh_token'); }

async function apiRequest(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || 'Erreur réseau'), { status: res.status });
  return data;
}

// ==============================|| MODULE ARCHIVES ||============================== //

export default function ArchivesPage() {
  const { user }  = useAuth();
  const isAdmin   = user?.role === 'ADMIN';

  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'agents');
  const [toast, setToast] = useState(null);

  const showToast = (msg, variant = 'success') => {
    setToast({ msg, variant });
    setTimeout(() => setToast(null), 4000);
  };

  const { data: stats } = useSWR('/archives/stats', fetcher);

  return (
    <Row>
      <Col xs={12}>
        {toast && (
          <Alert variant={toast.variant} dismissible onClose={() => setToast(null)} className="mb-3">
            <i className={`ph ph-${toast.variant === 'success' ? 'check-circle' : 'warning'} me-2`} />
            {toast.msg}
          </Alert>
        )}

        {stats && (
          <Row className="g-3 mb-4">
            {[
              { label: 'Total archivés',   value: stats.total_archives, icon: 'ph-archive',          bg: 'primary'   },
              { label: 'Retraités',        value: stats.retraites,      icon: 'ph-person',            bg: 'secondary' },
              { label: 'En disponibilité', value: stats.disponibilite,  icon: 'ph-pause-circle',      bg: 'warning'   },
              { label: 'En détachement',   value: stats.detachement,    icon: 'ph-arrows-left-right', bg: 'info'      },
            ].map((s) => (
              <Col key={s.label} xs={6} md={3}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className={`bg-${s.bg} bg-opacity-10 rounded-3 p-3`}>
                      <i className={`ph ${s.icon} f-24 text-${s.bg}`} />
                    </div>
                    <div>
                      <div className="fw-bold fs-4">{s.value ?? '—'}</div>
                      <div className="small text-muted">{s.label}</div>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

        <MainCard
          title={
            <div className="d-flex align-items-center gap-3">
              <i className="ph ph-archive f-24 text-primary" />
              <span>Gestion des archives</span>
            </div>
          }
        >
          <Nav variant="tabs" className="mb-4" activeKey={activeTab} onSelect={setActiveTab}>
            <Nav.Item>
              <Nav.Link eventKey="agents">
                <i className="ph ph-users me-2" />Agents archivés
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="documents">
                <i className="ph ph-file-text me-2" />Documents officiels
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === 'agents'    && <AgentsTab    isAdmin={isAdmin} showToast={showToast} />}
          {activeTab === 'documents' && <DocumentsTab isAdmin={isAdmin} showToast={showToast} />}
        </MainCard>
      </Col>
    </Row>
  );
}

// ==============================|| ONGLET AGENTS ||============================== //

function AgentsTab({ isAdmin, showToast }) {
  const [search,    setSearch]    = useState('');
  const [filterSit, setFilterSit] = useState('');
  const [page,      setPage]      = useState(1);
  const [restoring, setRestoring] = useState(null);
  const [confirm,   setConfirm]   = useState(null);
  const [dlLoading, setDlLoading] = useState(null);

  const handleDownload = async (id, type) => {
    setDlLoading(`${id}-${type}`);
    try {
      const agent = await api.get(`/agents/${id}`);
      if (type === 'fiche')       exportAgentFiche(agent);
      if (type === 'attestation') exportAttestationService(agent);
    } catch { showToast('Erreur lors de la génération du document.', 'danger'); }
    finally  { setDlLoading(null); }
  };

  const query = new URLSearchParams();
  if (search)    query.set('search',    search);
  if (filterSit) query.set('situation', filterSit);
  query.set('page',  String(page));
  query.set('limit', String(PAGE_LIMIT));

  const { data, error, isLoading } = useSWR(`/archives/agents?${query}`, fetcher);
  const agents = data?.data  || [];
  const total  = data?.total ?? 0;

  const handleSearch    = (v) => { setSearch(v);    setPage(1); };
  const handleFilterSit = (v) => { setFilterSit(v); setPage(1); };

  const handleRestaurer = async (agent) => {
    setRestoring(agent.id);
    try {
      await apiRequest(`/archives/agents/${agent.id}/restaurer`, { method: 'PATCH' });
      mutate(`/archives/agents?${query}`);
      mutate('/archives/stats');
      showToast(`${agent.prenom} ${agent.nom_famille} restauré avec succès.`);
    } catch (e) {
      showToast(e.message || 'Erreur lors de la restauration.', 'danger');
    } finally {
      setRestoring(null);
      setConfirm(null);
    }
  };

  return (
    <>
      <Row className="g-2 mb-3">
        <Col xs={12} md={6}>
          <InputGroup>
            <InputGroup.Text><i className="ph ph-magnifying-glass" /></InputGroup.Text>
            <Form.Control
              placeholder="Rechercher par nom, prénom ou matricule…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {search && <Button variant="outline-secondary" onClick={() => handleSearch('')}><i className="ph ph-x" /></Button>}
          </InputGroup>
        </Col>
        <Col xs={12} md={3}>
          <Form.Select value={filterSit} onChange={(e) => handleFilterSit(e.target.value)}>
            <option value="">Toutes situations</option>
            {SITUATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </Form.Select>
        </Col>
      </Row>

      {isLoading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : error ? (
        <Alert variant="danger"><i className="ph ph-warning me-2" />Erreur de chargement.</Alert>
      ) : agents.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="ph ph-archive f-48 d-block mb-2 text-muted" />
          Aucun agent archivé trouvé.
        </div>
      ) : (
        <>
        <Table hover responsive className="align-middle">
          <thead className="table-light">
            <tr>
              <th>Matricule</th>
              <th>Nom & Prénom</th>
              <th>Grade</th>
              <th>Direction</th>
              <th className="text-center">Situation</th>
              <th className="text-center">Date archivage</th>
              <th className="text-center">Documents</th>
              {isAdmin && <th className="text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr key={a.id}>
                <td><code className="fw-bold text-primary">{a.matricule}</code></td>
                <td>
                  <div className="fw-semibold">{a.nom_famille} {a.prenom}</div>
                  <small className="text-muted">{a.categorie && `Cat. ${a.categorie}`}</small>
                </td>
                <td className="small">{a.grade || '—'}</td>
                <td className="small text-muted">{a.direction_libelle || '—'}</td>
                <td className="text-center">
                  <Badge bg={SIT_COLOR[a.situation_admin] || 'secondary'}>{a.situation_admin || '—'}</Badge>
                </td>
                <td className="text-center small">{fmt(a.date_archivage)}</td>
                <td className="text-center">
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-primary" size="sm"
                      disabled={!!dlLoading?.startsWith(String(a.id))}
                      title="Télécharger un document officiel"
                    >
                      {dlLoading?.startsWith(String(a.id))
                        ? <Spinner size="sm" animation="border" />
                        : <><i className="ph ph-download-simple me-1" />PDF</>}
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                      <Dropdown.Header>Documents officiels</Dropdown.Header>
                      <Dropdown.Item onClick={() => handleDownload(a.id, 'fiche')}>
                        <i className="ph ph-identification-card me-2 text-primary" />Fiche individuelle
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDownload(a.id, 'attestation')}>
                        <i className="ph ph-seal-check me-2 text-success" />Attestation de service
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
                {isAdmin && (
                  <td className="text-center">
                    <Button
                      variant="outline-success" size="sm"
                      title="Restaurer cet agent"
                      disabled={restoring === a.id}
                      onClick={() => setConfirm(a)}
                    >
                      {restoring === a.id
                        ? <Spinner size="sm" animation="border" />
                        : <i className="ph ph-arrow-counter-clockwise" />
                      }
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
        <TablePagination page={page} setPage={setPage} total={total} limit={PAGE_LIMIT} />
        </>
      )}

      <Modal show={!!confirm} onHide={() => setConfirm(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title><i className="ph ph-arrow-counter-clockwise me-2 text-success" />Restaurer l'agent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Voulez-vous vraiment restaurer <strong>{confirm?.prenom} {confirm?.nom_famille}</strong> ({confirm?.matricule}) ?
          <br /><small className="text-muted">L'agent sera remis en statut <em>En activité</em>.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setConfirm(null)}>Annuler</Button>
          <Button variant="success" size="sm" disabled={restoring === confirm?.id} onClick={() => handleRestaurer(confirm)}>
            <i className="ph ph-check me-2" />Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// ==============================|| ONGLET DOCUMENTS ||============================== //

const EMPTY_FORM = {
  reference: '', type: '', titre: '',
  emetteur: '', date_document: '', description: '',
};

function DocumentsTab({ isAdmin, showToast }) {
  const [search,     setSearch]     = useState('');
  const [filterType, setFilterType] = useState('');
  const [pageDoc,    setPageDoc]    = useState(1);
  const [showAdd,    setShowAdd]    = useState(false);
  const [detailDoc,  setDetailDoc]  = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [fichier,    setFichier]    = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [errors,     setErrors]     = useState({});
  const [deleting,   setDeleting]   = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const fileRef = useRef(null);

  const query = new URLSearchParams();
  if (search)     query.set('search', search);
  if (filterType) query.set('type',   filterType);

  const { data, error, isLoading } = useSWR(`/archives/documents?${query}`, fetcher);
  const docs      = data?.data  || [];
  const docsTotal = data?.total ?? docs.length;
  const pagedDocs = docs.slice((pageDoc - 1) * PAGE_LIMIT, pageDoc * PAGE_LIMIT);

  const validate = () => {
    const e = {};
    if (!form.reference.trim()) e.reference    = 'Champ obligatoire.';
    if (!form.type)             e.type         = 'Champ obligatoire.';
    if (!form.titre.trim())     e.titre        = 'Champ obligatoire.';
    if (!form.date_document)    e.date_document = 'Champ obligatoire.';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (fichier) fd.append('fichier', fichier);

      await apiRequest('/archives/documents', {
        method: 'POST',
        body: fd,
        // Ne pas setter Content-Type : fetch le fait automatiquement avec boundary
      });

      mutate(`/archives/documents?${query}`);
      setShowAdd(false);
      setForm(EMPTY_FORM);
      setFichier(null);
      setErrors({});
      if (fileRef.current) fileRef.current.value = '';
      showToast('Document archivé avec succès.');
    } catch (err) {
      showToast(err.message || 'Erreur lors de l\'enregistrement.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (doc) => {
    setDeleting(doc.id);
    try {
      await apiRequest(`/archives/documents/${doc.id}`, { method: 'DELETE' });
      mutate(`/archives/documents?${query}`);
      showToast('Document supprimé.');
    } catch (err) {
      showToast(err.message || 'Erreur lors de la suppression.', 'danger');
    } finally {
      setDeleting(null);
      setConfirmDel(null);
    }
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setFichier(null);
    setErrors({});
    if (fileRef.current) fileRef.current.value = '';
    setShowAdd(true);
  };

  const downloadUrl = (id) => `${BASE_URL}/archives/documents/${id}/telecharger?token=${getToken()}`;

  const field = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <>
      <Row className="g-2 mb-3 align-items-center">
        <Col xs={12} md={5}>
          <InputGroup>
            <InputGroup.Text><i className="ph ph-magnifying-glass" /></InputGroup.Text>
            <Form.Control
              placeholder="Rechercher par référence ou titre…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && <Button variant="outline-secondary" onClick={() => setSearch('')}><i className="ph ph-x" /></Button>}
          </InputGroup>
        </Col>
        <Col xs={12} md={3}>
          <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Tous les types</option>
            {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Form.Select>
        </Col>
        {isAdmin && (
          <Col xs="auto" className="ms-auto">
            <Button variant="primary" size="sm" onClick={openAdd}>
              <i className="ph ph-plus me-2" />Archiver un document
            </Button>
          </Col>
        )}
      </Row>

      {isLoading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : error ? (
        <Alert variant="danger"><i className="ph ph-warning me-2" />Erreur de chargement des documents.</Alert>
      ) : docs.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="ph ph-file-dashed f-48 d-block mb-2" />
          Aucun document archivé.
          {isAdmin && (
            <div className="mt-2">
              <Button variant="outline-primary" size="sm" onClick={openAdd}>
                <i className="ph ph-plus me-2" />Archiver le premier document
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
        <Table hover responsive className="align-middle">
          <thead className="table-light">
            <tr>
              <th>Référence</th>
              <th className="text-center">Type</th>
              <th>Titre</th>
              <th>Émetteur</th>
              <th className="text-center">Date</th>
              <th className="text-center">Fichier</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedDocs.map((d) => (
              <tr key={d.id}>
                <td><code className="fw-bold text-primary">{d.reference}</code></td>
                <td className="text-center">
                  <Badge bg={TYPE_COLOR[d.type] || 'secondary'}>{d.type}</Badge>
                </td>
                <td className="fw-semibold small">{d.titre}</td>
                <td className="small text-muted">{d.emetteur || '—'}</td>
                <td className="text-center small">{fmt(d.date_document)}</td>
                <td className="text-center">
                  {d.has_file ? (
                    <a
                      href={downloadUrl(d.id)}
                      title={`Télécharger ${d.fichier_nom}`}
                      className="text-primary"
                      download
                    >
                      <i className={`ph ${mimeIcon(d.fichier_mimetype)} f-18`} />
                      <small className="ms-1 d-none d-md-inline">{fmtSize(d.fichier_taille)}</small>
                    </a>
                  ) : (
                    <span className="text-muted small">—</span>
                  )}
                </td>
                <td className="text-center">
                  <div className="d-flex gap-1 justify-content-center">
                    <Button
                      variant="outline-primary" size="sm"
                      title="Voir les détails"
                      onClick={() => setDetailDoc(d)}
                    >
                      <i className="ph ph-eye" />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="outline-danger" size="sm"
                        title="Supprimer"
                        disabled={deleting === d.id}
                        onClick={() => setConfirmDel(d)}
                      >
                        {deleting === d.id
                          ? <Spinner size="sm" animation="border" />
                          : <i className="ph ph-trash" />
                        }
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <TablePagination page={pageDoc} setPage={setPageDoc} total={docsTotal} limit={PAGE_LIMIT} />
        </>
      )}

      {/* ══════════════════ MODAL AJOUT ══════════════════ */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ph ph-file-plus me-2 text-primary" />
            Archiver un nouveau document
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Référence <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  placeholder="Ex : DEC-2026-001"
                  value={form.reference}
                  onChange={(e) => field('reference', e.target.value)}
                  isInvalid={!!errors.reference}
                />
                <Form.Control.Feedback type="invalid">{errors.reference}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Type <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={form.type}
                  onChange={(e) => field('type', e.target.value)}
                  isInvalid={!!errors.type}
                >
                  <option value="">— Sélectionner —</option>
                  {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Date du document <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="date"
                  value={form.date_document}
                  onChange={(e) => field('date_document', e.target.value)}
                  isInvalid={!!errors.date_document}
                />
                <Form.Control.Feedback type="invalid">{errors.date_document}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Titre / Objet <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  placeholder="Ex : Décision de nomination du Directeur Général"
                  value={form.titre}
                  onChange={(e) => field('titre', e.target.value)}
                  isInvalid={!!errors.titre}
                />
                <Form.Control.Feedback type="invalid">{errors.titre}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>Émetteur / Signataire</Form.Label>
                <Form.Control
                  placeholder="Ex : Ministère de la Communication et des Médias"
                  value={form.emetteur}
                  onChange={(e) => field('emetteur', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>
                  <i className="ph ph-paperclip me-1" />
                  Fichier joint <small className="text-muted">(PDF, Word, Excel, image — max 10 Mo)</small>
                </Form.Label>
                <Form.Control
                  type="file"
                  ref={fileRef}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.txt"
                  onChange={(e) => setFichier(e.target.files[0] || null)}
                />
                {fichier && (
                  <div className="mt-1 small text-success">
                    <i className={`ph ${mimeIcon(fichier.type)} me-1`} />
                    {fichier.name} — {fmtSize(fichier.size)}
                    <Button variant="link" size="sm" className="p-0 ms-2 text-danger" onClick={() => { setFichier(null); fileRef.current.value = ''; }}>
                      <i className="ph ph-x" />
                    </Button>
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Description / Observations</Form.Label>
                <Form.Control
                  as="textarea" rows={3}
                  placeholder="Informations complémentaires sur ce document…"
                  value={form.description}
                  onChange={(e) => field('description', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setShowAdd(false)}>Annuler</Button>
          <Button variant="primary" size="sm" disabled={saving} onClick={handleSave}>
            {saving
              ? <><Spinner size="sm" animation="border" className="me-2" />Enregistrement…</>
              : <><i className="ph ph-floppy-disk me-2" />Enregistrer</>
            }
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ══════════════════ MODAL DÉTAILS ══════════════════ */}
      <Modal show={!!detailDoc} onHide={() => setDetailDoc(null)} size="lg" centered>
        {detailDoc && (
          <>
            <Modal.Header closeButton className="border-bottom-0 pb-0">
              <Modal.Title>
                <Badge bg={TYPE_COLOR[detailDoc.type] || 'secondary'} className="me-2">{detailDoc.type}</Badge>
                <span className="fs-6 fw-semibold">{detailDoc.reference}</span>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-2">
              <h5 className="fw-bold mb-3">{detailDoc.titre}</h5>

              <Row className="g-3">
                <Col xs={12} md={4}>
                  <div className="text-muted small mb-1">Émetteur</div>
                  <div className="fw-semibold">{detailDoc.emetteur || '—'}</div>
                </Col>
                <Col xs={12} md={4}>
                  <div className="text-muted small mb-1">Date du document</div>
                  <div className="fw-semibold">{fmt(detailDoc.date_document)}</div>
                </Col>
                <Col xs={12} md={4}>
                  <div className="text-muted small mb-1">Statut</div>
                  <Badge bg="secondary">{detailDoc.statut}</Badge>
                </Col>

                {detailDoc.description && (
                  <Col xs={12}>
                    <div className="text-muted small mb-1">Description</div>
                    <div className="p-3 bg-light rounded small">{detailDoc.description}</div>
                  </Col>
                )}

                {/* Fichier joint */}
                <Col xs={12}>
                  <div className="text-muted small mb-2">Fichier joint</div>
                  {detailDoc.has_file ? (
                    <div className="d-flex align-items-center gap-3 p-3 border rounded bg-white">
                      <i className={`ph ${mimeIcon(detailDoc.fichier_mimetype)} f-32 text-primary`} />
                      <div className="flex-grow-1">
                        <div className="fw-semibold small">{detailDoc.fichier_nom}</div>
                        <div className="text-muted small">
                          {detailDoc.fichier_mimetype} — {fmtSize(detailDoc.fichier_taille)}
                        </div>
                      </div>
                      <a
                        href={downloadUrl(detailDoc.id)}
                        download
                        className="btn btn-primary btn-sm"
                      >
                        <i className="ph ph-download-simple me-2" />Télécharger
                      </a>
                    </div>
                  ) : (
                    <div className="text-muted small fst-italic p-3 border rounded bg-light">
                      <i className="ph ph-file-dashed me-2" />Aucun fichier attaché à ce document.
                    </div>
                  )}
                </Col>

                <Col xs={12}>
                  <hr className="my-1" />
                  <div className="d-flex gap-4 small text-muted">
                    <span><i className="ph ph-user me-1" />Archivé par : <strong>{detailDoc.created_by || '—'}</strong></span>
                    <span><i className="ph ph-calendar me-1" />Le : <strong>{fmtDT(detailDoc.created_at)}</strong></span>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" size="sm" onClick={() => setDetailDoc(null)}>Fermer</Button>
              {detailDoc.has_file && (
                <a href={downloadUrl(detailDoc.id)} download className="btn btn-primary btn-sm">
                  <i className="ph ph-download-simple me-2" />Télécharger le fichier
                </a>
              )}
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* ══════════════════ MODAL SUPPRIMER ══════════════════ */}
      <Modal show={!!confirmDel} onHide={() => setConfirmDel(null)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title><i className="ph ph-trash me-2 text-danger" />Supprimer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Supprimer le document <strong>{confirmDel?.reference}</strong> ?
          {confirmDel?.has_file && (
            <div className="mt-2 small text-warning">
              <i className="ph ph-warning me-1" />Le fichier joint sera également supprimé.
            </div>
          )}
          <br /><small className="text-muted">Cette action est irréversible.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setConfirmDel(null)}>Annuler</Button>
          <Button variant="danger" size="sm" disabled={deleting === confirmDel?.id} onClick={() => handleDelete(confirmDel)}>
            <i className="ph ph-trash me-2" />Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
