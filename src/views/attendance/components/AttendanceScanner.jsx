import PropTypes from 'prop-types';
import { useState } from 'react';

// react-bootstrap
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const FAKE_EMPLOYEES = [
  { id: 'EMP001', nom: 'Mamadou Koné',       poste: 'Directeur adjoint',          matricule: '2019045' },
  { id: 'EMP002', nom: 'Aminata Traoré',     poste: 'Chef de service RH',          matricule: '2020112' },
  { id: 'EMP003', nom: 'Jean-Baptiste Yao',  poste: 'Administrateur principal',    matricule: '2018033' },
  { id: 'EMP004', nom: 'Fatoumata Camara',   poste: 'Secrétaire de direction',     matricule: '2021089' },
  { id: 'EMP005', nom: 'Ousmane Diallo',     poste: 'Agent de bureau',             matricule: '2022156' },
  { id: 'EMP006', nom: 'Ndeye Sow',          poste: 'Chargée de mission',          matricule: '2020078' },
  { id: 'EMP007', nom: 'Abdoulaye Barry',    poste: 'Inspecteur principal',        matricule: '2017022' },
  { id: 'EMP008', nom: 'Marie-Claire Bah',   poste: "Attachée d'administration",   matricule: '2023201' },
];

const PHASES = [
  { key: 'reading',   label: "Lecture de l'empreinte…",    ms: 1000 },
  { key: 'matching',  label: 'Identification biométrique…', ms: 900  },
  { key: 'verifying', label: 'Vérification du dossier…',   ms: 700  },
];

const todayStr = () => new Date().toISOString().split('T')[0];
const fmtTime  = (d) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

// ==============================|| POINTAGE — SCANNER BIOMÉTRIQUE (SIMULÉ) ||============================== //

export default function AttendanceScanner({ records, onScan }) {
  const [phase,  setPhase]  = useState(null);   // null | 'reading' | 'matching' | 'verifying' | 'done'
  const [result, setResult] = useState(null);

  const scanning = phase !== null && phase !== 'done';

  const runScan = () => {
    setResult(null);
    let delay = 0;

    PHASES.forEach((p) => {
      setTimeout(() => setPhase(p.key), delay);
      delay += p.ms;
    });

    setTimeout(() => {
      const employee = FAKE_EMPLOYEES[Math.floor(Math.random() * FAKE_EMPLOYEES.length)];

      const lastRecord = [...records]
        .filter((r) => r.employeeId === employee.id && r.date === todayStr())
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

      const type = !lastRecord || lastRecord.type === 'OUT' ? 'IN' : 'OUT';
      const now  = new Date();

      const record = {
        id:          Date.now(),
        employeeId:  employee.id,
        nom:         employee.nom,
        poste:       employee.poste,
        matricule:   employee.matricule,
        type,
        timestamp:   now,
        date:        todayStr(),
      };

      onScan(record);
      setResult({ ...record, time: fmtTime(now) });
      setPhase('done');
    }, delay);
  };

  const currentPhase = PHASES.find((p) => p.key === phase);
  const isIN  = result?.type === 'IN';
  const color = isIN ? 'success' : 'danger';

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={5}>

        {/* ── Visuel du scanner ── */}
        <div className="text-center py-5 px-4 border rounded bg-light mb-4">
          <i
            className="ph ph-fingerprint d-block mb-3"
            style={{
              fontSize: 100,
              color: scanning ? '#f0ad4e' : phase === 'done' ? '#198754' : '#adb5bd',
              transition: 'color 0.4s ease'
            }}
          />

          <div style={{ minHeight: 28 }} className="mb-4">
            {scanning && (
              <span className="text-warning fw-semibold">
                <span className="spinner-grow spinner-grow-sm me-2 align-middle" />
                {currentPhase?.label}
              </span>
            )}
            {phase === 'done' && !scanning && (
              <span className="text-success fw-semibold">
                <i className="ph ph-check-circle me-2" />Scan terminé
              </span>
            )}
            {!phase && (
              <span className="text-muted small">Appuyez sur le bouton pour simuler un scan</span>
            )}
          </div>

          <Button
            variant={scanning ? 'warning' : 'primary'}
            size="lg"
            className="px-5"
            onClick={runScan}
            disabled={scanning}
          >
            {scanning ? (
              <><span className="spinner-border spinner-border-sm me-2" />Scan en cours…</>
            ) : (
              <><i className="ph ph-fingerprint me-2" />Scanner l'empreinte</>
            )}
          </Button>
        </div>

        {/* ── Résultat du scan ── */}
        {result && (
          <Card className={`border-${color} shadow-sm`} style={{ animation: 'fadeIn 0.3s ease' }}>
            <Card.Header className={`bg-${color} text-white d-flex justify-content-between align-items-center`}>
              <span className="fw-semibold">
                <i className={`ph ph-${isIN ? 'sign-in' : 'sign-out'} me-2`} />
                {isIN ? 'Entrée enregistrée' : 'Sortie enregistrée'}
              </span>
              <span className="fw-bold fs-6">{result.time}</span>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center gap-3">
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center bg-${color} bg-opacity-10 flex-shrink-0`}
                  style={{ width: 56, height: 56 }}
                >
                  <i className={`ph ph-user f-24 text-${color}`} />
                </div>
                <div>
                  <h5 className="mb-0">{result.nom}</h5>
                  <p className="text-muted small mb-2">{result.poste}</p>
                  <Badge bg="light" text="dark" className="me-2">
                    <i className="ph ph-identification-card me-1" />
                    {result.matricule}
                  </Badge>
                  <Badge bg={isIN ? 'success' : 'danger'}>
                    {isIN ? '↓ Entrée' : '↑ Sortie'}
                  </Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
      </Col>
    </Row>
  );
}

AttendanceScanner.propTypes = {
  records: PropTypes.array.isRequired,
  onScan:  PropTypes.func.isRequired,
};
