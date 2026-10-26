import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function RiskGauge({
  riskPercentage = 0,
  riskCategory = 'Low',
  confidenceLevel = 90,
  algorithm = 'Calibrated Ensemble',
}) {
  const clampedRisk = Math.min(100, Math.max(0, riskPercentage));

  // Determine color and styling based on risk category
  let theme = {
    color: '#059669', // Emerald
    bgBadge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    title: 'Low Estimated Risk',
    icon: CheckCircle2,
    subtext: 'Your reported risk factors are within typical lower-prevalence parameters.'
  };

  if (riskCategory === 'Moderate') {
    theme = {
      color: '#d97706', // Amber
      bgBadge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      title: 'Moderate Estimated Risk',
      icon: AlertCircle,
      subtext: 'Certain modifiable or clinical factors moderately elevate estimated probability.'
    };
  } else if (riskCategory === 'High') {
    theme = {
      color: '#e11d48', // Rose
      bgBadge: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      title: 'Elevated Estimated Risk',
      icon: AlertTriangle,
      subtext: 'Multiple clinical indicators suggest discussing targeted screening with a physician.'
    };
  }

  const IconComponent = theme.icon;

  // Semi-circle SVG calculation
  // Radius = 90, strokeWidth = 14, circumference of semicircle = PI * R ≈ 282.74
  const radius = 90;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (clampedRisk / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div
        className="absolute -top-10 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: theme.color }}
      />

      <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-2">
        Estimated Risk Probability
      </div>

      {/* SVG Semicircular Gauge Meter */}
      <div className="relative w-64 h-36 flex items-end justify-center">
        <svg
          viewBox="0 0 220 120"
          className="w-full h-full overflow-visible"
          role="img"
          aria-label={`Risk gauge: ${clampedRisk}% ${riskCategory} risk`}
        >
          {/* Background track */}
          <path
            d="M 20 110 A 90 90 0 0 1 200 110"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="text-slate-100 dark:text-slate-800"
          />
          {/* Active colored arc */}
          <path
            d="M 20 110 A 90 90 0 0 1 200 110"
            fill="none"
            stroke={theme.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            {clampedRisk}%
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Calibrated Risk
          </span>
        </div>
      </div>

      {/* Risk Category Badge */}
      <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs sm:text-sm font-semibold ${theme.bgBadge}`}>
        <IconComponent className="w-4 h-4 shrink-0" />
        <span>{theme.title}</span>
      </div>

      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
        {theme.subtext}
      </p>

      {/* Model Confidence & Algorithm Footer */}
      <div className="mt-5 w-full pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <div>
          <span className="block text-slate-400 dark:text-slate-400">Confidence Metric</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{confidenceLevel}% Calibrated</span>
        </div>
        <div>
          <span className="block text-slate-400 dark:text-slate-400">Classifier Architecture</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">{algorithm}</span>
        </div>
      </div>

    </div>
  );
}
