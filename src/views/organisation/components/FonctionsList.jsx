import PropTypes from 'prop-types';
import { useState } from 'react';

import { useAuth } from 'contexts/AuthContext';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { NIVEAUX_HIERARCHIQUES } from '../data/org';
import TablePagination from 'components/TablePagination';

const PAGE_LIMIT = 10;

const EMPTY = { code: '', nom: '', niveau: 1, description: '', active: true };

const NIVEAU_COLORS = ['', 'danger', 'danger', 'warning', 'info', 'secondary', 'light', 'light'];

// ==============================|| ORGANISATION — FONCTIONS ||============================== //

export default function FonctionsList({ fonctions, setFonctions }) {
  const { user } = useAuth();
  const readOnly = user?.role === 'SG';
  const [modal,    setModal]    = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form,     setForm]     = useState(EMPTY);

  const openAdd  = () => { setEditItem(null); setForm(EMPTY); setModal(true); };
  const openEdit = (f) => { setEditItem(f); setForm({ ...f }); setModal(true); };
  const set      = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : k === 'niveau' ? +e.target.value : e.target.value }));

  const save = () => {
    if (editItem) {
      setFonctions((p) => p.map((f) => f.id === editItem.id ? { ...f, ...form } : f));
    } else {
      setFonctions((p) => [...p, { id: `FCT${Date.now()}`, ...form }]);
    }
    setModal(false);
  };

  const toggle = (id) => setFonctions((p) => p.map((f) => f.id === id ? { ...f, active: !f.active } : f));

  const [page, setPage] = useState(1);
  const sorted = [...fonctions].sort((a, b) => a.niveau - b.niveau);
  const paged  = sorted.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="mb-0">Fonctions et postes</h6>
          <small className="text-muted">
            <Badge bg="primary" className="me-1">{fonctions.filter(f => f.active).length}</Badge>fonctions actives
          </small>
        </div>
        {!readOnly && (
          <Button variant="primary" size="sm" onClick={openAdd}>
            <i className="ph ph-plus me-2" />Ajouter une fonction
          </Button>
        )}
      </div>

      <Table hover responsive className="align-middle">
        <thead className="table-light">
          <tr>
            <th className="text-center">Niveau</th>
            <th>Code</th>
            <th>Intitulé de la fonction</th>
            <th>Description</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paged.map((f) => {
            const nColor = NIVEAU_COLORS[f.niveau] || 'secondary';
            const nLabel = NIVEAUX_HIERARCHIQUES.find(n => n.value === f.niveau)?.label || `N${f.niveau}`;
            return (
              <tr key={f.id} style={{ opacity: f.active ? 1 : 0.5 }}>
                <td className="text-center">
                  <Badge bg={nColor} text={f.niveau >= 6 ? 'dark' : 'white'} className="px-3">
                    N{f.niveau}
                  </Badge>
                </td>
                <td><code className="fw-bold">{f.code}</code></td>
                <td className="fw-semibold">{f.nom}</td>
                <td className="small text-muted">{f.description || '—'}</td>
                <td className="text-center">
                  <Badge bg={f.active ? 'success' : 'secondary'}>{f.active ? 'Active' : 'Inactive'}</Badge>
                </td>
                <td className="text-center">
                  {!readOnly && (
                    <div className="d-flex gap-1 justify-content-center">
                      <Button variant="outline-primary" size="sm" onClick={() => openEdit(f)}>
                        <i className="ph ph-pencil" />
                      </Button>
                      <Button variant={f.active ? 'outline-warning' : 'outline-success'} size="sm" onClick={() => toggle(f.id)}>
                        <i className={`ph ph-${f.active ? 'pause' : 'play'}`} />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <TablePagination page={page} setPage={setPage} total={sorted.length} limit={PAGE_LIMIT} />

      {/* ── Modal ── */}
      <Modal show={modal} onHide={() => setModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`ph ph-${editItem ? 'pencil' : 'plus'} me-2 text-primary`} />
            {editItem ? 'Modifier la fonction' : 'Ajouter une fonction'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Form.Group as={Col} xs={4}>
              <Form.Label className="small">Code <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={form.code} onChange={set('code')} placeholder="Ex: DIR" />
            </Form.Group>
            <Form.Group as={Col} xs={8}>
              <Form.Label className="small">Intitulé <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={form.nom} onChange={set('nom')} placeholder="Nom de la fonction" />
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Label className="small">Niveau hiérarchique <span className="text-danger">*</span></Form.Label>
              <Form.Select size="sm" value={form.niveau} onChange={set('niveau')}>
                {NIVEAUX_HIERARCHIQUES.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Label className="small">Description</Form.Label>
              <Form.Control as="textarea" size="sm" rows={2} value={form.description} onChange={set('description')} />
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Check type="switch" label="Fonction active" checked={!!form.active} onChange={set('active')} />
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setModal(false)}>Annuler</Button>
          <Button variant="primary" size="sm" onClick={save} disabled={!form.code || !form.nom}>
            <i className="ph ph-check me-2" />{editItem ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

FonctionsList.propTypes = {
  fonctions:    PropTypes.array.isRequired,
  setFonctions: PropTypes.func.isRequired,
};
