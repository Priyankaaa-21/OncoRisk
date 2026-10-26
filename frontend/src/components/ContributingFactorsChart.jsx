import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { Info, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function ContributingFactorsChart({ factors = [] }) {
  if (!factors || factors.length === 0) {
    return (
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        No factor attribution data available.
      </div>
    );
  }

  // Format data for horizontal bar chart
  const chartData = factors.map((item) => ({
    name: item.label.length > 22 ? `${item.label.substring(0, 20)}...` : item.label,
    fullName: item.label,
    weight: Math.min(100, item.weight),
    direction: item.direction,
    description: item.description,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs max-w-xs border border-slate-700">
          <p className="font-semibold text-slate-100">{data.fullName}</p>
          <div className="flex items-center gap-1.5 mt-1 font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                data.direction === 'increases_risk' ? 'bg-rose-400' : 'bg-emerald-400'
              }`}
            />
            <span className="capitalize">
              {data.direction === 'increases_risk'
                ? 'Elevates estimated risk'
                : 'Protective / Lowers risk'}
            </span>
          </div>
          <p className="text-slate-300 text-[11px] mt-1.5 leading-snug">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Top Contributing Risk Factors
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            SHAP-derived relative influence of your reported lifestyle and clinical parameters
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Increases Risk
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Protective / Baseline
          </span>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 'dataMax + 10']}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              unit="%"
            />
            <YAxis
              type="category"
              dataKey="name"
              width={130}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="weight" radius={[0, 6, 6, 0]} barSize={16}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.direction === 'increases_risk' ? '#f43f5e' : '#10b981'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory cards list */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Factor Impact Breakdown:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {factors.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-2.5"
            >
              <div
                className={`mt-0.5 p-1 rounded-md shrink-0 ${
                  item.direction === 'increases_risk'
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                    : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {item.direction === 'increases_risk' ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {item.label}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {item.weight}% influence
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
