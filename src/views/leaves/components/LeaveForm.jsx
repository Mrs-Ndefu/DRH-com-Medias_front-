import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import { fetcher } from 'api/client';
import { LEAVE_TYPES, countBusinessDays } from '../data/leaves';

const todayStr = () => new Date().toISOString().split('T')[0];

const EMPTY = { employeeId: '', type: 'ANNUEL', dateDebut: '', dateFin: '', nbJours: 0, motif: '' };

export default function LeaveForm({ show, onHide, onSubmit }) {
  const [form,   setForm]   = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const { data: agentsData, isLoading: agentsLoading } = useSWR('/agents?limit=100', fetcher);
  const agents = agentsData?.data || [];

  useEffect(() => {
    if (!show) { setForm(EMPTY); setErrors({}); }
  }, [show]);

  useEffect(() => {
    if (form.dateDebut && form.dateFin && form.dateFin >= form.dateDebut) {
      setForm((p) => ({ ...p, nbJours: countBusinessDays(form.dateDebut, form.dateFin) }));
    } else {
      setForm((p) => ({ ...p, nbJours: 0 }));
    }
  }, [form.dateDebut, form.dateFin]);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.employeeId)  e.employeeId = 'Choisissez un agent';
    if (!form.dateDebut)   e.dateDebut  = 'Date de début requise';
    if (!form.dateFin)     e.dateFin    = 'Date de fin requise';
    if (form.dateFin && form.dateFin < form.dateDebut) e.dateFin = 'La fin doit être après le début';
    if (!form.motif.trim()) e.motif     = 'Motif requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const agent = agents.find((a) => String(a.id) === String(form.employeeId));
    onSubmit({
      employeeId: parseInt(form.employeeId),
      type:       form.type,
      dateDebut:  form.dateDebut,
      dateFin:    form.dateFin,
      nbJours:    form.nbJours,
      motif:      form.motif,
      nom:        agent ? `${agent.prenom} ${agent.nom_famille}` : '',
      matricule:  agent?.matricule || '',
      service:    agent?.direction_libelle || '',
    });
    onHide();
  };

  const lt = LEAVE_TYPES[form.type];
  const selectedAgent = agents.find((a) => String(a.id) === String(form.employeeId));

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="ph ph-calendar-plus me-2 text-primary" />
          Nouvelle demande de congé
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Body>
          <Row className="g-3">
            {/* Agent */}
            <Col xs={12} md={6}>
              <Form.Label className="small">Agent <span className="text-danger">*</span></Form.Label>
              {agentsLoading ? (
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <Spinner size="sm" animation="border" /> Chargement des agents…
                </div>
              ) : (
                <Form.Select size="sm" value={form.employeeId} onChange={set('employeeId')} isInvalid={!!errors.employeeId}>
                  <option value="">— Sélectionner un agent —</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.prenom} {a.nom_famille} ({a.matricule})
                    </option>
                  ))}
                </Form.Select>
              )}
              <Form.Control.Feedback type="invalid">{errors.employeeId}</Form.Control.Feedback>
            </Col>

            {/* Type */}
            <Col xs={12} md={6}>
              <Form.Label className="small">Type de congé <span className="text-danger">*</span></Form.Label>
              <Form.Select size="sm" value={form.type} onChange={set('type')}>
                {Object.entries(LEAVE_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </Form.Select>
            </Col>

            {/* Dates */}
            <Col xs={12} md={4}>
              <Form.Label className="small">Date de début <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="date" size="sm" min={todayStr()}
                value={form.dateDebut} onChange={set('dateDebut')} isInvalid={!!errors.dateDebut}
              />
              <Form.Control.Feedback type="invalid">{errors.dateDebut}</Form.Control.Feedback>
            </Col>

            <Col xs={12} md={4}>
              <Form.Label className="small">Date de fin <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="date" size="sm" min={form.dateDebut || todayStr()}
                value={form.dateFin} onChange={set('dateFin')} isInvalid={!!errors.dateFin}
              />
              <Form.Control.Feedback type="invalid">{errors.dateFin}</Form.Control.Feedback>
            </Col>

            <Col xs={12} md={4}>
              <Form.Label className="small">Jours ouvrables</Form.Label>
              <div className="border rounded px-3 d-flex align-items-center justify-content-center fw-bold text-primary" style={{ height: 31, fontSize: 18 }}>
                {form.nbJours > 0 ? form.nbJours : '—'}
              </div>
            </Col>

            {/* Motif */}
            <Col xs={12}>
              <Form.Label className="small">Motif <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea" rows={3} size="sm"
                placeholder="Précisez le motif de la demande…"
                value={form.motif} onChange={set('motif')} isInvalid={!!errors.motif}
              />
              <Form.Control.Feedback type="invalid">{errors.motif}</Form.Control.Feedback>
            </Col>

            {/* Pièce justificative */}
            <Col xs={12}>
              <Form.Label className="small">Pièce justificative <span className="text-muted">(optionnel)</span></Form.Label>
              <Form.Control type="file" size="sm" accept=".pdf,.jpg,.jpeg,.png" />
              <Form.Text className="text-muted">PDF, JPG ou PNG — 5 Mo max</Form.Text>
            </Col>

            {/* Récapitulatif */}
            {form.nbJours > 0 && (
              <Col xs={12}>
                <div className={`alert alert-${lt.color} d-flex align-items-center gap-2 py-2 mb-0`}>
                  <i className={`ph ${lt.icon} f-20`} />
                  <span>
                    <strong>{lt.label}</strong> — {form.nbJours} jour{form.nbJours > 1 ? 's' : ''} ouvrable{form.nbJours > 1 ? 's' : ''}
                    {selectedAgent && ` pour ${selectedAgent.prenom} ${selectedAgent.nom_famille}`}
                  </span>
                </div>
              </Col>
            )}
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={onHide}>Annuler</Button>
          <Button type="submit" variant="primary" size="sm">
            <i className="ph ph-paper-plane-right me-2" />Soumettre la demande
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

LeaveForm.propTypes = {
  show:     PropTypes.bool.isRequired,
  onHide:   PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
