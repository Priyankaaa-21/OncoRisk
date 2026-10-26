import React, { useState, useEffect } from 'react';
import {
  History,
  TrendingUp,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Loader2,
  Calendar,
  Sparkles,
  UserCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { api } from '../services/api';

export default function UserDashboardPage({
  user,
  onOpenAuth,
  onViewExplanation,
  onNavigate,
}) {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteStatus, setDeleteStatus] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (user) {
      loadHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function loadHistory() {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setHistoryData(data);
    } catch (err) {
      console.error('Failed to load assessment history:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteData = async (deleteAccount = false) => {
    try {
      await api.deleteMyData(deleteAccount);
      setDeleteStatus('Your medical assessment histories have been permanently and irreversibly erased.');
      setConfirmDelete(false);
      setHistoryData({ assessments: [], trend_data: [] });
    } catch (err) {
      setDeleteStatus('Failed to erase data: ' + err.message);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Account Required for Long-Term Tracking
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Guest assessments are computed confidentially in memory. Sign in or test our instant demo account to store longitudinal assessment histories and track risk trends over time.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={onOpenAuth}
            className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md transition"
          >
            Sign In / Access Demo Account
          </button>
          <button
            onClick={() => onNavigate('selector')}
            className="px-6 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Start Guest Assessment
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600 mx-auto" />
        <h2 className="text-lg font-bold">Retrieving Assessment History & Trends...</h2>
      </div>
    );
  }

  const assessments = historyData?.assessments || [];
  const trendData = historyData?.trend_data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800 mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Authenticated Patient Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome, {user.full_name || 'Patient'}
          </h1>
          <p className="text-xs text-slate-500">
            Account: {user.email} &bull; Longitudinal Risk Trends & Assessment History
          </p>
        </div>

        <button
          onClick={() => onNavigate('selector')}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>+ New Risk Assessment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {deleteStatus && (
        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600" />
          <span>{deleteStatus}</span>
        </div>
      )}

      {/* Risk Trend Chart Over Time */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <span>Risk Probability Trend Over Time</span>
            </h2>
            <p className="text-xs text-slate-500">
              Track how your risk percentages evolved across assessments and lifestyle interventions
            </p>
          </div>
        </div>

        {trendData.length > 0 ? (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val, name, props) => [`${val}% Risk`, props.payload.cancer_type.toUpperCase()]}
                  labelFormatter={(date) => `Date: ${date}`}
                />
                <Line
                  type="monotone"
                  dataKey="risk_percentage"
                  stroke="#0d9488"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#0d9488' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-44 flex items-center justify-center text-xs text-slate-400">
            No historical trend points recorded yet. Complete an assessment to begin tracking.
          </div>
        )}
      </div>

      {/* Assessment History Table */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-teal-600" />
              <span>Completed Assessments ({assessments.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              Review prior inputs, calibrated probabilities, and clinician guidance
            </p>
          </div>
        </div>

        {assessments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="py-3 px-4">Cancer Type</th>
                  <th className="py-3 px-4">Assessment Date</th>
                  <th className="py-3 px-4">Risk Probability</th>
                  <th className="py-3 px-4">Risk Category</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Algorithm</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {assessments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                      {item.cancer_type}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs">
                      {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-teal-600 dark:text-teal-400">
                      {item.risk_percentage}%
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          item.risk_category === 'Low'
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                            : item.risk_category === 'Moderate'
                            ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                            : 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {item.risk_category} Risk
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 text-xs">
                      {item.confidence_level}%
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">
                      {item.algorithm_used}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onViewExplanation(item.id)}
                        className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline"
                      >
                        View Breakdown &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No completed assessments in this account yet.
          </div>
        )}
      </div>

      {/* Privacy & Data Deletion Section */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
          <Trash2 className="w-4 h-4" />
          <span>Patient Data Privacy & Right to Erasure</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          In adherence to healthcare privacy regulations (GDPR and HIPAA guidance), you have the absolute right to delete all your stored medical parameters and assessment scores from our database permanently.
        </p>

        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="px-4 py-2 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
          >
            Erase All My Assessment History
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 space-y-3 text-xs text-rose-900 dark:text-rose-200">
            <p className="font-bold">
              Are you sure you want to permanently erase your medical history? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleDeleteData(false)}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-sm"
              >
                Yes, Delete My Data
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
