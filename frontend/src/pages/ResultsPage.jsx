import React from 'react';
import {
  ArrowLeft,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  Stethoscope,
  HeartPulse,
  MapPin,
  Sparkles,
  CheckCircle2,
  Share2,
  Eye,
  FileCheck2
} from 'lucide-react';
import RiskGauge from '../components/RiskGauge';
import ContributingFactorsChart from '../components/ContributingFactorsChart';
import NaturalLanguageExplanation from '../components/NaturalLanguageExplanation';
import PDFReportGenerator from '../components/PDFReportGenerator';

export default function ResultsPage({
  result,
  cancerType,
  onReset,
  onNavigate,
}) {
  if (!result) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold">No Assessment Result Found</h2>
        <p className="text-xs text-slate-500">Please start a new assessment to view risk estimation.</p>
        <button
          onClick={onReset}
          className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-xs"
        >
          Go to Cancer Directory
        </button>
      </div>
    );
  }

  const cTitle = cancerType.charAt(0).toUpperCase() + cancerType.slice(1);
  const recs = result.recommendations || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Bar with Navigation and Print / PDF button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 no-print">
        <div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Start Another Assessment</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {cTitle} Cancer Risk Evaluation Report
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} &bull; Algorithm: {result.algorithm_used}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PDFReportGenerator result={result} cancerType={cancerType} />
        </div>
      </div>

      {/* Primary Results Grid: Gauge Meter + SHAP Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Semicircular Gauge & Clinical Status */}
        <div className="lg:col-span-5 space-y-6">
          <RiskGauge
            riskPercentage={result.risk_percentage}
            riskCategory={result.risk_category}
            confidenceLevel={result.confidence_level}
            algorithm={result.algorithm_used}
          />

          {/* Skin Lesion Image Feature Analysis Card (if applicable) */}
          {result.image_analyzed && (
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-teal-200 dark:border-teal-800/80 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-bold text-sm">
                <Eye className="w-4 h-4" />
                <span>CNN Lesion Photographic Analysis</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="block text-[11px] text-slate-400">Visual Suspicion:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{result.visual_suspicion_level || 'Moderate'}</strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="block text-[11px] text-slate-400">Border Score:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{result.lesion_border_irregularity_score || '0.24'}</strong>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Photo analysis was blended with your ABCDE criteria to calibrate overall risk probability.
              </p>
            </div>
          )}

          {/* Doctor Discussion Callout */}
          <div className="p-5 bg-gradient-to-br from-teal-500/10 via-sky-500/5 to-transparent rounded-2xl border border-teal-500/20 text-slate-800 dark:text-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-teal-700 dark:text-teal-300">
              <Stethoscope className="w-4 h-4 shrink-0" />
              <span>Physician Discussion Guidance</span>
            </div>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              {recs.doctor_consultation}
            </p>
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => onNavigate('clinics')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Find nearby cancer screening centers &rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: SHAP Contributing Factors Chart */}
        <div className="lg:col-span-7 space-y-6">
          <ContributingFactorsChart factors={result.contributing_factors} />
        </div>

      </div>

      {/* Bilingual Natural Language Explanation (English / Hindi) */}
      <section>
        <NaturalLanguageExplanation
          explanationEn={result.explanation_en}
          explanationHi={result.explanation_hi}
          riskCategory={result.risk_category}
        />
      </section>

      {/* Personalized Recommendations Section */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Personalized Clinical Next Steps
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Evidence-based screening modalities and lifestyle interventions tailored to your profile
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Recommended Screening Tests */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Suggested Screening Tests
              </h3>
              <div className="space-y-3 text-xs">
                {recs.screening_tests?.map((st, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      {st.test}
                    </span>
                    <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 block">
                      Frequency: {st.frequency}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {st.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[11px] text-slate-400 italic pt-2">
              Based on official USPSTF, ACS, and WHO guidelines.
            </span>
          </div>

          {/* Card 2: Lifestyle Modifications */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Lifestyle & Prevention Actions
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                {recs.lifestyle_modifications?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <span className="text-[11px] text-slate-400 italic pt-2">
              30-50% of oncologic malignancies are preventable through lifestyle modification.
            </span>
          </div>

          {/* Card 3: When to See a Doctor / Red Flags */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                When to See a Doctor Promptly
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Do not wait for routine screening if you develop any of the following clinical warning signs:
              </p>
              <ul className="space-y-2 text-xs text-rose-700 dark:text-rose-300">
                {recs.urgent_red_flags?.map((rf, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 leading-snug">
                    &bull; {rf}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => onNavigate('symptoms')}
              className="w-full text-center py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition"
            >
              Open Full Symptom Checker
            </button>
          </div>

        </div>
      </section>

      {/* Bottom Sticky Action Bar */}
      <div className="p-6 bg-slate-100 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
            Questions about these recommendations?
          </span>
          <span className="text-xs text-slate-500">
            Use our AI health assistant to ask clarifying questions about guidelines or screening prep.
          </span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('selector')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition"
          >
            Check Another Cancer
          </button>
          <button
            onClick={() => onNavigate('clinics')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow transition"
          >
            Find Screening Clinics
          </button>
        </div>
      </div>

    </div>
  );
}
