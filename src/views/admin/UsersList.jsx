import { useState } from 'react';
import useSWR, { mutate } from 'swr';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';

import MainCard from 'components/MainCard';
import { fetcher, api } from 'api/client';
import { useAuth } from 'contexts/AuthContext';

const USERS_KEY = '/users';

const ROLE_LABELS = {
  ADMIN:      { label: 'Administrateur',     color: 'danger'   },
  DRH:        { label: 'Directeur RH',       color: 'primary'  },
  SUPER_USER: { label: 'Super Utilisateur',  color: 'warning'  },
  RH:         { label: 'Agent RH',           color: 'info'     },
  CHEF:       { label: 'Chef de service',    color: 'secondary'},
  SG:         { label: 'Secrétaire Général', color: 'success'  },
};

const ALL_ROLES = Object.keys(ROLE_LABELS);

function RoleBadge({ role }) {
  const r = ROLE_LABELS[role] || { label: role, color: 'secondary' };
  return <Badge bg={r.color}>{r.label}</Badge>;
}

const BLANK_CREATE = { prenom: '', nom: '', email: '', role: 'RH', password: '', confirm: '' };

export default function UsersList() {
  const { user: currentUser } = useAuth();
  const { data: raw, isLoading, error } = useSWR(USERS_KEY, fetcher);
  const users = raw?.data || [];

  const [editUser,    setEditUser]    = useState(null);
  const [editForm,    setEditForm]    = useState({ role: '', actif: true });
  const [delUser,     setDelUser]     = useState(null);
  const [showCreate,  setShowCreate]  = useState(false);
  const [createForm,  setCreateForm]  = useState(BLANK_CREATE);
  const [showPwd,     setShowPwd]     = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [alert,       setAlert]       = useState(null);

  const refresh = () => mutate(USERS_KEY);

  const openEdit = (u) => {
    setEditUser(u);
    setEditForm({ role: u.role, actif: u.actif });
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await api.patch(`/users/${editUser.id}`, editForm);
      refresh();
      setEditUser(null);
      setAlert({ type: 'success', msg: 'Utilisateur modifié.' });
    } catch (e) {
      setAlert({ type: 'danger', msg: e.message || 'Erreur.' });
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    setSaving(true);
    try {
      await api.delete(`/users/${delUser.id}`);
      refresh();
      setDelUser(null);
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

  const openCreate = () => { setCreateForm(BLANK_CREATE); setShowPwd(false); setShowCreate(true); };

  const submitCreate = async () => {
    if (!createForm.prenom || !createForm.nom || !createForm.email || !createForm.password) {
      return setAlert({ type: 'danger', msg: 'Tous les champs sont obligatoires.' });
    }
    if (createForm.password !== createForm.confirm) {
      return setAlert({ type: 'danger', msg: 'Les mots de passe ne correspondent pas.' });
    }
    if (createForm.password.length < 6) {
      return setAlert({ type: 'danger', msg: 'Le mot de passe doit faire au moins 6 caractères.' });
    }
    setSaving(true);
    try {
      await api.post('/auth/register', {
        prenom:   createForm.prenom,
        nom:      createForm.nom,
        email:    createForm.email,
        role:     createForm.role,
        password: createForm.password,
      });
      refresh();
      setShowCreate(false);
      setAlert({ type: 'success', msg: `Compte créé pour ${createForm.prenom} ${createForm.nom}.` });
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
              { label: 'Total utilisateurs', value: users.length,                               color: 'primary' },
              { label: 'Actifs',             value: users.filter(u => u.actif).length,           color: 'success' },
              { label: 'Inactifs',           value: users.filter(u => !u.actif).length,          color: 'secondary'},
              { label: 'Administrateurs',    value: users.filter(u => ['ADMIN','DRH'].includes(u.role)).length, color: 'danger' },
            ].map(k => (
              <Col key={k.label} xs={6} md={3}>
                <div className={`border border-${k.color} border-opacity-25 rounded p-3 bg-${k.color} bg-opacity-10 text-center`}>
                  <h4 className={`mb-0 text-${k.color}`}>{k.value}</h4>
                  <small className="text-muted">{k.label}</small>
                </div>
              </Col>
            ))}
          </Row>

          {error && (
            <div className="alert alert-danger">Erreur chargement : {error.message}</div>
          )}

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
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                        style={{ width: 34, height: 34, fontSize: 13, flexShrink: 0 }}
                      >
                        {(u.prenom?.[0] || '').toUpperCase()}{(u.nom?.[0] || '').toUpperCase()}
                      </div>
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
                  <td>
                    <small className="text-muted">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : '—'}
                    </small>
                  </td>
                  <td className="text-center">
                    <div className="d-flex gap-1 justify-content-center">
                      <Button
                        variant="outline-primary" size="sm"
                        onClick={() => openEdit(u)}
                        title="Modifier le rôle"
                      >
                        <i className="ph ph-pencil" />
                      </Button>
                      <Button
                        variant={u.actif ? 'outline-warning' : 'outline-success'} size="sm"
                        onClick={() => toggleActif(u)}
                        disabled={u.id === currentUser?.id}
                        title={u.actif ? 'Désactiver' : 'Activer'}
                      >
                        <i className={`ph ph-${u.actif ? 'lock' : 'lock-open'}`} />
                      </Button>
                      <Button
                        variant="outline-danger" size="sm"
                        onClick={() => setDelUser(u)}
                        disabled={u.id === currentUser?.id}
                        title="Supprimer"
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
            <Form.Select
              value={editForm.role}
              onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))}
            >
              {ALL_ROLES.map(r => (
                <option key={r} value={r}>{ROLE_LABELS[r]?.label || r}</option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              {editForm.role === 'SUPER_USER' && 'Dashboard + Agents + Présences (lecture & écriture)'}
              {editForm.role === 'DRH' && 'Tous les droits du système'}
              {editForm.role === 'SG' && 'Lecture seule du tableau de bord'}
              {editForm.role === 'ADMIN' && 'Administration complète du système'}
              {editForm.role === 'RH' && 'Gestion RH : agents, congés, présences, recrutement'}
              {editForm.role === 'CHEF' && 'Validation des congés et vue organisation'}
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="switch"
              label="Compte actif"
              checked={editForm.actif}
              onChange={e => setEditForm(p => ({ ...p, actif: e.target.checked }))}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setEditUser(null)}>
            Annuler
          </Button>
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
                  {ALL_ROLES.map(r => (
                    <option key={r} value={r}>{ROLE_LABELS[r]?.label || r}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Mot de passe <span className="text-danger">*</span></Form.Label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text"><i className="ph ph-lock" /></span>
                  <Form.Control type={showPwd ? 'text' : 'password'} value={createForm.password}
                    onChange={e => setCreateForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Min. 6 caractères" />
                  <button type="button" className="btn btn-outline-secondary btn-sm"
                    onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                    <i className={`ph ${showPwd ? 'ph-eye-slash' : 'ph-eye'}`} />
                  </button>
                </div>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Confirmer le mot de passe <span className="text-danger">*</span></Form.Label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text"><i className="ph ph-lock-key" /></span>
                  <Form.Control type={showPwd ? 'text' : 'password'} value={createForm.confirm}
                    onChange={e => setCreateForm(p => ({ ...p, confirm: e.target.value }))}
                    placeholder="Répétez le mot de passe" />
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setShowCreate(false)}>
            Annuler
          </Button>
          <Button variant="primary" size="sm" onClick={submitCreate} disabled={saving}>
            {saving
              ? <><Spinner size="sm" className="me-1" />Création…</>
              : <><i className="ph ph-user-plus me-1" />Créer le compte</>}
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
          <Button variant="outline-secondary" size="sm" onClick={() => setDelUser(null)}>
            Annuler
          </Button>
          <Button variant="danger" size="sm" onClick={confirmDelete} disabled={saving}>
            {saving ? <Spinner size="sm" /> : 'Supprimer'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
}
