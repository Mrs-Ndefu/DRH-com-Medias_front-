import PropTypes from 'prop-types';
import { useState } from 'react';

// react-bootstrap
import ListGroup from 'react-bootstrap/ListGroup';

// project-imports
import NavItem from './NavItem';
import NavGroup from './NavGroup';
import { MenuOrientation } from 'config';
import menuItems from 'menu-items';
import useConfig from 'hooks/useConfig';
import { useAuth } from 'contexts/AuthContext';

// ==============================|| NAVIGATION ||============================== //

function filterByRole(items, userRole) {
  return items
    .filter(item => !item.roles || item.roles.includes(userRole))
    .map(item => {
      if (!item.children) return item;
      const filtered = filterByRole(item.children, userRole);
      return { ...item, children: filtered };
    })
    .filter(item => !item.children || item.children.length > 0);
}

export default function Navigation({ selectedItems, setSelectedItems, setSelectTab }) {
  const [selectedID, setSelectedID] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const { menuOrientation } = useConfig();
  const { user } = useAuth();

  const userRole = user?.role || 'RH';
  const filteredItems = filterByRole(menuItems.items, userRole);

  const lastItem = null;
  let lastItemIndex = filteredItems.length - 1;
  let remItems = [];
  let lastItemId;

  if (lastItem && lastItem < filteredItems.length) {
    lastItemId = filteredItems[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = filteredItems.slice(lastItem - 1, filteredItems.length).map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && { url: item.url })
    }));
  }

  const navGroups = filteredItems.slice(0, lastItemIndex + 1).map((item, index) => {
    switch (item.type) {
      case 'group':
        if (item.url && item.id !== lastItemId) {
          return (
            <>
              <ListGroup.Item key={index}>
                <NavItem item={item} level={1} isParents />
              </ListGroup.Item>
            </>
          );
        }

        return (
          <NavGroup
            key={item.id}
            setSelectedID={setSelectedID}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedID={selectedID}
            selectedItems={selectedItems}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
            item={item}
            setSelectTab={setSelectTab ?? (() => {})}
          />
        );
      default:
        return (
          <h6 key={item.id} color="error" className="align-items-center">
            Fix - Navigation Group
          </h6>
        );
    }
  });

  return (
    <ul className={`pc-navbar 'd-block'  ${menuOrientation === MenuOrientation.TAB ? 'pc-tab-link nav flex-column' : ''}`}>{navGroups}</ul>
  );
}

Navigation.propTypes = {
  selectedItems: PropTypes.any,
  setSelectedItems: PropTypes.oneOfType([PropTypes.func, PropTypes.any]),
  setSelectTab: PropTypes.oneOfType([PropTypes.func, PropTypes.any])
};
