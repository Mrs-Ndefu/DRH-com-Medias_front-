import PropTypes from 'prop-types';
import { useState } from 'react';

// react-bootstrap
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

import { LEAVE_TYPES, STATUSES } from '../data/leaves';

const fmt = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

// ── Workflow stepper ──────────────────────────────────────────────────────────

function StepCircle({ done, pending, rejected }) {
  const bg    = rejected ? '#dc3545' : done ? '#198754' : pending ? '#ffc107' : '#dee2e6';
  const icon  = rejected ? 'ph-x' : done ? 'ph-check' : pending ? 'ph-clock' : '';
  const icolor = pending ? '#664d03' : 'white';
  return (
    <div
      style={{
        width: 32, height: 32, borderRadius: '50%', backgroundColor: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto', position: 'relative', zIndex: 1, flexShrink: 0,
      }}
    >
      {icon && <i className={`ph ${icon}`} style={{ fontSize: 14, color: icolor }} />}
    </div>
  );
}

// ==============================|| CONGÉS — DÉTAIL & WORKFLOW ||============================== //

export default function LeaveDetail({ leave, onHide, onApproveDRH, onReject }) {
  const [comment,     setComment]     = useState('');
  const [rejectMode,  setRejectMode]  = useState(false);
  const [rejectMotif, setRejectMotif] = useState('');
  const [rejectBy,    setRejectBy]    = useState('Chef de service');

  const lt = LEAVE_TYPES[leave.type?.toUpperCase()] || { label: leave.type, color: 'secondary', icon: 'ph-calendar' };
  const st = STATUSES[leave.status] || { label: leave.status, color: 'secondary' };

  const canAct        = leave.status === 'PENDING_CHEF' || leave.status === 'PENDING_DRH';

  const handleApproveDRH  = () => { onApproveDRH(leave.id, comment);  setComment(''); };
  const handleReject      = () => {
    if (!rejectMotif.trim()) return;
    onReject(leave.id, rejectBy, rejectMotif);
    setRejectMode(false);
    setRejectMotif('');
  };

  const steps = [
    {
      label: 'Soumission',
      done: true, pending: false, rejected: false,
      date: leave.createdAt, by: leave.nom, comment: null,
    },
    {
      label: 'En attente SG/DRH',
      done: leave.status === 'APPROVED' || leave.status === 'REJECTED',
      pending: canAct,
      rejected: false,
      date: null, by: null, comment: null,
    },
    {
      label: 'Décision SG/DRH',
      done: leave.status === 'APPROVED' || leave.status === 'REJECTED',
      pending: false,
      rejected: leave.status === 'REJECTED',
      date: leave.validationDRH?.date || leave.rejection?.date,
      by: leave.status === 'APPROVED'
        ? `Approuvé par ${leave.validationDRH?.validatedBy || 'SG/DRH'}`
        : leave.status === 'REJECTED'
        ? `Rejeté par ${leave.rejection?.rejectedBy || 'SG/DRH'}`
        : null,
      comment: leave.rejection?.motif || leave.validationDRH?.comment || null,
    },
  ];

  return (
    <Modal show onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className={`bg-${st.color} bg-opacity-10`}>
        <Modal.Title>
          <div className="d-flex align-items-center gap-2">
            <i className={`ph ${lt.icon} text-${lt.color}`} />
            <span>{lt.label}</span>
            <Badge bg={st.color} className="ms-1">{st.label}</Badge>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* ── Informations ── */}
        <Row className="g-3 mb-4 p-3 bg-light rounded">
          <Col xs={6} md={4} className="py-1">
            <small className="text-muted d-block mb-1">Employé</small>
            <strong>{leave.nom}</strong>
          </Col>
          <Col xs={6} md={4} className="py-1">
            <small className="text-muted d-block mb-1">Matricule</small>
            <code>{leave.matricule}</code>
          </Col>
          <Col xs={6} md={4} className="py-1">
            <small className="text-muted d-block mb-1">Service</small>
            {leave.service || '—'}
          </Col>
          <Col xs={6} md={4} className="py-1">
            <small className="text-muted d-block mb-1">Date de début</small>
            {fmt(leave.dateDebut)}
          </Col>
          <Col xs={6} md={4} className="py-1">
            <small className="text-muted d-block mb-1">Date de fin</small>
            {fmt(leave.dateFin)}
          </Col>
          <Col xs={6} md={4} className="py-1">
            <small className="text-muted d-block mb-1">Durée</small>
            <strong className="text-primary">{leave.nbJours} jours ouvrables</strong>
          </Col>
          <Col xs={12} className="py-1">
            <small className="text-muted d-block mb-1">Motif</small>
            <em>« {leave.motif} »</em>
          </Col>
        </Row>

        {/* ── Stepper workflow ── */}
        <h6 className="text-muted mb-3">
          <i className="ph ph-git-branch me-2" />Suivi de la demande
        </h6>

        <div className="position-relative mb-4" style={{ overflowX: 'auto' }}>
          <div className="d-flex" style={{ minWidth: 480 }}>
            {steps.map((step, i) => (
              <div key={i} className="flex-fill text-center position-relative px-1">
                {/* Connecting line */}
                {i < steps.length - 1 && (
                  <div style={{
                    position: 'absolute', top: 15, left: '50%', width: '100%',
                    height: 2, backgroundColor: step.done ? '#198754' : '#dee2e6', zIndex: 0,
                  }} />
                )}

                <StepCircle done={step.done} pending={step.pending} rejected={step.rejected} />

                <div className="mt-2" style={{ fontSize: 12, fontWeight: 600 }}>{step.label}</div>

                {step.date && (
                  <div className="text-muted" style={{ fontSize: 11 }}>{fmt(step.date)}</div>
                )}
                {step.by && (
                  <div style={{ fontSize: 11, color: step.rejected ? '#dc3545' : '#198754', fontWeight: 500 }}>
                    {step.by}
                  </div>
                )}
                {step.comment && (
                  <div className="text-muted fst-italic" style={{ fontSize: 10, marginTop: 2 }}>
                    « {step.comment.substring(0, 50)}{step.comment.length > 50 ? '…' : ''} »
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Motif de rejet ── */}
        {leave.status === 'REJECTED' && leave.rejection && (
          <div className="alert alert-danger py-2 mb-3">
            <strong><i className="ph ph-x-circle me-2" />Motif du rejet :</strong> {leave.rejection.motif}
            <br />
            <small className="text-muted">
              Par {leave.rejection.rejectedBy} — {fmt(leave.rejection.date)}
            </small>
          </div>
        )}

        {/* ── Zone d'action (commentaire) ── */}
        {canAct && !rejectMode && (
          <Form.Group className="mb-2">
            <Form.Label className="small">Commentaire de validation <span className="text-muted">(optionnel)</span></Form.Label>
            <Form.Control
              as="textarea" rows={2} size="sm"
              placeholder="Ajouter un commentaire…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>
        )}

        {/* ── Formulaire de rejet ── */}
        {rejectMode && (
          <div className="border border-danger rounded p-3">
            <h6 className="text-danger mb-3">
              <i className="ph ph-warning me-2" />Rejeter la demande
            </h6>
            <Form.Group className="mb-3">
              <Form.Label className="small">Rejeté par</Form.Label>
              <Form.Select size="sm" value={rejectBy} onChange={(e) => setRejectBy(e.target.value)}>
                <option>Chef de service</option>
                <option>Directeur RH</option>
                <option>Direction générale</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label className="small">Motif du rejet <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea" rows={3} size="sm"
                placeholder="Expliquer le motif du rejet…"
                value={rejectMotif}
                onChange={(e) => setRejectMotif(e.target.value)}
                isInvalid={rejectMotif === '' && false}
              />
            </Form.Group>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        {rejectMode ? (
          <>
            <Button variant="outline-secondary" size="sm" onClick={() => setRejectMode(false)}>
              Annuler
            </Button>
            <Button variant="danger" size="sm" onClick={handleReject} disabled={!rejectMotif.trim()}>
              <i className="ph ph-x me-2" />Confirmer le rejet
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline-secondary" size="sm" onClick={onHide}>Fermer</Button>
            {canAct && (
              <Button variant="outline-danger" size="sm" onClick={() => setRejectMode(true)}>
                <i className="ph ph-x-circle me-2" />Rejeter
              </Button>
            )}
            {canAct && (
              <Button variant="success" size="sm" onClick={handleApproveDRH}>
                <i className="ph ph-check-circle me-2" />Approuver (SG/DRH)
              </Button>
            )}
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

LeaveDetail.propTypes = {
  leave:         PropTypes.object.isRequired,
  onHide:        PropTypes.func.isRequired,
  onApproveDRH:  PropTypes.func.isRequired,
  onReject:      PropTypes.func.isRequired,
};
