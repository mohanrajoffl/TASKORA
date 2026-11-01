import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Layers,
  Sparkles,
  CalendarClock,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '../types';
import { TaskCard } from '../components/TaskCard';

interface TasksViewProps {
  tasks: Task[];
  onCompleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onDuplicateTask: (id: string) => void;
  onRescheduleTask: (task: Task) => void;
  onOpenCreateTask: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onCompleteTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onRescheduleTask,
  onOpenCreateTask,
}) => {
  const [activeRange, setActiveRange] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = '2026-11-01';
  const tomorrowStr = '2026-11-02';
  const weekEndStr = '2026-11-08';
  const nextMonthStartStr = '2026-12-01';
  const nextYearStartStr = '2027-01-01';

  // Range filter tabs
  const rangeTabs = [
    { id: 'all', label: 'All Tasks' },
    { id: 'today', label: 'Today' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'week', label: 'This Week' },
    { id: 'next_month', label: 'Next Month' },
    { id: 'future', label: '2M - 1Y+ Future' },
    { id: 'completed', label: 'Completed' },
  ];

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

  // Filtering
  const filteredTasks = tasks.filter((task) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        task.title.toLowerCase().includes(q) ||
        task.description?.toLowerCase().includes(q) ||
        task.notes?.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Category
    if (selectedCategory !== 'all' && task.category !== selectedCategory) {
      return false;
    }

    // Priority
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
      return false;
    }

    // Status
    if (selectedStatus !== 'all' && task.status !== selectedStatus) {
      return false;
    }

    // Range
    if (activeRange === 'today') {
      return task.startDate <= todayStr && task.deadlineDate >= todayStr;
    }
    if (activeRange === 'tomorrow') {
      return task.deadlineDate === tomorrowStr;
    }
    if (activeRange === 'week') {
      return task.deadlineDate >= todayStr && task.deadlineDate <= weekEndStr;
    }
    if (activeRange === 'next_month') {
      return task.deadlineDate >= nextMonthStartStr && task.deadlineDate < '2027-01-01';
    }
    if (activeRange === 'future') {
      return task.deadlineDate >= nextYearStartStr;
    }
    if (activeRange === 'completed') {
      return task.status === 'Completed';
    }

    return true;
  });

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto px-4 pt-2">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Task Management & Future Schedule</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filteredTasks.length} tasks
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Create and track tasks for any date: today, tomorrow, or up to 1 year ahead
          </p>
        </div>

        <button
          onClick={onOpenCreateTask}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-amber-500 hover:from-indigo-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Range Presets Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {rangeTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveRange(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeRange === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Secondary Filter Row */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, notes, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Task List Grid */}
      {filteredTasks.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-slate-800/30 border border-slate-800 space-y-3">
          <CalendarClock className="w-10 h-10 text-slate-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">
            No tasks found in this view
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search or create a new future milestone for this date range.
          </p>
          <button
            onClick={onOpenCreateTask}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Schedule New Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredTasks.map((t) => (
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
  );
};
