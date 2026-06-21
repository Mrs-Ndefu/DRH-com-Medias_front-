import PropTypes from 'prop-types';
import { useState } from 'react';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';

import { DIRECTIONS, ETAPES_INTEGRATION, STATUTS_INTEGRATION } from '../data/recruitment';

const mkEtapesVides = () => ETAPES_INTEGRATION.map(e => ({ ...e, done: false, date: null, notes: '' }));

const EMPTY = { nom: '', prenom: '', poste: '', direction: '', matricule: '', dateIntegration: '', statut: 'EN_COURS', etapes: mkEtapesVides() };

// ==============================|| RECRUTEMENT — INTÉGRATION ||============================== //

export default function IntegrationList({ integrations, setIntegrations }) {
  const [modal,      setModal]      = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [detailItem, setDetailItem] = useState(null);

  const openAdd  = () => { setEditItem(null); setForm({ ...EMPTY, etapes: mkEtapesVides() }); setModal(true); };
  const openEdit = (i) => { setEditItem(i); setForm({ ...i }); setModal(true); };
  const set      = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const save = () => {
    if (editItem) setIntegrations((p) => p.map((i) => i.id === editItem.id ? { ...i, ...form } : i));
    else          setIntegrations((p) => [...p, { id: `INT${Date.now()}`, ...form }]);
    setModal(false);
  };

  const toggleEtape = (integId, etapeId) => {
    setIntegrations((p) => p.map((integ) => {
      if (integ.id !== integId) return integ;
      const etapes = integ.etapes.map((e) =>
        e.id === etapeId ? { ...e, done: !e.done, date: !e.done ? new Date().toISOString().slice(0, 10) : null } : e
      );
      const allDone = etapes.every(e => e.done);
      return { ...integ, etapes, statut: allDone ? 'TERMINEE' : 'EN_COURS' };
    }));
    if (detailItem?.id === integId) {
      setDetailItem((prev) => {
        const etapes = prev.etapes.map((e) =>
          e.id === etapeId ? { ...e, done: !e.done, date: !e.done ? new Date().toISOString().slice(0, 10) : null } : e
        );
        const allDone = etapes.every(e => e.done);
        return { ...prev, etapes, statut: allDone ? 'TERMINEE' : 'EN_COURS' };
      });
    }
  };

  const progression = (etapes) => Math.round((etapes.filter(e => e.done).length / etapes.length) * 100);

  return (
    <>
      {/* ── KPIs ── */}
      <Row className="g-3 mb-4">
        {Object.entries(STATUTS_INTEGRATION).map(([key, s]) => (
          <Col key={key} xs={6} md={3}>
            <div className={`border border-${s.color} border-opacity-25 rounded p-3 text-center bg-${s.color} bg-opacity-10`}>
              <h4 className={`mb-0 text-${s.color}`}>{integrations.filter(i => i.statut === key).length}</h4>
              <small className="text-muted">{s.label}</small>
            </div>
          </Col>
        ))}
        <Col xs={6} md={3}>
          <div className="border border-primary border-opacity-25 rounded p-3 text-center bg-primary bg-opacity-10">
            <h4 className="mb-0 text-primary">{integrations.length}</h4>
            <small className="text-muted">Total</small>
          </div>
        </Col>
        <Col xs={6} md={3}>
          <div className="border border-success border-opacity-25 rounded p-3 text-center bg-success bg-opacity-10">
            <h4 className="mb-0 text-success">
              {integrations.length > 0
                ? Math.round(integrations.reduce((s, i) => s + progression(i.etapes), 0) / integrations.length)
                : 0}%
            </h4>
            <small className="text-muted">Progression moy.</small>
          </div>
        </Col>
      </Row>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Intégration des nouvelles recrues</h6>
        <Button variant="primary" size="sm" onClick={openAdd}>
          <i className="ph ph-plus me-2" />Nouvelle intégration
        </Button>
      </div>

      {/* ── Cartes d'intégration ── */}
      <Row className="g-3">
        {integrations.length === 0 ? (
          <Col xs={12}>
            <div className="text-center text-muted py-5">
              <i className="ph ph-user-plus f-36 d-block mb-2" />
              Aucune intégration en cours
            </div>
          </Col>
        ) : integrations.map((integ) => {
          const pct = progression(integ.etapes);
          const s = STATUTS_INTEGRATION[integ.statut] || {};
          return (
            <Col key={integ.id} xs={12} md={6} lg={4}>
              <div className="border rounded p-3 h-100">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                      style={{ width: 40, height: 40, fontSize: 13 }}>
                      {(integ.prenom?.[0] || '') + (integ.nom?.[0] || '')}
                    </div>
                    <div>
                      <div className="fw-semibold">{integ.prenom} {integ.nom}</div>
                      <small className="text-muted">{integ.poste}</small>
                    </div>
                  </div>
                  <Badge bg={s.color}>{s.label}</Badge>
                </div>

                <div className="d-flex gap-3 text-muted small mb-3">
                  {integ.direction && <span><i className="ph ph-buildings me-1" />{integ.direction}</span>}
                  {integ.matricule && <span><i className="ph ph-identification-badge me-1" />{integ.matricule}</span>}
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="text-muted">Progression</span>
                    <span className="fw-semibold">{pct}%</span>
                  </div>
                  <ProgressBar now={pct} variant={pct === 100 ? 'success' : pct >= 50 ? 'info' : 'warning'} style={{ height: 6 }} />
                  <div className="text-muted small mt-1">
                    {integ.etapes.filter(e => e.done).length} / {integ.etapes.length} étapes complétées
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm" onClick={() => setDetailItem(integ)} className="flex-grow-1">
                    <i className="ph ph-list-checks me-1" />Étapes
                  </Button>
                  <Button variant="outline-secondary" size="sm" onClick={() => openEdit(integ)}>
                    <i className="ph ph-pencil" />
                  </Button>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* ── Modal étapes ── */}
      <Modal show={!!detailItem} onHide={() => setDetailItem(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ph ph-list-checks me-2 text-primary" />
            Suivi d'intégration — {detailItem?.prenom} {detailItem?.nom}
          </Modal.Title>
        </Modal.Header>
        {detailItem && (
          <Modal.Body>
            <div className="d-flex gap-3 text-muted small mb-4">
              <span><i className="ph ph-briefcase me-1" />{detailItem.poste}</span>
              <span><i className="ph ph-buildings me-1" />{detailItem.direction}</span>
              {detailItem.dateIntegration && (
                <span><i className="ph ph-calendar me-1" />{new Date(detailItem.dateIntegration).toLocaleDateString('fr-FR')}</span>
              )}
            </div>
            <div className="mb-4">
              <ProgressBar now={progression(detailItem.etapes)}
                variant={progression(detailItem.etapes) === 100 ? 'success' : 'primary'} />
              <small className="text-muted">{progression(detailItem.etapes)}% complété</small>
            </div>
            <div className="d-flex flex-column gap-3">
              {detailItem.etapes.map((e, idx) => (
                <div key={e.id} className={`d-flex align-items-center gap-3 p-3 rounded border ${e.done ? 'border-success bg-success bg-opacity-10' : 'border-secondary bg-light'}`}>
                  <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0 text-white ${e.done ? 'bg-success' : 'bg-secondary'}`}
                    style={{ width: 32, height: 32, fontSize: 13 }}>
                    {e.done ? <i className="ph ph-check" /> : idx + 1}
                  </div>
                  <div className="flex-grow-1">
                    <div className={`fw-semibold ${e.done ? 'text-success' : ''}`}>{e.label}</div>
                    {e.done && e.date && <small className="text-muted">Réalisé le {new Date(e.date).toLocaleDateString('fr-FR')}</small>}
                  </div>
                  <Button
                    variant={e.done ? 'outline-secondary' : 'outline-success'}
                    size="sm"
                    onClick={() => toggleEtape(detailItem.id, e.id)}>
                    {e.done ? <><i className="ph ph-arrow-u-up-left me-1" />Annuler</> : <><i className="ph ph-check me-1" />Valider</>}
                  </Button>
                </div>
              ))}
            </div>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setDetailItem(null)}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      {/* ── Modal Add/Edit ── */}
      <Modal show={modal} onHide={() => setModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`ph ph-${editItem ? 'pencil' : 'plus'} me-2 text-primary`} />
            {editItem ? "Modifier l'intégration" : "Nouvelle intégration"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Form.Group as={Col} xs={6}>
              <Form.Label className="small">Nom <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={form.nom} onChange={set('nom')} />
            </Form.Group>
            <Form.Group as={Col} xs={6}>
              <Form.Label className="small">Prénom <span className="text-danger">*</span></Form.Label>
              <Form.Control size="sm" value={form.prenom} onChange={set('prenom')} />
            </Form.Group>
            <Form.Group as={Col} xs={12}>
              <Form.Label className="small">Poste</Form.Label>
              <Form.Control size="sm" value={form.poste} onChange={set('poste')} />
            </Form.Group>
            <Form.Group as={Col} xs={6}>
              <Form.Label className="small">Direction</Form.Label>
              <Form.Select size="sm" value={form.direction} onChange={set('direction')}>
                <option value="">—</option>
                {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={6}>
              <Form.Label className="small">Matricule</Form.Label>
              <Form.Control size="sm" value={form.matricule} onChange={set('matricule')} />
            </Form.Group>
            <Form.Group as={Col} xs={6}>
              <Form.Label className="small">Date d'intégration</Form.Label>
              <Form.Control size="sm" type="date" value={form.dateIntegration} onChange={set('dateIntegration')} />
            </Form.Group>
            <Form.Group as={Col} xs={6}>
              <Form.Label className="small">Statut</Form.Label>
              <Form.Select size="sm" value={form.statut} onChange={set('statut')}>
                {Object.entries(STATUTS_INTEGRATION).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </Form.Select>
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setModal(false)}>Annuler</Button>
          <Button variant="primary" size="sm" onClick={save} disabled={!form.nom || !form.prenom}>
            <i className="ph ph-check me-2" />{editItem ? 'Enregistrer' : 'Créer'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

IntegrationList.propTypes = {
  integrations:    PropTypes.array.isRequired,
  setIntegrations: PropTypes.func.isRequired,
};
