import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

export default function LoginPage() {
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflowY: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e8f0fe 0%, #f0f2f5 100%)',
        padding: '24px 16px',
      }}
    >
      <div className="w-100" style={{ maxWidth: 420 }}>

        {/* En-tête institutionnel */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary mb-3 shadow"
            style={{ width: 64, height: 64 }}
          >
            <i className="ph ph-buildings text-white" style={{ fontSize: 32 }} />
          </div>
          <h5
            className="fw-bold mb-1 text-primary text-uppercase text-center"
            style={{ letterSpacing: '0.04em', lineHeight: 1.3 }}
          >
            MINISTÈRE DE LA COMMUNICATION<br />ET DES MÉDIAS
          </h5>
          <p className="text-muted small mb-0">Système d'Information des Ressources Humaines</p>
        </div>

        {/* Carte connexion */}
        <div className="bg-white rounded-4 shadow p-4">

          <h5 className="fw-semibold mb-4 text-center text-dark">
            <i className="ph ph-lock-key me-2 text-primary" />Connexion
          </h5>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-3">
              <i className="ph ph-warning-circle flex-shrink-0" />{error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Adresse email</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="ph ph-envelope text-muted" />
                </span>
                <input
                  type="email"
                  className="form-control border-start-0"
                  placeholder="prenom.nom@ministere.ml"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Mot de passe</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="ph ph-lock text-muted" />
                </span>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="form-control border-start-0 border-end-0"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary border-start-0"
                  onClick={() => setShowPwd((p) => !p)}
                  tabIndex={-1}
                >
                  <i className={`ph ${showPwd ? 'ph-eye-slash' : 'ph-eye'}`} />
                </button>
              </div>
            </div>

            {/* Espace entre champs et bouton */}
            <div className="mt-5">
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={loading}
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Connexion en cours…</>
                  : <><i className="ph ph-sign-in me-2" />Se connecter</>
                }
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-muted small mt-3">
          © {new Date().getFullYear()} Ministère de la Communication et des Médias (MCM)
        </p>
      </div>
    </div>
  );
}
