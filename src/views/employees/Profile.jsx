// react-bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

// project-imports
import MainCard from 'components/MainCard';

// ==============================|| PROFIL EMPLOYÉ ||============================== //

export default function EmployeeProfile() {
  return (
    <Row className="g-3">
      <Col xl={4}>
        <MainCard>
          <div className="text-center py-3">
            <div
              className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: 80, height: 80 }}
            >
              <i className="ph ph-user f-36 text-secondary" />
            </div>
            <h5 className="mb-0">—</h5>
            <small className="text-muted">Poste</small>
          </div>
        </MainCard>
      </Col>
      <Col xl={8}>
        <Row className="g-3">
          <Col xs={12}>
            <MainCard title="Informations personnelles">
              <p className="text-muted mb-0">Sélectionnez un employé pour afficher son profil.</p>
            </MainCard>
          </Col>
          <Col xs={12}>
            <MainCard title="Contrat & Poste">
              <p className="text-muted mb-0">Sélectionnez un employé pour afficher son contrat.</p>
            </MainCard>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
