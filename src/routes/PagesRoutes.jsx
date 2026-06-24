import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AuthLayout from 'layout/Auth';
import ProtectedRoute, { RoleGuard } from 'components/ProtectedRoute';

// render - auth
const LoginPage = Loadable(lazy(() => import('views/auth/Login')));

// render - dashboard
const DashboardPage = Loadable(lazy(() => import('views/dashboard')));

// render - agents
const AgentsList    = Loadable(lazy(() => import('views/agents/AgentsList')));
const AgentCreate   = Loadable(lazy(() => import('views/agents/AgentCreate')));
const AgentEdit     = Loadable(lazy(() => import('views/agents/AgentEdit')));
const AgentDetails  = Loadable(lazy(() => import('views/agents/AgentDetails')));

// render - modules RH
const LeavesPage       = Loadable(lazy(() => import('views/leaves')));
const AttendancePage   = Loadable(lazy(() => import('views/attendance')));
const OrganisationPage = Loadable(lazy(() => import('views/organisation')));
const PayrollPage      = Loadable(lazy(() => import('views/payroll')));
const RecruitmentPage  = Loadable(lazy(() => import('views/recruitment')));

// render - admin
const UsersList    = Loadable(lazy(() => import('views/admin/UsersList')));
const ArchivesPage = Loadable(lazy(() => import('views/archives')));

// render - settings
const ProfileSettings = Loadable(lazy(() => import('views/settings/Profile')));

// render - maintenance
const ErrorPage        = Loadable(lazy(() => import('views/maintenance/Error')));
const ComingSoonPage   = Loadable(lazy(() => import('views/maintenance/ComingSoon')));
const OfflineUiPage    = Loadable(lazy(() => import('views/maintenance/OfflineUI')));
const UnauthorizedPage = Loadable(lazy(() => import('views/maintenance/Unauthorized')));

// ── Matrices d'accès par rôle ────────────────────────────────────────────────

// ADMIN + DRH : tous les droits
const FULL_ACCESS    = ['ADMIN', 'DRH'];

// Agents : ADMIN, DRH, RH
const AGENTS_ROLES   = ['ADMIN', 'DRH', 'RH'];

// Congés : ADMIN, DRH, RH, CHEF
const LEAVES_ROLES   = ['ADMIN', 'DRH', 'RH', 'CHEF'];

// Présences : ADMIN, DRH, SUPER_USER, RH
const PRES_ROLES     = ['ADMIN', 'DRH', 'SUPER_USER', 'RH'];

// Organisation : ADMIN, DRH, SG (lecture), RH, CHEF
const ORG_ROLES      = ['ADMIN', 'DRH', 'SG', 'RH', 'CHEF'];

// Paie : ADMIN, DRH, SG (lecture)
const PAY_ROLES      = ['ADMIN', 'DRH', 'SG'];

// Recrutement : ADMIN, DRH, RH
const REC_ROLES      = ['ADMIN', 'DRH', 'RH'];

// Admin utilisateurs : ADMIN uniquement
const ADMIN_ROLES    = ['ADMIN'];

// Archives : ADMIN, DRH, SUPER_USER
const ARCHIVES_ROLES = ['ADMIN', 'DRH', 'SUPER_USER'];

// ==============================|| ROUTING ||============================== //

const PagesRoutes = {
  path: '/',
  children: [
    { path: 'login',        element: <LoginPage /> },
    { path: 'unauthorized', element: <UnauthorizedPage /> },
    {
      path: '/',
      element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
      children: [
        { index: true,      element: <Navigate to="/dashboard" replace /> },
        { path: 'dashboard', element: <DashboardPage /> },
        {
          path: 'agents',
          children: [
            { index: true,      element: <RoleGuard roles={AGENTS_ROLES}><AgentsList /></RoleGuard>   },
            { path: 'create',   element: <RoleGuard roles={AGENTS_ROLES}><AgentCreate /></RoleGuard>  },
            { path: ':id',      element: <RoleGuard roles={AGENTS_ROLES}><AgentDetails /></RoleGuard> },
            { path: ':id/edit', element: <RoleGuard roles={AGENTS_ROLES}><AgentEdit /></RoleGuard>    }
          ]
        },
        { path: 'leaves',       element: <RoleGuard roles={LEAVES_ROLES}><LeavesPage /></RoleGuard>       },
        { path: 'attendance',   element: <RoleGuard roles={PRES_ROLES}><AttendancePage /></RoleGuard>      },
        { path: 'organisation', element: <RoleGuard roles={ORG_ROLES}><OrganisationPage /></RoleGuard>    },
        { path: 'payroll',      element: <RoleGuard roles={PAY_ROLES}><PayrollPage /></RoleGuard>           },
        { path: 'recruitment',  element: <RoleGuard roles={REC_ROLES}><RecruitmentPage /></RoleGuard>      },
        { path: 'admin/users',  element: <RoleGuard roles={ADMIN_ROLES}><UsersList /></RoleGuard>          },
        { path: 'archives',     element: <RoleGuard roles={ARCHIVES_ROLES}><ArchivesPage /></RoleGuard>    },
        { path: 'settings',     element: <ProfileSettings /> }
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
                { path: 'error',       element: <ErrorPage />      },
                { path: 'coming-soon', element: <ComingSoonPage /> },
                { path: 'offline-ui',  element: <OfflineUiPage />  }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default PagesRoutes;
