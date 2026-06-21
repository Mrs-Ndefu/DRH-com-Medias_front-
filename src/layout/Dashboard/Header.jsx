import { useEffect } from 'react';
import { Link } from 'react-router-dom';

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Stack from 'react-bootstrap/Stack';

// project-imports
import MainCard from 'components/MainCard';
import SimpleBarScroll from 'components/third-party/SimpleBar';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import useConfig from 'hooks/useConfig';
import { setResolvedTheme } from 'components/setResolvedTheme';
import { ThemeMode } from 'config';

// assets
import Img2 from 'assets/images/user/avatar-2.png';

// =============================|| MAIN LAYOUT - HEADER ||============================== //

export default function Header() {
  const { i18n, onChangeLocalization, onChangeMode, mode } = useConfig();

  useEffect(() => {
    setResolvedTheme(mode);
  }, [mode]);

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;

  const handleListItemClick = (lang) => {
    onChangeLocalization(lang);
  };

  return (
    <header className="pc-header">
      <div className="header-wrapper">
        <div className="me-auto pc-mob-drp">
          <Nav className="list-unstyled">
            <Nav.Item className="pc-h-item pc-sidebar-collapse">
              <Nav.Link
                as={Link}
                to="#"
                className="pc-head-link ms-0"
                id="sidebar-hide"
                onClick={() => {
                  handlerDrawerOpen(!drawerOpen);
                }}
              >
                <i className="ph ph-list" />
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="pc-h-item pc-sidebar-popup">
              <Nav.Link as={Link} to="#" className="pc-head-link ms-0" id="mobile-collapse" onClick={() => handlerDrawerOpen(!drawerOpen)}>
                <i className="ph ph-list" />
              </Nav.Link>
            </Nav.Item>

            <Dropdown className="pc-h-item dropdown">
              <Dropdown.Toggle variant="link" className="pc-head-link arrow-none m-0 trig-drp-search" id="dropdown-search">
                <i className="ph ph-magnifying-glass" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="pc-h-dropdown drp-search">
                <Form className="px-3 py-2">
                  <Form.Control type="search" placeholder="Search here. . ." className="border-0 shadow-none" />
                </Form>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
        <div className="ms-auto">
          <Nav className="list-unstyled">
            <Dropdown className="pc-h-item" align="end">
              <Dropdown.Toggle className="pc-head-link me-0 arrow-none" variant="link" id="dropdown-basic">
                <i className="ph ph-sun-dim" />
              </Dropdown.Toggle>

              <Dropdown.Menu className="pc-h-dropdown">
                <Dropdown.Item onClick={() => onChangeMode(ThemeMode.DARK)}>
                  <i className="ph ph-moon" />
                  Dark
                </Dropdown.Item>

                <Dropdown.Item onClick={() => onChangeMode(ThemeMode.LIGHT)}>
                  <i className="ph ph-sun" />
                  Light
                </Dropdown.Item>
                <Dropdown.Item onClick={() => onChangeMode(ThemeMode.AUTO)}>
                  <i className="ph ph-cpu" />
                  Default
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="pc-h-item d-none d-md-inline-flex" align="end">
              <Dropdown.Toggle className="pc-head-link head-link-primary me-0 arrow-none" variant="link" id="language-dropdown">
                <i className="ph ph-translate" />
              </Dropdown.Toggle>

              <Dropdown.Menu className="pc-h-dropdown lng-dropdown">
                <Dropdown.Item active={i18n === 'en'} onClick={() => handleListItemClick('en')}>
                  <span>
                    English <small>(UK)</small>
                  </span>
                </Dropdown.Item>
                <Dropdown.Item active={i18n === 'fr'} onClick={() => handleListItemClick('fr')}>
                  <span>
                    français <small>(French)</small>
                  </span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="pc-h-item" align="end">
              <Dropdown.Toggle className="pc-head-link me-0 arrow-none" variant="link" id="settings-dropdown">
                <i className="ph ph-diamonds-four" />
              </Dropdown.Toggle>

              <Dropdown.Menu className="pc-h-dropdown">
                <Dropdown.Item>
                  <i className="ph ph-user"></i>
                  My Account
                </Dropdown.Item>
                <Dropdown.Item>
                  <i className="ph ph-gear" />
                  Settings
                </Dropdown.Item>
               
          
                <Dropdown.Item>
                  <i className="ph ph-power" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="pc-h-item" align="end">
              <Dropdown.Toggle className="pc-head-link me-0 arrow-none" variant="link" id="notification-dropdown">
                <i className="ph ph-bell" />
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-notification pc-h-dropdown">
                <Dropdown.Header>
                  <h5 className="m-0">Notifications</h5>
                </Dropdown.Header>
                <div className="text-center py-4 text-muted">
                  <i className="ph ph-bell-slash f-24 d-block mb-2" />
                  Aucune notification
                </div>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="pc-h-item" align="end">
              <Dropdown.Toggle
                className="pc-head-link arrow-none me-0"
                variant="link"
                id="user-profile-dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="ph ph-user-circle" />
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-user-profile pc-h-dropdown p-0 overflow-hidden">
                <Dropdown.Header className="bg-primary">
                  <Stack direction="horizontal" gap={3} className="my-2">
                    <div className="flex-shrink-0">
                      <Image src={Img2} alt="user-avatar" className="user-avatar wid-35" roundedCircle />
                    </div>
                    <Stack gap={1}>
                      <h6 className="text-white mb-0">Administrateur RH</h6>
                      <span className="text-white text-opacity-75">admin@rh.local</span>
                    </Stack>
                  </Stack>
                </Dropdown.Header>

                <div className="dropdown-body">
                  <div className="profile-notification-scroll position-relative" style={{ maxHeight: 'calc(100vh - 225px)' }}>
                    <Dropdown.Item as={Link} to="#" className="justify-content-start">
                      <i className="ph ph-gear me-2" />
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="#" className="justify-content-start">
                      <i className="ph ph-share-network me-2" />
                      Share
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="#" className="justify-content-start">
                      <i className="ph ph-lock-key me-2" />
                      Change Password
                    </Dropdown.Item>
                    <div className="d-grid my-2">
                      <Button>
                        <i className="ph ph-sign-out align-middle me-2" />
                        Logout
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
