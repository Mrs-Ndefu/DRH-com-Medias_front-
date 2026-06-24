import PropTypes from 'prop-types';
import { useState } from 'react';

import Badge   from 'react-bootstrap/Badge';
import Button  from 'react-bootstrap/Button';
import Card    from 'react-bootstrap/Card';
import Col     from 'react-bootstrap/Col';
import Form    from 'react-bootstrap/Form';
import Row     from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import { api } from 'api/client';

const PHASES = [
  { key: 'reading',   label: "Lecture de l'empreinte…",    ms: 800 },
  { key: 'matching',  label: 'Identification biométrique…', ms: 700 },
  { key: 'verifying', label: 'Vérification du dossier…',   ms: 600 },
];

const fmtHeure = (str) => str ? str.substring(0, 5) : '—';

const ENTREE_LIMITE_H = 9;
const ENTREE_LIMITE_M = 45;

function isLate() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  return h > ENTREE_LIMITE_H || (h === ENTREE_LIMITE_H && m > ENTREE_LIMITE_M);
}

// ==============================|| POINTAGE — SCANNER BIOMÉTRIQUE ||============================== //

export default function AttendanceScanner({ agents, todayPresences, onScanDone }) {
  const [selectedId, setSelectedId] = useState('');
  const [phase,      setPhase]      = useState(null);
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState(null);

  const scanning = phase !== null && phase !== 'done';

  const detectType = (agentId) => {
    const found = todayPresences.find(p => String(p.agent_id) === String(agentId));
    if (!found || !found.heure_entree)  return 'IN';
    if (found.heure_entree && !found.heure_sortie) return 'OUT';
    return 'IN';
  };

  const runScan = () => {
    if (!selectedId) return;
    setResult(null);
    setError(null);

    let delay = 0;
    PHASES.forEach((p) => {
      setTimeout(() => setPhase(p.key), delay);
      delay += p.ms;
    });

    setTimeout(async () => {
      try {
        const type = detectType(selectedId);
        const data = await api.post('/presences/pointer', {
          agent_id: parseInt(selectedId),
          type,
        });
        setResult({ ...data, type });
        onScanDone();
      } catch (err) {
        setError(err.message || 'Erreur lors du pointage.');
      } finally {
        setPhase('done');
      }
    }, delay);
  };

  const type      = selectedId ? detectType(selectedId) : null;
  const isIN      = result?.type === 'IN';
  const retard    = result?.retard;
  const sortieAnticipee = result?.sortie_anticipee;

  const cardColor = isIN
    ? (retard ? 'warning' : 'success')
    : (sortieAnticipee ? 'warning' : 'danger');

  const fpColor = scanning
    ? '#f0ad4e'
    : phase === 'done' && !error
      ? '#198754'
      : selectedId ? '#0d6efd' : '#adb5bd';

  const currentPhase = PHASES.find(p => p.key === phase);

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={6}>

        {/* Sélecteur d'agent */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">
            <i className="ph ph-user me-2 text-primary" />Sélectionner l'agent
          </Form.Label>
          <Form.Select
            value={selectedId}
            onChange={e => { setSelectedId(e.target.value); setResult(null); setError(null); setPhase(null); }}
            disabled={scanning}
            size="lg"
          >
            <option value="">— Choisir un agent —</option>
            {agents.map(a => (
              <option key={a.id} value={a.id}>
                {a.prenom} {a.nom_famille} — {a.matricule}
              </option>
            ))}
          </Form.Select>

          {selectedId && (
            <div className="mt-2 small d-flex align-items-center gap-2">
              <Badge bg={type === 'IN' ? 'success' : 'danger'}>
                <i className={`ph ph-${type === 'IN' ? 'sign-in' : 'sign-out'} me-1`} />
                {type === 'IN' ? 'Entrée détectée' : 'Sortie détectée'}
              </Badge>
              {type === 'IN' && isLate() && (
                <span className="text-warning fw-semibold">
                  <i className="ph ph-warning me-1" />
                  09h45 dépassé → sera marqué RETARD
                </span>
              )}
              {type === 'IN' && !isLate() && (
                <span className="text-success">
                  <i className="ph ph-check me-1" />Dans les délais
                </span>
              )}
            </div>
          )}
        </Form.Group>

        {/* Visuel scanner */}
        <div
          className={`text-center py-5 px-4 border rounded mb-4 ${
            selectedId ? 'border-primary bg-primary bg-opacity-5' : 'bg-light'
          }`}
        >
          <i
            className="ph ph-fingerprint d-block mb-3"
            style={{ fontSize: 100, color: fpColor, transition: 'color 0.4s ease' }}
          />

          <div style={{ minHeight: 28 }} className="mb-4">
            {scanning && (
              <span className="text-warning fw-semibold">
                <Spinner size="sm" animation="grow" className="me-2" />
                {currentPhase?.label}
              </span>
            )}
            {phase === 'done' && !error && (
              <span className="text-success fw-semibold">
                <i className="ph ph-check-circle me-2" />Pointage enregistré
              </span>
            )}
            {phase === 'done' && error && (
              <span className="text-danger small">{error}</span>
            )}
            {!phase && !selectedId && (
              <span className="text-muted small">Sélectionnez un agent puis appuyez sur le bouton</span>
            )}
            {!phase && selectedId && (
              <span className="text-primary small">
                Agent sélectionné — appuyez pour pointer
              </span>
            )}
          </div>

          <Button
            variant={scanning ? 'warning' : 'primary'}
            size="lg"
            className="px-5"
            onClick={runScan}
            disabled={scanning || !selectedId}
          >
            {scanning ? (
              <><Spinner size="sm" className="me-2" />Scan en cours…</>
            ) : (
              <>
                <i className="ph ph-fingerprint me-2" />
                {type === 'IN' ? "Pointer l'entrée" : 'Pointer la sortie'}
              </>
            )}
          </Button>
        </div>

        {/* Résultat du pointage */}
        {result && !error && (
          <Card className={`border-${cardColor} shadow-sm`} style={{ animation: 'fadeIn 0.3s ease' }}>
            <Card.Header
              className={`bg-${cardColor} ${cardColor === 'warning' ? 'text-dark' : 'text-white'} d-flex justify-content-between align-items-center`}
            >
              <span className="fw-semibold">
                <i className={`ph ph-${isIN ? 'sign-in' : 'sign-out'} me-2`} />
                {isIN ? 'Entrée enregistrée' : 'Sortie enregistrée'}
              </span>
              <span className="fw-bold fs-6">
                {isIN ? fmtHeure(result.heure_entree) : fmtHeure(result.heure_sortie)}
              </span>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center gap-3">
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center bg-${isIN ? 'success' : 'danger'} bg-opacity-10 flex-shrink-0`}
                  style={{ width: 60, height: 60 }}
                >
                  <i className={`ph ph-user f-26 text-${isIN ? 'success' : 'danger'}`} />
                </div>
                <div>
                  <h5 className="mb-0">{result.prenom} {result.nom_famille}</h5>
                  <p className="text-muted small mb-2">{result.poste}</p>
                  <div className="d-flex flex-wrap gap-2">
                    <Badge bg="light" text="dark">
                      <i className="ph ph-identification-card me-1" />
                      {result.matricule}
                    </Badge>
                    {isIN && retard && (
                      <Badge bg="warning" text="dark">
                        <i className="ph ph-warning me-1" />RETARD
                      </Badge>
                    )}
                    {isIN && !retard && (
                      <Badge bg="success">
                        <i className="ph ph-check me-1" />À l'heure
                      </Badge>
                    )}
                    {!isIN && sortieAnticipee && (
                      <Badge bg="warning" text="dark">
                        <i className="ph ph-warning me-1" />Sortie anticipée
                      </Badge>
                    )}
                  </div>
                  {result.observation && (
                    <p className="text-muted small mt-2 mb-0 fst-italic">
                      <i className="ph ph-note me-1" />{result.observation}
                    </p>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2">
            <i className="ph ph-warning-circle flex-shrink-0" />
            {error}
          </div>
        )}
      </Col>
    </Row>
  );
}

AttendanceScanner.propTypes = {
  agents:         PropTypes.array.isRequired,
  todayPresences: PropTypes.array.isRequired,
  onScanDone:     PropTypes.func.isRequired,
};
