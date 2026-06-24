import { useRef, useState } from 'react';
import useSWR, { mutate } from 'swr';

import Badge   from 'react-bootstrap/Badge';
import Button  from 'react-bootstrap/Button';
import Col     from 'react-bootstrap/Col';
import Form    from 'react-bootstrap/Form';
import Modal   from 'react-bootstrap/Modal';
import Row     from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Table   from 'react-bootstrap/Table';

import MainCard from 'components/MainCard';
import { fetcher, api } from 'api/client';
import { useAuth } from 'contexts/AuthContext';

const USERS_KEY  = '/users';
const API_BASE   = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

const ROLE_LABELS = {
  ADMIN:      { label: 'Administrateur',     color: 'danger'    },
  DRH:        { label: 'Directeur RH',       color: 'primary'   },
  SUPER_USER: { label: 'Super Utilisateur',  color: 'warning'   },
  RH:         { label: 'Agent RH',           color: 'info'      },
  CHEF:       { label: 'Chef de service',    color: 'secondary' },
  SG:         { label: 'Secrétaire Général', color: 'success'   },
};

const ALL_ROLES = Object.keys(ROLE_LABELS);

function RoleBadge({ role }) {
  const r = ROLE_LABELS[role] || { label: role, color: 'secondary' };
  return <Badge bg={r.color}>{r.label}</Badge>;
}

function Avatar({ user, size = 34 }) {
  const src = user.photo ? `${API_BASE}${user.photo}` : null;
  if (src) {
    return (
      <img
        src={src}
        alt={`${user.prenom} ${user.nom}`}
        className="rounded-circle object-fit-cover"
        style={{ width: size, height: size, flexShrink: 0 }}
        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
      />
    );
  }
  return (
    <div
      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {(user.prenom?.[0] || '').toUpperCase()}{(user.nom?.[0] || '').toUpperCase()}
    </div>
  );
}

const BLANK_CREATE = { prenom: '', nom: '', email: '', role: 'RH' };

async function uploadPhoto(userId, file) {
  const token = localStorage.getItem('sirh_token');
  const fd = new FormData();
  fd.append('photo', file);
  const res = await fetch(
    `${API_BASE}/api/users/${userId}/photo`,
    { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: fd }
  );
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.message || 'Erreur upload photo');
  }
  return res.json();
}

