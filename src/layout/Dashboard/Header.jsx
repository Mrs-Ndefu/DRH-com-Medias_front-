import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSWR, { mutate } from 'swr';

// react-bootstrap
import Badge    from 'react-bootstrap/Badge';
import Button   from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Form     from 'react-bootstrap/Form';
import Image    from 'react-bootstrap/Image';
import Nav      from 'react-bootstrap/Nav';
import Stack    from 'react-bootstrap/Stack';

// project-imports
import MainCard from 'components/MainCard';
import SimpleBarScroll from 'components/third-party/SimpleBar';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import useConfig from 'hooks/useConfig';
import { setResolvedTheme } from 'components/setResolvedTheme';
import { ThemeMode } from 'config';
import { useAuth } from 'contexts/AuthContext';
import { fetcher, api } from 'api/client';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

const NOTIF_ICONS = {
  CONGE:       { icon: 'ph-calendar-check', bg: '#fff3cd', color: '#856404' },
  UTILISATEUR: { icon: 'ph-user-plus',      bg: '#d1e7dd', color: '#0a6640' },
  SYSTEM:      { icon: 'ph-info',           bg: '#cff4fc', color: '#0a6880' },
};

const fmtRelative = (d) => {
  const diff = Math.floor((Date.now() - new Date(d)) / 1000);
  if (diff < 60)      return 'À l\'instant';
  if (diff < 3600)    return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400)   return `Il y a ${Math.floor(diff / 3600)} h`;
  return new Date(d).toLocaleDateString('fr-FR');
};

// =============================|| MAIN LAYOUT - HEADER ||============================== //

