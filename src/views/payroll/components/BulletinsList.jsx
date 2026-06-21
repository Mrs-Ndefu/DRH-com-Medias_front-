import PropTypes from 'prop-types';
import { useState } from 'react';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { MOIS_NOMS, STATUTS_BULLETIN } from '../data/payroll';

const fmt = (n) => new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA';
const fmtN = (n) => new Intl.NumberFormat('fr-FR').format(Math.round(n));

// ── Bulletin imprimable ───────────────────────────────────────────────────────

function BulletinDetail({ b, onClose }) {
  return (
    <Modal show={!!b} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title className="fs-6">
          <i className="ph ph-file-text me-2" />
          Bulletin de paie — {b?.periode} — {b?.prenom} {b?.nom}
        </Modal.Title>
      </Modal.Header>
      {b && (
        <Modal.Body className="p-0">
          {/* En-tête employeur / employé */}
          <div className="d-flex justify-content-between p-4 border-bottom bg-light">
            <div>
              <div className="fw-bold text-primary">Ministère de la Fonction Publique</div>
              <div className="small text-muted">et de la Réforme de l'État</div>
              <div className="small text-muted">BP 1234, Bamako — République du Mali</div>
            </div>
            <div className="text-end">
              <div className="fw-bold">{b.prenom} {b.nom}</div>
              <div className="small text-muted">Matricule : <strong>{b.matricule}</strong></div>
              <div className="small text-muted">Grade : {b.grade}</div>
              <div className="small text-muted">Direction : <Badge bg="primary" className="fw-normal">{b.direction}</Badge></div>
            </div>
          </div>

          {/* Référence bulletin */}
          <div className="d-flex justify-content-between align-items-center px-4 py-2 bg-primary bg-opacity-10 border-bottom">
            <span className="small fw-semibold">Ref. {b.reference}</span>
            <span className="small fw-semibold">Période : {b.periode}</span>
            <span className="small fw-semibold">Indice : {b.indice} × {fmtN(2000)} = {fmt(b.salaireBase)}</span>
          </div>

          <div className="p-4">
            <Row className="g-4">
              {/* Gains */}
              <Col xs={12} md={6}>
                <h6 className="text-success border-bottom border-success pb-1 mb-3">
                  <i className="ph ph-plus-circle me-1" />Gains
                </h6>
                <Table size="sm" className="mb-2">
                  <thead><tr><th>Désignation</th><th className="text-end">Montant</th></tr></thead>
                  <tbody>
                    {b.primes.map((p, i) => (
                      <tr key={i}>
                        <td className="small">{p.designation}</td>
                        <td className="text-end small fw-semibold">{fmtN(p.montant)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="table-success">
                      <th>Total brut</th>
                      <th className="text-end">{fmtN(b.salaireBrut)}</th>
                    </tr>
                  </tfoot>
                </Table>
              </Col>

              {/* Retenues */}
              <Col xs={12} md={6}>
                <h6 className="text-danger border-bottom border-danger pb-1 mb-3">
                  <i className="ph ph-minus-circle me-1" />Retenues
                </h6>
                <Table size="sm" className="mb-2">
                  <thead><tr><th>Désignation</th><th className="text-end">Montant</th></tr></thead>
                  <tbody>
                    {b.retenues.map((r, i) => (
                      <tr key={i}>
                        <td className="small">{r.designation}</td>
                        <td className="text-end small fw-semibold text-danger">{fmtN(r.montant)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="table-danger">
                      <th>Total retenues</th>
                      <th className="text-end text-danger">{fmtN(b.totalRetenues)}</th>
                    </tr>
                  </tfoot>
                </Table>
              </Col>
            </Row>

            {/* Net à payer */}
            <div className="mt-3 p-3 bg-primary text-white rounded d-flex justify-content-between align-items-center">
              <div>
                <div className="fs-6 fw-bold">NET À PAYER</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>
                  Mode : {b.modePaiement === 'VIREMENT' ? `Virement — ${b.banque}` : 'Espèces'}
                </div>
              </div>
              <div className="fs-4 fw-bold">{fmt(b.salaireNet)}</div>
            </div>

            {/* Pied */}
            <Row className="mt-3 g-2 text-center">
              {[
                ['Brut', fmt(b.salaireBrut)],
                ['Retenues', fmt(b.totalRetenues)],
                ['Net imposable', fmt(b.salaireBase)],
                ['Net à payer', fmt(b.salaireNet)],
              ].map(([l, v]) => (
                <Col xs={6} md={3} key={l}>
                  <div className="border rounded p-2">
                    <div className="text-muted" style={{ fontSize: 10 }}>{l}</div>
                    <div className="fw-semibold small">{v}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Modal.Body>
      )}
      <Modal.Footer className="justify-content-between">
        <span className="text-muted small">
          Généré le {b?.dateGeneration ? new Date(b.dateGeneration).toLocaleDateString('fr-FR') : '—'}
          {b?.dateValidation && ` — Validé le ${new Date(b.dateValidation).toLocaleDateString('fr-FR')}`}
        </span>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={() => window.print()}>
            <i className="ph ph-printer me-1" />Imprimer
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={onClose}>Fermer</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

// ── Liste des bulletins ───────────────────────────────────────────────────────

export default function BulletinsList({ bulletins, setBulletins }) {
  const [detail,      setDetail]      = useState(null);
  const [filterSt,    setFilterSt]    = useState('');
  const [filterDir,   setFilterDir]   = useState('');
  const [filterMois,  setFilterMois]  = useState('');

  const directions = [...new Set(bulletins.map(b => b.direction))];

  const changeStatut = (id, statut) =>
    setBulletins(p => p.map(b => b.id === id ? { ...b, statut } : b));

  const validerTous = () =>
    setBulletins(p => p.map(b => b.statut === 'CALCULE' ? { ...b, statut: 'VALIDE' } : b));

  const filtered = bulletins
    .filter(b => !filterSt  || b.statut    === filterSt)
    .filter(b => !filterDir || b.direction === filterDir)
    .filter(b => !filterMois || `${b.annee}-${String(b.mois).padStart(2,'0')}` === filterMois);

  const totalNet   = filtered.reduce((s, b) => s + b.salaireNet, 0);
  const totalBrut  = filtered.reduce((s, b) => s + b.salaireBrut, 0);

  return (
    <>
      {/* ── KPIs rapides ── */}
      <Row className="g-3 mb-4">
        {Object.entries(STATUTS_BULLETIN).map(([key, s]) => (
          <Col key={key} xs={6} md={3}>
            <div className={`border border-${s.color} border-opacity-25 rounded p-3 text-center bg-${s.color} bg-opacity-10`}
              style={{ cursor: 'pointer' }} onClick={() => setFilterSt(filterSt === key ? '' : key)}>
              <h4 className={`mb-0 text-${s.color}`}>{bulletins.filter(b => b.statut === key).length}</h4>
              <small className="text-muted">{s.label}</small>
            </div>
          </Col>
        ))}
      </Row>

      {/* ── Filtres + actions ── */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex gap-2 flex-wrap">
          <Form.Select size="sm" value={filterDir} onChange={e => setFilterDir(e.target.value)} style={{ width: 120 }}>
            <option value="">Toutes directions</option>
            {directions.map(d => <option key={d} value={d}>{d}</option>)}
          </Form.Select>
          <Form.Select size="sm" value={filterSt} onChange={e => setFilterSt(e.target.value)} style={{ width: 140 }}>
            <option value="">Tous statuts</option>
            {Object.entries(STATUTS_BULLETIN).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
          </Form.Select>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={validerTous}>
            <i className="ph ph-check-circle me-1" />Valider tous les calculés
          </Button>
          <Button variant="primary" size="sm">
            <i className="ph ph-paper-plane-tilt me-1" />Générer bulletins
          </Button>
        </div>
      </div>

      <Table hover responsive className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Référence</th>
            <th>Agent</th>
            <th>Direction</th>
            <th>Grade / Cat.</th>
            <th className="text-end">Salaire brut</th>
            <th className="text-end">Retenues</th>
            <th className="text-end fw-bold">Net à payer</th>
            <th>Mode</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(b => {
            const s = STATUTS_BULLETIN[b.statut] || {};
            return (
              <tr key={b.id}>
                <td><code className="small text-muted">{b.reference}</code></td>
                <td>
                  <div className="fw-semibold">{b.prenom} {b.nom}</div>
                  <small className="text-muted">{b.matricule}</small>
                </td>
                <td><Badge bg="primary" className="fw-normal">{b.direction}</Badge></td>
                <td>
                  <small>{b.grade}</small>
                  <div><Badge bg="light" text="dark" style={{fontSize:10}}>Cat. {b.categorie} — Ind. {b.indice}</Badge></div>
                </td>
                <td className="text-end small">{fmtN(b.salaireBrut)}</td>
                <td className="text-end small text-danger">{fmtN(b.totalRetenues)}</td>
                <td className="text-end fw-bold text-success">{fmtN(b.salaireNet)}</td>
                <td>
                  <small className="text-muted">
                    <i className={`ph ph-${b.modePaiement === 'VIREMENT' ? 'bank' : 'money'} me-1`} />
                    {b.modePaiement === 'VIREMENT' ? b.banque : 'Espèces'}
                  </small>
                </td>
                <td className="text-center"><Badge bg={s.color}>{s.label}</Badge></td>
                <td className="text-center">
                  <div className="d-flex gap-1 justify-content-center">
                    <Button variant="outline-primary" size="sm" onClick={() => setDetail(b)} title="Voir le bulletin">
                      <i className="ph ph-eye" />
                    </Button>
                    {b.statut === 'CALCULE' && (
                      <Button variant="outline-success" size="sm" title="Valider" onClick={() => changeStatut(b.id, 'VALIDE')}>
                        <i className="ph ph-check" />
                      </Button>
                    )}
                    {b.statut === 'VALIDE' && (
                      <Button variant="outline-info" size="sm" title="Marquer viré" onClick={() => changeStatut(b.id, 'VIRE')}>
                        <i className="ph ph-paper-plane-tilt" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        {filtered.length > 0 && (
          <tfoot className="table-light">
            <tr>
              <th colSpan={4} className="text-end">Totaux ({filtered.length} bulletins)</th>
              <th className="text-end">{fmtN(totalBrut)}</th>
              <th className="text-end text-danger">{fmtN(totalBrut - totalNet)}</th>
              <th className="text-end text-success">{fmtN(totalNet)}</th>
              <th colSpan={3} />
            </tr>
          </tfoot>
        )}
      </Table>

      <BulletinDetail b={detail} onClose={() => setDetail(null)} />
    </>
  );
}

BulletinsList.propTypes = {
  bulletins:    PropTypes.array.isRequired,
  setBulletins: PropTypes.func.isRequired,
};
