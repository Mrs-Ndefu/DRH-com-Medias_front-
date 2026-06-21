import { createBrowserRouter } from 'react-router-dom';

// project-imports
import PagesRoutes from './PagesRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([PagesRoutes], {
  basename: import.meta.env.VITE_APP_BASE_NAME
});

export default router;
