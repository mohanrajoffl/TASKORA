import React from 'react';
import {
  X,
  Bell,
  Clock,
  CheckCircle,
  Trash2,
  Calendar,
  AlertCircle,
  Volume2,
} from 'lucide-react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: any[];
  reminders: any[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onSnooze: (id: string, minutes: number) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  reminders,
  onMarkRead,
  onClearAll,
  onSnooze,
}) => {
  if (!isOpen) return null;

  const requestBrowserPermission = async () => {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      if (res === 'granted') {
        new Notification('Taskora Alerts Enabled', {
          body: 'You will receive advance reminders for all your upcoming tasks!',
          icon: '/favicon.ico',
        });
      }
    }
  };

  const pendingReminders = reminders.filter((r) => r.status === 'pending');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Smart Reminder Hub</h3>
              <p className="text-xs text-slate-400">
                Active alerts & upcoming advance notifications
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

        {/* Browser Alert Permission Banner */}
        <div className="my-3 p-3 rounded-xl bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs text-slate-300">
              Enable native browser push notifications
            </span>
          </div>
          <button
            onClick={requestBrowserPermission}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold cursor-pointer shrink-0"
          >
            Enable
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Delivered Notifications */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Delivered Alerts ({notifications.length})
              </span>
              {notifications.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-[11px] text-slate-400 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear all
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center bg-slate-800/30 rounded-xl">
                No unread alerts right now. You're up to date!
              </p>
            ) : (
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl border transition-all ${
                      n.read
                        ? 'bg-slate-800/40 border-slate-800 text-slate-400'
                        : 'bg-slate-800/90 border-amber-500/30 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-white">
                            {n.taskTitle}
                          </p>
                          <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            Triggered: {new Date(n.triggeredAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      {!n.read && (
                        <button
                          onClick={() => onMarkRead(n.id)}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scheduled Advance Reminders Queue */}
          <div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Scheduled Queue ({pendingReminders.length})
            </span>

            {pendingReminders.length === 0 ? (
              <p className="text-xs text-slate-500 py-2 text-center bg-slate-800/20 rounded-xl">
                No upcoming scheduled reminders.
              </p>
            ) : (
              <div className="space-y-2">
                {pendingReminders.slice(0, 10).map((r) => (
                  <div
                    key={r.id}
                    className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white block">
                        {r.taskTitle}
                      </span>
                      <span className="text-[11px] text-amber-300 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {r.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSnooze(r.id, 15)}
                        className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-[10px] cursor-pointer"
                      >
                        Snooze 15m
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
