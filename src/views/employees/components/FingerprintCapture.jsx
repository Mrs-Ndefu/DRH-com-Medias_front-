import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

// react-bootstrap
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const FINGERS = [
  { id: 'right-thumb', label: 'Pouce droit',  hand: 'Droite' },
  { id: 'left-thumb',  label: 'Pouce gauche', hand: 'Gauche' },
];

// ==============================|| CAPTURE EMPREINTE DIGITALE (WebAuthn / FIDO2) ||============================== //

export default function FingerprintCapture({ onChange }) {
  const [captured, setCaptured]   = useState({});
  const [scanning, setScanning]   = useState(null);
  const [status, setStatus]       = useState('idle');   // idle | scanning | success | error | unavailable
  const [message, setMessage]     = useState('');

  const capture = useCallback(async (finger) => {
    if (captured[finger.id]) return;

    setScanning(finger.id);
    setStatus('scanning');
    setMessage(`Posez votre ${finger.label.toLowerCase()} ${finger.hand.toLowerCase()} sur le lecteur…`);

    if (!window.PublicKeyCredential) {
      setScanning(null);
      setStatus('unavailable');
      setMessage("WebAuthn non supporté par ce navigateur. Utilisez un lecteur biométrique compatible FIDO2 / Windows Hello.");
      return;
    }

    try {
      const challenge = window.crypto.getRandomValues(new Uint8Array(32));
      const userId    = window.crypto.getRandomValues(new Uint8Array(16));

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: 'RH Manager – Ministère', id: window.location.hostname },
          user: {
            id: userId,
            name: `emp-${finger.id}-${Date.now()}`,
            displayName: `${finger.label} ${finger.hand}`
          },
          pubKeyCredParams: [
            { alg: -7,   type: 'public-key' },
            { alg: -257, type: 'public-key' }
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required'
          },
          timeout: 60000
        }
      });

      const updated = {
        ...captured,
        [finger.id]: {
          credentialId: credential.id,
          capturedAt: new Date().toISOString()
        }
      };
      setCaptured(updated);
      setScanning(null);
      setStatus('success');
      setMessage(`${finger.label} ${finger.hand} enregistré avec succès.`);
      onChange?.(updated);
    } catch (err) {
      setScanning(null);
      if (err.name === 'NotAllowedError') {
        setStatus('error');
        setMessage('Capture annulée ou délai dépassé. Veuillez réessayer.');
      } else if (err.name === 'NotSupportedError') {
        setStatus('unavailable');
        setMessage('Aucun lecteur d\'empreintes détecté. Vérifiez le branchement du périphérique biométrique.');
      } else {
        setStatus('error');
        setMessage(`Erreur de capture : ${err.message}`);
      }
    }
  }, [captured, onChange]);

  const remove = (fingerId) => {
    const updated = { ...captured };
    delete updated[fingerId];
    setCaptured(updated);
    onChange?.(updated);
    setStatus('idle');
    setMessage('');
  };

  const capturedCount = Object.keys(captured).length;
  const allCaptured   = capturedCount === FINGERS.length;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h6 className="mb-1">Capture des empreintes digitales</h6>
          <small className="text-muted">
            Cliquez sur un pouce pour lancer la capture via le lecteur biométrique (FIDO2 / Windows Hello)
          </small>
        </div>
        <Badge bg={allCaptured ? 'success' : 'secondary'} className="fs-6 px-3 py-2">
          {capturedCount} / 2 pouce{capturedCount > 1 ? 's' : ''}
        </Badge>
      </div>

      <Row className="g-4 mb-4 justify-content-center">
        {FINGERS.map((finger) => {
          const isCaptured = !!captured[finger.id];
          const isScanning = scanning === finger.id;
          return (
            <Col key={finger.id} xs={12} sm={6} md={4}>
              <div className={`border rounded p-4 text-center h-100 ${isCaptured ? 'border-success bg-success bg-opacity-10' : ''}`}>
                <i
                  className={`ph ph-fingerprint d-block mb-3 ${isCaptured ? 'text-success' : 'text-secondary'}`}
                  style={{ fontSize: 56 }}
                />
                <p className="fw-semibold mb-3">{finger.label}</p>

                {isCaptured ? (
                  <div>
                    <p className="text-success small mb-2">
                      <i className="ph ph-check-circle me-1" />Empreinte enregistrée
                    </p>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => remove(finger.id)}
                    >
                      <i className="ph ph-arrow-counter-clockwise me-1" />Recapturer
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant={isScanning ? 'warning' : 'primary'}
                    size="sm"
                    onClick={() => capture(finger)}
                    disabled={!!scanning}
                  >
                    {isScanning ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Capture en cours…
                      </>
                    ) : (
                      <>
                        <i className="ph ph-fingerprint me-2" />Capturer
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Col>
          );
        })}
      </Row>

      {status === 'scanning' && (
        <Alert variant="warning" className="d-flex align-items-center gap-2 mb-0">
          <span className="spinner-border spinner-border-sm flex-shrink-0" />
          {message}
        </Alert>
      )}
      {status === 'success' && (
        <Alert variant="success" className="d-flex align-items-center gap-2 mb-0">
          <i className="ph ph-check-circle flex-shrink-0" />
          {message}
        </Alert>
      )}
      {(status === 'error' || status === 'unavailable') && (
        <Alert variant={status === 'unavailable' ? 'warning' : 'danger'} className="d-flex align-items-center gap-2 mb-0">
          <i className="ph ph-warning flex-shrink-0" />
          {message}
        </Alert>
      )}
      {capturedCount === 0 && status === 'idle' && (
        <Alert variant="info" className="mb-0">
          <i className="ph ph-info me-2" />
          Les deux pouces sont requis pour l'identification biométrique de l'employé.
        </Alert>
      )}
      {allCaptured && (
        <Alert variant="success" className="mb-0">
          <i className="ph ph-check-circle me-2" />
          Les deux empreintes ont été capturées avec succès.
        </Alert>
      )}
    </div>
  );
}

FingerprintCapture.propTypes = { onChange: PropTypes.func };
