import { createBrowserRouter } from "react-router";
import MainLayout from "../components/layout/MainLayout";
import Landing from "../pages/landing/Landing";
import Booking from "../pages/booking/Booking";
import Casestudy from "../pages/casestudy/Casestudy";
import Portfolio from "../pages/projects/Project";
import Education from "../pages/education/Education";
import Hire from "../pages/hire/Hire";
import Tools from "../pages/tools/Tools";
import Privacy from "../pages/legal/Privacy";
import Terms from "../pages/legal/Terms";




export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // Wraps everything
 
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
]);