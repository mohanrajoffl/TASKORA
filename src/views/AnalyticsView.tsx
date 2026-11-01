import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  PieChart,
  Calendar,
} from 'lucide-react';
import { api } from '../api/client';
import { Task } from '../types';

interface AnalyticsViewProps {
  tasks: Task[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks }) => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [aiReport, setAiReport] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [tasks]);

  const loadAnalytics = async () => {
    try {
      const data = await api.getAnalytics();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  };

  const handleGenerateAIReport = async () => {
    setIsGeneratingReport(true);
    try {
      const res = await api.getProductivityReport();
      setAiReport(res.report);
    } catch (err) {
      console.error('Error generating AI report:', err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const overdue = tasks.filter((t) => {
    if (t.status === 'Completed' || t.status === 'Cancelled') return false;
    return t.deadlineDate < '2026-11-01';
  }).length;

  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <span>Productivity Analytics & AI Reports</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time tracking of task velocity, category completion, and habits
          </p>
        </div>

        <button
          onClick={handleGenerateAIReport}
          disabled={isGeneratingReport}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-amber-500 hover:from-indigo-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
        >
          {isGeneratingReport ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate AI Report</span>
            </>
          )}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">Completion Rate</span>
          <div className="mt-2 text-2xl font-black text-emerald-400">{rate}%</div>
          <span className="text-[11px] text-slate-400">{completed} of {total} done</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">In Progress</span>
          <div className="mt-2 text-2xl font-black text-indigo-300">{inProgress}</div>
          <span className="text-[11px] text-slate-400">Active milestones</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">Pending & Future</span>
          <div className="mt-2 text-2xl font-black text-amber-300">{pending}</div>
          <span className="text-[11px] text-slate-400">Scheduled ahead</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">Overdue Tasks</span>
          <div className="mt-2 text-2xl font-black text-rose-400">{overdue}</div>
          <span className="text-[11px] text-slate-400">Needs rescheduling</span>
        </div>
      </div>

      {/* AI Productivity Report Card */}
      {aiReport && (
        <div className="p-5 rounded-3xl bg-indigo-950/40 border border-indigo-500/40 shadow-xl space-y-2.5 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm sm:text-base text-white">
              Taskora AI Performance & Motivation Synthesis
            </h3>
          </div>
          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            {aiReport}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="p-5 rounded-3xl bg-slate-800/60 border border-slate-700/60 space-y-4">
        <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
          <PieChart className="w-4 h-4 text-indigo-400" />
          <span>Category Performance</span>
        </h3>

        <div className="space-y-3">
          {analyticsData?.categoryCounts &&
            Object.entries(analyticsData.categoryCounts).map(([cat, info]: any) => {
              const catRate = info.total > 0 ? Math.round((info.completed / info.total) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold">{cat}</span>
                    <span>
                      {info.completed}/{info.total} completed ({catRate}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${catRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
