import { Calendar, Check, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface GoogleAuthButtonProps {
  isConnected?: boolean;
  onConnect?: () => void;
  userEmail?: string;
}

export default function GoogleAuthButton({
  isConnected = false,
  onConnect,
  userEmail,
}: GoogleAuthButtonProps) {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>(
    isConnected ? 'connected' : 'idle'
  );
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Check for OAuth callback params
    const params = new URLSearchParams(window.location.search);
    if (params.get('calendar_connected') === 'true') {
      setStatus('connected');
      setErrorMessage('');
    } else if (params.get('calendar_error')) {
      setStatus('error');
      setErrorMessage(`Connection failed: ${params.get('calendar_error')}`);
    }
  }, []);

  const handleConnect = () => {
    setStatus('connecting');
    // Redirect to OAuth flow
    window.location.href = '/.netlify/functions/calendar-oauth-start';
  };

  if (status === 'connected') {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
        <Check size={18} className="text-green-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-900">Calendar Connected</p>
          {userEmail && <p className="text-xs text-green-700">{userEmail}</p>}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle size={18} className="text-red-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-900">Connection Failed</p>
          <p className="text-xs text-red-700">{errorMessage}</p>
        </div>
        <button
          onClick={handleConnect}
          className="text-xs font-medium text-red-600 hover:text-red-700 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={status === 'connecting'}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-stone-300 text-white font-medium rounded-lg transition-colors"
    >
      <Calendar size={16} />
      {status === 'connecting' ? 'Connecting...' : 'Connect Google Calendar'}
    </button>
  );
}
