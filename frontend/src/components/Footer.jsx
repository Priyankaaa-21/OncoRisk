import React from 'react';
import { ShieldCheck, HeartHandshake, PhoneCall, Lock, AlertCircle } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Platform & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span>OncoRisk Platform</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              An evidence-based machine learning platform dedicated to estimating cancer risk probabilities, promoting timely age-appropriate screening, and improving patient health literacy. Built using calibrated classifiers trained on public benchmark cohorts.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-teal-400" /> Patient Privacy Protected
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> WHO/NCI/ACS Guidelines
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold tracking-wider uppercase">Platform Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('selector')} className="hover:text-teal-400 transition">
                  Cancer Risk Assessments
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('metrics')} className="hover:text-teal-400 transition">
                  Model Benchmarks & ROC Curves
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('symptoms')} className="hover:text-teal-400 transition">
                  Symptom Checker & Red Flags
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('clinics')} className="hover:text-teal-400 transition">
                  Screening Centers Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('education')} className="hover:text-teal-400 transition">
                  Myths vs Facts & Screening Matrix
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Medical Notice & Support */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold tracking-wider uppercase">Urgent Clinical Triage</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              If you are experiencing acute chest pain, uncontrolled bleeding, or sudden neurological deficits, please seek immediate emergency care.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Cancer Helplines</span>
              </div>
              <p className="text-[11px] text-slate-300">
                US NCI Information: <span className="font-semibold text-white">1-800-4-CANCER</span>
              </p>
              <p className="text-[11px] text-slate-300">
                India Tata Cancer Care: <span className="font-semibold text-white">1800-22-1952</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer Banner & Copyright */}
        <div className="border-t border-slate-800 mt-10 pt-6 text-center space-y-2 text-xs text-slate-400">
          <p className="max-w-3xl mx-auto text-[11px] leading-relaxed">
            <strong className="text-slate-300">Statutory Notice:</strong> OncoRisk does not provide medical advice, definitive clinical diagnoses, or prescription treatment plans. All calculations are mathematical probabilities designed to facilitate informed shared decision-making with certified medical professionals.
          </p>
          <p className="text-[11px]">
            &copy; {new Date().getFullYear()} OncoRisk Clinical Intelligence. Designed for patient safety and clinical transparency.
          </p>
        </div>
      </div>
    </footer>
  );
}
