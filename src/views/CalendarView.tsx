import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Task } from '../types';
import { TaskCard } from '../components/TaskCard';

interface CalendarViewProps {
  tasks: Task[];
  onCompleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onDuplicateTask: (id: string) => void;
  onRescheduleTask: (task: Task) => void;
  onOpenCreateTask: (selectedDate?: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onCompleteTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onRescheduleTask,
  onOpenCreateTask,
}) => {
  // Current calendar viewing month and year
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(10); // 0-indexed: 10 = November
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-11-01');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Jump to future milestones
  const jumpTo = (year: number, month: number, day: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    setSelectedDateStr(`${year}-${mStr}-${dStr}`);
  };

  // Build calendar matrix
  const firstDayOfWeek = new Date(Date.UTC(currentYear, currentMonth, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0)).getUTCDate();

  const days: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];
  // Pad previous month days
  const prevMonthDays = new Date(Date.UTC(currentYear, currentMonth, 0)).getUTCDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const prevM = currentMonth === 0 ? 12 : currentMonth;
    const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
    days.push({
      day: d,
      dateStr: `${prevY}-${String(prevM).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = String(d).padStart(2, '0');
    const mStr = String(currentMonth + 1).padStart(2, '0');
    days.push({
      day: d,
      dateStr: `${currentYear}-${mStr}-${dStr}`,
      isCurrentMonth: true,
    });
  }

  // Filter tasks for selected date
  const tasksForSelectedDate = tasks.filter((t) => t.deadlineDate === selectedDateStr);

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto px-4 pt-2">
      {/* Calendar Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-400" />
            <span>Interactive Calendar & Timeline</span>
          </h2>
          <p className="text-xs text-slate-400">
            View plans for any month in 2026, 2027, or beyond
          </p>
        </div>

        {/* Quick Future Jumps */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => jumpTo(2026, 10, 1)}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 cursor-pointer"
          >
            Today (Nov 1)
          </button>
          <button
            onClick={() => jumpTo(2027, 0, 1)}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer"
          >
            Jan 2027 (College Submissions)
          </button>
          <button
            onClick={() => jumpTo(2027, 4, 1)}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 cursor-pointer"
          >
            May 2027 (6 Months)
          </button>
        </div>
      </div>

      {/* Month Navigator Toolbar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-xl hover:bg-slate-700 text-slate-300 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="font-extrabold text-base sm:text-lg text-white tracking-wide">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-xl hover:bg-slate-700 text-slate-300 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenCreateTask(selectedDateStr)}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add on this day</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid (Month View) */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 p-3 sm:p-4 shadow-xl">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 pb-2 border-b border-slate-700/60">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-2">
          {days.map((item, idx) => {
            const isSelected = item.dateStr === selectedDateStr;
            const isToday = item.dateStr === '2026-11-01';
            const dayTasks = tasks.filter((t) => t.deadlineDate === item.dateStr);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDateStr(item.dateStr)}
                className={`min-h-[58px] sm:min-h-[72px] p-1.5 rounded-xl flex flex-col justify-between text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-indigo-600/30 border-2 border-indigo-500 text-white shadow-md'
                    : item.isCurrentMonth
                    ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/40'
                    : 'bg-slate-900/40 text-slate-600 border border-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-bold px-1 rounded-md ${
                      isToday
                        ? 'bg-amber-500 text-slate-950 font-extrabold'
                        : isSelected
                        ? 'text-indigo-300'
                        : ''
                    }`}
                  >
                    {item.day}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1 rounded">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Event dots */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {dayTasks.slice(0, 3).map((t, tIdx) => (
                    <span
                      key={tIdx}
                      className={`w-1.5 h-1.5 rounded-full ${
                        t.priority === 'Critical'
                          ? 'bg-red-400'
                          : t.priority === 'High'
                          ? 'bg-amber-400'
                          : 'bg-indigo-400'
                      }`}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <span className="text-[9px] text-slate-400">+</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">
              Agenda for {selectedDateStr}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-indigo-500/30">
              {tasksForSelectedDate.length} {tasksForSelectedDate.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          <button
            onClick={() => onOpenCreateTask(selectedDateStr)}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add task for this date</span>
          </button>
        </div>

        {tasksForSelectedDate.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-800/30 border border-slate-800 space-y-2">
            <p className="text-xs sm:text-sm text-slate-400">
              No tasks scheduled for {selectedDateStr}.
            </p>
            <button
              onClick={() => onOpenCreateTask(selectedDateStr)}
              className="text-xs text-indigo-400 hover:underline font-medium cursor-pointer"
            >
              + Tap to schedule an event or task on this date
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tasksForSelectedDate.map((t) => (
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
    </div>
  );
};
