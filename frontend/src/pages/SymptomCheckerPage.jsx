import React, { useState } from 'react';
import {
  Stethoscope,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  Info
} from 'lucide-react';
import { SYMPTOM_CATEGORIES } from '../data/symptomData';

export default function SymptomCheckerPage({ onStartAssessment }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState({});

  const toggleSymptom = (id) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectedList = [];
  let redFlagCount = 0;

  SYMPTOM_CATEGORIES.forEach((cat) => {
    cat.symptoms.forEach((s) => {
      if (selectedSymptoms[s.id]) {
        selectedList.push(s);
        if (s.isRedFlag) {
          redFlagCount += 1;
        }
      }
    });
  });

  const hasRedFlags = redFlagCount > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-800">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Clinical Warning Signs Triage</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Cancer Symptom Checker & Red Flags
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Select any persistent or unusual bodily symptoms you have noticed recently. Our triage system identifies high-priority clinical red flags that require timely medical consultation.
        </p>
      </div>

      {/* Red-Flag Urgent Care Alert Box (Appears when red flag is selected) */}
      {hasRedFlags && (
        <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-500 text-rose-900 dark:text-rose-100 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="text-lg font-bold">
                Clinical Red Flag Symptoms Detected ({redFlagCount})
              </h3>
              <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-200 leading-relaxed">
                You have selected one or more symptoms that oncology guidelines classify as high-priority "red flags" (such as unexplained bleeding, rapid mole change, or a discrete hard painless lump). While many benign conditions can cause these symptoms, they require formal clinical evaluation by a physician to establish an accurate cause.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900/60 text-xs space-y-2">
            <strong className="block text-rose-900 dark:text-rose-200 font-semibold">
              Recommended Urgent Clinical Actions:
            </strong>
            <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
              <li>Schedule an urgent appointment with your primary care doctor, gynecologist, or dermatologist within 1-2 weeks.</li>
              <li>Do not wait for routine annual screening intervals to elapse.</li>
              <li>Document when the symptom started, any changes in severity, and associated triggers.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SYMPTOM_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {cat.description}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {cat.symptoms.map((s) => {
                const isChecked = !!selectedSymptoms[s.id];
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleSymptom(s.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isChecked
                        ? s.isRedFlag
                          ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-400 text-rose-950 dark:text-rose-100'
                          : 'bg-teal-50 dark:bg-teal-950/40 border-teal-400 text-teal-950 dark:text-teal-100'
                        : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {s.name}
                        </span>
                        {s.isRedFlag && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-1.5 py-0.2 rounded border border-rose-300 dark:border-rose-800">
                            Red Flag
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {s.info}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Summary Counter & Action */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-base font-bold block">
            {selectedList.length === 0
              ? 'No symptoms currently checked'
              : `${selectedList.length} symptoms selected (${redFlagCount} red-flag alerts)`}
          </span>
          <span className="text-xs text-slate-400">
            Remember: this checker assists with awareness and triage; it does not diagnose medical conditions.
          </span>
        </div>

        <button
          onClick={() => onStartAssessment('lung')}
          className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs shadow transition flex items-center gap-1.5"
        >
          <span>Proceed to Risk Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
