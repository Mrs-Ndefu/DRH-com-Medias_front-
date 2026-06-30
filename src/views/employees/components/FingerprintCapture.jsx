import PropTypes from 'prop-types';
import { useState, useEffect, useRef, useCallback } from 'react';

import Alert   from 'react-bootstrap/Alert';
import Badge   from 'react-bootstrap/Badge';
import Button  from 'react-bootstrap/Button';

import { useFingerprintBridge } from 'hooks/useFingerprintBridge';

const TOTAL_CAPTURES = 4;
const STEPS = [
  { key: 'gauche', label: 'Pouce gauche' },
  { key: 'droit',  label: 'Pouce droit'  },
];

// ==============================|| ENRÔLEMENT — POUCE GAUCHE + POUCE DROIT ||============================== //

export default function FingerprintCapture({ onChange }) {
  const { status, message, on, send, connect } = useFingerprintBridge();

  const [stepIdx,  setStepIdx]  = useState(0);
  const [fmds,     setFmds]     = useState({});   // { gauche: '...', droit: '...' }
  const [progress, setProgress] = useState(0);
  const [running,  setRunning]  = useState(false);
  const [phase,    setPhase]    = useState('idle');
  const [phaseMsg, setPhaseMsg] = useState('');

  // Refs pour éviter les closures périmées dans les handlers
  const stepIdxRef = useRef(0);
  const fmdsRef    = useRef({});

  const bridgeOk    = status === 'ready' || status === 'open';
  const bridgeError = status === 'error';
  const allDone     = !!(fmds.gauche && fmds.droit);
  const currentStep = STEPS[stepIdx];

  useEffect(() => {
    on('ready',    () => {});
    on('waiting',  (m) => { setPhase('waiting');  setProgress(m.count ?? 0); setPhaseMsg(''); });
    on('progress', (m) => { setPhase('progress'); setProgress(m.count ?? 0); setPhaseMsg(''); });
    on('retry',    (m) => { setPhase('retry');    setPhaseMsg(m.message || 'Qualité insuffisante, reposez le doigt'); });
    on('error',    (m) => { setPhase('error');    setPhaseMsg(m.message || 'Erreur inconnue'); setRunning(false); });
    on('cancelled',()  => { setPhase('idle');     setRunning(false); setProgress(0); });

    on('enrolled', (m) => {
      const step    = STEPS[stepIdxRef.current];
      const updated = { ...fmdsRef.current, [step.key]: m.fmd };
      fmdsRef.current = updated;
      setFmds(updated);
      setPhase('enrolled');
      setRunning(false);

      if (stepIdxRef.current < STEPS.length - 1) {
        // Passer automatiquement à l'étape suivante après 1,5s
        setTimeout(() => {
          stepIdxRef.current += 1;
          setStepIdx(stepIdxRef.current);
          setPhase('idle');
          setProgress(0);
        }, 1500);
      } else {
        // Les deux pouces sont enrôlés
        onChange?.(updated);
      }
    });
  }, [on, onChange]);

  const startEnrollment = useCallback(() => {
    if (running) return;
    setProgress(0);
    setPhase('waiting');
    setPhaseMsg('');
    setRunning(true);
    send({ action: 'start_enrollment' });
  }, [running, send]);

  const cancel = useCallback(() => {
    send({ action: 'cancel' });
    setRunning(false);
    setPhase('idle');
    setProgress(0);
  }, [send]);

  const reset = useCallback(() => {
    fmdsRef.current  = {};
    stepIdxRef.current = 0;
    setFmds({});
    setStepIdx(0);
    setPhase('idle');
    setProgress(0);
    setRunning(false);
    onChange?.(null);
  }, [onChange]);

  const fpColor =
    phase === 'enrolled' ? '#198754' :
    phase === 'progress' ? '#0d6efd' :
    phase === 'waiting'  ? '#0d6efd' :
    phase === 'retry'    ? '#f0ad4e' :
    phase === 'error'    ? '#dc3545' :
    bridgeOk ? '#0d6efd' : '#adb5bd';

  return (
    <div>
      {/* En-tête */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h6 className="mb-1">Enrôlement biométrique</h6>
          <small className="text-muted">Lecteur DigitalPersona U.are.U — {TOTAL_CAPTURES} poses par pouce</small>
        </div>
        {allDone && <Badge bg="success">Complet ✓</Badge>}
      </div>

      {/* Pont non disponible */}
      {bridgeError && (
        <Alert variant="danger" className="mb-3">
          <strong>Pont biométrique non disponible.</strong>
          <div className="small mt-1">{message || 'Lancez fp-bridge.js (port 8091).'}</div>
          <Button variant="outline-danger" size="sm" className="mt-2" onClick={connect}>
            <i className="ph ph-arrows-clockwise me-1" />Reconnecter
          </Button>
        </Alert>
      )}

      {/* Indicateur 2 étapes */}
      <div className="d-flex gap-3 mb-4">
        {STEPS.map((s, i) => {
          const done   = !!fmds[s.key];
          const active = i === stepIdx && !allDone;
          return (
            <div
              key={s.key}
              className={`flex-fill text-center py-3 rounded border ${
                done   ? 'border-success bg-success bg-opacity-10' :
                active ? 'border-primary bg-primary bg-opacity-10' :
                         'bg-light border-secondary'
              }`}
            >
              <i
                className="ph ph-fingerprint d-block mb-1"
                style={{
                  fontSize: 36,
                  color: done ? '#198754' : active ? '#0d6efd' : '#adb5bd',
                }}
              />
              <div className={`fw-semibold small ${done ? 'text-success' : active ? 'text-primary' : 'text-muted'}`}>
                {s.label}
              </div>
              <Badge bg={done ? 'success' : active ? 'primary' : 'secondary'} className="mt-1">
                {done ? '✓ Enrôlé' : active ? 'En cours' : 'En attente'}
              </Badge>
            </div>
          );
        })}
      </div>

      {/* Zone scanner */}
      {!allDone && (
        <div className={`text-center py-4 px-4 border rounded mb-4 ${bridgeOk ? 'border-primary bg-primary bg-opacity-5' : 'bg-light'}`}>

          {/* Progression dots */}
          {running && (
            <div className="mb-3 d-flex justify-content-center gap-2">
              {[...Array(TOTAL_CAPTURES)].map((_, i) => (
                <div
                  key={i}
                  className={`rounded-circle ${
                    i < progress   ? 'bg-success' :
                    i === progress ? 'bg-primary' :
                    'bg-secondary bg-opacity-25'
                  }`}
                  style={{ width: 18, height: 18, transition: 'background 0.3s' }}
                />
              ))}
            </div>
          )}

          <i
            className="ph ph-fingerprint d-block mb-2"
            style={{ fontSize: 90, color: fpColor, transition: 'color 0.4s ease' }}
          />

          <p className="fw-bold mb-2">
            Étape {stepIdx + 1}/2 — {currentStep.label}
          </p>

          <div style={{ minHeight: 30 }} className="mb-3 small">
            {phase === 'idle'     && bridgeOk  && <span className="text-primary">Prêt — cliquez pour démarrer</span>}
            {phase === 'waiting'  && <span className="text-primary fw-semibold"><span className="spinner-border spinner-border-sm me-1" />Posez le {currentStep.label} ({progress}/{TOTAL_CAPTURES})…</span>}
            {phase === 'progress' && <span className="text-success fw-semibold"><i className="ph ph-check-circle me-1" />Capture {progress}/{TOTAL_CAPTURES} — reposez le doigt…</span>}
            {phase === 'retry'    && <span className="text-warning fw-semibold"><i className="ph ph-warning me-1" />{phaseMsg}</span>}
            {phase === 'enrolled' && <span className="text-success fw-semibold"><i className="ph ph-check-circle me-1" />{currentStep.label} enrôlé !</span>}
            {phase === 'error'    && <span className="text-danger"><i className="ph ph-warning-circle me-1" />{phaseMsg}</span>}
          </div>

          {phase !== 'enrolled' ? (
            <Button
              variant={running ? 'warning' : 'primary'}
              onClick={running ? cancel : startEnrollment}
              disabled={bridgeError || status === 'connecting'}
            >
              {running
                ? <><span className="spinner-border spinner-border-sm me-2" />Annuler</>
                : <><i className="ph ph-fingerprint me-2" />Enrôler le {currentStep.label}</>
              }
            </Button>
          ) : stepIdx < STEPS.length - 1 ? (
            <span className="text-muted small fst-italic">Passage au pouce suivant…</span>
          ) : null}
        </div>
      )}

      {/* Succès final */}
      {allDone && (
        <Alert variant="success" className="d-flex justify-content-between align-items-center mb-0">
          <span>
            <i className="ph ph-check-circle me-2" />
            <strong>Les deux pouces sont enrôlés.</strong> Ils seront sauvegardés avec le dossier.
          </span>
          <Button variant="outline-danger" size="sm" onClick={reset}>
            <i className="ph ph-arrow-counter-clockwise me-1" />Recommencer
          </Button>
        </Alert>
      )}

      {phase === 'idle' && !allDone && bridgeOk && (
        <Alert variant="info" className="mb-0 mt-3">
          <i className="ph ph-info me-2" />
          Posez le <strong>même doigt</strong> {TOTAL_CAPTURES} fois de suite pour chaque pouce.
        </Alert>
      )}
    </div>
  );
}

FingerprintCapture.propTypes = { onChange: PropTypes.func };
