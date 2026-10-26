import React, { useState } from 'react';
import { Languages, Volume2, Sparkles, AlertCircle } from 'lucide-react';

export default function NaturalLanguageExplanation({
  explanationEn = '',
  explanationHi = '',
  riskCategory = 'Low',
}) {
  const [lang, setLang] = useState('en'); // 'en' | 'hi'

  const activeText = lang === 'en' ? explanationEn : explanationHi;

  const handleSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeText);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-teal-50/50 via-white to-sky-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/20 rounded-2xl border border-teal-100 dark:border-teal-900/50 shadow-sm space-y-4">
      
      {/* Header with Title and Language Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-600 text-white shadow-sm shadow-teal-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Natural-Language Clinical Interpretation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Plain-language synthesis of your calculation in your preferred language
            </p>
          </div>
        </div>

        {/* English / Hindi Toggle Buttons */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                lang === 'en'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-teal-600'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                lang === 'hi'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-teal-600'
              }`}
            >
              हिंदी (Hindi)
            </button>
          </div>

          {/* Audio narration button */}
          <button
            type="button"
            onClick={handleSpeech}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            title="Read explanation aloud"
            aria-label="Read explanation aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Explanation Text */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 text-sm leading-relaxed relative">
        <p className="font-sans whitespace-pre-line">
          {activeText || 'Interpretation loading...'}
        </p>

        {/* Language Indicator footnote */}
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/40 flex items-center justify-between text-[11px] text-slate-400">
          <span>{lang === 'hi' ? 'अनुवाद: हिंदी भाषा' : 'Language: English (US Medical)'}</span>
          <span>Validated by OncoRisk Clinical Intelligence Engine</span>
        </div>
      </div>

    </div>
  );
}
