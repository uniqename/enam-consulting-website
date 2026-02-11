import { createBrowserRouter } from "react-router";
import MainLayout from "../components/layout/MainLayout";
import Landing from "../pages/landing/Landing";
import Booking from "../pages/booking/Booking";
import Casestudy from "../pages/casestudy/Casestudy";
import Portfolio from "../pages/projects/Project";
import Education from "../pages/education/Education";




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
    ],
  },
]);