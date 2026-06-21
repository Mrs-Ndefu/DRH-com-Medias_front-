import { Outlet } from 'react-router-dom';

// project-imports
import Drawer from './Drawer';
import Footer from './Footer';
import Header from './Header';
import Breadcrumbs from 'components/Breadcrumbs';
import useConfig from 'hooks/useConfig';
import NavigationScroll from 'components/NavigationScroll';

// ==============================|| MAIN LAYOUT ||============================== //

export default function MainLayout() {
  const { themeDirection, customColor, mode, container } = useConfig();

  return (
    <div data-pc-preset={customColor} data-pc-direction={themeDirection} data-pc-theme={mode}>
      <Drawer />
      <Header />
      <div className="pc-container">
        <div className={`pc-content ${container && 'container'} `}>
          <Breadcrumbs />
          <NavigationScroll>
            <Outlet />
          </NavigationScroll>
        </div>
      </div>
      <Footer />
    </div>
  );
}
