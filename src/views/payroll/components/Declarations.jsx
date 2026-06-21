import PropTypes from 'prop-types';
import { useState } from 'react';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { STATUTS_DECLARATION } from '../data/payroll';

const fmt  = (n) => new Intl.NumberFormat('fr-FR').format(Math.round(n || 0)) + ' FCFA';
const fmtD = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

const TYPE_COLORS = { INPS: 'primary', CANAM: 'info', IMPOTS: 'warning' };
const TYPE_LABELS = { INPS: 'INPS (Retraite)', CANAM: 'CANAM (Santé)', IMPOTS: 'DGI (Impôts)' };

// ==============================|| PAIE — DÉCLARATIONS SOCIALES ||============================== //

export default function Declarations({ declarations, setDeclarations }) {
  const [noteModal, setNoteModal] = useState(null);
  const [refForm,   setRefForm]   = useState({ reference: '', dateDeclaration: '' });

  const soumettre = (id) =>
    setDeclarations(p => p.map(d => d.id === id ? { ...d, statut: 'SOUMISE' } : d));

  const openValider = (d) => {
    setNoteModal(d);
    setRefForm({ reference: d.reference || '', dateDeclaration: new Date().toISOString().slice(0,10) });
  };

  const valider = () => {
    setDeclarations(p => p.map(d => d.id === noteModal.id
      ? { ...d, statut: 'VALIDEE', ...refForm }
      : d));
    setNoteModal(null);
  };

  const totalPending = declarations.filter(d => d.statut === 'EN_ATTENTE' || d.statut === 'SOUMISE')
    .reduce((s,d) => s + (d.montantTotal || 0), 0);

  const totalValide = declarations.filter(d => d.statut === 'VALIDEE')
    .reduce((s,d) => s + (d.montantTotal || 0), 0);

  const prochaine = declarations
    .filter(d => d.statut === 'EN_ATTENTE')
    .sort((a,b) => (a.dateLimite||'').localeCompare(b.dateLimite||''))[0];

  return (
    <>
      {/* ── KPIs ── */}
      <Row className="g-3 mb-4">
        {[
          { label: 'À soumettre',      value: declarations.filter(d => d.statut === 'EN_ATTENTE').length, color: 'warning',  icon: 'ph-clock'         },
          { label: 'En cours',         value: declarations.filter(d => d.statut === 'SOUMISE').length,    color: 'info',     icon: 'ph-hourglass'     },
          { label: 'Validées',         value: declarations.filter(d => d.statut === 'VALIDEE').length,    color: 'success',  icon: 'ph-check-circle'  },
          { label: 'Total à reverser', value: fmt(totalPending),                                          color: 'danger',   icon: 'ph-money'         },
        ].map(k => (
          <Col key={k.label} xs={6} md={3}>
            <div className={`border border-${k.color} border-opacity-25 rounded p-3 bg-${k.color} bg-opacity-10`}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <i className={`ph ${k.icon} text-${k.color}`} />
                <small className="text-muted">{k.label}</small>
              </div>
              <div className={`fw-bold text-${k.color}`}>{k.value}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* ── Alerte prochaine échéance ── */}
      {prochaine && (
        <div className="alert alert-warning d-flex align-items-center gap-3 py-2 mb-3">
          <i className="ph ph-warning f-20" />
          <div>
            <strong>Prochaine échéance : </strong>
            {prochaine.libelle} — à soumettre avant le <strong>{fmtD(prochaine.dateLimite)}</strong>
            {' '}— Montant : <strong>{fmt(prochaine.montantTotal)}</strong>
          </div>
        </div>
      )}

      <h6 className="mb-3">Déclarations sociales et fiscales</h6>

      <Table hover responsive className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Organisme</th>
            <th>Libellé</th>
            <th>Période</th>
            <th className="text-end">Part salariale</th>
            <th className="text-end">Part patronale</th>
            <th className="text-end fw-bold">Total à reverser</th>
            <th>Échéance</th>
            <th>Date déclaration</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {declarations.map(d => {
            const s = STATUTS_DECLARATION[d.statut] || {};
            const isLate = d.statut === 'EN_ATTENTE' && d.dateLimite && new Date(d.dateLimite) < new Date();
            return (
              <tr key={d.id} className={isLate ? 'table-danger' : ''}>
                <td>
                  <Badge bg={TYPE_COLORS[d.type] || 'secondary'} className="fw-normal px-3">
                    {d.type}
                  </Badge>
                </td>
                <td>
                  <div className="fw-semibold small">{d.libelle}</div>
                  {d.reference && <code style={{ fontSize: 11 }} className="text-muted">{d.reference}</code>}
                </td>
                <td className="small">{d.periode}</td>
                <td className="text-end small">{fmt(d.montant)}</td>
                <td className="text-end small text-muted">{d.cotisationPatronale > 0 ? fmt(d.cotisationPatronale) : '—'}</td>
                <td className="text-end fw-bold">{fmt(d.montantTotal)}</td>
                <td>
                  <span className={`small ${isLate ? 'text-danger fw-bold' : ''}`}>
                    {isLate && <i className="ph ph-warning me-1" />}
                    {fmtD(d.dateLimite)}
                  </span>
                </td>
                <td className="small text-muted">{fmtD(d.dateDeclaration)}</td>
                <td className="text-center"><Badge bg={s.color}>{s.label}</Badge></td>
                <td className="text-center">
                  <div className="d-flex gap-1 justify-content-center">
                    {d.statut === 'EN_ATTENTE' && (
                      <Button variant="outline-info" size="sm" title="Soumettre" onClick={() => soumettre(d.id)}>
                        <i className="ph ph-paper-plane-tilt" />
                      </Button>
                    )}
                    {d.statut === 'SOUMISE' && (
                      <Button variant="outline-success" size="sm" title="Valider / saisir référence" onClick={() => openValider(d)}>
                        <i className="ph ph-check" />
                      </Button>
                    )}
                    {d.statut === 'VALIDEE' && (
                      <Button variant="outline-secondary" size="sm" title="Télécharger récépissé">
                        <i className="ph ph-download-simple" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* ── Modal validation ── */}
      <Modal show={!!noteModal} onHide={() => setNoteModal(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title><i className="ph ph-check-circle me-2 text-success" />Valider la déclaration</Modal.Title>
        </Modal.Header>
        {noteModal && (
          <Modal.Body>
            <div className="p-3 bg-light rounded mb-3">
              <div className="fw-semibold">{noteModal.libelle}</div>
              <div className="text-muted small">Montant : <strong>{fmt(noteModal.montantTotal)}</strong></div>
            </div>
            <Row className="g-3">
              <Form.Group as={Col} xs={12}>
                <Form.Label className="small">Référence / N° de quittance</Form.Label>
                <Form.Control size="sm" value={refForm.reference}
                  onChange={e => setRefForm(p => ({ ...p, reference: e.target.value }))}
                  placeholder="Ex: INPS-2026-06-0001" />
              </Form.Group>
              <Form.Group as={Col} xs={12}>
                <Form.Label className="small">Date de paiement</Form.Label>
                <Form.Control size="sm" type="date" value={refForm.dateDeclaration}
                  onChange={e => setRefForm(p => ({ ...p, dateDeclaration: e.target.value }))} />
              </Form.Group>
            </Row>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setNoteModal(null)}>Annuler</Button>
          <Button variant="success" size="sm" onClick={valider}>
            <i className="ph ph-check me-2" />Valider
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

Declarations.propTypes = {
  declarations:    PropTypes.array.isRequired,
  setDeclarations: PropTypes.func.isRequired,
};
