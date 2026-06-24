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

import { CATEGORIES } from '../data/org';

const CAT_COLORS = { A: 'danger', B: 'warning', C: 'info', D: 'secondary' };
const EMPTY = { categorie: 'A', code: '', nom: '', echelons: '', indiceMin: '', indiceMax: '', active: true };

// ==============================|| ORGANISATION — GRADES ||============================== //

export default function GradesList({ grades, setGrades }) {
  const { user } = useAuth();
  const readOnly = user?.role === 'SG';
  const [modal,      setModal]      = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [filterCat,  setFilterCat]  = useState('');

  const openAdd  = () => { setEditItem(null); setForm(EMPTY); setModal(true); };
  const openEdit = (g) => { setEditItem(g); setForm({ ...g }); setModal(true); };
  const set      = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const save = () => {
    if (editItem) {
      setGrades((p) => p.map((g) => g.id === editItem.id ? { ...g, ...form } : g));
    } else {
      setGrades((p) => [...p, { id: `GRD${Date.now()}`, ...form }]);
    }
    setModal(false);
  };

  const toggle = (id) => setGrades((p) => p.map((g) => g.id === id ? { ...g, active: !g.active } : g));

  const filtered = filterCat ? grades.filter(g => g.categorie === filterCat) : grades;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h6 className="mb-0">Grille des grades</h6>
          <div className="d-flex gap-1 mt-1">
            {CATEGORIES.map(c => (
              <Badge key={c} bg={CAT_COLORS[c]} className="fw-normal">
                Cat. {c} : {grades.filter(g => g.categorie === c && g.active).length}
              </Badge>
            ))}
          </div>
        </div>
        <div className="d-flex gap-2">
          <Form.Select size="sm" value={filterCat} onChange={(e) => setFilterCat(e.target.value)} style={{ width: 140 }}>
            <option value="">Toutes catégories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>Catégorie {c}</option>)}
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
            <th>Catégorie</th>
            <th>Code</th>
            <th>Dénomination du grade</th>
            <th className="text-center">Échelons</th>
            <th className="text-center">Indice min</th>
            <th className="text-center">Indice max</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((g) => (
            <tr key={g.id} style={{ opacity: g.active ? 1 : 0.5 }}>
              <td>
                <Badge bg={CAT_COLORS[g.categorie] || 'secondary'} className="px-3">
                  Cat. {g.categorie}
                </Badge>
              </td>
              <td><code className="fw-bold">{g.code}</code></td>
              <td className="fw-semibold">{g.nom}</td>
              <td className="text-center">{g.echelons || '—'}</td>
              <td className="text-center">{g.indiceMin || '—'}</td>
              <td className="text-center">{g.indiceMax || '—'}</td>
              <td className="text-center">
                <Badge bg={g.active ? 'success' : 'secondary'}>{g.active ? 'Actif' : 'Inactif'}</Badge>
              </td>
              <td className="text-center">
                {!readOnly && (
                  <div className="d-flex gap-1 justify-content-center">
                    <Button variant="outline-primary" size="sm" onClick={() => openEdit(g)}>
                      <i className="ph ph-pencil" />
                    </Button>
                    <Button variant={g.active ? 'outline-warning' : 'outline-success'} size="sm" onClick={() => toggle(g.id)}>
                      <i className={`ph ph-${g.active ? 'pause' : 'play'}`} />
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ── Modal ── */}
      <Modal show={modal} onHide={() => setModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`ph ph-${editItem ? 'pencil' : 'plus'} me-2 text-primary`} />
            {editItem ? 'Modifier le grade' : 'Ajouter un grade'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Form.Group as={Col} xs={6}>
              <Form.Label className="small">Catégorie <span className="text-danger">*</span></Form.Label>
              <Form.Select size="sm" value={form.categorie} onChange={set('categorie')}>
                {CATEGORIES.map(c => <option key={c} value={c}>Catégorie {c}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={6}>
              <Form.Label className="small">Code <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={form.code} onChange={set('code')} placeholder="Ex: A-HC" />
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Label className="small">Dénomination <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={form.nom} onChange={set('nom')} />
            </Form.Group>
            <Form.Group as={Col} xs={4}>
              <Form.Label className="small">Échelons</Form.Label>
              <Form.Control size="sm" type="number" value={form.echelons} onChange={set('echelons')} />
            </Form.Group>
            <Form.Group as={Col} xs={4}>
              <Form.Label className="small">Indice min</Form.Label>
              <Form.Control size="sm" type="number" value={form.indiceMin} onChange={set('indiceMin')} />
            </Form.Group>
            <Form.Group as={Col} xs={4}>
              <Form.Label className="small">Indice max</Form.Label>
              <Form.Control size="sm" type="number" value={form.indiceMax} onChange={set('indiceMax')} />
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Check type="switch" label="Grade actif" checked={!!form.active} onChange={set('active')} />
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

GradesList.propTypes = {
  grades:    PropTypes.array.isRequired,
  setGrades: PropTypes.func.isRequired,
};
