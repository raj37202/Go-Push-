import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B1120] text-gray-200 px-6 font-sans">
      <div className="max-w-md w-full bg-[#111827] border border-gray-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Decorative ambient background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-xl rounded-full" />
        
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-950/40 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <AlertCircle className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-white font-display">404</h1>
          <h2 className="text-lg font-bold text-gray-300">Page Not Found</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
            The page you are looking for does not exist or has been moved to another administrative gateway node.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-550 hover:to-pink-450 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
