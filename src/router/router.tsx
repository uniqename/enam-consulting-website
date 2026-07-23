import { createBrowserRouter, useParams } from 'react-router';
import { useEffect } from 'react';

// Layouts
import MainLayout from '@/components/layout/MainLayout';
import ErrorBoundary from '@/components/ErrorBoundary';

// Pages
import LandingPage from '@/pages/landing/Landing';
import BookingPage from '@/pages/booking/Booking';
import ClientManagement from '@/pages/tools/ClientManagement';
import PipelineAnalytics from '@/pages/tools/PipelineAnalytics';
import ApplicantTracking from '@/pages/tools/ApplicantTracking';
import Careers from '@/pages/hire/Careers';
import JobApplication from '@/pages/hire/JobApplication';
import Healthcheck from '@/pages/healthcheck/Healthcheck';
import Tools from '@/pages/tools/Tools';
import ClarityHub from '@/pages/clarityb/ClarityHub';
import ClarityHubLanding from '@/pages/clarityb/ClarityHubLanding';
import Assessment from '@/pages/clarityb/Assessment';

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
    path: '/tools',
    element: <Tools />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/clarityb',
    element: <ClarityHubLanding />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/clarityb/dashboard',
    element: <ClarityHub />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/clarityb/assessment',
    element: <Assessment />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/clarityb/assessment/:id',
    element: <Assessment />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
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
        path: 'healthcheck',
        element: <Healthcheck />,
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
  {
    path: '*',
    element: <ErrorBoundary />,
  },
]);
