import { createBrowserRouter } from "react-router";
import MainLayout from "../components/layout/MainLayout";
import ClarityHubLayout from "../pages/clarityb/ClarityHubLayout";
import Landing from "../pages/landing/Landing";
import Booking from "../pages/booking/Booking";
import Casestudy from "../pages/casestudy/Casestudy";
import Portfolio from "../pages/projects/Project";
import Education from "../pages/education/Education";
import Hire from "../pages/hire/Hire";
import Tools from "../pages/tools/Tools";
import Privacy from "../pages/legal/Privacy";
import Terms from "../pages/legal/Terms";

// ClarityHub pages
import ClarityHubLanding from "../pages/clarityb/ClarityHubLanding";
import Assessment from "../pages/clarityb/Assessment";
import ClarityLogin from "../pages/clarityb/Login";
import PortalRoute from "../pages/clarityb/PortalRoute";
import Dashboard from "../pages/clarityb/portal/Dashboard";
import Assessments from "../pages/clarityb/portal/Assessments";
import Projects from "../pages/clarityb/portal/Projects";
import Documents from "../pages/clarityb/portal/Documents";
import KPIs from "../pages/clarityb/portal/KPIs";
import Team from "../pages/clarityb/portal/Team";
import StrategicPlan from "../pages/clarityb/portal/StrategicPlan";
import AdminPortal from "../pages/clarityb/admin/AdminPortal";

// DoxaOS Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Callback from "../pages/auth/Callback";

// DoxaOS Portal pages
import PortalLayout from "../pages/portal/PortalLayout";
import PortalDashboard from "../pages/portal/Dashboard";
import Health from "../pages/portal/Health";
import PortalKPIs from "../pages/portal/KPIs";
import SOPs from "../pages/portal/SOPs";
import GRC from "../pages/portal/GRC";
import PortalProjects from "../pages/portal/Projects";
import Strategy from "../pages/portal/Strategy";
import CRM from "../pages/portal/CRM";
import Settings from "../pages/portal/Settings";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        path: '/',
        element: <Landing />,
      },
      {
        path: '/home',
        element: <Landing />,
      },
      {
        path: 'booking',
        element: <Booking />,
      },
      {
        path: "projects",
        element: <Portfolio />
      },
      {
        path: "education",
        element: <Education />
      },
      {
        path: 'work/:slug',
        element: <Casestudy />,
      },
      {
        path: 'hire',
        element: <Hire />,
      },
      {
        path: 'tools',
        element: <Tools />,
      },
      {
        path: 'privacy',
        element: <Privacy />,
      },
      {
        path: 'terms',
        element: <Terms />,
      },
    ],
  },
  // DoxaOS Auth Routes
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'callback',
        element: <Callback />,
      },
    ],
  },
  // DoxaOS Portal Routes
  {
    path: 'portal',
    element: <PortalLayout />,
    children: [
      {
        index: true,
        element: <PortalDashboard />,
        path: 'dashboard',
      },
      {
        path: 'health',
        element: <Health />,
      },
      {
        path: 'kpis',
        element: <PortalKPIs />,
      },
      {
        path: 'sops',
        element: <SOPs />,
      },
      {
        path: 'grc',
        element: <GRC />,
      },
      {
        path: 'projects',
        element: <PortalProjects />,
      },
      {
        path: 'strategy',
        element: <Strategy />,
      },
      {
        path: 'crm',
        element: <CRM />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: 'clarityb',
    element: <ClarityHubLayout />,
    children: [
      {
        index: true,
        element: <ClarityHubLanding />,
      },
      {
        path: 'assessment',
        element: <Assessment />,
      },
      {
        path: 'login',
        element: <ClarityLogin />,
      },
      {
        path: 'portal',
        element: <PortalRoute />,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'assessments',
            element: <Assessments />,
          },
          {
            path: 'projects',
            element: <Projects />,
          },
          {
            path: 'documents',
            element: <Documents />,
          },
          {
            path: 'kpis',
            element: <KPIs />,
          },
          {
            path: 'team',
            element: <Team />,
          },
          {
            path: 'strategic-plan',
            element: <StrategicPlan />,
          },
        ],
      },
      {
        path: 'admin',
        element: <AdminPortal />,
      },
    ],
  },
]);