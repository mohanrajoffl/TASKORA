import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Bell,
  Repeat,
  Plus,
  Trash2,
  Sparkles,
  Check,
} from 'lucide-react';
import {
  Task,
  TaskCategory,
  TaskPriority,
  ReminderPreset,
  RecurrenceType,
} from '../types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Partial<Task>) => void;
  initialTask?: Task | null;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('2026-11-01');
  const [startTime, setStartTime] = useState('09:00');
  const [deadlineDate, setDeadlineDate] = useState('2026-11-01');
  const [deadlineTime, setDeadlineTime] = useState('18:00');
  const [category, setCategory] = useState<TaskCategory>('Education');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [notes, setNotes] = useState('');
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none');
  const [selectedReminders, setSelectedReminders] = useState<ReminderPreset[]>([
    '30_mins',
  ]);
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setStartDate(initialTask.startDate || '2026-11-01');
      setStartTime(initialTask.startTime || '09:00');
      setDeadlineDate(initialTask.deadlineDate || '2026-11-01');
      setDeadlineTime(initialTask.deadlineTime || '18:00');
      setCategory(initialTask.category || 'Education');
      setPriority(initialTask.priority || 'Medium');
      setNotes(initialTask.notes || '');
      setRecurrenceType(initialTask.recurrence?.type || 'none');
      setSelectedReminders(
        initialTask.reminders?.map((r) => r.preset) || ['30_mins']
      );
      setSubtasks(initialTask.subtasks || []);
    } else {
      // Default reset
      setTitle('');
      setDescription('');
      setStartDate('2026-11-01');
      setStartTime('09:00');
      setDeadlineDate('2026-11-01');
      setDeadlineTime('18:00');
      setCategory('Education');
      setPriority('Medium');
      setNotes('');
      setRecurrenceType('none');
      setSelectedReminders(['30_mins']);
      setSubtasks([]);
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  // Quick Future Date Presets
  const handleQuickPreset = (presetName: string) => {
    const base = new Date('2026-11-01T00:00:00Z');
    let target = new Date(base);

    switch (presetName) {
      case 'today':
        target = new Date('2026-11-01T00:00:00Z');
        break;
      case 'tomorrow':
        target = new Date('2026-11-02T00:00:00Z');
        break;
      case 'next_week':
        target = new Date('2026-11-08T00:00:00Z');
        break;
      case 'next_month':
        target = new Date('2026-12-01T00:00:00Z');
        break;
      case '2_months':
        target = new Date('2027-01-01T00:00:00Z');
        break;
      case '6_months':
        target = new Date('2027-05-01T00:00:00Z');
        break;
      case '1_year':
        target = new Date('2027-11-01T00:00:00Z');
        break;
    }

    const y = target.getUTCFullYear();
    const m = String(target.getUTCMonth() + 1).padStart(2, '0');
    const d = String(target.getUTCDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    setDeadlineDate(dateStr);
  };

  const categories: TaskCategory[] = [
    'Education',
    'Career',
    'Personal',
    'Health',
    'Fitness',
    'Work',
    'Projects',
    'Finance',
    'Events',
    'Other',
  ];

  const priorities: TaskPriority[] = ['Critical', 'High', 'Medium', 'Low'];

  // All 16 advance reminder presets from prompt specification
  const reminderOptions: { id: ReminderPreset; label: string; group: string }[] = [
    { id: '12_months', label: '12 months before', group: 'Long-term' },
    { id: '6_months', label: '6 months before', group: 'Long-term' },
    { id: '3_months', label: '3 months before', group: 'Long-term' },
    { id: '2_months', label: '2 months before', group: 'Mid-term' },
    { id: '1_month', label: '1 month before', group: 'Mid-term' },
    { id: '2_weeks', label: '2 weeks before', group: 'Mid-term' },
    { id: '1_week', label: '1 week before', group: 'Short-term' },
    { id: '3_days', label: '3 days before', group: 'Short-term' },
    { id: '2_days', label: '2 days before', group: 'Short-term' },
    { id: '1_day', label: '1 day before', group: 'Short-term' },
    { id: '12_hours', label: '12 hours before', group: 'Immediate' },
    { id: '6_hours', label: '6 hours before', group: 'Immediate' },
    { id: '1_hour', label: '1 hour before', group: 'Immediate' },
    { id: '30_mins', label: '30 mins before', group: 'Immediate' },
    { id: '15_mins', label: '15 mins before', group: 'Immediate' },
    { id: '5_mins', label: '5 mins before', group: 'Immediate' },
  ];

  const toggleReminder = (preset: ReminderPreset) => {
    if (selectedReminders.includes(preset)) {
      setSelectedReminders(selectedReminders.filter((r) => r !== preset));
    } else {
      setSelectedReminders([...selectedReminders, preset]);
    }
  };

  const handleAddSubtask = () => {
    if (!newSubtaskInput.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        title: newSubtaskInput.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskInput('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const remindersPayload = selectedReminders.map((preset) => ({
      preset,
    }));

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      startDate,
      startTime,
      deadlineDate,
      deadlineTime,
      category,
      priority,
      notes: notes.trim(),
      recurrence: { type: recurrenceType },
      reminders: remindersPayload as any,
      subtasks,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {initialTask ? 'Edit Task' : 'Create New Task'}
              </h3>
              <p className="text-xs text-slate-400">
                Schedule for today or any future date (months/year ahead)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. College Project Submission, Semester Exam, Java Study"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Objectives
            </label>
            <textarea
              rows={2}
              placeholder="Provide context, deliverables, or checklist notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p} {p === 'Critical' ? '(+25 pts)' : p === 'High' ? '(+20 pts)' : p === 'Medium' ? '(+15 pts)' : '(+10 pts)'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Future Date Scheduling Helpers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Quick Future Date Presets
              </label>
              <span className="text-[11px] text-indigo-400 font-medium">
                Never restricted to just today!
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'today', label: 'Today (Nov 1)' },
                { id: 'tomorrow', label: 'Tomorrow' },
                { id: 'next_week', label: 'Next Week' },
                { id: 'next_month', label: 'Next Month (Dec 1)' },
                { id: '2_months', label: '2 Months (Jan 1, 2027)' },
                { id: '6_months', label: '6 Months (May 1, 2027)' },
                { id: '1_year', label: '1 Year (Nov 1, 2027)' },
              ].map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => handleQuickPreset(preset.id)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-indigo-600/30 hover:text-indigo-200 border border-slate-700 hover:border-indigo-500/50 text-slate-300 transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dates & Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
            {/* Start Date / Time */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Start Schedule
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Deadline Date / Time */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Deadline Schedule *
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  required
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 font-semibold text-amber-200"
                />
                <input
                  type="time"
                  required
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* ADVANCED SMART REMINDERS CONFIGURATION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                Advanced Smart Reminders ({selectedReminders.length} selected)
              </label>
              <span className="text-[11px] text-slate-400">
                Select multiple advance notifications
              </span>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 p-3.5 rounded-2xl max-h-48 overflow-y-auto space-y-3">
              {['Long-term', 'Mid-term', 'Short-term', 'Immediate'].map((group) => {
                const groupItems = reminderOptions.filter((r) => r.group === group);
                return (
                  <div key={group} className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {group} Reminders
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {groupItems.map((opt) => {
                        const isSelected = selectedReminders.includes(opt.id);
                        return (
                          <button
                            type="button"
                            key={opt.id}
                            onClick={() => toggleReminder(opt.id)}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                                : 'bg-slate-800/90 text-slate-300 border-slate-700/60 hover:bg-slate-700'
                            }`}
                          >
                            <span className="truncate">{opt.label}</span>
                            {isSelected && <Check className="w-3 h-3 text-amber-400 ml-1 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recurrence Settings */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-indigo-400" />
              Recurrence Schedule
            </label>
            <select
              value={recurrenceType}
              onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="none">One-time Task</option>
              <option value="daily">Every Day</option>
              <option value="weekdays">Every Weekday (Mon - Fri)</option>
              <option value="weekly">Every Week</option>
              <option value="biweekly">Every Two Weeks</option>
              <option value="monthly">Every Month</option>
              <option value="yearly">Every Year</option>
            </select>
          </div>

          {/* Subtasks / Checklist */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Subtasks / Milestones
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add subtask or step..."
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-200"
                  >
                    <span>{sub.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(sub.id)}
                      className="text-slate-400 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Additional Notes
            </label>
            <textarea
              rows={2}
              placeholder="Important references, links, or instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-amber-500 hover:from-indigo-600 hover:to-amber-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              {initialTask ? 'Save Changes' : 'Schedule Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
