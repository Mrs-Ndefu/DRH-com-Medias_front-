import { Link } from 'react-router-dom';

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

// project-imports
import MainCard from 'components/MainCard';

// ==============================|| LISTE DES EMPLOYÉS ||============================== //

export default function EmployeeList() {
  return (
    <Row>
      <Col xs={12}>
        <MainCard
          title="Liste des employés"
          secondary={
            <Button as={Link} to="/employees/add" size="sm">
              <i className="ph ph-plus me-2" />
              Ajouter un employé
            </Button>
          }
        >
          <Table hover responsive>
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Nom & Prénom</th>
                <th>Poste</th>
                <th>Département</th>
                <th>Date d'embauche</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="text-center text-muted py-5">
                  <i className="ph ph-users f-36 d-block mb-2" />
                  Aucun employé enregistré.{' '}
                  <Link to="/employees/add">Ajouter le premier employé</Link>
                </td>
              </tr>
            </tbody>
          </Table>
        </MainCard>
      </Col>
    </Row>
  );
}
