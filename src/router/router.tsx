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