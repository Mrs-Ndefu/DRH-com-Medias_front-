import { useRef, useState } from 'react';
import useSWR from 'swr';

import Badge   from 'react-bootstrap/Badge';
import Button  from 'react-bootstrap/Button';
import Col     from 'react-bootstrap/Col';
import Form    from 'react-bootstrap/Form';
import Row     from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import MainCard from 'components/MainCard';
import { fetcher, api } from 'api/client';
import { useAuth } from 'contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

const ROLE_LABELS = {
  ADMIN:      { label: 'Administrateur',     color: 'danger'    },
  DRH:        { label: 'Directeur RH',       color: 'primary'   },
  SUPER_USER: { label: 'Super Utilisateur',  color: 'warning'   },
  RH:         { label: 'Agent RH',           color: 'info'      },
  CHEF:       { label: 'Chef de service',    color: 'secondary' },
  SG:         { label: 'Secrétaire Général', color: 'success'   },
};

async function uploadSelfPhoto(file) {
  const token = localStorage.getItem('sirh_token');
  const fd = new FormData();
  fd.append('photo', file);
  const res = await fetch(`${API_BASE}/api/auth/me/photo`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Erreur upload photo');
  return data;
}

export default function ProfileSettings() {
  const { user: authUser, setUser } = useAuth();
  const { data: me, mutate: refreshMe } = useSWR('/auth/me', fetcher);

  const photoRef = useRef(null);
  const [preview,    setPreview]    = useState(null);
  const [uploading,  setUploading]  = useState(false);
  const [photoAlert, setPhotoAlert] = useState(null);

  const [pwdForm,   setPwdForm]   = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [showPwd,   setShowPwd]   = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdAlert,  setPwdAlert]  = useState(null);

  const userInfo = me || authUser || {};
  const photoSrc = preview || (userInfo.photo ? `${API_BASE}${userInfo.photo}` : null);
  const role     = ROLE_LABELS[userInfo.role] || { label: userInfo.role, color: 'secondary' };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    setPhotoAlert(null);
    try {
      const updated = await uploadSelfPhoto(file);
      setPreview(null);
      // Met à jour le contexte auth + localStorage pour persistance après refresh
      setUser(u => ({ ...u, photo: updated.photo }));
      refreshMe();
      setPhotoAlert({ type: 'success', msg: 'Photo mise à jour avec succès.' });
    } catch (err) {
      setPhotoAlert({ type: 'danger', msg: err.message });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleChangePwd = async (e) => {
    e.preventDefault();
    setPwdAlert(null);
    if (!pwdForm.currentPassword || !pwdForm.newPassword || !pwdForm.confirm) {
      return setPwdAlert({ type: 'danger', msg: 'Tous les champs sont obligatoires.' });
    }
    if (pwdForm.newPassword !== pwdForm.confirm) {
      return setPwdAlert({ type: 'danger', msg: 'Les nouveaux mots de passe ne correspondent pas.' });
    }
    if (pwdForm.newPassword.length < 6) {
      return setPwdAlert({ type: 'danger', msg: 'Le nouveau mot de passe doit faire au moins 6 caractères.' });
    }
    if (pwdForm.currentPassword === pwdForm.newPassword) {
      return setPwdAlert({ type: 'warning', msg: 'Le nouveau mot de passe doit être différent de l\'actuel.' });
    }
    setSavingPwd(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: pwdForm.currentPassword,
        newPassword:     pwdForm.newPassword,
      });
      setPwdForm({ currentPassword: '', newPassword: '', confirm: '' });
      setPwdAlert({ type: 'success', msg: 'Mot de passe modifié avec succès.' });
    } catch (err) {
      setPwdAlert({ type: 'danger', msg: err.message || 'Erreur.' });
    } finally { setSavingPwd(false); }
  };

  return (
    <Row className="g-4 justify-content-center">
      <Col xs={12} lg={4}>
        {/* ── Carte profil ── */}
        <MainCard>
          <div className="text-center py-2">
            {/* Avatar */}
            <div className="position-relative d-inline-block mb-3">
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt="Avatar"
                  className="rounded-circle object-fit-cover border border-3 border-primary shadow"
                  style={{ width: 110, height: 110 }}
                />
              ) : (
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow mx-auto"
                  style={{ width: 110, height: 110, fontSize: 38 }}
                >
                  {(userInfo.prenom?.[0] || '').toUpperCase()}
                  {(userInfo.nom?.[0] || '').toUpperCase()}
                </div>
              )}
              {uploading && (
                <div
                  className="position-absolute top-0 start-0 rounded-circle d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
                  style={{ width: 110, height: 110 }}
                >
                  <Spinner variant="light" size="sm" />
                </div>
              )}
              <button
                className="position-absolute bottom-0 end-0 btn btn-primary btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center shadow"
                style={{ width: 32, height: 32 }}
                onClick={() => photoRef.current?.click()}
                title="Changer la photo"
                disabled={uploading}
              >
                <i className="ph ph-camera" style={{ fontSize: 15 }} />
              </button>
              <input ref={photoRef} type="file" className="d-none"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange} />
            </div>

            <h5 className="fw-bold mb-1">{userInfo.prenom} {userInfo.nom}</h5>
            <p className="text-muted small mb-2">{userInfo.email}</p>
            <Badge bg={role.color}>{role.label}</Badge>

            {photoAlert && (
              <div className={`alert alert-${photoAlert.type} d-flex align-items-center gap-2 py-2 mt-3 text-start small`}>
                <i className={`ph ph-${photoAlert.type === 'success' ? 'check-circle' : 'warning-circle'} flex-shrink-0`} />
                {photoAlert.msg}
              </div>
            )}

            <p className="text-muted mt-3 mb-0" style={{ fontSize: 11 }}>
              <i className="ph ph-camera me-1" />
              Cliquez sur l'icône appareil photo pour changer votre photo<br/>
              JPG, PNG ou WEBP — max 5 Mo
            </p>
          </div>
        </MainCard>
      </Col>

      <Col xs={12} lg={8}>
        {/* ── Informations personnelles ── */}
        <MainCard title={<><i className="ph ph-user me-2 text-primary" />Informations personnelles</>} className="mb-4">
          <Row className="g-3">
            {[
              { label: 'Prénom',   value: userInfo.prenom, icon: 'ph-user'         },
              { label: 'Nom',      value: userInfo.nom,    icon: 'ph-user'         },
              { label: 'Email',    value: userInfo.email,  icon: 'ph-envelope'     },
              { label: 'Rôle',     value: role.label,      icon: 'ph-shield-check' },
            ].map(f => (
              <Col xs={12} sm={6} key={f.label}>
                <Form.Label className="small fw-semibold text-muted">{f.label}</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className={`ph ${f.icon} text-muted`} /></span>
                  <Form.Control value={f.value || ''} readOnly className="bg-light" />
                </div>
              </Col>
            ))}
          </Row>
          <p className="text-muted small mt-3 mb-0">
            <i className="ph ph-info me-1" />
            Pour modifier vos informations personnelles, contactez l'administrateur système.
          </p>
        </MainCard>

        {/* ── Changer le mot de passe ── */}
        <MainCard title={<><i className="ph ph-lock-key me-2 text-primary" />Changer le mot de passe</>}>
          {pwdAlert && (
            <div className={`alert alert-${pwdAlert.type} d-flex align-items-center gap-2 py-2 mb-3`}>
              <i className={`ph ph-${pwdAlert.type === 'success' ? 'check-circle' : pwdAlert.type === 'warning' ? 'warning' : 'warning-circle'} flex-shrink-0`} />
              {pwdAlert.msg}
              <button className="btn-close ms-auto" style={{ fontSize: 11 }} onClick={() => setPwdAlert(null)} />
            </div>
          )}

          <Form onSubmit={handleChangePwd}>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Mot de passe actuel <span className="text-danger">*</span></Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="ph ph-lock text-muted" /></span>
                    <Form.Control
                      type={showPwd ? 'text' : 'password'}
                      placeholder="Votre mot de passe actuel"
                      value={pwdForm.currentPassword}
                      onChange={e => setPwdForm(p => ({ ...p, currentPassword: e.target.value }))}
                    />
                    <button type="button" className="btn btn-outline-secondary"
                      onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                      <i className={`ph ${showPwd ? 'ph-eye-slash' : 'ph-eye'}`} />
                    </button>
                  </div>
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Nouveau mot de passe <span className="text-danger">*</span></Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="ph ph-lock-key text-muted" /></span>
                    <Form.Control
                      type={showPwd ? 'text' : 'password'}
                      placeholder="Min. 6 caractères"
                      value={pwdForm.newPassword}
                      onChange={e => setPwdForm(p => ({ ...p, newPassword: e.target.value }))}
                    />
                  </div>
                  {pwdForm.newPassword && (
                    <div className="mt-1">
                      {[
                        { ok: pwdForm.newPassword.length >= 6,             label: 'Au moins 6 caractères' },
                        { ok: /[A-Z]/.test(pwdForm.newPassword),           label: 'Une majuscule'         },
                        { ok: /[0-9!@#$%^&*]/.test(pwdForm.newPassword),  label: 'Un chiffre ou symbole' },
                      ].map(r => (
                        <div key={r.label} className={`small ${r.ok ? 'text-success' : 'text-muted'}`}>
                          <i className={`ph ${r.ok ? 'ph-check-circle' : 'ph-circle'} me-1`} />{r.label}
                        </div>
                      ))}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Confirmer le mot de passe <span className="text-danger">*</span></Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="ph ph-check text-muted" /></span>
                    <Form.Control
                      type={showPwd ? 'text' : 'password'}
                      placeholder="Répétez le nouveau mot de passe"
                      value={pwdForm.confirm}
                      onChange={e => setPwdForm(p => ({ ...p, confirm: e.target.value }))}
                      className={pwdForm.confirm ? (pwdForm.confirm === pwdForm.newPassword ? 'is-valid' : 'is-invalid') : ''}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Button type="submit" variant="primary" disabled={savingPwd}>
                  {savingPwd
                    ? <><Spinner size="sm" className="me-2" />Modification…</>
                    : <><i className="ph ph-floppy-disk me-2" />Enregistrer le nouveau mot de passe</>}
                </Button>
              </Col>
            </Row>
          </Form>
        </MainCard>
      </Col>
    </Row>
  );
}
