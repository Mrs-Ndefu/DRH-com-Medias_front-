import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// react-bootstrap
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

// third-party
import { useIntl } from 'react-intl';

// project-imports
import { APP_DEFAULT_PATH } from 'config';
import navigation from 'menu-items';

// ==============================|| MAIN BREADCRUMB ||============================== //

export default function Breadcrumbs() {
  const location = useLocation();
  const intl = useIntl();

  const [main, setMain] = useState({});
  const [item, setItem] = useState({});

  const getCollapse = useCallback(
    (item) => {
      if (item.children) {
        item.children.forEach((collapse) => {
          if (collapse.type === 'collapse') {
            getCollapse(collapse);
          } else if (collapse.type === 'item') {
            // Comparer pathname sans query string
            const currentPath = location.pathname;
            const itemUrl = collapse.url ? collapse.url.split('?')[0] : '';
            if (currentPath === itemUrl || currentPath === collapse.url) {
              setMain((prev) => ({
                ...prev,
                type: 'collapse',
                title: typeof item.title === 'string' ? item.title : undefined
              }));
              setItem((prev) => ({
                ...prev,
                type: 'item',
                title: typeof collapse.title === 'string' ? collapse.title : undefined,
                breadcrumbs: collapse.breadcrumbs !== false
              }));
            }
          }
        });
      }
    },
    [location.pathname]
  );

  useEffect(() => {
    navigation.items.forEach((navItem) => {
      if (navItem.type === 'group') {
        getCollapse(navItem);
      }
    });
  }, [location.pathname, getCollapse]);

  // Traduit une clé de menu vers le français
  const t = (key) => {
    if (!key) return '';
    try {
      return intl.formatMessage({ id: key });
    } catch {
      return key;
    }
  };

  let mainContent;
  let itemContent;
  let breadcrumbContent;
  let title = '';

  if (main?.type === 'collapse') {
    mainContent = (
      <Breadcrumb.Item href="#">
        {t(main.title)}
      </Breadcrumb.Item>
    );
  }

  if (item?.type === 'item') {
    title = t(item.title);
    itemContent = (
      <Breadcrumb.Item href="#">
        {title}
      </Breadcrumb.Item>
    );

    if (item.breadcrumbs !== false) {
      breadcrumbContent = (
        <div className="page-header">
          <div className="page-block">
            <Row className="align-items-center">
              <Col md={12} className="page-header-title">
                <h5>{title}</h5>
              </Col>
              <Col md={12}>
                <Breadcrumb listProps={{ style: { marginBottom: 0 } }}>
                  <Breadcrumb.Item href={APP_DEFAULT_PATH}>Accueil</Breadcrumb.Item>
                  {mainContent}
                  {itemContent}
                </Breadcrumb>
              </Col>
            </Row>
          </div>
        </div>
      );
    } else {
      breadcrumbContent = null;
    }
  }

  return <>{breadcrumbContent}</>;
}
