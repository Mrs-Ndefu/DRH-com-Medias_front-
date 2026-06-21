import PropTypes from 'prop-types';
import { useState } from 'react';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { TYPES_ELEMENT } from '../data/payroll';

const BASES = ['FIXE', '% BASE', '% BRUT', 'INDICE'];
const EMPTY = { code: '', designation: '', type: 'PRIME', base: 'FIXE', taux: '', imposable: false, active: true };

// ==============================|| PAIE — ÉLÉMENTS DE PAIE ||============================== //

export default function ElementsPaie({ elements, setElements }) {
  const [modal,    setModal]    = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [filterTy, setFilterTy] = useState('');

  const openAdd  = () => { setEditItem(null); setForm(EMPTY); setModal(true); };
  const openEdit = (e) => { setEditItem(e); setForm({ ...e }); setModal(true); };
  const set      = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const save = () => {
    if (editItem) setElements(p => p.map(e => e.id === editItem.id ? { ...e, ...form } : e));
    else          setElements(p => [...p, { id: `EL${Date.now()}`, ...form }]);
    setModal(false);
  };

  const toggle = (id) => setElements(p => p.map(e => e.id === id ? { ...e, active: !e.active } : e));

  const filtered = filterTy ? elements.filter(e => e.type === filterTy) : elements;

  return (
    <>
      {/* ── KPIs types ── */}
      <Row className="g-2 mb-4">
        {Object.entries(TYPES_ELEMENT).map(([key, t]) => (
          <Col key={key} xs={6} md={3}>
            <div className={`border border-${t.color} border-opacity-25 rounded p-3 text-center bg-${t.color} bg-opacity-10`}
              style={{ cursor: 'pointer' }} onClick={() => setFilterTy(filterTy === key ? '' : key)}>
              <h4 className={`mb-0 text-${t.color}`}>{elements.filter(e => e.type === key && e.active).length}</h4>
              <small className="text-muted">{t.label}</small>
            </div>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Éléments de paie</h6>
        <Button variant="primary" size="sm" onClick={openAdd}>
          <i className="ph ph-plus me-2" />Nouvel élément
        </Button>
      </div>

      <Table hover responsive className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Code</th>
            <th>Désignation</th>
            <th>Type</th>
            <th>Base de calcul</th>
            <th className="text-end">Taux / Montant</th>
            <th className="text-center">Imposable</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(e => {
            const t = TYPES_ELEMENT[e.type] || {};
            return (
              <tr key={e.id} style={{ opacity: e.active ? 1 : 0.5 }}>
                <td><code className="fw-bold">{e.code}</code></td>
                <td className="fw-semibold">{e.designation}</td>
                <td><Badge bg={t.color}>{t.label}</Badge></td>
                <td><Badge bg="light" text="dark">{e.base}</Badge></td>
                <td className="text-end fw-semibold">
                  {e.base.startsWith('%') ? `${e.taux} %` : e.base === 'INDICE' ? `${e.taux} FCFA/pt` : `${new Intl.NumberFormat('fr-FR').format(e.taux)} FCFA`}
                </td>
                <td className="text-center">
                  {e.imposable ? <i className="ph ph-check text-success" /> : <i className="ph ph-x text-muted" />}
                </td>
                <td className="text-center">
                  <Badge bg={e.active ? 'success' : 'secondary'}>{e.active ? 'Actif' : 'Inactif'}</Badge>
                </td>
                <td className="text-center">
                  <div className="d-flex gap-1 justify-content-center">
                    <Button variant="outline-primary" size="sm" onClick={() => openEdit(e)}>
                      <i className="ph ph-pencil" />
                    </Button>
                    <Button variant={e.active ? 'outline-warning' : 'outline-success'} size="sm" onClick={() => toggle(e.id)}>
                      <i className={`ph ph-${e.active ? 'pause' : 'play'}`} />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* ── Modal ── */}
      <Modal show={modal} onHide={() => setModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`ph ph-${editItem ? 'pencil' : 'plus'} me-2 text-primary`} />
            {editItem ? "Modifier l'élément" : "Nouvel élément de paie"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Form.Group as={Col} xs={4}>
              <Form.Label className="small">Code <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={form.code} onChange={set('code')} placeholder="Ex: IFO" />
            </Form.Group>
            <Form.Group as={Col} xs={8}>
              <Form.Label className="small">Désignation <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={form.designation} onChange={set('designation')} />
            </Form.Group>
            <Form.Group as={Col} xs={6}>
              <Form.Label className="small">Type</Form.Label>
              <Form.Select size="sm" value={form.type} onChange={set('type')}>
                {Object.entries(TYPES_ELEMENT).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={6}>
              <Form.Label className="small">Base de calcul</Form.Label>
              <Form.Select size="sm" value={form.base} onChange={set('base')}>
                {BASES.map(b => <option key={b} value={b}>{b}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={6}>
              <Form.Label className="small">
                {form.base.startsWith('%') ? 'Taux (%)' : 'Montant (FCFA)'}
              </Form.Label>
              <Form.Control size="sm" type="number" value={form.taux} onChange={set('taux')} />
            </Form.Group>
            <Col xs={6} className="d-flex gap-3 align-items-center pt-4">
              <Form.Check type="switch" label="Imposable" checked={!!form.imposable} onChange={set('imposable')} />
              <Form.Check type="switch" label="Actif" checked={!!form.active} onChange={set('active')} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setModal(false)}>Annuler</Button>
          <Button variant="primary" size="sm" onClick={save} disabled={!form.code || !form.designation}>
            <i className="ph ph-check me-2" />{editItem ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ElementsPaie.propTypes = {
  elements:    PropTypes.array.isRequired,
  setElements: PropTypes.func.isRequired,
};
