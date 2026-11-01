import React, { useState } from 'react';
import {
  X,
  Compass,
  Sparkles,
  Calendar,
  CheckCircle,
  RefreshCw,
  ArrowRight,
  Layers,
  Clock,
} from 'lucide-react';
import { api } from '../api/client';
import { GoalPlanBreakdown, Task } from '../types';

interface GoalPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMilestonesToTasks: (tasks: Partial<Task>[]) => void;
}

export const GoalPlannerModal: React.FC<GoalPlannerModalProps> = ({
  isOpen,
  onClose,
  onAddMilestonesToTasks,
}) => {
  const [goalInput, setGoalInput] = useState('I want to become an AI Engineer in six months');
  const [timeframe, setTimeframe] = useState('6 months');
  const [isLoading, setIsLoading] = useState(false);
  const [breakdown, setBreakdown] = useState<GoalPlanBreakdown | null>(null);

  if (!isOpen) return null;

  const handleGeneratePlan = async (customGoal?: string) => {
    const goal = customGoal || goalInput;
    if (!goal.trim()) return;

    setIsLoading(true);
    try {
      const plan = await api.planGoalWithAI(goal, timeframe);
      setBreakdown(plan);
    } catch (err) {
      console.error('Error planning goal:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommitToTaskora = () => {
    if (!breakdown || !breakdown.phases) return;

    const tasksToCreate: Partial<Task>[] = [];

    breakdown.phases.forEach((phase) => {
      phase.milestones.forEach((m) => {
        tasksToCreate.push({
          title: m.title,
          description: `${phase.phaseName}: ${m.description}`,
          startDate: '2026-11-01',
          startTime: '09:00',
          deadlineDate: m.suggestedDeadline,
          deadlineTime: '18:00',
          category: m.category || 'Career',
          priority: m.priority || 'High',
          reminders: (m.reminders || ['1_week', '1_day']).map((p: any) => ({ preset: p })) as any,
          notes: `Generated via AI Goal Planner for "${breakdown.goalTitle}"`,
          subtasks: [],
        });
      });
    });

    onAddMilestonesToTasks(tasksToCreate);
    onClose();
  };

  const suggestedGoals = [
    'I want to become an AI Engineer in six months',
    'Prepare for Civil Services Examination in one year',
    'Launch my B2B SaaS MVP and get first 10 customers in 3 months',
    'Run a Half-Marathon and build peak fitness in 4 months',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                AI Goal Decomposition Engine
              </h3>
              <p className="text-xs text-slate-400">
                Transform big dreams into scheduled monthly & weekly milestones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <div className="py-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              What is your big goal?
            </label>
            <input
              type="text"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="e.g. Become an AI Engineer in six months..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-medium">Timeline:</label>
            {['3 months', '6 months', '1 year'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  timeframe === t
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {suggestedGoals.map((sg, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setGoalInput(sg);
                  handleGeneratePlan(sg);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-indigo-300 border border-slate-700/60 cursor-pointer"
              >
                {sg}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleGeneratePlan()}
            disabled={isLoading || !goalInput.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-amber-500 hover:from-indigo-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Designing Milestones & Roadmap...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Step-by-Step Roadmap</span>
              </>
            )}
          </button>
        </div>

        {/* Results Roadmap */}
        {breakdown && (
          <div className="flex-1 overflow-y-auto space-y-4 pt-2 border-t border-slate-800 pr-1">
            <div className="bg-slate-800/60 p-3 rounded-2xl border border-indigo-500/30">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                {breakdown.goalTitle} ({breakdown.timeline})
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {breakdown.summary}
              </p>
            </div>

            <div className="space-y-3">
              {breakdown.phases.map((phase, pIdx) => (
                <div
                  key={pIdx}
                  className="p-3 rounded-2xl bg-slate-800/30 border border-slate-700/50 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300 uppercase tracking-wide">
                      {phase.phaseName}
                    </span>
                    <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                      {phase.duration}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {phase.milestones.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start justify-between gap-2 text-xs"
                      >
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-100 block">
                            {m.title}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            {m.description}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-indigo-300 font-semibold bg-indigo-500/20 px-2 py-0.5 rounded-md block mb-1">
                            {m.suggestedDeadline}
                          </span>
                          <span className="text-[10px] text-amber-400 font-medium">
                            {m.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Commit Button */}
            <div className="sticky bottom-0 pt-3 pb-1 bg-slate-900 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleCommitToTaskora}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30 cursor-pointer"
              >
                <span>Add All Milestones to Taskora Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
