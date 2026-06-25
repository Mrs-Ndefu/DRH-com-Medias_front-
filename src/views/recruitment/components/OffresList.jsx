import PropTypes from 'prop-types';
import { useState } from 'react';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { CATEGORIES, DIRECTIONS, STATUTS_OFFRE, TYPES_POSTE } from '../data/recruitment';
import TablePagination from 'components/TablePagination';

const PAGE_LIMIT = 10;

const EMPTY = { reference: '', titre: '', direction: '', division: '', typePoste: 'CONCOURS', categorie: 'A', nbPostes: 1, datePublication: '', dateCloture: '', statut: 'OUVERTE', description: '', qualifications: '' };

const fmt = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

// ==============================|| RECRUTEMENT — OFFRES D'EMPLOI ||============================== //

export default function OffresList({ offres, candidats, setOffres, onSelectOffre }) {
  const [modal,    setModal]    = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [filterStatut, setFilterStatut] = useState('');
  const [page, setPage] = useState(1);

  const openAdd  = () => { setEditItem(null); setForm(EMPTY); setModal(true); };
  const openEdit = (o) => { setEditItem(o); setForm({ ...o }); setModal(true); };
  const set      = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const save = () => {
    if (editItem) {
      setOffres((p) => p.map((o) => o.id === editItem.id ? { ...o, ...form } : o));
    } else {
      setOffres((p) => [...p, { id: `OFF${Date.now()}`, ...form }]);
    }
    setModal(false);
  };

  const filtered = filterStatut ? offres.filter(o => o.statut === filterStatut) : offres;
  const paged    = filtered.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT);

  const nbCandidats = (id) => candidats.filter(c => c.offreId === id).length;

  return (
    <>
      {/* ── KPIs ── */}
      <Row className="g-3 mb-4">
        {Object.entries(STATUTS_OFFRE).map(([key, s]) => (
          <Col key={key} xs={6} md={4}>
            <div className={`border border-${s.color} border-opacity-25 rounded p-3 text-center bg-${s.color} bg-opacity-10`}
              style={{ cursor: 'pointer' }}
              onClick={() => { setFilterStatut(filterStatut === key ? '' : key); setPage(1); }}>
              <h4 className={`mb-0 text-${s.color}`}>{offres.filter(o => o.statut === key).length}</h4>
              <small className="text-muted">{s.label}</small>
            </div>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h6 className="mb-0">Offres d'emploi</h6>
          {filterStatut && (
            <Badge bg={STATUTS_OFFRE[filterStatut]?.color} className="me-1 cursor-pointer" onClick={() => setFilterStatut('')}>
              {STATUTS_OFFRE[filterStatut]?.label} <i className="ph ph-x ms-1" />
            </Badge>
          )}
        </div>
        <Button variant="primary" size="sm" onClick={openAdd}>
          <i className="ph ph-plus me-2" />Nouvelle offre
        </Button>
      </div>

      <Table hover responsive className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Référence</th>
            <th>Intitulé du poste</th>
            <th>Direction</th>
            <th>Type</th>
            <th className="text-center">Postes</th>
            <th className="text-center">Candidatures</th>
            <th>Clôture</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={9} className="text-center text-muted py-5">
              <i className="ph ph-briefcase f-28 d-block mb-2" />Aucune offre
            </td></tr>
          ) : paged.map((o) => {
            const s = STATUTS_OFFRE[o.statut] || {};
            return (
              <tr key={o.id}>
                <td><code className="text-primary fw-bold">{o.reference}</code></td>
                <td>
                  <div className="fw-semibold">{o.titre}</div>
                  <small className="text-muted">Cat. {o.categorie} — {TYPES_POSTE[o.typePoste]}</small>
                </td>
                <td><Badge bg="primary" className="fw-normal">{o.direction}</Badge></td>
                <td><Badge bg="light" text="dark">{TYPES_POSTE[o.typePoste]}</Badge></td>
                <td className="text-center fw-semibold">{o.nbPostes}</td>
                <td className="text-center">
                  <Button variant="link" size="sm" className="p-0 text-decoration-none" onClick={() => onSelectOffre(o)}>
                    <Badge bg="info">{nbCandidats(o.id)}</Badge>
                  </Button>
                </td>
                <td className="small">{fmt(o.dateCloture)}</td>
                <td className="text-center"><Badge bg={s.color}>{s.label}</Badge></td>
                <td className="text-center">
                  <div className="d-flex gap-1 justify-content-center">
                    <Button variant="outline-primary" size="sm" onClick={() => openEdit(o)} title="Modifier">
                      <i className="ph ph-pencil" />
                    </Button>
                    <Button variant="outline-info" size="sm" onClick={() => onSelectOffre(o)} title="Voir candidats">
                      <i className="ph ph-users" />
                    </Button>
                    {o.statut === 'OUVERTE' && (
                      <Button variant="outline-warning" size="sm" title="Clôturer"
                        onClick={() => setOffres(p => p.map(x => x.id === o.id ? { ...x, statut: 'CLOTUREE' } : x))}>
                        <i className="ph ph-lock" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <TablePagination page={page} setPage={setPage} total={filtered.length} limit={PAGE_LIMIT} />

      {/* ── Modal ── */}
      <Modal show={modal} onHide={() => setModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`ph ph-${editItem ? 'pencil' : 'plus'} me-2 text-primary`} />
            {editItem ? "Modifier l'offre" : "Nouvelle offre d'emploi"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Form.Group as={Col} xs={6} md={4}>
              <Form.Label className="small">Référence <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={form.reference} onChange={set('reference')} placeholder="OFF-2026-00X" />
            </Form.Group>
            <Form.Group as={Col} xs={6} md={4}>
              <Form.Label className="small">Type de poste</Form.Label>
              <Form.Select size="sm" value={form.typePoste} onChange={set('typePoste')}>
                {Object.entries(TYPES_POSTE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={6} md={2}>
              <Form.Label className="small">Catégorie</Form.Label>
              <Form.Select size="sm" value={form.categorie} onChange={set('categorie')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={6} md={2}>
              <Form.Label className="small">Nb postes</Form.Label>
              <Form.Control size="sm" type="number" min={1} value={form.nbPostes} onChange={set('nbPostes')} />
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Label className="small">Intitulé du poste <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={form.titre} onChange={set('titre')} placeholder="Ex: Administrateur Civil" />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Direction</Form.Label>
              <Form.Select size="sm" value={form.direction} onChange={set('direction')}>
                <option value="">— Sélectionner —</option>
                {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label className="small">Division</Form.Label>
              <Form.Control size="sm" value={form.division} onChange={set('division')} />
            </Form.Group>
            <Form.Group as={Col} xs={6}>
              <Form.Label className="small">Date de publication</Form.Label>
              <Form.Control size="sm" type="date" value={form.datePublication} onChange={set('datePublication')} />
            </Form.Group>
            <Form.Group as={Col} xs={6}>
              <Form.Label className="small">Date de clôture</Form.Label>
              <Form.Control size="sm" type="date" value={form.dateCloture} onChange={set('dateCloture')} />
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Label className="small">Description du poste</Form.Label>
              <Form.Control as="textarea" size="sm" rows={2} value={form.description} onChange={set('description')} />
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Label className="small">Qualifications requises</Form.Label>
              <Form.Control as="textarea" size="sm" rows={2} value={form.qualifications} onChange={set('qualifications')} />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={4}>
              <Form.Label className="small">Statut</Form.Label>
              <Form.Select size="sm" value={form.statut} onChange={set('statut')}>
                {Object.entries(STATUTS_OFFRE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </Form.Select>
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setModal(false)}>Annuler</Button>
          <Button variant="primary" size="sm" onClick={save} disabled={!form.reference || !form.titre}>
            <i className="ph ph-check me-2" />{editItem ? 'Enregistrer' : 'Publier'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

OffresList.propTypes = {
  offres:         PropTypes.array.isRequired,
  candidats:      PropTypes.array.isRequired,
  setOffres:      PropTypes.func.isRequired,
  onSelectOffre:  PropTypes.func.isRequired,
};
