import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';

export default function DisclaimerBanner() {
  const [minimized, setMinimized] = useState(false);

  return (
    <div
      role="region"
      aria-label="Medical Disclaimer"
      className="bg-amber-500/10 dark:bg-amber-500/20 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm px-4 py-2 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
          <p className="leading-snug">
            <strong className="font-semibold">Medical Disclaimer:</strong>{' '}
            This tool provides an estimate for cancer awareness and early screening education only. It does{' '}
            <span className="underline font-medium">NOT</span> provide a clinical diagnosis or treatment plan. Always consult a qualified physician for medical concerns.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-200/50 dark:bg-amber-900/40 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3" /> Non-Diagnostic
          </span>
        </div>
      </div>
    </div>
  );
}
