import React, { useState } from 'react';
import { X, CalendarClock, Clock, Calendar, ArrowRight } from 'lucide-react';
import { Task } from '../types';

interface RescheduleModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (taskId: string, newDate: string, newTime?: string) => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  task,
  isOpen,
  onClose,
  onReschedule,
}) => {
  const [newDate, setNewDate] = useState('2026-11-02');
  const [newTime, setNewTime] = useState('09:00');

  if (!isOpen || !task) return null;

  const handleQuickShift = (days: number) => {
    const base = new Date(task.deadlineDate || '2026-11-01');
    base.setDate(base.getDate() + days);
    const y = base.getFullYear();
    const m = String(base.getMonth() + 1).padStart(2, '0');
    const d = String(base.getDate()).padStart(2, '0');
    setNewDate(`${y}-${m}-${d}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;
    onReschedule(task.id, newDate, newTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Reschedule Task</h3>
              <p className="text-xs text-slate-400">Adjust date and recalculate reminders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Info */}
        <div className="my-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
          <span className="font-semibold text-white block truncate">{task.title}</span>
          <span className="text-slate-400 mt-1 block">
            Current Deadline: {task.deadlineDate} @ {task.deadlineTime || '18:00'}
          </span>
        </div>

        {/* Quick Shift Presets */}
        <div className="mb-4 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Quick Shift
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickShift(1)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 cursor-pointer"
            >
              +1 Day (Tomorrow)
            </button>
            <button
              type="button"
              onClick={() => handleQuickShift(3)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 cursor-pointer"
            >
              +3 Days
            </button>
            <button
              type="button"
              onClick={() => handleQuickShift(7)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 cursor-pointer"
            >
              +1 Week
            </button>
            <button
              type="button"
              onClick={() => handleQuickShift(30)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer"
            >
              +1 Month
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                New Deadline Date *
              </label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                New Deadline Time
              </label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <span>Confirm Reschedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
