import PropTypes from 'prop-types';
import { useState } from 'react';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { STATUTS_ENTRETIEN, TYPES_ENTRETIEN } from '../data/recruitment';

const EMPTY = { candidatId: '', offreId: '', date: '', heure: '', lieu: '', type: 'RH', statut: 'PLANIFIE', note: '', appreciation: '', evaluateur: '' };

// ==============================|| RECRUTEMENT — ENTRETIENS ||============================== //

export default function EntretiensList({ entretiens, candidats, offres, setEntretiens }) {
  const [modal,       setModal]       = useState(false);
  const [editItem,    setEditItem]    = useState(null);
  const [form,        setForm]        = useState(EMPTY);
  const [filterSt,    setFilterSt]    = useState('');
  const [noteModal,   setNoteModal]   = useState(null);
  const [noteForm,    setNoteForm]    = useState({ note: '', appreciation: '' });

  const openAdd  = () => { setEditItem(null); setForm(EMPTY); setModal(true); };
  const openEdit = (e) => { setEditItem(e); setForm({ ...e, note: e.note ?? '' }); setModal(true); };
  const set      = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const save = () => {
    const payload = { ...form, note: form.note !== '' ? +form.note : null };
    if (editItem) setEntretiens((p) => p.map((e) => e.id === editItem.id ? { ...e, ...payload } : e));
    else          setEntretiens((p) => [...p, { id: `ENT${Date.now()}`, ...payload }]);
    setModal(false);
  };

  const openNote = (e) => { setNoteModal(e); setNoteForm({ note: e.note ?? '', appreciation: e.appreciation || '' }); };
  const saveNote = () => {
    setEntretiens((p) => p.map((e) => e.id === noteModal.id
      ? { ...e, note: noteForm.note !== '' ? +noteForm.note : null, appreciation: noteForm.appreciation, statut: 'REALISE' }
      : e));
    setNoteModal(null);
  };

  const nomCandidat = (id) => { const c = candidats.find(x => x.id === id); return c ? `${c.prenom} ${c.nom}` : id; };
  const titrOffre   = (id) => offres.find(o => o.id === id)?.titre || id;

  const filtered = filterSt ? entretiens.filter(e => e.statut === filterSt) : entretiens;
  const sorted   = [...filtered].sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));

  return (
    <>
      {/* ── KPIs ── */}
      <Row className="g-2 mb-4">
        {Object.entries(STATUTS_ENTRETIEN).map(([key, s]) => (
          <Col key={key} xs={6} md={3}>
            <div className={`border border-${s.color} border-opacity-25 rounded p-3 text-center bg-${s.color} bg-opacity-10`}
              style={{ cursor: 'pointer' }} onClick={() => setFilterSt(filterSt === key ? '' : key)}>
              <h4 className={`mb-0 text-${s.color}`}>{entretiens.filter(e => e.statut === key).length}</h4>
              <small className="text-muted">{s.label}</small>
            </div>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Planning des entretiens</h6>
        <Button variant="primary" size="sm" onClick={openAdd}>
          <i className="ph ph-plus me-2" />Planifier un entretien
        </Button>
      </div>

      <Table hover responsive className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Date &amp; Heure</th>
            <th>Candidat</th>
            <th>Poste</th>
            <th>Type</th>
            <th>Lieu</th>
            <th>Évaluateur</th>
            <th className="text-center">Note /20</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr><td colSpan={9} className="text-center text-muted py-5">
              <i className="ph ph-calendar f-28 d-block mb-2" />Aucun entretien planifié
            </td></tr>
          ) : sorted.map((e) => {
            const s = STATUTS_ENTRETIEN[e.statut] || {};
            return (
              <tr key={e.id}>
                <td>
                  <div className="fw-semibold">{e.date ? new Date(e.date).toLocaleDateString('fr-FR') : '—'}</div>
                  <small className="text-muted">{e.heure}</small>
                </td>
                <td className="fw-semibold">{nomCandidat(e.candidatId)}</td>
                <td><small className="text-muted">{titrOffre(e.offreId)}</small></td>
                <td><Badge bg="light" text="dark">{TYPES_ENTRETIEN[e.type]}</Badge></td>
                <td><small>{e.lieu}</small></td>
                <td><small className="text-muted">{e.evaluateur || '—'}</small></td>
                <td className="text-center">
                  {e.note != null
                    ? <Badge bg={e.note >= 14 ? 'success' : e.note >= 10 ? 'warning' : 'danger'} className="px-3">{e.note}/20</Badge>
                    : <span className="text-muted">—</span>}
                </td>
                <td className="text-center"><Badge bg={s.color}>{s.label}</Badge></td>
                <td className="text-center">
                  <div className="d-flex gap-1 justify-content-center">
                    <Button variant="outline-primary" size="sm" onClick={() => openEdit(e)} title="Modifier">
                      <i className="ph ph-pencil" />
                    </Button>
                    {e.statut === 'PLANIFIE' && (
                      <Button variant="outline-success" size="sm" title="Saisir la note" onClick={() => openNote(e)}>
                        <i className="ph ph-star" />
                      </Button>
                    )}
                    {e.statut === 'PLANIFIE' && (
                      <Button variant="outline-warning" size="sm" title="Reporter"
                        onClick={() => setEntretiens(p => p.map(x => x.id === e.id ? { ...x, statut: 'REPORTE' } : x))}>
                        <i className="ph ph-clock-clockwise" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* ── Modal saisie note ── */}
      <Modal show={!!noteModal} onHide={() => setNoteModal(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title><i className="ph ph-star me-2 text-warning" />Résultat de l'entretien</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {noteModal && (
            <div className="mb-3 p-3 bg-light rounded">
              <div className="fw-semibold">{nomCandidat(noteModal.candidatId)}</div>
              <small className="text-muted">{TYPES_ENTRETIEN[noteModal.type]} — {noteModal.date ? new Date(noteModal.date).toLocaleDateString('fr-FR') : ''} {noteModal.heure}</small>
            </div>
          )}
          <Row className="g-3">
            <Form.Group as={Col} xs={6}>
              <Form.Label className="small">Note /20 <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" type="number" min={0} max={20} step={0.5}
                value={noteForm.note}
                onChange={(e) => setNoteForm(p => ({ ...p, note: e.target.value }))} />
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Label className="small">Appréciation</Form.Label>
              <Form.Control as="textarea" size="sm" rows={3}
                value={noteForm.appreciation}
                onChange={(e) => setNoteForm(p => ({ ...p, appreciation: e.target.value }))}
                placeholder="Commentaires sur le candidat..." />
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setNoteModal(null)}>Annuler</Button>
          <Button variant="success" size="sm" onClick={saveNote} disabled={noteForm.note === ''}>
            <i className="ph ph-check me-2" />Valider
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── Modal Add/Edit ── */}
      <Modal show={modal} onHide={() => setModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`ph ph-${editItem ? 'pencil' : 'plus'} me-2 text-primary`} />
            {editItem ? "Modifier l'entretien" : "Planifier un entretien"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Candidat <span className="text-danger">*</span></Form.Label>
              <Form.Select size="sm" value={form.candidatId} onChange={set('candidatId')}>
                <option value="">— Sélectionner —</option>
                {candidats.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Offre concernée</Form.Label>
              <Form.Select size="sm" value={form.offreId} onChange={set('offreId')}>
                <option value="">— Sélectionner —</option>
                {offres.map(o => <option key={o.id} value={o.id}>{o.reference} — {o.titre}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={6} md={3}>
              <Form.Label className="small">Date <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" type="date" value={form.date} onChange={set('date')} />
            </Form.Group>
            <Form.Group as={Col} xs={6} md={3}>
              <Form.Label className="small">Heure</Form.Label>
              <Form.Control size="sm" type="time" value={form.heure} onChange={set('heure')} />
            </Form.Group>
            <Form.Group as={Col} xs={6} md={3}>
              <Form.Label className="small">Type</Form.Label>
              <Form.Select size="sm" value={form.type} onChange={set('type')}>
                {Object.entries(TYPES_ENTRETIEN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={6} md={3}>
              <Form.Label className="small">Statut</Form.Label>
              <Form.Select size="sm" value={form.statut} onChange={set('statut')}>
                {Object.entries(STATUTS_ENTRETIEN).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Lieu</Form.Label>
              <Form.Control size="sm" value={form.lieu} onChange={set('lieu')} placeholder="Ex: Salle A — Ministère" />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Évaluateur</Form.Label>
              <Form.Control size="sm" value={form.evaluateur} onChange={set('evaluateur')} />
            </Form.Group>
            {editItem && (
              <>
                <Form.Group as={Col} xs={4}>
                  <Form.Label className="small">Note /20</Form.Label>
                  <Form.Control size="sm" type="number" min={0} max={20} step={0.5} value={form.note} onChange={set('note')} />
                </Form.Group>
                <Form.Group as={Col} xs={8}>
                  <Form.Label className="small">Appréciation</Form.Label>
                  <Form.Control size="sm" value={form.appreciation} onChange={set('appreciation')} />
                </Form.Group>
              </>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setModal(false)}>Annuler</Button>
          <Button variant="primary" size="sm" onClick={save} disabled={!form.candidatId || !form.date}>
            <i className="ph ph-check me-2" />{editItem ? 'Enregistrer' : 'Planifier'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

EntretiensList.propTypes = {
  entretiens:    PropTypes.array.isRequired,
  candidats:     PropTypes.array.isRequired,
  offres:        PropTypes.array.isRequired,
  setEntretiens: PropTypes.func.isRequired,
};
