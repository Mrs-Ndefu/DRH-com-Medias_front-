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

// assets
import Img2 from 'assets/images/user/avatar-2.png';

const NOTIF_ICONS = {
  CONGE:       { icon: 'ph-calendar-check', color: 'warning' },
  UTILISATEUR: { icon: 'ph-user-plus',      color: 'primary' },
  SYSTEM:      { icon: 'ph-info',           color: 'info'    },
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

              <Dropdown.Menu className="pc-h-dropdown" style={{ width: 360, maxWidth: '95vw' }}>
                {/* En-tête */}
                <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
                  <h6 className="mb-0 fw-bold">
                    <i className="ph ph-bell me-2 text-primary" />
                    Notifications
                    {nonLues > 0 && <Badge bg="danger" pill className="ms-2" style={{ fontSize: 10 }}>{nonLues}</Badge>}
                  </h6>
                  {nonLues > 0 && (
                    <button className="btn btn-link btn-sm p-0 text-primary small" onClick={marquerToutLu}>
                      Tout marquer lu
                    </button>
                  )}
                </div>

                {/* Liste */}
                <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <i className="ph ph-bell-slash f-32 d-block mb-2" />
                      <small>Aucune notification</small>
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const icon = NOTIF_ICONS[n.type] || NOTIF_ICONS.SYSTEM;
                      return (
                        <div
                          key={n.id}
                          className={`d-flex gap-3 px-3 py-2 border-bottom ${!n.lu ? 'bg-primary bg-opacity-5' : ''}`}
                          style={{ cursor: n.lu ? 'default' : 'pointer' }}
                          onClick={() => !n.lu && marquerLu(n.id)}
                        >
                          <div className={`bg-${icon.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0`}
                            style={{ width: 36, height: 36 }}>
                            <i className={`ph ${icon.icon} text-${icon.color}`} />
                          </div>
                          <div className="flex-grow-1 overflow-hidden">
                            <div className="d-flex align-items-start justify-content-between gap-1">
                              <span className={`small ${!n.lu ? 'fw-semibold text-dark' : 'text-muted'}`} style={{ lineHeight: 1.3 }}>
                                {n.titre}
                              </span>
                              {!n.lu && <span className="flex-shrink-0 bg-primary rounded-circle" style={{ width: 7, height: 7, marginTop: 4 }} />}
                            </div>
                            <p className="text-muted mb-0" style={{ fontSize: 11, lineHeight: 1.4 }}>
                              {n.message}
                            </p>
                            <small className="text-muted" style={{ fontSize: 10 }}>
                              <i className="ph ph-clock me-1" />{fmtRelative(n.created_at)}
                            </small>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="text-center py-2 border-top">
                    <small className="text-muted">{notifications.length} notification{notifications.length > 1 ? 's' : ''} au total</small>
                  </div>
                )}
              </Dropdown.Menu>
            </Dropdown>

            {/* Profil */}
            <Dropdown className="pc-h-item" align="end">
              <Dropdown.Toggle className="pc-head-link arrow-none me-0" variant="link">
                <i className="ph ph-user-circle" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-user-profile pc-h-dropdown p-0 overflow-hidden">
                <Dropdown.Header className="bg-primary">
                  <Stack direction="horizontal" gap={3} className="my-2">
                    <div className="flex-shrink-0">
                      <Image src={Img2} alt="avatar" className="user-avatar wid-35" roundedCircle />
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