export default function Header() {
  const { i18n, onChangeLocalization, onChangeMode, mode } = useConfig();
  const { user, logout } = useAuth();

  useEffect(() => { setResolvedTheme(mode); }, [mode]);

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;

  // ── Notifications ──
  const { data: notifData, mutate: refreshNotifs } = useSWR(
    user ? '/notifications' : null,
    fetcher,
    { refreshInterval: 30000 }
  );
  const notifications = notifData?.data || [];
  const nonLues       = notifData?.non_lues || 0;

  const marquerLu = async (id) => {
    await api.patch(`/notifications/${id}/lire`, {});
    refreshNotifs();
  };

  const marquerToutLu = async () => {
    await api.patch('/notifications/lire-tout', {});
    refreshNotifs();
  };

  return (
    <header className="pc-header">
      <div className="header-wrapper">
        {/* ── Gauche ── */}
        <div className="me-auto pc-mob-drp">
          <Nav className="list-unstyled">
            <Nav.Item className="pc-h-item pc-sidebar-collapse">
              <Nav.Link as={Link} to="#" className="pc-head-link ms-0" id="sidebar-hide"
                onClick={() => handlerDrawerOpen(!drawerOpen)}>
                <i className="ph ph-list" />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="pc-h-item pc-sidebar-popup">
              <Nav.Link as={Link} to="#" className="pc-head-link ms-0" id="mobile-collapse"
                onClick={() => handlerDrawerOpen(!drawerOpen)}>
                <i className="ph ph-list" />
              </Nav.Link>
            </Nav.Item>
            <Dropdown className="pc-h-item dropdown">
              <Dropdown.Toggle variant="link" className="pc-head-link arrow-none m-0 trig-drp-search" id="dropdown-search">
                <i className="ph ph-magnifying-glass" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="pc-h-dropdown drp-search">
                <Form className="px-3 py-2">
                  <Form.Control type="search" placeholder="Rechercher…" className="border-0 shadow-none" />
                </Form>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>

        {/* ── Droite ── */}
        <div className="ms-auto">
          <Nav className="list-unstyled">

            {/* Thème */}
            <Dropdown className="pc-h-item" align="end">
              <Dropdown.Toggle className="pc-head-link me-0 arrow-none" variant="link">
                <i className="ph ph-sun-dim" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="pc-h-dropdown">
                <Dropdown.Item onClick={() => onChangeMode(ThemeMode.DARK)}>  <i className="ph ph-moon me-2" />Sombre</Dropdown.Item>
                <Dropdown.Item onClick={() => onChangeMode(ThemeMode.LIGHT)}> <i className="ph ph-sun me-2" />Clair</Dropdown.Item>
                <Dropdown.Item onClick={() => onChangeMode(ThemeMode.AUTO)}>  <i className="ph ph-cpu me-2" />Auto</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Langue */}
            <Dropdown className="pc-h-item d-none d-md-inline-flex" align="end">
              <Dropdown.Toggle className="pc-head-link head-link-primary me-0 arrow-none" variant="link">
                <i className="ph ph-translate" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="pc-h-dropdown lng-dropdown">
                <Dropdown.Item active={i18n === 'en'} onClick={() => onChangeLocalization('en')}>English <small>(UK)</small></Dropdown.Item>
                <Dropdown.Item active={i18n === 'fr'} onClick={() => onChangeLocalization('fr')}>Français <small>(French)</small></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* ── Cloche notifications ── */}
            <Dropdown className="pc-h-item" align="end">
              <Dropdown.Toggle className="pc-head-link me-0 arrow-none position-relative" variant="link">
                <i className="ph ph-bell" />
                {nonLues > 0 && (
                  <Badge
                    bg="danger"
                    pill
                    style={{
                      position: 'absolute', top: 4, right: 4,
                      fontSize: 9, minWidth: 16, lineHeight: '16px',
                      padding: '0 4px',
                    }}
                  >
                    {nonLues > 99 ? '99+' : nonLues}
                  </Badge>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu className="pc-h-dropdown p-0 overflow-hidden" style={{ width: 380, maxWidth: '95vw', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                {/* En-tête */}
                <div style={{ background: 'linear-gradient(135deg, #1a2340 0%, #243060 100%)', padding: '14px 16px' }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="ph ph-bell" style={{ color: '#fff', fontSize: 16 }} />
                      </div>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1 }}>Notifications</div>
                        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 2 }}>
                          {nonLues > 0 ? `${nonLues} non lue${nonLues > 1 ? 's' : ''}` : 'Tout est lu'}
                        </div>
                      </div>
                    </div>
                    {nonLues > 0 && (
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 11, border: 'none', borderRadius: 6, padding: '4px 10px' }}
                        onClick={marquerToutLu}
                      >
                        <i className="ph ph-checks me-1" />Tout lire
                      </button>
                    )}
                  </div>
                </div>

                {/* Liste */}
                <div style={{ maxHeight: 380, overflowY: 'auto', background: '#f8f9fa' }}>
                  {notifications.length === 0 ? (
                    <div className="text-center py-5 text-muted" style={{ background: '#fff' }}>
                      <i className="ph ph-bell-slash d-block mb-2" style={{ fontSize: 36, color: '#ccc' }} />
                      <div style={{ fontSize: 13, color: '#999' }}>Aucune notification</div>
                    </div>
                  ) : (
                    notifications.map((n, idx) => {
                      const icon = NOTIF_ICONS[n.type] || NOTIF_ICONS.SYSTEM;
                      return (
                        <div
                          key={n.id}
                          style={{
                            display: 'flex', gap: 12, padding: '12px 16px',
                            background: !n.lu ? '#fff' : 'transparent',
                            borderBottom: idx < notifications.length - 1 ? '1px solid #eef0f3' : 'none',
                            cursor: n.lu ? 'default' : 'pointer',
                            transition: 'background 0.15s',
                          }}
                          onClick={() => !n.lu && marquerLu(n.id)}
                          onMouseEnter={e => { if (!n.lu) e.currentTarget.style.background = '#f0f7ff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = !n.lu ? '#fff' : 'transparent'; }}
                        >
                          <div style={{
                            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                            background: icon.bg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <i className={`ph ${icon.icon}`} style={{ fontSize: 18, color: icon.color }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="d-flex align-items-start justify-content-between gap-1">
                              <span style={{ fontSize: 13, fontWeight: !n.lu ? 600 : 400, color: !n.lu ? '#1a2340' : '#6c757d', lineHeight: 1.3 }}>
                                {n.titre}
                              </span>
                              {!n.lu && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1a2340', flexShrink: 0, marginTop: 4 }} />}
                            </div>
                            <p style={{ fontSize: 11.5, color: '#6c757d', margin: '3px 0 4px', lineHeight: 1.4 }}>
                              {n.message}
                            </p>
                            <div style={{ fontSize: 10.5, color: '#adb5bd' }}>
                              <i className="ph ph-clock me-1" />{fmtRelative(n.created_at)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {notifications.length > 0 && (
                  <div style={{ padding: '10px 16px', background: '#fff', borderTop: '1px solid #eef0f3', textAlign: 'center' }}>
                    <span style={{ fontSize: 11.5, color: '#adb5bd' }}>
                      {notifications.length} notification{notifications.length > 1 ? 's' : ''} au total
                    </span>
                  </div>
                )}
              </Dropdown.Menu>
            </Dropdown>

            {/* Profil */}
            <Dropdown className="pc-h-item" align="end">
              <Dropdown.Toggle className="pc-head-link arrow-none me-0" variant="link">
                {user?.photo
                  ? <img src={`${API_BASE}${user.photo}`} alt="" className="rounded-circle" style={{ width: 32, height: 32, objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)' }} />
                  : <i className="ph ph-user-circle" />
                }
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-user-profile pc-h-dropdown p-0 overflow-hidden">
                <Dropdown.Header className="bg-primary">
                  <Stack direction="horizontal" gap={3} className="my-2">
                    <div className="flex-shrink-0">
                      {user?.photo
                        ? <Image src={`${API_BASE}${user.photo}`} alt="avatar" className="user-avatar wid-35" roundedCircle style={{ objectFit: 'cover', width: 35, height: 35 }} />
                        : <div className="rounded-circle d-inline-flex align-items-center justify-content-center bg-white bg-opacity-25 text-white fw-bold" style={{ width: 35, height: 35, fontSize: 14 }}>
                            {(user?.prenom?.[0] || '').toUpperCase()}{(user?.nom?.[0] || '').toUpperCase()}
                          </div>
                      }
                    </div>
                    <Stack gap={1}>
                      <h6 className="text-white mb-0">{user ? `${user.prenom} ${user.nom}` : 'Utilisateur'}</h6>
                      <span className="text-white text-opacity-75 small">{user?.email}</span>
                      {user?.role && (
                        <Badge bg="light" text="primary" style={{ fontSize: 9, width: 'fit-content' }}>{user.role}</Badge>
                      )}
                    </Stack>
                  </Stack>
                </Dropdown.Header>
                <div className="dropdown-body">
                  <div className="profile-notification-scroll position-relative" style={{ maxHeight: 'calc(100vh - 225px)' }}>
                    <div className="px-2 pt-2">
                      <Link to="/settings" className="btn btn-outline-primary w-100 mb-2 text-start btn-sm">
                        <i className="ph ph-gear align-middle me-2" />Mon profil &amp; Paramètres
                      </Link>
                    </div>
                    <div className="d-grid my-2 px-2">
                      <Button variant="danger" onClick={logout}>
                        <i className="ph ph-sign-out align-middle me-2" />
                        Se déconnecter
                      </Button>
                    </div>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>

          </Nav>
        </div>
      </div>
    </header>
  );
}
