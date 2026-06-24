import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { api } from 'api/client';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [mode, setMode] = useState('login');

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);

  const [reg, setReg] = useState({ prenom: '', nom: '', email: '', password: '', confirm: '', role: 'RH' });
  const setR = (k) => (e) => setReg((p) => ({ ...p, [k]: e.target.value }));

  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = (m) => { setMode(m); setError(''); setSuccess(''); };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Identifiants incorrects.');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (reg.password !== reg.confirm) return setError('Les mots de passe ne correspondent pas.');
    if (reg.password.length < 6)      return setError('Minimum 6 caractères.');
    setLoading(true);
    try {
      await api.post('/auth/register', { prenom: reg.prenom, nom: reg.nom, email: reg.email, password: reg.password, role: reg.role });
      setSuccess('Compte créé. Vous pouvez maintenant vous connecter.');
      setEmail(reg.email);
      reset('login');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création.');
    } finally { setLoading(false); }
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
        background: '#f0f2f5',
        padding: '24px 16px',
      }}
    >
      <div className="w-100" style={{ maxWidth: 420, padding: '0 16px' }}>

        {/* Logo / titre */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary mb-3"
            style={{ width: 56, height: 56 }}
          >
            <i className="ph ph-buildings text-white" style={{ fontSize: 28 }} />
          </div>
          <h4 className="fw-bold mb-0">SIRH — Mali</h4>
          <p className="text-muted small">Ministère de la Communication et des Médias</p>
        </div>

        {/* Carte */}
        <div className="bg-white rounded-3 shadow-sm p-4">

          {/* Titre onglet */}
          <h5 className="fw-semibold mb-4 text-center">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h5>

          {/* Alertes */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-3">
              <i className="ph ph-warning-circle flex-shrink-0" />{error}
            </div>
          )}
          {success && (
            <div className="alert alert-success d-flex align-items-center gap-2 py-2 small mb-3">
              <i className="ph ph-check-circle flex-shrink-0" />{success}
            </div>
          )}

          {/* ── Connexion ── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="prenom.nom@ministere.ml"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required autoFocus
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Mot de passe</label>
                <div className="input-group">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className="form-control border-end-0"
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

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Connexion…</>
                  : 'Se connecter'}
              </button>
            </form>
          )}

          {/* ── Créer un compte ── */}
          {mode === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="row g-2 mb-3">
                <div className="col">
                  <label className="form-label small fw-semibold">Prénom *</label>
                  <input className="form-control form-control-sm" value={reg.prenom} onChange={setR('prenom')} required />
                </div>
                <div className="col">
                  <label className="form-label small fw-semibold">Nom *</label>
                  <input className="form-control form-control-sm" value={reg.nom} onChange={setR('nom')} required />
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Email *</label>
                <input type="email" className="form-control form-control-sm" placeholder="prenom.nom@ministere.ml" value={reg.email} onChange={setR('email')} required />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Rôle</label>
                <select className="form-select form-select-sm" value={reg.role} onChange={setR('role')}>
                  <option value="RH">Agent RH</option>
                  <option value="CHEF">Chef de service</option>
                  <option value="DRH">Directeur RH (tous les droits)</option>
                  <option value="SUPER_USER">Super Utilisateur (Dashboard + Agents + Présences)</option>
                  <option value="SG">Secrétaire Général (lecture dashboard)</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Mot de passe *</label>
                <input type="password" className="form-control form-control-sm" placeholder="Min. 6 caractères" value={reg.password} onChange={setR('password')} required />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Confirmer *</label>
                <input type="password" className="form-control form-control-sm" placeholder="Répéter le mot de passe" value={reg.confirm} onChange={setR('confirm')} required />
              </div>

              <button type="submit" className="btn btn-success w-100" disabled={loading}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Création…</>
                  : 'Créer le compte'}
              </button>
            </form>
          )}

          {/* Switcher */}
          <hr className="my-3" />
          <p className="text-center text-muted small mb-0">
            {mode === 'login' ? (
              <>Pas de compte ?{' '}
                <button className="btn btn-link btn-sm p-0 text-primary" onClick={() => reset('register')}>
                  Créer un compte
                </button>
              </>
            ) : (
              <>Déjà un compte ?{' '}
                <button className="btn btn-link btn-sm p-0 text-primary" onClick={() => reset('login')}>
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-center text-muted small mt-3">
          v19.0.0 — © {new Date().getFullYear()} Ministère de la Communication et des Médias
        </p>
      </div>
    </div>
  );
}
