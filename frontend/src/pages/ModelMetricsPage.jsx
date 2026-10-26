import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  Database,
  Loader2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { api } from '../services/api';

export default function ModelMetricsPage() {
  const [metricsData, setMetricsData] = useState(null);
  const [selectedCancer, setSelectedCancer] = useState('breast');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await api.getModelMetrics();
        setMetricsData(data);
      } catch (err) {
        console.error('Error fetching model metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const cancerList = [
    { id: 'breast', label: 'Breast Cancer' },
    { id: 'lung', label: 'Lung Cancer' },
    { id: 'cervical', label: 'Cervical Cancer' },
    { id: 'skin', label: 'Skin / Melanoma' },
    { id: 'colorectal', label: 'Colorectal Cancer' },
    { id: 'prostate', label: 'Prostate Cancer' },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600 mx-auto" />
        <h2 className="text-lg font-bold">Loading Model Performance Benchmarks...</h2>
      </div>
    );
  }

  const currentMeta = metricsData ? metricsData[selectedCancer] : null;

  if (!currentMeta) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold">Metrics Unavailable</h2>
        <p className="text-xs text-slate-500">Ensure the ML models have been generated in ml/saved_models.</p>
      </div>
    );
  }

  const comparison = currentMeta.algorithms_comparison || {};
  const bestAlgo = currentMeta.best_algorithm;
  const bestMetrics = comparison[bestAlgo] || Object.values(comparison)[0] || {};
  const rocCurvePoints = bestMetrics.roc_curve || [];
  const cm = bestMetrics.confusion_matrix || { tn: 0, fp: 0, fn: 0, tp: 0 };
  const importances = currentMeta.feature_importances || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800">
          <Cpu className="w-3.5 h-3.5" />
          <span>Algorithmic Rigor & Clinical Calibration</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Model Performance & Evaluation
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Full benchmark evaluation comparing Logistic Regression, Random Forest, and XGBoost classifiers. Probabilities are calibrated using Platt scaling, with class imbalance managed via SMOTE.
        </p>
      </div>

      {/* Cancer Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {cancerList.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCancer(c.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              selectedCancer === c.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Dataset & Selected Architecture Summary */}
      <div className="p-6 bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-transparent rounded-3xl border border-teal-500/20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <span className="text-xs uppercase font-bold text-teal-700 dark:text-teal-300 tracking-wider block">
            Dataset Source
          </span>
          <span className="text-base font-bold text-slate-900 dark:text-white block mt-0.5">
            {currentMeta.dataset_name}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            {currentMeta.total_samples} cohort records &bull; {currentMeta.test_samples} held-out test records
          </span>
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-teal-700 dark:text-teal-300 tracking-wider block">
            Selected Architecture
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {bestAlgo}
            </span>
            <span className="text-[11px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full">
              Highest ROC-AUC & Recall
            </span>
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Calibrated with CalibratedClassifierCV (3-fold cross validation)
          </span>
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-teal-700 dark:text-teal-300 tracking-wider block">
            Prevalence & Class Imbalance
          </span>
          <span className="text-base font-bold text-slate-900 dark:text-white block mt-0.5">
            {(currentMeta.positive_ratio * 100).toFixed(1)}% Positive Prevalence
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            SMOTE synthetic minority over-sampling and balanced class weighting applied
          </span>
        </div>
      </div>

      {/* Algorithms Benchmark Comparison Table */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Algorithm Benchmark Comparison
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cross-evaluated on 25% stratified holdout test split. Sensitivity (Recall) is prioritized in cancer awareness.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-3 px-4">Algorithm</th>
                <th className="py-3 px-4">ROC-AUC</th>
                <th className="py-3 px-4">Recall (Sensitivity)</th>
                <th className="py-3 px-4">Precision (PPV)</th>
                <th className="py-3 px-4">F1-Score</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Selection Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {Object.entries(comparison).map(([name, m]) => {
                const isSelected = name === bestAlgo;
                return (
                  <tr
                    key={name}
                    className={`transition ${
                      isSelected
                        ? 'bg-teal-50/60 dark:bg-teal-950/40 font-semibold text-teal-950 dark:text-teal-200'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-4 flex items-center gap-2">
                      <span>{name}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-teal-500" />
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-teal-700 dark:text-teal-300">
                      {(m.roc_auc * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-4">{(m.recall * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4">{(m.precision * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4">{(m.f1 * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4">{(m.accuracy * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/60 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Selected
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Benchmarked</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: ROC Curve + Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ROC Curve Chart */}
        <div className="lg:col-span-7 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Receiver Operating Characteristic (ROC Curve)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sensitivity (TPR) vs. 1 - Specificity (FPR) across discrimination thresholds
              </p>
            </div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800">
              AUC = {bestMetrics.roc_auc}
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocCurvePoints} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis
                  dataKey="fpr"
                  domain={[0, 1]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  label={{ value: 'False Positive Rate (1 - Specificity)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#94a3b8' }}
                />
                <YAxis
                  domain={[0, 1]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  label={{ value: 'True Positive Rate (Recall)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8' }}
                />
                <Tooltip
                  formatter={(val, name) => [`${(val * 100).toFixed(1)}%`, name === 'tpr' ? 'True Positive Rate' : name]}
                  labelFormatter={(fpr) => `FPR: ${(fpr * 100).toFixed(1)}%`}
                />
                <Line
                  type="monotone"
                  dataKey="tpr"
                  stroke="#0d9488"
                  strokeWidth={3}
                  dot={{ r: 2, fill: '#0d9488' }}
                  name="Calibrated Model"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confusion Matrix Visualizer */}
        <div className="lg:col-span-5 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Holdout Confusion Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Binary classification performance on un-seen validation cohort
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center my-4">
            
            {/* True Negative */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 block uppercase font-semibold">True Negative (TN)</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{cm.tn}</span>
              <span className="text-[10px] text-emerald-600 block mt-1 font-medium">Correctly identified low risk</span>
            </div>

            {/* False Positive */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
              <span className="text-xs text-amber-800 dark:text-amber-300 block uppercase font-semibold">False Positive (FP)</span>
              <span className="text-2xl font-extrabold text-amber-700 dark:text-amber-400">{cm.fp}</span>
              <span className="text-[10px] text-amber-600 block mt-1 font-medium">False alert (prompts review)</span>
            </div>

            {/* False Negative */}
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
              <span className="text-xs text-rose-800 dark:text-rose-300 block uppercase font-semibold">False Negative (FN)</span>
              <span className="text-2xl font-extrabold text-rose-700 dark:text-rose-400">{cm.fn}</span>
              <span className="text-[10px] text-rose-600 block mt-1 font-medium">Minimized by high recall priority</span>
            </div>

            {/* True Positive */}
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800">
              <span className="text-xs text-teal-800 dark:text-teal-300 block uppercase font-semibold">True Positive (TP)</span>
              <span className="text-2xl font-extrabold text-teal-700 dark:text-teal-300">{cm.tp}</span>
              <span className="text-[10px] text-teal-600 block mt-1 font-medium">Accurately detected elevated risk</span>
            </div>

          </div>

          <p className="text-[11px] text-slate-400 leading-snug">
            In medical screening, minimizing False Negatives (FN) is paramount to prevent missed early-stage disease opportunities.
          </p>
        </div>

      </div>

      {/* Dataset Limitations & Transparency Note */}
      <div className="p-6 rounded-3xl bg-amber-50/60 dark:bg-slate-900 border border-amber-300/60 dark:border-amber-900/40 space-y-3">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Scientific Transparency & Dataset Limitations Note</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {currentMeta.dataset_limitations}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          <strong>Referral & Sampling Bias:</strong> Public oncology datasets frequently over-represent clinical populations referred to tertiary cancer hospitals, meaning baseline disease prevalence may differ from general asymptomatic population cohorts. Consequently, risk probabilities are calibrated with isotonic/sigmoid scaling to align with epidemiological rates. Always correlate algorithmic estimates with individual clinical exams and laboratory pathology.
        </p>
      </div>

    </div>
  );
}
