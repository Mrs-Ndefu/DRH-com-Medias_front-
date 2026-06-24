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

const EMPTY = { directionId: '', code: '', nom: '', chef: '', effectif: '', description: '', active: true };

// ==============================|| ORGANISATION — DIVISIONS ||============================== //

export default function DivisionsList({ divisions, bureaux, directions, setDivisions }) {
  const { user } = useAuth();
  const readOnly = user?.role === 'SG';
  const [modal,       setModal]       = useState(false);
  const [editItem,    setEditItem]    = useState(null);
  const [form,        setForm]        = useState(EMPTY);
  const [filterDir,   setFilterDir]   = useState('');

  const openAdd  = () => { setEditItem(null); setForm(EMPTY); setModal(true); };
  const openEdit = (d) => { setEditItem(d); setForm({ ...d }); setModal(true); };
  const set      = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const save = () => {
    if (editItem) {
      setDivisions((p) => p.map((d) => d.id === editItem.id ? { ...d, ...form } : d));
    } else {
      setDivisions((p) => [...p, { id: `DIV${Date.now()}`, ...form }]);
    }
    setModal(false);
  };

  const toggle = (id) => setDivisions((p) => p.map((d) => d.id === id ? { ...d, active: !d.active } : d));

  const filtered = filterDir ? divisions.filter(d => d.directionId === filterDir) : divisions;

  const dirName = (id) => directions.find(d => d.id === id)?.sigle || id;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h6 className="mb-0">Divisions</h6>
          <small className="text-muted">
            <Badge bg="info" className="me-1">{divisions.filter(d => d.active).length}</Badge>actives
          </small>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <Form.Select size="sm" value={filterDir} onChange={(e) => setFilterDir(e.target.value)} style={{ width: 220 }}>
            <option value="">Toutes les directions</option>
            {directions.map(d => <option key={d.id} value={d.id}>{d.sigle} — {d.nom}</option>)}
          </Form.Select>
          {!readOnly && (
            <Button variant="primary" size="sm" onClick={openAdd}>
              <i className="ph ph-plus me-2" />Ajouter
            </Button>
          )}
        </div>
      </div>

      <Table hover responsive className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Direction</th>
            <th>Code</th>
            <th>Dénomination</th>
            <th>Chef de division</th>
            <th className="text-center">Effectif</th>
            <th className="text-center">Bureaux</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={8} className="text-center text-muted py-4">Aucune division trouvée</td></tr>
          ) : (
            filtered.map((d) => {
              const nbBureaux = bureaux.filter(b => b.divisionId === d.id).length;
              return (
                <tr key={d.id} style={{ opacity: d.active ? 1 : 0.5 }}>
                  <td><Badge bg="primary" className="fw-normal">{dirName(d.directionId)}</Badge></td>
                  <td><code className="text-info fw-bold">{d.code}</code></td>
                  <td>
                    <div className="fw-semibold">{d.nom}</div>
                    {d.description && <small className="text-muted">{d.description}</small>}
                  </td>
                  <td className="small">{d.chef || <span className="text-muted">—</span>}</td>
                  <td className="text-center fw-semibold">{d.effectif || '—'}</td>
                  <td className="text-center"><Badge bg="secondary">{nbBureaux}</Badge></td>
                  <td className="text-center">
                    <Badge bg={d.active ? 'success' : 'secondary'}>{d.active ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td className="text-center">
                    {!readOnly && (
                      <div className="d-flex gap-1 justify-content-center">
                        <Button variant="outline-primary" size="sm" onClick={() => openEdit(d)}>
                          <i className="ph ph-pencil" />
                        </Button>
                        <Button variant={d.active ? 'outline-warning' : 'outline-success'} size="sm" onClick={() => toggle(d.id)}>
                          <i className={`ph ph-${d.active ? 'pause' : 'play'}`} />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      {/* ── Modal ── */}
      <Modal show={modal} onHide={() => setModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`ph ph-${editItem ? 'pencil' : 'plus'} me-2 text-info`} />
            {editItem ? 'Modifier la division' : 'Ajouter une division'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Direction <span className="text-danger">*</span></Form.Label>
              <Form.Select size="sm" value={form.directionId} onChange={set('directionId')}>
                <option value="">— Sélectionner —</option>
                {directions.filter(d => d.active).map(d => (
                  <option key={d.id} value={d.id}>{d.sigle} — {d.nom}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={6} md={3}>
              <Form.Label className="small">Code <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={form.code} onChange={set('code')} placeholder="Ex: DGP" />
            </Form.Group>
            <Form.Group as={Col} xs={6} md={3}>
              <Form.Label className="small">Effectif</Form.Label>
              <Form.Control size="sm" type="number" value={form.effectif} onChange={set('effectif')} />
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Label className="small">Dénomination <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={form.nom} onChange={set('nom')} placeholder="Nom complet de la division" />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Chef de division</Form.Label>
              <Form.Control size="sm" value={form.chef} onChange={set('chef')} placeholder="Nom & Prénom" />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Description</Form.Label>
              <Form.Control size="sm" value={form.description} onChange={set('description')} />
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Check type="switch" label="Division active" checked={!!form.active} onChange={set('active')} />
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setModal(false)}>Annuler</Button>
          <Button variant="info" size="sm" onClick={save} disabled={!form.directionId || !form.nom}>
            <i className="ph ph-check me-2" />{editItem ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

DivisionsList.propTypes = {
  divisions:    PropTypes.array.isRequired,
  bureaux:      PropTypes.array.isRequired,
  directions:   PropTypes.array.isRequired,
  setDivisions: PropTypes.func.isRequired,
};
