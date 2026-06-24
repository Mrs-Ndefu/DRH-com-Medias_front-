import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// react-bootstrap
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

// third-party
import { FormattedMessage } from 'react-intl';

// project-imports
import NavItem from './NavItem';
import useConfig from 'hooks/useConfig';
import { MenuOrientation, ThemeDirection } from 'config';

// ==============================|| NAVIGATION - COLLAPSE ||============================== //

export default function NavCollapse({ menu, level, parentId, setSelectedItems, selectedItems, setSelectedLevel, selectedLevel }) {
  const [open, setOpen] = useState(false);
  const { menuOrientation, themeDirection } = useConfig();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Auto-ouvrir si l'URL active correspond à un enfant
  useEffect(() => {
    if (menu.children) {
      const isActive = menu.children.some((child) => {
        if (!child.url) return false;
        const base = child.url.split('?')[0];
        return pathname === base || pathname.startsWith(base + '/');
      });
      if (isActive) setOpen(true);
    }
  }, [pathname, menu.children]);

  const handleClick = (e) => {
    e.preventDefault();
    setOpen((prev) => !prev);
    if (menu.url) navigate(menu.url);
  };

  const navCollapse = menu.children?.map((item) => {
    switch (item.type) {
      case 'collapse':
        return (
          <NavCollapse
            key={item.id}
            menu={item}
            level={level + 1}
            parentId={parentId}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
          />
        );
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />;
      default:
        return (
          <h6 key={item.id} color="error" className="align-center">
            Fix - Collapse or Item
          </h6>
        );
    }
  });

  // Le mode TAB est géré directement dans DrawerContent
  if (menuOrientation === MenuOrientation.TAB) return null;

  return (
    <ListGroup className={`pc-item pc-hasmenu${open ? ' pc-trigger' : ''}`}>
      <a className="pc-link" href="#!" onClick={handleClick}>
        {menu.icon && (
          <span className="pc-micon">
            <i className={typeof menu.icon === 'string' ? menu.icon : menu.icon?.props.className} />
          </span>
        )}
        <span className="pc-mtext">
          <FormattedMessage id={menu.title} />
        </span>
        <span className="pc-arrow">
          <i className="ti ti-chevron-right" />
        </span>
        {menu.badge && <Badge className="pc-badge">{menu.badge}</Badge>}
      </a>
      {open && (
        <ul className={`pc-submenu${themeDirection === ThemeDirection.RTL ? ' edge' : ''}`}>
          {navCollapse}
        </ul>
      )}
    </ListGroup>
  );
}

NavCollapse.propTypes = {
  menu: PropTypes.any,
  level: PropTypes.number,
  parentId: PropTypes.string,
  setSelectedItems: PropTypes.oneOfType([PropTypes.func, PropTypes.any]),
  selectedItems: PropTypes.any,
  setSelectedLevel: PropTypes.func,
  selectedLevel: PropTypes.number
};
