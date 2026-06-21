import PropTypes from 'prop-types';
import { useState } from 'react';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { STATUTS_CANDIDAT } from '../data/recruitment';

const EMPTY = { nom: '', prenom: '', email: '', telephone: '', dateNaissance: '', diplome: '', etablissement: '', experience: 0, offreId: '', statut: 'EN_ATTENTE', dateDepot: '' };

const initiales = (p, n) => `${p?.[0] || ''}${n?.[0] || ''}`.toUpperCase();

// ==============================|| RECRUTEMENT — CANDIDATS ||============================== //

export default function CandidatsList({ candidats, offres, setCandidats, filtreOffreId, setFiltreOffreId }) {
  const [modal,       setModal]       = useState(false);
  const [editItem,    setEditItem]    = useState(null);
  const [form,        setForm]        = useState(EMPTY);
  const [filterSt,    setFilterSt]    = useState('');
  const [modalDetail, setModalDetail] = useState(null);

  const openAdd  = () => { setEditItem(null); setForm({ ...EMPTY, offreId: filtreOffreId || '' }); setModal(true); };
  const openEdit = (c) => { setEditItem(c); setForm({ ...c }); setModal(true); };
  const set      = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const save = () => {
    if (editItem) setCandidats((p) => p.map((c) => c.id === editItem.id ? { ...c, ...form } : c));
    else          setCandidats((p) => [...p, { id: `CAN${Date.now()}`, ...form }]);
    setModal(false);
  };

  const changeStatut = (id, statut) => setCandidats((p) => p.map((c) => c.id === id ? { ...c, statut } : c));

  const filtered = candidats
    .filter(c => !filtreOffreId || c.offreId === filtreOffreId)
    .filter(c => !filterSt     || c.statut  === filterSt);

  const offreTitre = (id) => offres.find(o => o.id === id)?.titre || id;

  return (
    <>
      {/* Filtre offre actif */}
      {filtreOffreId && (
        <div className="alert alert-info d-flex align-items-center justify-content-between py-2 mb-3">
          <span><i className="ph ph-funnel me-2" />Filtre : <strong>{offreTitre(filtreOffreId)}</strong></span>
          <Button variant="link" size="sm" className="p-0 text-info" onClick={() => setFiltreOffreId('')}>
            <i className="ph ph-x me-1" />Retirer le filtre
          </Button>
        </div>
      )}

      {/* ── KPIs ── */}
      <Row className="g-2 mb-3">
        {Object.entries(STATUTS_CANDIDAT).map(([key, s]) => (
          <Col key={key} xs={4} md={2}>
            <div className={`border border-${s.color} border-opacity-25 rounded p-2 text-center bg-${s.color} bg-opacity-10`}
              style={{ cursor: 'pointer' }}
              onClick={() => setFilterSt(filterSt === key ? '' : key)}>
              <div className={`fw-bold text-${s.color}`}>{candidats.filter(c => c.statut === key && (!filtreOffreId || c.offreId === filtreOffreId)).length}</div>
              <small className="text-muted" style={{ fontSize: 10 }}>{s.label}</small>
            </div>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h6 className="mb-0">
          Candidats <Badge bg="secondary" className="ms-1">{filtered.length}</Badge>
        </h6>
        <div className="d-flex gap-2">
          <Form.Select size="sm" value={filtreOffreId} onChange={(e) => setFiltreOffreId(e.target.value)} style={{ width: 220 }}>
            <option value="">Toutes les offres</option>
            {offres.map(o => <option key={o.id} value={o.id}>{o.reference} — {o.titre}</option>)}
          </Form.Select>
          <Button variant="primary" size="sm" onClick={openAdd}>
            <i className="ph ph-plus me-1" />Ajouter
          </Button>
        </div>
      </div>

      <Table hover responsive className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Candidat</th>
            <th>Diplôme</th>
            <th>Offre</th>
            <th className="text-center">Expérience</th>
            <th>Dépôt</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={7} className="text-center text-muted py-5">
              <i className="ph ph-users f-28 d-block mb-2" />Aucun candidat
            </td></tr>
          ) : filtered.map((c) => {
            const s = STATUTS_CANDIDAT[c.statut] || {};
            return (
              <tr key={c.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                      style={{ width: 34, height: 34, fontSize: 12 }}>
                      {initiales(c.prenom, c.nom)}
                    </div>
                    <div>
                      <div className="fw-semibold">{c.prenom} {c.nom}</div>
                      <small className="text-muted">{c.email}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="small">{c.diplome}</div>
                  <small className="text-muted">{c.etablissement}</small>
                </td>
                <td><small className="text-muted">{offreTitre(c.offreId)}</small></td>
                <td className="text-center">
                  <Badge bg="light" text="dark">{c.experience} an{c.experience > 1 ? 's' : ''}</Badge>
                </td>
                <td className="small">{c.dateDepot ? new Date(c.dateDepot).toLocaleDateString('fr-FR') : '—'}</td>
                <td className="text-center"><Badge bg={s.color}>{s.label}</Badge></td>
                <td className="text-center">
                  <div className="d-flex gap-1 justify-content-center">
                    <Button variant="outline-info" size="sm" onClick={() => setModalDetail(c)} title="Fiche candidat">
                      <i className="ph ph-eye" />
                    </Button>
                    <Button variant="outline-primary" size="sm" onClick={() => openEdit(c)} title="Modifier">
                      <i className="ph ph-pencil" />
                    </Button>
                    {c.statut === 'EN_ATTENTE' && (
                      <Button variant="outline-success" size="sm" title="Retenir" onClick={() => changeStatut(c.id, 'RETENU')}>
                        <i className="ph ph-check" />
                      </Button>
                    )}
                    {c.statut === 'RETENU' && (
                      <Button variant="outline-warning" size="sm" title="Planifier entretien" onClick={() => changeStatut(c.id, 'ENTRETIEN')}>
                        <i className="ph ph-calendar" />
                      </Button>
                    )}
                    {(c.statut !== 'ACCEPTE' && c.statut !== 'REJETE') && (
                      <Button variant="outline-danger" size="sm" title="Rejeter" onClick={() => changeStatut(c.id, 'REJETE')}>
                        <i className="ph ph-x" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* ── Modal fiche candidat ── */}
      <Modal show={!!modalDetail} onHide={() => setModalDetail(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title><i className="ph ph-user me-2 text-primary" />Fiche candidat</Modal.Title>
        </Modal.Header>
        {modalDetail && (
          <Modal.Body>
            <div className="text-center mb-3">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold mx-auto mb-2"
                style={{ width: 56, height: 56, fontSize: 20 }}>
                {initiales(modalDetail.prenom, modalDetail.nom)}
              </div>
              <h6 className="mb-0">{modalDetail.prenom} {modalDetail.nom}</h6>
              <Badge bg={STATUTS_CANDIDAT[modalDetail.statut]?.color}>{STATUTS_CANDIDAT[modalDetail.statut]?.label}</Badge>
            </div>
            <Row className="g-2 text-sm">
              {[
                ['Email',          modalDetail.email],
                ['Téléphone',      modalDetail.telephone],
                ['Date naissance', modalDetail.dateNaissance ? new Date(modalDetail.dateNaissance).toLocaleDateString('fr-FR') : '—'],
                ['Diplôme',        modalDetail.diplome],
                ['Établissement',  modalDetail.etablissement],
                ['Expérience',     `${modalDetail.experience} an(s)`],
                ['Offre',          offreTitre(modalDetail.offreId)],
                ['Date dépôt',     modalDetail.dateDepot ? new Date(modalDetail.dateDepot).toLocaleDateString('fr-FR') : '—'],
              ].map(([l, v]) => (
                <Col xs={6} key={l}>
                  <div className="text-muted small">{l}</div>
                  <div className="fw-semibold small">{v || '—'}</div>
                </Col>
              ))}
            </Row>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setModalDetail(null)}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      {/* ── Modal Add/Edit ── */}
      <Modal show={modal} onHide={() => setModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`ph ph-${editItem ? 'pencil' : 'plus'} me-2 text-primary`} />
            {editItem ? 'Modifier le candidat' : 'Nouveau candidat'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Nom <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={form.nom} onChange={set('nom')} />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Prénom <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={form.prenom} onChange={set('prenom')} />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Email</Form.Label>
              <Form.Control size="sm" type="email" value={form.email} onChange={set('email')} />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Téléphone</Form.Label>
              <Form.Control size="sm" value={form.telephone} onChange={set('telephone')} />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Date de naissance</Form.Label>
              <Form.Control size="sm" type="date" value={form.dateNaissance} onChange={set('dateNaissance')} />
            </Form.Group>
            <Form.Group as={Col} xs={6} md={3}>
              <Form.Label className="small">Expérience (ans)</Form.Label>
              <Form.Control size="sm" type="number" min={0} value={form.experience} onChange={set('experience')} />
            </Form.Group>
            <Form.Group as={Col} xs={6} md={3}>
              <Form.Label className="small">Date de dépôt</Form.Label>
              <Form.Control size="sm" type="date" value={form.dateDepot} onChange={set('dateDepot')} />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Diplôme</Form.Label>
              <Form.Control size="sm" value={form.diplome} onChange={set('diplome')} />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Établissement</Form.Label>
              <Form.Control size="sm" value={form.etablissement} onChange={set('etablissement')} />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Offre concernée</Form.Label>
              <Form.Select size="sm" value={form.offreId} onChange={set('offreId')}>
                <option value="">— Sélectionner —</option>
                {offres.map(o => <option key={o.id} value={o.id}>{o.reference} — {o.titre}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Statut</Form.Label>
              <Form.Select size="sm" value={form.statut} onChange={set('statut')}>
                {Object.entries(STATUTS_CANDIDAT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </Form.Select>
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setModal(false)}>Annuler</Button>
          <Button variant="primary" size="sm" onClick={save} disabled={!form.nom || !form.prenom}>
            <i className="ph ph-check me-2" />{editItem ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

CandidatsList.propTypes = {
  candidats:      PropTypes.array.isRequired,
  offres:         PropTypes.array.isRequired,
  setCandidats:   PropTypes.func.isRequired,
  filtreOffreId:  PropTypes.string.isRequired,
  setFiltreOffreId: PropTypes.func.isRequired,
};
