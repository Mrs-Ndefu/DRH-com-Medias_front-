import { Link } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

export default function UnauthorizedPage() {
  const { user } = useAuth();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <div className="text-center" style={{ maxWidth: 480, padding: '0 16px' }}>
        <div className="display-1 fw-bold text-danger mb-3">403</div>
        <h4 className="fw-bold mb-2">Accès refusé</h4>
        <p className="text-muted mb-4">
          Votre rôle <strong>{user?.role || ''}</strong> ne permet pas d'accéder à cette page.
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          <i className="ph ph-arrow-left me-2" />Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
