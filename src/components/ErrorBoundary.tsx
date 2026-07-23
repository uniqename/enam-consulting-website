import { useRouteError, isRouteErrorResponse } from 'react-router';
import { AlertCircle, Home, RotateCcw } from 'lucide-react';

export default function ErrorBoundary() {
  const error = useRouteError();
  const isRouteError = isRouteErrorResponse(error);

  const status = isRouteError ? error.status : 500;
  const statusText = isRouteError ? error.statusText : 'Error';
  const message = isRouteError ? error.data?.message : 'An unexpected error occurred';

  const errorMessages: Record<number, { title: string; description: string }> = {
    404: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist or has been moved.',
    },
    403: {
      title: 'Access Denied',
      description: 'You do not have permission to access this resource.',
    },
    500: {
      title: 'Something Went Wrong',
      description: 'We encountered an unexpected error. Please try again.',
    },
  };

  const errorInfo = errorMessages[status] || {
    title: statusText,
    description: message || 'An error occurred while processing your request.',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-stone-100 p-8 space-y-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={32} className="text-red-500" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">{status}</h1>
          <h2 className="text-xl font-semibold text-stone-700 mb-2">{errorInfo.title}</h2>
          <p className="text-stone-500 text-sm">{errorInfo.description}</p>
        </div>

        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
          <p className="text-xs text-stone-500 font-mono break-all">
            {isRouteError ? error.statusText : 'Internal Server Error'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold py-3 rounded-xl transition-all"
          >
            <Home size={16} /> Go Home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-stone-900 hover:bg-stone-50 text-stone-700 font-semibold py-3 rounded-xl transition-all"
          >
            <RotateCcw size={16} /> Retry
          </button>
        </div>
      </div>
    </div>
  );
}
