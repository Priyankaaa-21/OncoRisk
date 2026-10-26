import React from 'react';
import { Download, Printer, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function PDFReportGenerator({
  result,
  inputs = {},
  cancerType = 'breast',
}) {
  const handlePrint = () => {
    window.print();
  };

  const cTitle = cancerType.toUpperCase();
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const reportRef = `OR-${cancerType.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div>
      {/* User Button */}
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm shadow-md transition hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <Printer className="w-4 h-4 text-teal-400 dark:text-teal-600" />
        <span>Download / Print Clinical Report (PDF)</span>
      </button>

      {/* Printable Hidden/Print-Only Layout */}
      <div className="hidden print:block fixed inset-0 bg-white text-black p-8 z-[999999] overflow-visible">
        {/* Document Header */}
        <div className="flex items-center justify-between border-b-2 border-teal-600 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-teal-800 tracking-tight">OncoRisk Clinical Intelligence</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Cancer Risk Estimation & Screening Advisory Report</p>
          </div>
          <div className="text-right text-xs text-gray-600">
            <p><strong className="text-gray-800">Report Ref:</strong> {reportRef}</p>
            <p><strong className="text-gray-800">Assessment Date:</strong> {dateStr}</p>
            <p><strong className="text-gray-800">Evaluation:</strong> {cTitle} CANCER</p>
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold">Calculated Risk</span>
            <span className="text-3xl font-extrabold text-teal-700">{result.risk_percentage}%</span>
          </div>
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold">Risk Category</span>
            <span className="text-xl font-bold text-gray-800 mt-1 inline-block">{result.risk_category} Risk</span>
          </div>
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold">Model Confidence</span>
            <span className="text-xl font-bold text-gray-700 mt-1 inline-block">{result.confidence_level}%</span>
          </div>
        </div>

        {/* Natural Language Summary */}
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-800 border-b border-gray-200 pb-1 mb-2">
            Clinical Summary & Explanation
          </h2>
          <p className="text-xs text-gray-700 leading-relaxed">
            {result.explanation_en}
          </p>
        </div>

        {/* Contributing Factors */}
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-800 border-b border-gray-200 pb-1 mb-2">
            Primary Contributing Factors (SHAP Decomposed)
          </h2>
          <table className="w-full text-xs text-left border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-2 border border-gray-200">Factor</th>
                <th className="p-2 border border-gray-200">Direction</th>
                <th className="p-2 border border-gray-200">Weight</th>
                <th className="p-2 border border-gray-200">Clinical Finding</th>
              </tr>
            </thead>
            <tbody>
              {result.contributing_factors?.map((f, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="p-2 font-semibold text-gray-800 border border-gray-200">{f.label}</td>
                  <td className="p-2 border border-gray-200 font-medium">
                    {f.direction === 'increases_risk' ? 'Elevates Risk' : 'Protective / Baseline'}
                  </td>
                  <td className="p-2 border border-gray-200 font-bold">{f.weight}%</td>
                  <td className="p-2 border border-gray-200 text-gray-600">{f.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recommended Screening Schedule */}
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-800 border-b border-gray-200 pb-1 mb-2">
            Evidence-Based Screening Recommendations
          </h2>
          <div className="space-y-2 text-xs">
            {result.recommendations?.screening_tests?.map((st, i) => (
              <div key={i} className="p-2 border border-gray-200 rounded-lg bg-gray-50">
                <span className="font-bold text-gray-900">{st.test}</span> - <span className="text-teal-700 font-semibold">{st.frequency}</span>
                <p className="text-gray-600 text-[11px] mt-0.5">{st.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lifestyle & Red Flags */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
          <div>
            <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-1 mb-1">Recommended Lifestyle Actions</h3>
            <ul className="list-disc pl-4 space-y-1 text-gray-600">
              {result.recommendations?.lifestyle_modifications?.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-rose-800 border-b border-gray-200 pb-1 mb-1">Warning Red Flags (Seek Prompt Care)</h3>
            <ul className="list-disc pl-4 space-y-1 text-rose-700">
              {result.recommendations?.urgent_red_flags?.map((rf, i) => (
                <li key={i}>{rf}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Physician Consultation Advisory */}
        <div className="p-3 border border-teal-200 bg-teal-50 rounded-xl mb-6 text-xs text-teal-900">
          <strong className="block font-bold mb-0.5">Physician Discussion Advisory:</strong>
          {result.recommendations?.doctor_consultation}
        </div>

        {/* Statutory Legal Disclaimer */}
        <div className="border-t border-gray-300 pt-3 text-[10px] text-gray-500 leading-tight text-center">
          <p className="font-bold text-gray-700 mb-0.5">MANDATORY STATUTORY MEDICAL DISCLAIMER</p>
          <p>
            This report was computer-generated by OncoRisk for educational and risk awareness purposes only. It is NOT a medical diagnosis, clinical evaluation, or treatment plan. Bring this document to a licensed physician or oncologist for personalized clinical interpretation.
          </p>
        </div>
      </div>
    </div>
  );
}
