import { RouterProvider } from 'react-router-dom';

// project-imports
import router from 'routes';
import Locales from 'components/Locales';
import { AuthProvider } from 'contexts/AuthContext';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

function App() {
  return (
    <AuthProvider>
      <Locales>
        <RouterProvider router={router} />
      </Locales>
    </AuthProvider>
  );
}

export default App;
