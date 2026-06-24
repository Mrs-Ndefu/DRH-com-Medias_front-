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

const fmt = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

const EMPTY = { code: '', nom: '', sigle: '', chef: '', chefMatricule: '', effectif: '', description: '', active: true };

// ==============================|| ORGANISATION — DIRECTIONS ||============================== //

export default function DirectionsList({ directions, divisions, setDirections }) {
  const { user } = useAuth();
  const readOnly = user?.role === 'SG';
  const [modal,    setModal]    = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form,     setForm]     = useState(EMPTY);

  const openAdd  = () => { setEditItem(null); setForm(EMPTY); setModal(true); };
  const openEdit = (d) => { setEditItem(d); setForm({ ...d }); setModal(true); };
  const set      = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const save = () => {
    if (editItem) {
      setDirections((p) => p.map((d) => d.id === editItem.id ? { ...d, ...form } : d));
    } else {
      setDirections((p) => [...p, { id: `DIR${Date.now()}`, ...form }]);
    }
    setModal(false);
  };

  const toggle = (id) =>
    setDirections((p) => p.map((d) => d.id === id ? { ...d, active: !d.active } : d));

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="mb-0">Directions centrales</h6>
          <small className="text-muted">
            <Badge bg="primary" className="me-1">{directions.filter(d => d.active).length}</Badge> actives
            <Badge bg="secondary" className="ms-1">{directions.filter(d => !d.active).length}</Badge> inactives
          </small>
        </div>
        {!readOnly && (
          <Button variant="primary" size="sm" onClick={openAdd}>
            <i className="ph ph-plus me-2" />Ajouter une direction
          </Button>
        )}
      </div>

      <Table hover responsive className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Code</th>
            <th>Dénomination</th>
            <th>Chef de direction</th>
            <th className="text-center">Effectif</th>
            <th className="text-center">Divisions</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {directions.map((d) => {
            const nbDivisions = divisions.filter(dv => dv.directionId === d.id).length;
            return (
              <tr key={d.id} style={{ opacity: d.active ? 1 : 0.5 }}>
                <td><code className="fw-bold text-primary">{d.sigle || d.code}</code></td>
                <td>
                  <div className="fw-semibold">{d.nom}</div>
                  {d.description && <small className="text-muted">{d.description}</small>}
                </td>
                <td>
                  {d.chef ? (
                    <>
                      <div className="small">{d.chef}</div>
                      {d.chefMatricule && <code className="text-muted" style={{ fontSize: 11 }}>{d.chefMatricule}</code>}
                    </>
                  ) : <span className="text-muted">—</span>}
                </td>
                <td className="text-center fw-semibold">{d.effectif || '—'}</td>
                <td className="text-center">
                  <Badge bg="info">{nbDivisions}</Badge>
                </td>
                <td className="text-center">
                  <Badge bg={d.active ? 'success' : 'secondary'}>
                    {d.active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="text-center">
                  {!readOnly && (
                    <div className="d-flex gap-1 justify-content-center">
                      <Button variant="outline-primary" size="sm" onClick={() => openEdit(d)} title="Modifier">
                        <i className="ph ph-pencil" />
                      </Button>
                      <Button variant={d.active ? 'outline-warning' : 'outline-success'} size="sm" onClick={() => toggle(d.id)} title={d.active ? 'Désactiver' : 'Activer'}>
                        <i className={`ph ph-${d.active ? 'pause' : 'play'}`} />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* ── Modal Add / Edit ── */}
      <Modal show={modal} onHide={() => setModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`ph ph-${editItem ? 'pencil' : 'plus'} me-2 text-primary`} />
            {editItem ? 'Modifier la direction' : 'Ajouter une direction'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Form.Group as={Col} xs={6} md={3}>
              <Form.Label className="small">Code <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={form.code} onChange={set('code')} placeholder="Ex: DRH" />
            </Form.Group>
            <Form.Group as={Col} xs={6} md={3}>
              <Form.Label className="small">Sigle</Form.Label>
              <Form.Control size="sm" value={form.sigle} onChange={set('sigle')} placeholder="Ex: DRH" />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Dénomination <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={form.nom} onChange={set('nom')} placeholder="Nom complet de la direction" />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Chef de direction</Form.Label>
              <Form.Control size="sm" value={form.chef} onChange={set('chef')} placeholder="Nom & Prénom" />
            </Form.Group>
            <Form.Group as={Col} xs={6} md={3}>
              <Form.Label className="small">Matricule chef</Form.Label>
              <Form.Control size="sm" value={form.chefMatricule} onChange={set('chefMatricule')} />
            </Form.Group>
            <Form.Group as={Col} xs={6} md={3}>
              <Form.Label className="small">Effectif</Form.Label>
              <Form.Control size="sm" type="number" value={form.effectif} onChange={set('effectif')} />
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Label className="small">Description</Form.Label>
              <Form.Control as="textarea" size="sm" rows={2} value={form.description} onChange={set('description')} />
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Check type="switch" label="Direction active" checked={!!form.active} onChange={set('active')} />
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

DirectionsList.propTypes = {
  directions:    PropTypes.array.isRequired,
  divisions:     PropTypes.array.isRequired,
  setDirections: PropTypes.func.isRequired,
};
