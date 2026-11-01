import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  AlertTriangle,
  Repeat,
  Bell,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  CalendarClock,
  CheckSquare,
} from 'lucide-react';
import { Task, TaskPriority, TaskCategory } from '../types';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onReschedule: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete,
  onEdit,
  onDelete,
  onDuplicate,
  onReschedule,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const isCompleted = task.status === 'Completed';

  // Category styles
  const categoryColors: Record<TaskCategory, string> = {
    Education: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    Career: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    Personal: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    Health: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    Fitness: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    Work: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    Projects: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    Finance: 'bg-lime-500/15 text-lime-300 border-lime-500/30',
    Events: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
    Other: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  };

  // Priority styles
  const priorityStyles: Record<TaskPriority, { badge: string; border: string }> = {
    Critical: {
      badge: 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse',
      border: 'border-l-4 border-l-red-500',
    },
    High: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      border: 'border-l-4 border-l-amber-500',
    },
    Medium: {
      badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      border: 'border-l-4 border-l-sky-500',
    },
    Low: {
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      border: 'border-l-4 border-l-emerald-500',
    },
  };

  // Check how far in future the deadline is
  const formatFutureDistance = (deadlineDate: string) => {
    const today = new Date('2026-11-01');
    const target = new Date(deadlineDate);
    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)}d Overdue`;
    if (diffDays > 300) return `~1 Year Ahead (${deadlineDate})`;
    if (diffDays > 150) return `~6 Months Ahead (${deadlineDate})`;
    if (diffDays > 50) return `~2 Months Ahead (${deadlineDate})`;
    if (diffDays > 25) return `~1 Month Ahead (${deadlineDate})`;
    return `In ${diffDays} days (${deadlineDate})`;
  };

  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div
      className={`relative group rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 p-4 transition-all duration-200 shadow-sm hover:shadow-md hover:border-slate-600 ${
        priorityStyles[task.priority]?.border || ''
      } ${isCompleted ? 'opacity-70 bg-slate-800/40' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Completion Checkbox */}
        <button
          onClick={() => onComplete(task.id)}
          className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
          title={isCompleted ? 'Task completed' : 'Mark as completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
          ) : (
            <Circle className="w-5 h-5 hover:stroke-indigo-400" />
          )}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4
              className={`font-semibold text-sm sm:text-base text-slate-100 truncate ${
                isCompleted ? 'line-through text-slate-400' : ''
              }`}
            >
              {task.title}
            </h4>

            {/* Overflow Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-6 z-30 w-44 rounded-xl bg-slate-900 border border-slate-700 shadow-xl py-1 text-xs">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onReschedule(task);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-slate-800 cursor-pointer"
                    >
                      <CalendarClock className="w-3.5 h-3.5 text-amber-400" />
                      Reschedule
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onEdit(task);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-slate-800 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                      Edit Details
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDuplicate(task.id);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-slate-800 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-purple-400" />
                      Duplicate Task
                    </button>
                    <div className="my-1 border-t border-slate-800" />
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(task.id);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Meta Tags: Category, Priority, Points */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-lg border ${
                categoryColors[task.category] || categoryColors.Other
              }`}
            >
              {task.category}
            </span>

            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${
                priorityStyles[task.priority]?.badge
              }`}
            >
              {task.priority}
            </span>

            <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              +{task.pointsValue || 15} pts
            </span>

            {task.recurrence && task.recurrence.type !== 'none' && (
              <span className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                <Repeat className="w-3 h-3" />
                <span className="capitalize">{task.recurrence.type}</span>
              </span>
            )}
          </div>

          {/* Timing & Future Scheduling Info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 pt-2.5 border-t border-slate-700/50 text-xs text-slate-300">
            {/* Deadline */}
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{formatFutureDistance(task.deadlineDate)}</span>
              {task.deadlineTime && (
                <span className="text-slate-400">@ {task.deadlineTime}</span>
              )}
            </div>

            {/* Advance Reminders Count */}
            {task.reminders && task.reminders.length > 0 && (
              <div
                className="flex items-center gap-1 text-[11px] text-amber-300 font-medium bg-amber-500/10 px-1.5 py-0.5 rounded-md"
                title={task.reminders.map((r) => r.label).join('\n')}
              >
                <Bell className="w-3 h-3" />
                <span>
                  {task.reminders.length}{' '}
                  {task.reminders.length === 1 ? 'Reminder' : 'Reminders'}
                </span>
              </div>
            )}

            {/* Subtasks Count */}
            {totalSubtasks > 0 && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <CheckSquare className="w-3 h-3 text-slate-400" />
                <span>
                  {completedSubtasks}/{totalSubtasks}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