export default function UsersList() {
  const { user: currentUser } = useAuth();
  const { data: raw, isLoading, error } = useSWR(USERS_KEY, fetcher);
  const users = raw?.data || [];

  const [editUser,     setEditUser]     = useState(null);
  const [editForm,     setEditForm]     = useState({ role: '', actif: true });
  const [delUser,      setDelUser]      = useState(null);
  const [showCreate,   setShowCreate]   = useState(false);
  const [createForm,   setCreateForm]   = useState(BLANK_CREATE);
  const [photoFile,    setPhotoFile]    = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving,       setSaving]       = useState(false);
  const [alert,        setAlert]        = useState(null);
  const [newUserPwd,   setNewUserPwd]   = useState(null); // { prenom, nom, email, motDePasse, emailEnvoye }
  const photoInputRef = useRef(null);

  const refresh = () => mutate(USERS_KEY);

  const openEdit = (u) => { setEditUser(u); setEditForm({ role: u.role, actif: u.actif }); };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await api.patch(`/users/${editUser.id}`, editForm);
      refresh(); setEditUser(null);
      setAlert({ type: 'success', msg: 'Utilisateur modifié.' });
    } catch (e) {
      setAlert({ type: 'danger', msg: e.message || 'Erreur.' });
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    setSaving(true);
    try {
      await api.delete(`/users/${delUser.id}`);
      refresh(); setDelUser(null);
      setAlert({ type: 'success', msg: 'Utilisateur supprimé.' });
    } catch (e) {
      setAlert({ type: 'danger', msg: e.message || 'Erreur.' });
    } finally { setSaving(false); }
  };

  const toggleActif = async (u) => {
    try {
      await api.patch(`/users/${u.id}`, { actif: !u.actif });
      refresh();
    } catch (e) {
      setAlert({ type: 'danger', msg: e.message || 'Erreur.' });
    }
  };

  const openCreate = () => {
    setCreateForm(BLANK_CREATE);
    setPhotoFile(null);
    setPhotoPreview(null);
    setShowCreate(true);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const submitCreate = async () => {
    if (!createForm.prenom || !createForm.nom || !createForm.email) {
      return setAlert({ type: 'danger', msg: 'Prénom, nom et email sont obligatoires.' });
    }
    setSaving(true);
    try {
      const res = await api.post('/auth/register', {
        prenom: createForm.prenom, nom: createForm.nom,
        email: createForm.email, role: createForm.role,
      });
      if (photoFile && res.user?.id) {
        await uploadPhoto(res.user.id, photoFile).catch(() => {});
      }
      refresh();
      setShowCreate(false);
      setNewUserPwd({
        prenom: createForm.prenom,
        nom: createForm.nom,
        email: createForm.email,
        motDePasse: res.motDePasse,
        emailEnvoye: res.emailEnvoye,
      });
    } catch (e) {
      setAlert({ type: 'danger', msg: e.message || 'Erreur lors de la création.' });
    } finally { setSaving(false); }
  };

  return (
    <Row>
      <Col xs={12}>
        <MainCard
          title={
            <div className="d-flex align-items-center justify-content-between w-100">
              <div className="d-flex align-items-center gap-3">
                <i className="ph ph-users-three f-24 text-primary" />
                <span>Gestion des utilisateurs</span>
                {isLoading && <Spinner animation="border" size="sm" variant="primary" />}
              </div>
              {currentUser?.role === 'ADMIN' && (
                <Button variant="primary" size="sm" onClick={openCreate}>
                  <i className="ph ph-user-plus me-2" />Créer un utilisateur
                </Button>
              )}
            </div>
          }
        >
          {alert && (
            <div className={`alert alert-${alert.type} d-flex align-items-center gap-2 py-2 mb-3`}>
              <i className={`ph ph-${alert.type === 'success' ? 'check-circle' : 'warning-circle'}`} />
              {alert.msg}
              <button className="btn-close ms-auto" style={{ fontSize: 12 }} onClick={() => setAlert(null)} />
            </div>
          )}

          {/* ── KPIs ── */}
          <Row className="g-3 mb-4">
            {[
              { label: 'Total utilisateurs', value: users.length,                                                    color: 'primary'   },
              { label: 'Actifs',             value: users.filter(u => u.actif).length,                               color: 'success'   },
              { label: 'Inactifs',           value: users.filter(u => !u.actif).length,                              color: 'secondary' },
              { label: 'Administrateurs',    value: users.filter(u => ['ADMIN','DRH'].includes(u.role)).length,      color: 'danger'    },
            ].map(k => (
              <Col key={k.label} xs={6} md={3}>
                <div className={`border border-${k.color} border-opacity-25 rounded p-3 bg-${k.color} bg-opacity-10 text-center`}>
                  <h4 className={`mb-0 text-${k.color}`}>{k.value}</h4>
                  <small className="text-muted">{k.label}</small>
                </div>
              </Col>
            ))}
          </Row>

          {error && <div className="alert alert-danger">Erreur chargement : {error.message}</div>}

          <Table hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th className="text-center">Statut</th>
                <th>Créé le</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ opacity: u.actif ? 1 : 0.55 }}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <Avatar user={u} size={36} />
                      <div>
                        <div className="fw-semibold small">{u.prenom} {u.nom}</div>
                        {u.id === currentUser?.id && (
                          <Badge bg="light" text="dark" style={{ fontSize: 10 }}>Vous</Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td><small className="text-muted">{u.email}</small></td>
                  <td><RoleBadge role={u.role} /></td>
                  <td className="text-center">
                    <Badge bg={u.actif ? 'success' : 'secondary'}>
                      {u.actif ? 'Actif' : 'Inactif'}
                    </Badge>
                  </td>
                  <td><small className="text-muted">{u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : '—'}</small></td>
                  <td className="text-center">
                    <div className="d-flex gap-1 justify-content-center">
                      <Button variant="outline-primary" size="sm" onClick={() => openEdit(u)} title="Modifier le rôle">
                        <i className="ph ph-pencil" />
                      </Button>
                      <Button
                        variant={u.actif ? 'outline-warning' : 'outline-success'} size="sm"
                        onClick={() => toggleActif(u)} disabled={u.id === currentUser?.id}
                        title={u.actif ? 'Désactiver' : 'Activer'}
                      >
                        <i className={`ph ph-${u.actif ? 'lock' : 'lock-open'}`} />
                      </Button>
                      <Button
                        variant="outline-danger" size="sm" onClick={() => setDelUser(u)}
                        disabled={u.id === currentUser?.id} title="Supprimer"
                      >
                        <i className="ph ph-trash" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && users.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    <i className="ph ph-users" style={{ fontSize: 32, opacity: 0.3 }} />
                    <p className="mt-2 mb-0">Aucun utilisateur</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </MainCard>
      </Col>

      {/* ── Modal modifier rôle ── */}
      <Modal show={!!editUser} onHide={() => setEditUser(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ph ph-pencil me-2 text-primary" />
            Modifier {editUser?.prenom} {editUser?.nom}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Rôle</Form.Label>
            <Form.Select value={editForm.role} onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))}>
              {ALL_ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]?.label || r}</option>)}
            </Form.Select>
            <Form.Text className="text-muted">
              {editForm.role === 'SUPER_USER' && 'Dashboard + Agents + Présences (lecture & écriture)'}
              {editForm.role === 'DRH'        && 'Tous les droits du système'}
              {editForm.role === 'SG'         && 'Lecture seule du tableau de bord'}
              {editForm.role === 'ADMIN'      && 'Administration complète du système'}
              {editForm.role === 'RH'         && 'Gestion RH : agents, congés, présences, recrutement'}
              {editForm.role === 'CHEF'       && 'Validation des congés et vue organisation'}
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Check type="switch" label="Compte actif" checked={editForm.actif}
              onChange={e => setEditForm(p => ({ ...p, actif: e.target.checked }))} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setEditUser(null)}>Annuler</Button>
          <Button variant="primary" size="sm" onClick={saveEdit} disabled={saving}>
            {saving ? <><Spinner size="sm" className="me-1" />Enregistrement…</> : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── Modal créer utilisateur ── */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="fs-6">
            <i className="ph ph-user-plus me-2" />Créer un compte utilisateur
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Zone photo */}
          <div className="text-center mb-4">
            <div
              className="mx-auto position-relative"
              style={{ width: 90, height: 90, cursor: 'pointer' }}
              onClick={() => photoInputRef.current?.click()}
              title="Cliquer pour choisir une photo"
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Aperçu"
                  className="rounded-circle object-fit-cover border border-2 border-primary shadow-sm"
                  style={{ width: 90, height: 90 }}
                />
              ) : (
                <div
                  className="rounded-circle bg-primary bg-opacity-10 border border-2 border-primary border-dashed d-flex flex-column align-items-center justify-content-center"
                  style={{ width: 90, height: 90 }}
                >
                  <i className="ph ph-camera text-primary" style={{ fontSize: 28 }} />
                  <span className="text-primary" style={{ fontSize: 10 }}>Photo</span>
                </div>
              )}
              <div
                className="position-absolute bottom-0 end-0 bg-primary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 26, height: 26 }}
              >
                <i className="ph ph-pencil-simple text-white" style={{ fontSize: 13 }} />
              </div>
            </div>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="d-none"
              onChange={handlePhotoSelect}
            />
            <p className="text-muted mt-1 mb-0" style={{ fontSize: 11 }}>
              JPG, PNG ou WEBP — max 5 Mo (optionnel)
            </p>
          </div>

          <Row className="g-3">
            <Col xs={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Prénom <span className="text-danger">*</span></Form.Label>
                <Form.Control size="sm" value={createForm.prenom}
                  onChange={e => setCreateForm(p => ({ ...p, prenom: e.target.value }))}
                  placeholder="Moussa" />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Nom <span className="text-danger">*</span></Form.Label>
                <Form.Control size="sm" value={createForm.nom}
                  onChange={e => setCreateForm(p => ({ ...p, nom: e.target.value }))}
                  placeholder="Diallo" />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Email <span className="text-danger">*</span></Form.Label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text"><i className="ph ph-envelope" /></span>
                  <Form.Control type="email" value={createForm.email}
                    onChange={e => setCreateForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="prenom.nom@ministere.ml" />
                </div>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Rôle</Form.Label>
                <Form.Select size="sm" value={createForm.role}
                  onChange={e => setCreateForm(p => ({ ...p, role: e.target.value }))}>
                  {ALL_ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]?.label || r}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <div className="alert alert-info py-2 small mb-0 d-flex align-items-center gap-2">
                <i className="ph ph-key flex-shrink-0" />
                Un mot de passe sécurisé sera généré automatiquement et envoyé à l'utilisateur par email.
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setShowCreate(false)}>Annuler</Button>
          <Button variant="primary" size="sm" onClick={submitCreate} disabled={saving}>
            {saving
              ? <><Spinner size="sm" className="me-1" />Création…</>
              : <><i className="ph ph-user-plus me-1" />Créer le compte</>}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── Modal identifiants générés ── */}
      <Modal show={!!newUserPwd} onHide={() => setNewUserPwd(null)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title className="fs-6">
            <i className="ph ph-check-circle me-2" />Compte créé avec succès
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">
            Le compte de <strong>{newUserPwd?.prenom} {newUserPwd?.nom}</strong> a été créé.
          </p>

          {newUserPwd?.emailEnvoye ? (
            <div className="alert alert-success d-flex align-items-center gap-2 py-2 small">
              <i className="ph ph-envelope-simple-check flex-shrink-0" />
              Email envoyé à <strong>{newUserPwd?.email}</strong> avec les identifiants.
            </div>
          ) : (
            <div className="alert alert-warning d-flex align-items-center gap-2 py-2 small">
              <i className="ph ph-warning flex-shrink-0" />
              Email non envoyé (SMTP non configuré). Communiquez ces identifiants manuellement.
            </div>
          )}

          <div className="bg-light border rounded p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">Email</small>
              <strong className="small">{newUserPwd?.email}</strong>
            </div>
            <hr className="my-2" />
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">Mot de passe</small>
              <div className="d-flex align-items-center gap-2">
                <code className="fs-5 text-primary fw-bold">{newUserPwd?.motDePasse}</code>
                <button
                  className="btn btn-outline-secondary btn-sm py-0 px-2"
                  title="Copier"
                  onClick={() => {
                    navigator.clipboard.writeText(newUserPwd?.motDePasse || '');
                  }}
                >
                  <i className="ph ph-copy" />
                </button>
              </div>
            </div>
          </div>
          <p className="text-muted mt-3 mb-0 small">
            <i className="ph ph-info me-1" />
            L'utilisateur pourra changer ce mot de passe depuis <strong>Paramètres → Mon profil</strong>.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setNewUserPwd(null)}>
            <i className="ph ph-check me-2" />Compris
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── Modal confirmer suppression ── */}
      <Modal show={!!delUser} onHide={() => setDelUser(null)} centered size="sm">
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title className="fs-6">
            <i className="ph ph-trash me-2" />Supprimer l'utilisateur
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Supprimer définitivement <strong>{delUser?.prenom} {delUser?.nom}</strong> ?
          Cette action est irréversible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setDelUser(null)}>Annuler</Button>
          <Button variant="danger" size="sm" onClick={confirmDelete} disabled={saving}>
            {saving ? <Spinner size="sm" /> : 'Supprimer'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
}
