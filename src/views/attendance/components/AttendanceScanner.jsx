import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';

import Badge   from 'react-bootstrap/Badge';
import Card    from 'react-bootstrap/Card';
import Col     from 'react-bootstrap/Col';
import Row     from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import { api } from 'api/client';
import { useFingerprintBridge } from 'hooks/useFingerprintBridge';

const COOLDOWN_MS = 3500; // délai avant relance automatique après un pointage

const fmtHeure = (str) => str ? str.substring(0, 5) : '—';

// ==============================|| POINTAGE — SCANNER BIOMÉTRIQUE AUTONOME ||============================== //

export default function AttendanceScanner({ onScanDone, todayPresences = [] }) {
  const { status, on, send, connect } = useFingerprintBridge();

  const [phase,  setPhase]  = useState('idle');  // idle|reading|matching|done|error
  const [result, setResult] = useState(null);
  const [error,  setError]  = useState(null);
  const [countdown, setCountdown] = useState(0);

  const timerRef    = useRef(null);
  const countRef    = useRef(null);
  const isActiveRef = useRef(false);

  const startCapture = () => {
    isActiveRef.current = true;
    setPhase('reading');
    setResult(null);
    setError(null);
    send({ action: 'capture' });
  };

  // Relance automatique après cooldown
  const scheduleRestart = () => {
    let remaining = Math.ceil(COOLDOWN_MS / 1000);
    setCountdown(remaining);
    countRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) clearInterval(countRef.current);
    }, 1000);

    timerRef.current = setTimeout(() => {
      clearInterval(countRef.current);
      setCountdown(0);
      startCapture();
    }, COOLDOWN_MS);
  };

  // Dès que le pont est prêt, démarrer la capture automatiquement
  useEffect(() => {
    if ((status === 'ready' || status === 'open') && !isActiveRef.current) {
      startCapture();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    on('ready', () => {
      if (!isActiveRef.current) startCapture();
    });

    on('waiting', () => {
      setPhase('reading');
      setResult(null);
      setError(null);
    });

    on('captured', async ({ fmd }) => {
      setPhase('matching');
      try {
        const data = await api.post('/presences/identifier-empreinte', { fmd });
        setResult(data);
        setPhase('done');
        isActiveRef.current = false;
        onScanDone();
        scheduleRestart();
      } catch (err) {
        setError(err.message || 'Agent non reconnu.');
        setPhase('error');
        isActiveRef.current = false;
        scheduleRestart();
      }
    });

    on('error', ({ message }) => {
      setError(message || 'Erreur du lecteur.');
      setPhase('error');
      isActiveRef.current = false;
      scheduleRestart();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, onScanDone]);

  // Nettoyage timers au démontage
  useEffect(() => () => {
    clearTimeout(timerRef.current);
    clearInterval(countRef.current);
  }, []);

  const isIN            = result?.type === 'IN';
  const retard          = result?.retard;
  const sortieAnticipee = result?.sortie_anticipee;
  const cardColor       = isIN ? (retard ? 'warning' : 'success') : (sortieAnticipee ? 'warning' : 'danger');

  const fpColor =
    phase === 'reading'  ? '#f0ad4e' :
    phase === 'matching' ? '#0d6efd' :
    phase === 'done'     ? '#198754' :
    phase === 'error'    ? '#dc3545' :
    '#adb5bd';

  const fpPulse = phase === 'reading' || phase === 'matching';

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={6}>

        {/* Pont non disponible */}
        {status === 'error' && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
            <i className="ph ph-warning-circle flex-shrink-0" />
            <div>
              <strong>Pont biométrique non disponible.</strong>
              <div className="small">Lancez <code>node fp-bridge.js</code> dans le dossier backend.</div>
              <button className="btn btn-outline-danger btn-sm mt-2" onClick={connect}>
                <i className="ph ph-arrows-clockwise me-1" />Reconnecter
              </button>
            </div>
          </div>
        )}

        {status === 'connecting' && (
          <div className="alert alert-info d-flex align-items-center gap-2 mb-4">
            <Spinner size="sm" className="flex-shrink-0" />
            Connexion au pont biométrique…
          </div>
        )}

        {/* Zone scanner — aucun bouton */}
        <div className={`text-center py-5 px-4 border rounded mb-4 ${
          phase === 'reading'  ? 'border-secondary bg-light' :
          phase === 'matching' ? 'border-primary bg-primary bg-opacity-5' :
          phase === 'done'     ? 'border-success bg-success bg-opacity-5' :
          phase === 'error'    ? 'border-danger  bg-danger  bg-opacity-5' :
          'bg-light'
        }`}>

          <i
            className={`ph ph-fingerprint d-block mb-3${fpPulse ? ' animate__animated animate__pulse animate__infinite' : ''}`}
            style={{ fontSize: 120, color: fpColor, transition: 'color 0.4s ease' }}
          />

          <div style={{ minHeight: 36 }}>
            {phase === 'idle' && (
              <span className="text-muted">Initialisation…</span>
            )}
            {phase === 'reading' && (
              <span className="text-warning fw-bold fs-5">
                <Spinner size="sm" animation="grow" className="me-2" />
                Posez votre doigt sur le lecteur
              </span>
            )}
            {phase === 'matching' && (
              <span className="text-primary fw-semibold">
                <Spinner size="sm" className="me-2" />
                Identification en cours…
              </span>
            )}
            {phase === 'done' && (
              <span className="text-success fw-bold fs-5">
                <i className="ph ph-check-circle me-2" />
                Pointage enregistré
                {countdown > 0 && <span className="text-muted fw-normal fs-6 ms-2">(reprise dans {countdown}s)</span>}
              </span>
            )}
            {phase === 'error' && (
              <span className="text-danger fw-semibold">
                <i className="ph ph-warning-circle me-2" />{error}
                {countdown > 0 && <span className="text-muted fw-normal fs-6 ms-2"> — reprise dans {countdown}s</span>}
              </span>
            )}
          </div>
        </div>

        {/* Résultat du dernier pointage */}
        {result && phase === 'done' && (
          <Card className={`border-${cardColor} shadow-sm mb-4`}>
            <Card.Header className={`bg-${cardColor} ${cardColor === 'warning' ? 'text-dark' : 'text-white'} d-flex justify-content-between align-items-center`}>
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
                <div className={`rounded-circle d-flex align-items-center justify-content-center bg-${isIN ? 'success' : 'danger'} bg-opacity-10 flex-shrink-0`} style={{ width: 60, height: 60 }}>
                  <i className={`ph ph-user f-26 text-${isIN ? 'success' : 'danger'}`} />
                </div>
                <div>
                  <h5 className="mb-0">{result.prenom} {result.nom_famille}</h5>
                  <p className="text-muted small mb-2">{result.poste}</p>
                  <div className="d-flex flex-wrap gap-2">
                    <Badge bg="light" text="dark"><i className="ph ph-identification-card me-1" />{result.matricule}</Badge>
                    {isIN && retard && <Badge bg="warning" text="dark"><i className="ph ph-warning me-1" />RETARD</Badge>}
                    {isIN && !retard && <Badge bg="success"><i className="ph ph-check me-1" />À l'heure</Badge>}
                    {!isIN && sortieAnticipee && <Badge bg="warning" text="dark"><i className="ph ph-warning me-1" />Sortie anticipée</Badge>}
                  </div>
                  {result.observation && (
                    <p className="text-muted small mt-2 mb-0 fst-italic"><i className="ph ph-note me-1" />{result.observation}</p>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
      </Col>

      {/* Derniers pointages du jour — mis à jour automatiquement */}
      {todayPresences.length > 0 && (
        <Col xs={12} className="mt-2">
          <h6 className="text-muted mb-2 d-flex align-items-center gap-2">
            <i className="ph ph-clock-clockwise" />
            Derniers pointages du jour
            <Badge bg="secondary" className="ms-1">{todayPresences.length}</Badge>
          </h6>
          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Agent</th>
                  <th>Entrée</th>
                  <th>Sortie</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {[...todayPresences]
                  .sort((a, b) => {
                    const ta = a.heure_entree || a.heure_sortie || '';
                    const tb = b.heure_entree || b.heure_sortie || '';
                    return tb.localeCompare(ta);
                  })
                  .slice(0, 8)
                  .map((p) => (
                    <tr key={p.id}>
                      <td>
                        <span className="fw-semibold">{p.prenom} {p.nom_famille}</span>
                        <br /><span className="text-muted small">{p.matricule}</span>
                      </td>
                      <td className="small">{fmtHeure(p.heure_entree)}</td>
                      <td className="small">{fmtHeure(p.heure_sortie)}</td>
                      <td>
                        <Badge
                          bg={p.statut === 'PRESENT' ? 'success' : p.statut === 'RETARD' ? 'warning' : p.statut === 'ABSENT' ? 'danger' : 'secondary'}
                          text={p.statut === 'RETARD' ? 'dark' : undefined}
                        >
                          {p.statut}
                        </Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Col>
      )}
    </Row>
  );
}

AttendanceScanner.propTypes = {
  onScanDone:     PropTypes.func.isRequired,
  todayPresences: PropTypes.array,
};
