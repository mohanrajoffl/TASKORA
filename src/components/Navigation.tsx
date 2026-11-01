import React from 'react';
import {
  Home,
  CheckSquare,
  Calendar,
  Bot,
  Award,
  BarChart3,
  User,
  Plus,
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCreateTask: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenCreateTask,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Today', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'ai', label: 'AI Companion', icon: Bot, isAi: true },
    { id: 'rewards', label: 'Rewards', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={onOpenCreateTask}
        className="fixed bottom-20 right-6 md:bottom-8 md:right-8 z-40 w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-amber-500 hover:from-indigo-600 hover:to-amber-600 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer group"
        aria-label="Create Task"
        title="Create new task (Any future date or today)"
      >
        <Plus className="w-6 h-6 transition-transform group-hover:rotate-90 duration-200" />
      </button>

      {/* Bottom Navigation Bar (Mobile / Responsive) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 max-w-lg mx-auto sm:max-w-none">
        <div className="flex items-center justify-around max-w-3xl mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-indigo-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`relative p-1.5 rounded-xl transition-all ${
                    isActive
                      ? tab.isAi
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-indigo-500/20 text-indigo-400'
                      : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.isAi && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
