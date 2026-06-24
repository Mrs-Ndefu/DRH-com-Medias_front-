import PropTypes from 'prop-types';
import { useState } from 'react';

import { useAuth } from 'contexts/AuthContext';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { STATUTS_VIREMENT } from '../data/payroll';

const fmt  = (n) => new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA';
const fmtD = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

// ==============================|| PAIE — VIREMENTS ||============================== //

export default function Virements({ virements, setVirements, bulletins }) {
  const { user } = useAuth();
  const readOnly = user?.role === 'SG';
  const [detail, setDetail] = useState(null);

  const traiter = (id) =>
    setVirements(p => p.map(v => v.id === id ? { ...v, statut: 'TRAITE', dateVirement: new Date().toISOString().slice(0,10) } : v));

  const annuler = (id) =>
    setVirements(p => p.map(v => v.id === id ? { ...v, statut: 'REJETE' } : v));

  const totalTraite    = virements.filter(v => v.statut === 'TRAITE').reduce((s,v) => s + v.montantTotal, 0);
  const totalAttente   = virements.filter(v => v.statut === 'EN_ATTENTE').reduce((s,v) => s + v.montantTotal, 0);
  const nbBenefTotal   = virements.filter(v => v.statut === 'TRAITE').reduce((s,v) => s + v.nbBeneficiaires, 0);

  return (
    <>
      {/* ── KPIs ── */}
      <Row className="g-3 mb-4">
        {[
          { label: 'Total viré (mois)',  value: fmt(totalTraite),  icon: 'ph-check-circle',   color: 'success'  },
          { label: 'En attente',         value: fmt(totalAttente), icon: 'ph-clock',           color: 'warning'  },
          { label: 'Bénéficiaires virés',value: nbBenefTotal,      icon: 'ph-users',           color: 'primary'  },
          { label: 'Ordres de virement', value: virements.length,  icon: 'ph-paper-plane-tilt',color: 'info'     },
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

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Ordres de virement</h6>
        {!readOnly && (
          <Button variant="primary" size="sm" disabled={bulletins.filter(b => b.statut === 'VALIDE').length === 0}>
            <i className="ph ph-paper-plane-tilt me-2" />Générer ordre de virement
          </Button>
        )}
      </div>

      <Table hover responsive className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Référence</th>
            <th>Période</th>
            <th>Date prévue</th>
            <th>Banques</th>
            <th className="text-center">Bénéficiaires</th>
            <th className="text-end">Montant total</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {virements.map(v => {
            const s = STATUTS_VIREMENT[v.statut] || {};
            return (
              <tr key={v.id}>
                <td><code className="fw-bold text-primary">{v.reference}</code></td>
                <td className="fw-semibold">{v.periode}</td>
                <td>{fmtD(v.dateVirement)}</td>
                <td><small className="text-muted">{v.banque}</small></td>
                <td className="text-center"><Badge bg="info">{v.nbBeneficiaires}</Badge></td>
                <td className="text-end fw-bold">{fmt(v.montantTotal)}</td>
                <td className="text-center"><Badge bg={s.color}>{s.label}</Badge></td>
                <td className="text-center">
                  <div className="d-flex gap-1 justify-content-center">
                    <Button variant="outline-primary" size="sm" onClick={() => setDetail(v)} title="Détail">
                      <i className="ph ph-eye" />
                    </Button>
                    {!readOnly && v.statut === 'EN_ATTENTE' && (
                      <>
                        <Button variant="outline-success" size="sm" onClick={() => traiter(v.id)} title="Marquer traité">
                          <i className="ph ph-check" />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => annuler(v.id)} title="Annuler">
                          <i className="ph ph-x" />
                        </Button>
                      </>
                    )}
                    {v.fichier && (
                      <Button variant="outline-secondary" size="sm" title="Télécharger fichier">
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

      {/* ── Modal détail ── */}
      <Modal show={!!detail} onHide={() => setDetail(null)} centered size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="fs-6">
            <i className="ph ph-paper-plane-tilt me-2" />Ordre de virement — {detail?.reference}
          </Modal.Title>
        </Modal.Header>
        {detail && (
          <Modal.Body>
            <Row className="g-3 mb-3">
              {[
                ['Période',         detail.periode],
                ['Date de virement',fmtD(detail.dateVirement)],
                ['Montant total',   fmt(detail.montantTotal)],
                ['Bénéficiaires',   `${detail.nbBeneficiaires} agents`],
                ['Banque(s)',        detail.banque],
                ['Statut',          STATUTS_VIREMENT[detail.statut]?.label],
              ].map(([l,v]) => (
                <Col xs={6} key={l}>
                  <div className="text-muted small">{l}</div>
                  <div className="fw-semibold">{v}</div>
                </Col>
              ))}
            </Row>
            {/* Bulletins concernés */}
            <h6 className="border-top pt-3">Bulletins inclus</h6>
            <Table size="sm" hover>
              <thead className="table-light">
                <tr><th>Agent</th><th>Banque</th><th>N° Compte</th><th className="text-end">Net à payer</th></tr>
              </thead>
              <tbody>
                {bulletins
                  .filter(b => [detail.statut === 'TRAITE' ? 'VIRE' : 'VALIDE'].includes(b.statut) && b.modePaiement === 'VIREMENT')
                  .map(b => (
                    <tr key={b.id}>
                      <td className="small">{b.prenom} {b.nom}</td>
                      <td className="small text-muted">{b.banque}</td>
                      <td><code style={{ fontSize: 11 }}>{b.numCompte}</code></td>
                      <td className="text-end fw-semibold">{new Intl.NumberFormat('fr-FR').format(Math.round(b.salaireNet))}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setDetail(null)}>Fermer</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

Virements.propTypes = {
  virements:    PropTypes.array.isRequired,
  setVirements: PropTypes.func.isRequired,
  bulletins:    PropTypes.array.isRequired,
};
