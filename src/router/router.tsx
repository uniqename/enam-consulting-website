import { createBrowserRouter } from 'react-router/dom';
import { useParams } from 'react-router/dom';
import { useEffect } from 'react';

// Layouts
import MainLayout from '@/components/layout/MainLayout';

// Pages
import LandingPage from '@/pages/landing/Landing';
import BookingPage from '@/pages/booking/Booking';
import ClientManagement from '@/pages/tools/ClientManagement';
import PipelineAnalytics from '@/pages/tools/PipelineAnalytics';
import EmailManagement from '@/pages/tools/EmailManagement';
import ApplicantTracking from '@/pages/tools/ApplicantTracking';
import Careers from '@/pages/hire/Careers';
import JobApplication from '@/pages/hire/JobApplication';

const AppDeleteRedirect = () => {
  const { appName } = useParams();
  useEffect(() => {
    if (appName) {
      window.location.href = `/${appName}/account/delete.html`;
    }
  }, [appName]);
  return null;
};

const AppPrivacyRedirect = () => {
  const { appName } = useParams();
  useEffect(() => {
    if (appName) {
      window.location.href = `/${appName}/privacy-policy.html`;
    }
  }, [appName]);
  return null;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'booking',
        element: <BookingPage />,
      },
      {
        path: 'doxa/admin/clients',
        element: <ClientManagement />,
      },
      {
        path: 'tools/pipeline-analytics',
        element: <PipelineAnalytics />,
      },
      {
        path: 'tools/email-subscribers',
        element: <EmailManagement />,
      },
      {
        path: 'tools/applicants',
        element: <ApplicantTracking />,
      },
      {
        path: 'hire/careers',
        element: <Careers />,
      },
      {
        path: 'hire/apply/:jobId',
        element: <JobApplication />,
      },
      {
        path: 'delete/:appName',
        element: <AppDeleteRedirect />,
      },
      {
        path: 'privacy/:appName',
        element: <AppPrivacyRedirect />,
      },
    ],
  },
]);
