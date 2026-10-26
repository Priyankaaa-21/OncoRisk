import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Apple,
  Sun,
  Activity,
  Syringe,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MYTHS_VS_FACTS, PREVENTION_TIPS, SCREENING_MATRIX } from '../data/educationalData';

export default function EducationHubPage({ onStartAssessment }) {
  const [activeTab, setActiveTab] = useState('myths'); // 'myths' | 'prevention' | 'calendar'
  const [expandedMyth, setExpandedMyth] = useState(0);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('40 - 49 Years');
  const [selectedSex, setSelectedSex] = useState('all'); // 'all' | 'female' | 'male'

  const currentMatrix = SCREENING_MATRIX.find((m) => m.ageGroup === selectedAgeGroup) || SCREENING_MATRIX[1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Patient Health Literacy & Prevention</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Educational Hub & Screening Matrix
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Demystifying cancer biology with evidence-based research. Explore common myths debunked, 7 foundational cancer prevention principles, and age-by-age screening timelines.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('myths')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'myths'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border'
          }`}
        >
          Myths vs. Facts (Debunked)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('prevention')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'prevention'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border'
          }`}
        >
          7 Evidence-Based Prevention Rules
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'calendar'
              ? 'bg-teal-600 text-white shadow'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border'
          }`}
        >
          Interactive Screening Calendar
        </button>
      </div>

      {/* TAB 1: Myths vs Facts */}
      {activeTab === 'myths' && (
        <div className="space-y-4 animate-in fade-in">
          <p className="text-xs text-slate-500">
            Click on any myth below to view the verified clinical fact and oncology consensus.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MYTHS_VS_FACTS.map((item, idx) => {
              const isExpanded = expandedMyth === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setExpandedMyth(isExpanded ? null : idx)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                    isExpanded
                      ? 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-500 shadow-md ring-1 ring-teal-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                      Myth #{idx + 1} &bull; {item.category}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    "{item.myth}"
                  </h3>

                  {isExpanded && (
                    <div className="pt-3 border-t border-teal-200/50 dark:border-teal-900/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1.5 animate-in fade-in">
                      <strong className="text-teal-800 dark:text-teal-300 block font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        Verified Clinical Fact:
                      </strong>
                      <p>{item.fact}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Prevention Rules */}
      {activeTab === 'prevention' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2">
            <h3 className="text-base font-bold text-teal-950 dark:text-teal-200">
              The 30% to 50% Prevention Target (World Health Organization)
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Epidemiological studies confirm that between one-third and one-half of all cancer deaths are preventable through modifiable lifestyle habits, vaccination against oncogenic viruses, and avoidance of environmental carcinogens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PREVENTION_TIPS.map((tip) => (
              <div
                key={tip.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                    {tip.id}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {tip.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tip.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-teal-700 dark:text-teal-300 font-medium">
                  <strong>Action:</strong> {tip.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Interactive Screening Matrix */}
      {activeTab === 'calendar' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Matrix Controls: Age Group & Sex */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Age Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
              <span className="font-semibold text-slate-500 mr-1">Age Bracket:</span>
              {SCREENING_MATRIX.map((m) => (
                <button
                  key={m.ageGroup}
                  type="button"
                  onClick={() => setSelectedAgeGroup(m.ageGroup)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                    selectedAgeGroup === m.ageGroup
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600'
                  }`}
                >
                  {m.ageGroup}
                </button>
              ))}
            </div>

            {/* Sex Filter */}
            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedSex('all')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  selectedSex === 'all'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                All Genders
              </button>
              <button
                type="button"
                onClick={() => setSelectedSex('female')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  selectedSex === 'female'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Female
              </button>
              <button
                type="button"
                onClick={() => setSelectedSex('male')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  selectedSex === 'male'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Male
              </button>
            </div>

          </div>

          {/* Matrix Display Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Female Modalities */}
            {(selectedSex === 'all' || selectedSex === 'female') && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                    Female Screening Guidelines ({selectedAgeGroup})
                  </h3>
                  <span className="text-xs text-slate-400 font-semibold">USPSTF / ACS</span>
                </div>

                <div className="space-y-3">
                  {currentMatrix.female.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {item.test}
                        </span>
                        <span className="text-[10px] font-bold bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-full">
                          {item.guideline}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 block">
                        Frequency: {item.interval}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                        {item.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Male Modalities */}
            {(selectedSex === 'all' || selectedSex === 'male') && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                    Male Screening Guidelines ({selectedAgeGroup})
                  </h3>
                  <span className="text-xs text-slate-400 font-semibold">USPSTF / AUA</span>
                </div>

                <div className="space-y-3">
                  {currentMatrix.male.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {item.test}
                        </span>
                        <span className="text-[10px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full">
                          {item.guideline}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 block">
                        Frequency: {item.interval}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                        {item.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* CTA Box */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-base font-bold block">
            Ready to compute your calibrated risk?
          </span>
          <span className="text-xs text-slate-400">
            Compare your parameters against population baselines in minutes.
          </span>
        </div>
        <button
          onClick={() => onStartAssessment('breast')}
          className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs shadow transition"
        >
          Begin Risk Assessment
        </button>
      </div>

    </div>
  );
}
