import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

export default function Setup() {
  const [step, setStep] = useState('start'); // start, checking, clearing, seeding, done, error
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const checkHealth = async () => {
    setStep('checking');
    setMessage('Checking MongoDB connection...');
    setError('');
    try {
      const res = await fetch('/api/public/health');
      const data = await res.json();
      if (data.ok) {
        setMessage('✅ MongoDB is connected!');
        await new Promise(r => setTimeout(r, 1000));
        clearSessions();
      } else {
        setError('❌ MongoDB connection failed: ' + (data.error || 'Unknown error'));
        setStep('error');
      }
    } catch (e) {
      setError('❌ Failed to reach API: ' + e.message);
      setStep('error');
    }
  };

  const clearSessions = async () => {
    setStep('clearing');
    setMessage('Clearing any stuck sessions...');
    try {
      const res = await fetch('/api/public/logout-all-sessions', { method: 'POST' });
      const data = await res.json();
      setMessage(`✅ Sessions cleared (${data.clearedCount || 0})`);
      await new Promise(r => setTimeout(r, 1000));
      seedAdmin();
    } catch (e) {
      setError('❌ Failed to clear sessions: ' + e.message);
      setStep('error');
    }
  };

  const seedAdmin = async () => {
    setStep('seeding');
    setMessage('Creating admin user...');
    try {
      const res = await fetch('/api/public/seed-admin-emergency', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok || data.admin || data.message?.includes('exists')) {
        setMessage(`✅ Admin ready! Email: ${data.admin?.email || data.email || 'admin@jyothu.com'}`);
        setStep('done');
      } else {
        setError('❌ Failed to create admin: ' + (data.error || 'Unknown error'));
        setStep('error');
      }
    } catch (e) {
      setError('❌ Failed to seed admin: ' + e.message);
      setStep('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">Admin Setup</h1>

        {step === 'start' && (
          <div className="space-y-4">
            <p className="text-slate-600 text-center">Click below to automatically:</p>
            <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
              <li>Check MongoDB connection</li>
              <li>Clear any stuck sessions</li>
              <li>Create admin user</li>
            </ol>
            <Button 
              onClick={checkHealth}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              size="lg"
            >
              Start Setup
            </Button>
          </div>
        )}

        {(step === 'checking' || step === 'clearing' || step === 'seeding') && (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Loader className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
            <p className="text-center text-slate-600">{message}</p>
          </div>
        )}

        {step === 'done' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-900 font-semibold mb-2">{message}</p>
              <p className="text-sm text-green-700 mb-4">
                Default password: <code className="bg-white px-2 py-1 rounded">admin@123</code>
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/jyothu-control-panel-login'}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              Go to Login
            </Button>
          </div>
        )}

        {step === 'error' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-900 font-semibold text-sm mb-3">{error}</p>
              <details className="text-xs text-red-700">
                <summary className="cursor-pointer font-semibold mb-2">Troubleshooting:</summary>
                <ul className="list-disc list-inside space-y-1">
                  <li>Wait 5 minutes for Vercel deployment to finish</li>
                  <li>Check browser DevTools → Network tab for errors</li>
                  <li>Verify MONGODB_URI is set in Vercel env vars</li>
                  <li>Try again after 1 minute</li>
                </ul>
              </details>
            </div>
            <Button 
              onClick={() => setStep('start')}
              className="w-full bg-slate-600 hover:bg-slate-700 text-white"
              size="lg"
            >
              Try Again
            </Button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-slate-200 text-xs text-slate-500 text-center">
          <p>Setup Page • Never share this URL with anyone</p>
        </div>
      </div>
    </div>
  );
}
