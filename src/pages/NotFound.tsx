import React from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-slate-300 mb-2">Page Not Found</p>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
        <Button
          onClick={() => setLocation('/')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
