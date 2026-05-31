'use client';

import React, { useEffect } from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B1120] text-gray-200 px-6 font-sans">
      <div className="max-w-md w-full bg-[#111827] border border-gray-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Decorative subtle ambient background red glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-xl rounded-full" />
        
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-950/40 border border-red-500/20 flex items-center justify-center text-red-400">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-white font-display">System Error</h1>
          <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
            An unexpected error occurred in the administrative engine gateway. The error has been logged.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-550 hover:to-rose-450 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-lg shadow-red-900/30 transition-all duration-200 pointer-events-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Attempt Recovery</span>
          </button>
        </div>
      </div>
    </div>
  );
}
