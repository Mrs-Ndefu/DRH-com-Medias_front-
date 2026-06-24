import PropTypes from 'prop-types';
import { useState } from 'react';

import { useAuth } from 'contexts/AuthContext';

import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { SECRETARIAT_GENERAL } from '../data/org';

const EMPTY_DIV = { code: '', nom: '', chef: '', effectif: '', description: '', active: true };
const EMPTY_BUR = { divisionId: '', nom: '', chef: '', effectif: '', active: true };

// ==============================|| ORGANISATION — SECRÉTARIAT GÉNÉRAL ||============================== //

export default function SecretariatGeneral({ sgDivisions, setSgDivisions, sgBureaux, setSgBureaux }) {
  const { user } = useAuth();
  const readOnly = user?.role === 'SG';
  const [modalDiv,   setModalDiv]   = useState(false);
  const [modalBur,   setModalBur]   = useState(false);
  const [editDiv,    setEditDiv]    = useState(null);
  const [editBur,    setEditBur]    = useState(null);
  const [formDiv,    setFormDiv]    = useState(EMPTY_DIV);
  const [formBur,    setFormBur]    = useState(EMPTY_BUR);
  const [modalInfo,  setModalInfo]  = useState(false);
  const [sgInfo,     setSgInfo]     = useState({ ...SECRETARIAT_GENERAL });
  const [formInfo,   setFormInfo]   = useState({ ...SECRETARIAT_GENERAL });

  const setD = (k) => (e) => setFormDiv((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const setB = (k) => (e) => setFormBur((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const setI = (k) => (e) => setFormInfo((p) => ({ ...p, [k]: e.target.value }));

  const openAddDiv  = ()  => { setEditDiv(null); setFormDiv(EMPTY_DIV); setModalDiv(true); };
  const openEditDiv = (d) => { setEditDiv(d);    setFormDiv({ ...d });  setModalDiv(true); };
  const saveDiv = () => {
    if (editDiv) setSgDivisions((p) => p.map((d) => d.id === editDiv.id ? { ...d, ...formDiv } : d));
    else         setSgDivisions((p) => [...p, { id: `SGD${Date.now()}`, ...formDiv }]);
    setModalDiv(false);
  };
  const toggleDiv = (id) => setSgDivisions((p) => p.map((d) => d.id === id ? { ...d, active: !d.active } : d));

  const openAddBur  = (divisionId) => { setEditBur(null); setFormBur({ ...EMPTY_BUR, divisionId }); setModalBur(true); };
  const openEditBur = (b) => { setEditBur(b); setFormBur({ ...b }); setModalBur(true); };
  const saveBur = () => {
    if (editBur) setSgBureaux((p) => p.map((b) => b.id === editBur.id ? { ...b, ...formBur } : b));
    else         setSgBureaux((p) => [...p, { id: `SGB${Date.now()}`, ...formBur }]);
    setModalBur(false);
  };
  const toggleBur = (id) => setSgBureaux((p) => p.map((b) => b.id === id ? { ...b, active: !b.active } : b));

  const saveInfo = () => { setSgInfo({ ...formInfo }); setModalInfo(false); };

  return (
    <>
      {/* ── Fiche SG ── */}
      <div className="bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded p-4 mb-4">
        <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-4">
            <div className="d-flex align-items-center justify-content-center rounded-circle bg-warning text-white flex-shrink-0"
              style={{ width: 60, height: 60 }}>
              <i className="ph ph-user-gear f-28" />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <Badge bg="warning" text="dark" className="px-3 py-1 fs-6">{sgInfo.sigle}</Badge>
                <h5 className="mb-0">{sgInfo.nom}</h5>
              </div>
              <div className="d-flex flex-wrap gap-3 text-muted small">
                <span><i className="ph ph-user me-1" /><strong>{sgInfo.titulaire}</strong></span>
                {sgInfo.matricule && <span><i className="ph ph-identification-badge me-1" />{sgInfo.matricule}</span>}
                {sgInfo.telephoneOff && <span><i className="ph ph-phone me-1" />{sgInfo.telephoneOff}</span>}
                {sgInfo.email && <span><i className="ph ph-envelope me-1" />{sgInfo.email}</span>}
                <span><i className="ph ph-users me-1" />{sgInfo.effectif} agents</span>
              </div>
              <p className="text-muted small mb-0 mt-2">{sgInfo.description}</p>
            </div>
          </div>
          <Button variant="outline-warning" size="sm" onClick={() => { setFormInfo({ ...sgInfo }); setModalInfo(true); }}>
            <i className="ph ph-pencil me-1" />Modifier
          </Button>
        </div>
      </div>

      {/* ── Divisions du SG ── */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="mb-0">Divisions du Secrétariat Général</h6>
          <small className="text-muted">
            <Badge bg="warning" text="dark" className="me-1">{sgDivisions.filter(d => d.active).length}</Badge>divisions actives
          </small>
        </div>
        {!readOnly && (
          <Button variant="warning" size="sm" onClick={openAddDiv}>
            <i className="ph ph-plus me-2" />Ajouter une division
          </Button>
        )}
      </div>

      <Accordion className="mb-4">
        {sgDivisions.map((div) => {
          const divBur = sgBureaux.filter(b => b.divisionId === div.id);
          return (
            <Accordion.Item key={div.id} eventKey={div.id}>
              <Accordion.Header>
                <div className="d-flex align-items-center gap-3 w-100 me-3" style={{ opacity: div.active ? 1 : 0.5 }}>
                  <Badge bg="warning" text="dark">{div.code}</Badge>
                  <span className="fw-semibold">{div.nom}</span>
                  {div.chef && <small className="text-muted"><i className="ph ph-user me-1" />{div.chef}</small>}
                  <div className="ms-auto d-flex gap-2 align-items-center">
                    <Badge bg="light" text="dark">{div.effectif || 0} agents</Badge>
                    <Badge bg="secondary">{divBur.length} bureau{divBur.length > 1 ? 'x' : ''}</Badge>
                    {!readOnly && (
                      <>
                        <Button variant="outline-warning" size="sm" className="py-0 px-1"
                          onClick={(e) => { e.stopPropagation(); openEditDiv(div); }}>
                          <i className="ph ph-pencil" />
                        </Button>
                        <Button variant={div.active ? 'outline-secondary' : 'outline-success'} size="sm" className="py-0 px-1"
                          onClick={(e) => { e.stopPropagation(); toggleDiv(div.id); }}>
                          <i className={`ph ph-${div.active ? 'pause' : 'play'}`} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body className="p-3">
                {div.description && <p className="text-muted small mb-3">{div.description}</p>}
                <Table size="sm" hover className="align-middle mb-2">
                  <thead className="table-light">
                    <tr>
                      <th>Bureau</th>
                      <th>Chef de bureau</th>
                      <th className="text-center">Effectif</th>
                      <th className="text-center">Statut</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {divBur.length === 0 ? (
                      <tr><td colSpan={5} className="text-center text-muted py-2">Aucun bureau</td></tr>
                    ) : (
                      divBur.map((b) => (
                        <tr key={b.id} style={{ opacity: b.active ? 1 : 0.5 }}>
                          <td className="fw-semibold">{b.nom}</td>
                          <td className="small text-muted">{b.chef || '—'}</td>
                          <td className="text-center">{b.effectif || '—'}</td>
                          <td className="text-center">
                            <Badge bg={b.active ? 'success' : 'secondary'}>{b.active ? 'Actif' : 'Inactif'}</Badge>
                          </td>
                          <td className="text-center">
                            {!readOnly && (
                              <div className="d-flex gap-1 justify-content-center">
                                <Button variant="outline-primary" size="sm" onClick={() => openEditBur(b)}>
                                  <i className="ph ph-pencil" />
                                </Button>
                                <Button variant={b.active ? 'outline-warning' : 'outline-success'} size="sm" onClick={() => toggleBur(b.id)}>
                                  <i className={`ph ph-${b.active ? 'pause' : 'play'}`} />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
                {!readOnly && (
                  <Button variant="outline-warning" size="sm" onClick={() => openAddBur(div.id)}>
                    <i className="ph ph-plus me-1" />Ajouter un bureau
                  </Button>
                )}
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>

      {/* ── Modal info SG ── */}
      <Modal show={modalInfo} onHide={() => setModalInfo(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title><i className="ph ph-user-gear me-2 text-warning" />Modifier le Secrétariat Général</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Titulaire (Secrétaire Général)</Form.Label>
              <Form.Control size="sm" value={formInfo.titulaire} onChange={setI('titulaire')} />
            </Form.Group>
            <Form.Group as={Col} xs={6} md={3}>
              <Form.Label className="small">Matricule</Form.Label>
              <Form.Control size="sm" value={formInfo.matricule} onChange={setI('matricule')} />
            </Form.Group>
            <Form.Group as={Col} xs={6} md={3}>
              <Form.Label className="small">Effectif total</Form.Label>
              <Form.Control size="sm" type="number" value={formInfo.effectif} onChange={setI('effectif')} />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Téléphone</Form.Label>
              <Form.Control size="sm" value={formInfo.telephoneOff} onChange={setI('telephoneOff')} />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Email</Form.Label>
              <Form.Control size="sm" type="email" value={formInfo.email} onChange={setI('email')} />
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Label className="small">Description / missions</Form.Label>
              <Form.Control as="textarea" size="sm" rows={3} value={formInfo.description} onChange={setI('description')} />
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setModalInfo(false)}>Annuler</Button>
          <Button variant="warning" size="sm" onClick={saveInfo}><i className="ph ph-check me-2" />Enregistrer</Button>
        </Modal.Footer>
      </Modal>

      {/* ── Modal Division ── */}
      <Modal show={modalDiv} onHide={() => setModalDiv(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><i className={`ph ph-${editDiv ? 'pencil' : 'plus'} me-2 text-warning`} />{editDiv ? 'Modifier' : 'Ajouter'} une division</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Form.Group as={Col} xs={4}>
              <Form.Label className="small">Code <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={formDiv.code} onChange={setD('code')} placeholder="Ex: DAG" />
            </Form.Group>
            <Form.Group as={Col} xs={8}>
              <Form.Label className="small">Dénomination <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={formDiv.nom} onChange={setD('nom')} />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Chef de division</Form.Label>
              <Form.Control size="sm" value={formDiv.chef} onChange={setD('chef')} />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Effectif</Form.Label>
              <Form.Control size="sm" type="number" value={formDiv.effectif} onChange={setD('effectif')} />
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Label className="small">Description</Form.Label>
              <Form.Control size="sm" value={formDiv.description} onChange={setD('description')} />
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Check type="switch" label="Division active" checked={!!formDiv.active} onChange={setD('active')} />
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setModalDiv(false)}>Annuler</Button>
          <Button variant="warning" size="sm" onClick={saveDiv} disabled={!formDiv.code || !formDiv.nom}>
            <i className="ph ph-check me-2" />{editDiv ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── Modal Bureau ── */}
      <Modal show={modalBur} onHide={() => setModalBur(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><i className={`ph ph-${editBur ? 'pencil' : 'plus'} me-2 text-secondary`} />{editBur ? 'Modifier' : 'Ajouter'} un bureau</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Division <span className="text-danger">*</span></Form.Label>
              <Form.Select size="sm" value={formBur.divisionId} onChange={setB('divisionId')}>
                <option value="">— Sélectionner —</option>
                {sgDivisions.filter(d => d.active).map(d => (
                  <option key={d.id} value={d.id}>{d.code} — {d.nom}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Dénomination <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={formBur.nom} onChange={setB('nom')} />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Chef de bureau</Form.Label>
              <Form.Control size="sm" value={formBur.chef} onChange={setB('chef')} />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Effectif</Form.Label>
              <Form.Control size="sm" type="number" value={formBur.effectif} onChange={setB('effectif')} />
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Check type="switch" label="Bureau actif" checked={!!formBur.active} onChange={setB('active')} />
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setModalBur(false)}>Annuler</Button>
          <Button variant="secondary" size="sm" onClick={saveBur} disabled={!formBur.divisionId || !formBur.nom}>
            <i className="ph ph-check me-2" />{editBur ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

SecretariatGeneral.propTypes = {
  sgDivisions:    PropTypes.array.isRequired,
  setSgDivisions: PropTypes.func.isRequired,
  sgBureaux:      PropTypes.array.isRequired,
  setSgBureaux:   PropTypes.func.isRequired,
};
