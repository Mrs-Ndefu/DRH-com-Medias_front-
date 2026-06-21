import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AuthLayout from 'layout/Auth';

// render - dashboard
const DashboardPage = Loadable(lazy(() => import('views/dashboard')));

// render - agents
const AgentsList    = Loadable(lazy(() => import('views/agents/AgentsList')));
const AgentCreate   = Loadable(lazy(() => import('views/agents/AgentCreate')));
const AgentEdit     = Loadable(lazy(() => import('views/agents/AgentEdit')));
const AgentDetails  = Loadable(lazy(() => import('views/agents/AgentDetails')));

// render - modules RH
const LeavesPage      = Loadable(lazy(() => import('views/leaves')));
const AttendancePage  = Loadable(lazy(() => import('views/attendance')));
const OrganisationPage = Loadable(lazy(() => import('views/organisation')));
const PayrollPage     = Loadable(lazy(() => import('views/payroll')));
const RecruitmentPage = Loadable(lazy(() => import('views/recruitment')));

// render - maintenance
const ErrorPage      = Loadable(lazy(() => import('views/maintenance/Error')));
const ComingSoonPage = Loadable(lazy(() => import('views/maintenance/ComingSoon')));
const OfflineUiPage  = Loadable(lazy(() => import('views/maintenance/OfflineUI')));

// ==============================|| ROUTING ||============================== //

const PagesRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: 'dashboard',  element: <DashboardPage /> },
        {
          path: 'agents',
          children: [
            { index: true,      element: <AgentsList />   },
            { path: 'create',   element: <AgentCreate />  },
            { path: ':id',      element: <AgentDetails /> },
            { path: ':id/edit', element: <AgentEdit />    }
          ]
        },
        { path: 'leaves',      element: <LeavesPage />      },
        { path: 'attendance',  element: <AttendancePage />  },
        { path: 'organisation', element: <OrganisationPage /> },
        { path: 'payroll',     element: <PayrollPage />     },
        { path: 'recruitment', element: <RecruitmentPage /> }
      ]
    },
    {
      element: <AuthLayout />,
      children: [
        {
          path: 'pages',
          children: [
            {
              path: 'maintenance',
              children: [
                { path: 'error',      element: <ErrorPage />      },
                { path: 'coming-soon', element: <ComingSoonPage /> },
                { path: 'offline-ui', element: <OfflineUiPage />  }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default PagesRoutes;
