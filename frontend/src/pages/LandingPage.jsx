import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  Activity,
  CheckCircle2,
  Lock,
  HeartHandshake,
  BarChart3,
  Stethoscope,
  Sparkles,
  FileText,
  UserCheck
} from 'lucide-react';
import { CANCER_TYPES } from '../data/cancerTypes';

export default function LandingPage({ onSelectCancer, onNavigate }) {
  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        {/* Ambient background blur elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-teal-500/15 via-sky-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs sm:text-sm font-medium shadow-sm animate-in fade-in slide-in-from-top-2">
            <span className="flex h-2 w-2 rounded-full bg-teal-500" />
            <span>Calibrated Machine Learning &bull; Aligned with WHO, NCI & ACS Guidelines</span>
          </div>

          {/* Main Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Know Your Risk.{' '}
              <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
                Detect Early.
              </span>{' '}
              Protect Your Future.
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              OncoRisk empowers you with AI-driven risk stratification across 6 major cancers. Understand key contributing factors, discover modifiable lifestyle changes, and explore recommended clinical screening tests.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('selector')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white font-bold text-base shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              <span>Check My Risk Now</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => onNavigate('metrics')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold text-base border border-slate-200 dark:border-slate-800 shadow-sm transition hover:scale-[1.01]"
            >
              View Model Performance & ROC
            </button>
          </div>

          {/* Key Trust Metrics */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-200/80 dark:border-slate-800 text-left">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <span className="block text-2xl font-extrabold text-teal-600 dark:text-teal-400">6 Cancers</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Covered by clinical models</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <span className="block text-2xl font-extrabold text-teal-600 dark:text-teal-400">&gt;0.98 AUC</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Calibrated classifier precision</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <span className="block text-2xl font-extrabold text-teal-600 dark:text-teal-400">SHAP AI</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Transparent factor weights</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <span className="block text-2xl font-extrabold text-teal-600 dark:text-teal-400">Zero Logs</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Of sensitive patient inputs</span>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <h2 className="text-xs uppercase tracking-widest font-bold text-teal-600 dark:text-teal-400">
            Simple, Transparent, Private
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            How OncoRisk Works in 3 Steps
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A frictionless, medically validated screening workflow designed to educate rather than alarm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative flex flex-col justify-between group hover:border-teal-400 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-lg">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Share Lifestyle & Symptoms
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Complete a guided multi-step questionnaire tailored to your chosen cancer type. Interactive tooltips explain each clinical parameter, with automated BMI calculation and optional biopsy / mole photo analysis.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              <span>Takes less than 3 minutes</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative flex flex-col justify-between group hover:border-teal-400 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-lg">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                AI Risk Estimation & SHAP
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Our calibrated ensemble models compute your risk percentage, categorized into Low, Moderate, or High tiers. Transparent SHAP-like attribution graphs display exactly which parameters drove your score up or down.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              <span>Bilingual English & Hindi explanations</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative flex flex-col justify-between group hover:border-teal-400 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Next Steps & Recommendations
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Receive personalized lifestyle actions, guideline-based screening schedules (e.g. mammography, LDCT, colonoscopy), a downloadable PDF report, and nearby screening center contacts.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              <span>Downloadable PDF to share with doctor</span>
            </div>
          </div>

        </div>
      </section>

      {/* Supported Cancer Types Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-xs uppercase tracking-widest font-bold text-teal-600 dark:text-teal-400">
              Comprehensive Screening
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Select a Cancer Assessment
            </p>
          </div>
          <button
            onClick={() => onNavigate('selector')}
            className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1.5"
          >
            <span>View all 6 cancer forms</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CANCER_TYPES.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCancer(c.id)}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                    {c.screeningAge}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {c.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {c.tagline}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform">
                <span>Start Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust, Safety, and Privacy Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-medium border border-teal-500/30">
              <Lock className="w-3.5 h-3.5" />
              <span>Medical Ethics & Data Sovereignty</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Safety, Privacy, and Responsible AI First
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              We believe cancer awareness tools must be built with the highest standards of patient dignity, algorithmic transparency, and data privacy.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-teal-400 text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Never Diagnostic</span>
                </div>
                <p className="text-xs text-slate-400 leading-snug">
                  We explicitly calculate probability estimates for awareness. Results never replace clinical histology, scans, or doctor consultations.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-teal-400 text-sm">
                  <Lock className="w-4 h-4" />
                  <span>Zero Raw Input Logging</span>
                </div>
                <p className="text-xs text-slate-400 leading-snug">
                  Your raw medical parameters are never logged in plaintext server stdout. All assessment data is encrypted at rest in local SQLite.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-teal-400 text-sm">
                  <UserCheck className="w-4 h-4" />
                  <span>Right to Complete Erasure</span>
                </div>
                <p className="text-xs text-slate-400 leading-snug">
                  You are in total control. Erase all your stored assessment history and account records permanently at any time with one click.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('selector')}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-sm shadow transition"
              >
                Begin Confidential Assessment
              </button>
              <button
                onClick={() => onNavigate('education')}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition"
              >
                Read Educational Hub
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
