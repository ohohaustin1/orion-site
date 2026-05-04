import React from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-slate-300 mb-2">這頁不在這裡</p>
        <p className="text-slate-400 mb-8">你要找的東西可能搬家了、或者打錯了</p>
        <Button
          onClick={() => setLocation('/')}
          className="bg-[#C5A059] hover:bg-[#d9b770] text-black"
        >
          回首頁
        </Button>
      </div>
    </div>
  );
}
