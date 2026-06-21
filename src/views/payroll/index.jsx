// react-bootstrap
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

// project-imports
import MainCard from 'components/MainCard';

// ==============================|| PAIE ||============================== //

export default function PayrollPage() {
  return (
    <Row>
      <Col xs={12}>
        <MainCard
          title="Gestion de la paie"
          secondary={
            <Button size="sm">
              <i className="ph ph-paper-plane-tilt me-2" />
              Générer les bulletins
            </Button>
          }
        >
          <Table hover responsive>
            <thead>
              <tr>
                <th>Employé</th>
                <th>Période</th>
                <th>Salaire brut</th>
                <th>Cotisations</th>
                <th>Salaire net</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  <i className="ph ph-money f-24 d-block mb-2" />
                  Aucun bulletin de paie disponible
                </td>
              </tr>
            </tbody>
          </Table>
        </MainCard>
      </Col>
    </Row>
  );
}
