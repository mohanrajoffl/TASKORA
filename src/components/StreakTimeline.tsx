import React, { useState } from 'react';
import { Flame, CheckCircle2, AlertCircle, CircleSlash, Sparkles, Trophy } from 'lucide-react';
import { Task, RewardState } from '../types';

interface StreakTimelineProps {
  tasks: Task[];
  rewards: RewardState | null;
  onNavigateToRewards?: () => void;
}

interface DayStreakInfo {
  dateStr: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
  status: 'completed_all' | 'partial' | 'missed';
  totalTasks: number;
  completedTasks: number;
  pointsEarned: number;
  isToday: boolean;
}

export const StreakTimeline: React.FC<StreakTimelineProps> = ({
  tasks,
  rewards,
  onNavigateToRewards,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('2026-11-01');
  const [animatingDay, setAnimatingDay] = useState<string | null>(null);

  // Generate the last 7 days ending at Sunday, Nov 1, 2026
  const baseDate = new Date('2026-11-01T12:00:00Z');
  const todayStr = '2026-11-01';

  // Calculate today's actual live tasks
  const todayTasks = tasks.filter(
    (t) => t.startDate <= todayStr && t.deadlineDate >= todayStr
  );
  const completedToday = todayTasks.filter((t) => t.status === 'Completed').length;
  const todayPoints = todayTasks
    .filter((t) => t.status === 'Completed')
    .reduce((sum, t) => sum + (t.pointsValue || 15), 0);

  // Mock historical log for previous 6 days aligned with current 4-day streak
  const historicalData: Record<
    string,
    { total: number; completed: number; points: number }
  > = {
    '2026-10-26': { total: 2, completed: 0, points: 0 }, // Mon - Missed (gray)
    '2026-10-27': { total: 1, completed: 0, points: 0 }, // Tue - Missed (gray)
    '2026-10-28': { total: 3, completed: 1, points: 20 }, // Wed - Partial (amber)
    '2026-10-29': { total: 3, completed: 3, points: 55 }, // Thu - Streak Day 1 (green)
    '2026-10-30': { total: 2, completed: 2, points: 40 }, // Fri - Streak Day 2 (green)
    '2026-10-31': { total: 4, completed: 4, points: 75 }, // Sat - Streak Day 3 (green)
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const last7Days: DayStreakInfo[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setUTCDate(baseDate.getUTCDate() - i);

    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const isToday = dateStr === todayStr;

    let total = 0;
    let completed = 0;
    let points = 0;
    let status: 'completed_all' | 'partial' | 'missed' = 'missed';

    if (isToday) {
      total = todayTasks.length;
      completed = completedToday;
      points = todayPoints;

      if (total > 0 && completed === total) {
        status = 'completed_all';
      } else if (completed > 0) {
        status = 'partial';
      } else {
        status = 'missed';
      }
    } else {
      const hist = historicalData[dateStr] || { total: 0, completed: 0, points: 0 };
      total = hist.total;
      completed = hist.completed;
      points = hist.points;

      if (total > 0 && completed === total) {
        status = 'completed_all';
      } else if (completed > 0) {
        status = 'partial';
      } else {
        status = 'missed';
      }
    }

    last7Days.push({
      dateStr,
      dayName: dayNames[d.getUTCDay()],
      dayNumber: d.getUTCDate(),
      monthName: monthNames[d.getUTCMonth()],
      status,
      totalTasks: total,
      completedTasks: completed,
      pointsEarned: points,
      isToday,
    });
  }

  const handleDayClick = (dayInfo: DayStreakInfo) => {
    setSelectedDay(dayInfo.dateStr);

    // Trigger Flame Animation when clicked
    if (dayInfo.status === 'completed_all' || dayInfo.status === 'partial') {
      setAnimatingDay(dayInfo.dateStr);
      setTimeout(() => {
        setAnimatingDay(null);
      }, 1200);

      // Web Audio pop tone
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
        }
      } catch {
        // audio optional
      }
    }
  };

  const selectedInfo = last7Days.find((d) => d.dateStr === selectedDay) || last7Days[6];

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shadow-md shadow-orange-500/20">
            <Flame className="w-5 h-5 fill-orange-400/20 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white">
                Daily Consistency Streak
              </h3>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-orange-400" />
                {rewards?.currentStreak || 4} Days Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive 7-day activity timeline • Click any day for details
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50" />
            <span>Completed All</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-500/50" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <span>Missed</span>
          </div>
        </div>
      </div>

      {/* Horizontal Timeline Track */}
      <div className="relative pt-2 pb-1">
        {/* Connector Line behind nodes */}
        <div className="absolute top-[34px] left-6 right-6 h-1 bg-slate-800 rounded-full z-0 hidden sm:block" />

        <div className="grid grid-cols-7 gap-1.5 sm:gap-3 relative z-10">
          {last7Days.map((item) => {
            const isSelected = item.dateStr === selectedDay;
            const isAnimating = animatingDay === item.dateStr;

            // Indicator styles
            let statusBadge = 'border-slate-700 bg-slate-800/80 text-slate-400';
            let circleColor = 'bg-slate-700 text-slate-400';
            let glow = '';

            if (item.status === 'completed_all') {
              statusBadge = 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300';
              circleColor = 'bg-emerald-500 text-slate-950';
              glow = 'shadow-md shadow-emerald-500/30';
            } else if (item.status === 'partial') {
              statusBadge = 'border-amber-500/40 bg-amber-950/40 text-amber-300';
              circleColor = 'bg-amber-400 text-slate-950';
              glow = 'shadow-md shadow-amber-500/30';
            } else {
              statusBadge = 'border-slate-800 bg-slate-900/60 text-slate-500';
              circleColor = 'bg-slate-800 text-slate-600';
            }

            return (
              <button
                key={item.dateStr}
                type="button"
                onClick={() => handleDayClick(item)}
                className={`relative flex flex-col items-center p-2 rounded-2xl border transition-all cursor-pointer ${statusBadge} ${
                  isSelected ? 'ring-2 ring-indigo-500 scale-[1.03] bg-slate-800/90' : 'hover:scale-[1.02]'
                }`}
              >
                {/* Day name & date */}
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400">
                  {item.dayName}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-white mt-0.5">
                  {item.dayNumber}
                </span>

                {/* Status Dot / Flame Node */}
                <div
                  className={`mt-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-transform ${circleColor} ${glow} ${
                    isAnimating ? 'scale-125 rotate-12' : ''
                  }`}
                >
                  {item.status === 'completed_all' ? (
                    <Flame className={`w-4 h-4 fill-current ${isAnimating ? 'animate-bounce' : ''}`} />
                  ) : item.status === 'partial' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <CircleSlash className="w-3 h-3 text-slate-500" />
                  )}
                </div>

                {/* Flame Particle Overlay on click */}
                {isAnimating && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-orange-400 opacity-75" />
                    <span className="relative text-base">🔥</span>
                  </div>
                )}

                {/* Today Pill */}
                {item.isToday && (
                  <span className="mt-1 text-[9px] font-extrabold text-amber-300 bg-amber-500/20 px-1 rounded uppercase tracking-wider">
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Panel */}
      {selectedInfo && (
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                selectedInfo.status === 'completed_all'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : selectedInfo.status === 'partial'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              <Trophy className="w-5 h-5" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-white">
                  {selectedInfo.monthName} {selectedInfo.dayNumber}, 2026 ({selectedInfo.dayName})
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedInfo.status === 'completed_all'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : selectedInfo.status === 'partial'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {selectedInfo.status === 'completed_all'
                    ? '100% Completed'
                    : selectedInfo.status === 'partial'
                    ? 'Partially Completed'
                    : 'Missed / Rest Day'}
                </span>
              </div>

              <p className="text-xs text-slate-300">
                {selectedInfo.completedTasks} of {selectedInfo.totalTasks} tasks finished •{' '}
                <span className="text-amber-300 font-semibold">
                  +{selectedInfo.pointsEarned} XP points earned
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {selectedInfo.status === 'completed_all' ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/30">
                <Flame className="w-4 h-4 fill-orange-400 animate-pulse" />
                <span>Streak Protected</span>
              </div>
            ) : selectedInfo.status === 'partial' ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
                <Sparkles className="w-4 h-4" />
                <span>Finish pending tasks to level up</span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-xl">
                <span>Maintain habit rhythm</span>
              </div>
            )}

            {onNavigateToRewards && (
              <button
                onClick={onNavigateToRewards}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
              >
                Streak perks →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
