// react-bootstrap
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

// project-imports
import MainCard from 'components/MainCard';

// ==============================|| DÉPARTEMENTS ||============================== //

export default function DepartmentsPage() {
  return (
    <Row>
      <Col xs={12}>
        <MainCard
          title="Départements"
          secondary={
            <Button size="sm">
              <i className="ph ph-plus me-2" />
              Nouveau département
            </Button>
          }
        >
          <Table hover responsive>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Responsable</th>
                <th>Effectif</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="text-center text-muted py-4">
                  <i className="ph ph-buildings f-24 d-block mb-2" />
                  Aucun département enregistré
                </td>
              </tr>
            </tbody>
          </Table>
        </MainCard>
      </Col>
    </Row>
  );
}
