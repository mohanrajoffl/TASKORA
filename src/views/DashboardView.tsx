import React from 'react';
import {
  Flame,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
  Compass,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { Task, UserProfile, RewardState } from '../types';
import { TaskCard } from '../components/TaskCard';
import { StreakTimeline } from '../components/StreakTimeline';

interface DashboardViewProps {
  tasks: Task[];
  profile: UserProfile | null;
  rewards: RewardState | null;
  onNavigate: (tab: string) => void;
  onOpenCreateTask: () => void;
  onOpenGoalPlanner: () => void;
  onCompleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onDuplicateTask: (id: string) => void;
  onRescheduleTask: (task: Task) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  profile,
  rewards,
  onNavigate,
  onOpenCreateTask,
  onOpenGoalPlanner,
  onCompleteTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onRescheduleTask,
}) => {
  const todayStr = '2026-11-01';

  // Tasks for today
  const todayTasks = tasks.filter(
    (t) => t.startDate <= todayStr && t.deadlineDate >= todayStr
  );
  const completedToday = todayTasks.filter((t) => t.status === 'Completed').length;
  const todayPercentage =
    todayTasks.length > 0
      ? Math.round((completedToday / todayTasks.length) * 100)
      : 100;

  // Upcoming future tasks (beyond today)
  const upcomingTasks = tasks
    .filter((t) => t.deadlineDate > todayStr && t.status !== 'Completed')
    .slice(0, 4);

  // Personalized greeting based on time of day and personality
  const getGreeting = () => {
    const name = profile?.name || 'Machi';
    const lang = profile?.preferredLanguage || 'Tanglish';
    if (lang === 'Tanglish' || lang === 'Tamil') {
      return `Vanakkam ${name}! Ready to crush your goals today?`;
    }
    return `Good morning, ${name}! Let's make today count.`;
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 pt-2">
      {/* Top Banner / Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/90 via-slate-900 to-indigo-950/80 border border-indigo-700/40 p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Sunday, November 1, 2026
              </span>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                {rewards?.currentStreak || 4}-Day Streak
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {getGreeting()}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Plan smart today and stay ahead of your long-term milestones. You have{' '}
              <span className="text-amber-300 font-bold">{todayTasks.length - completedToday}</span> pending
              tasks today and{' '}
              <span className="text-indigo-300 font-bold">{tasks.length} total planned</span> across future dates.
            </p>
          </div>

          {/* Quick Action CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenCreateTask}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-amber-500 hover:from-indigo-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
            <button
              onClick={() => onNavigate('ai')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-indigo-300 text-xs sm:text-sm font-semibold border border-indigo-500/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ask Machi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Productivity Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Productivity Rate */}
        <div className="rounded-2xl bg-slate-800/70 border border-slate-700/60 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Today's Progress</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              {todayPercentage}%
            </span>
            <span className="text-xs text-slate-400">
              {completedToday}/{todayTasks.length} done
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${todayPercentage}%` }}
            />
          </div>
        </div>

        {/* Reward Points */}
        <div
          onClick={() => onNavigate('rewards')}
          className="rounded-2xl bg-slate-800/70 border border-slate-700/60 p-4 cursor-pointer hover:border-amber-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Taskora Points</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-300">
              {rewards?.points || 0}
            </span>
            <span className="text-[11px] text-amber-500 font-semibold">
              Level {rewards?.level || 1}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            {rewards?.levelTitle || 'Momentum Builder'}
          </p>
        </div>

        {/* Current Streak */}
        <div
          onClick={() => onNavigate('rewards')}
          className="rounded-2xl bg-slate-800/70 border border-slate-700/60 p-4 cursor-pointer hover:border-orange-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-orange-400">
              {rewards?.currentStreak || 4}
            </span>
            <span className="text-xs text-slate-400">days active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Best: {rewards?.longestStreak || 7} days 🔥
          </p>
        </div>

        {/* Future Tasks Count */}
        <div
          onClick={() => onNavigate('calendar')}
          className="rounded-2xl bg-slate-800/70 border border-slate-700/60 p-4 cursor-pointer hover:border-indigo-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Future Scheduled</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-300">
              {tasks.filter((t) => t.deadlineDate > todayStr).length}
            </span>
            <span className="text-xs text-slate-400">future plans</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            Up to 1 yr in advance 🚀
          </p>
        </div>
      </div>

      {/* AI Companion Quick Prompt Card */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">
              Taskora AI Companion is standing by
            </p>
            <p className="text-xs text-slate-300">
              "Naalaiku morning 7 AM-ku Java study plan pannalama machi?"
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('ai')}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 cursor-pointer"
        >
          Chat Now
        </button>
      </div>

      {/* Interactive Streaks Horizontal Timeline */}
      <StreakTimeline
        tasks={tasks}
        rewards={rewards}
        onNavigateToRewards={() => onNavigate('rewards')}
      />

      {/* Today's Tasks Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              Today's Schedule
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {todayTasks.length}
            </span>
          </div>

          <button
            onClick={() => onNavigate('tasks')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-800/30 border border-slate-800 space-y-2">
            <p className="text-sm font-semibold text-slate-300">
              No tasks scheduled for today yet!
            </p>
            <p className="text-xs text-slate-500">
              Create a task or tell Taskora AI what you want to achieve today.
            </p>
            <button
              onClick={onOpenCreateTask}
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task for Today
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {todayTasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onComplete={onCompleteTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onDuplicate={onDuplicateTask}
                onReschedule={onRescheduleTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* Future Date Tasks Preview Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Upcoming Future Milestones
            </h3>
            <p className="text-xs text-slate-400">
              Scheduled 1 month, 2 months, 6 months & 1 year ahead
            </p>
          </div>

          <button
            onClick={() => onNavigate('calendar')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Calendar View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {upcomingTasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onComplete={onCompleteTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onDuplicate={onDuplicateTask}
              onReschedule={onRescheduleTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
