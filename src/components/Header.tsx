import React from 'react';
import {
  Bell,
  Flame,
  Award,
  Smartphone,
  Maximize2,
  Mic,
  Sparkles,
  CalendarCheck,
} from 'lucide-react';
import { UserProfile, RewardState } from '../types';

interface HeaderProps {
  profile: UserProfile | null;
  rewards: RewardState | null;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenVoiceModal: () => void;
  onOpenGoalPlanner: () => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  rewards,
  unreadCount,
  onOpenNotifications,
  onOpenVoiceModal,
  onOpenGoalPlanner,
  isMobileFrame,
  onToggleFrame,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-200 to-amber-300 bg-clip-text text-transparent">
                  TASKORA
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI
                </span>
              </div>
              <p className="hidden sm:block text-[11px] font-medium text-slate-400">
                Plan Smart. Do More. Earn More.
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Goal Planner Quick Action */}
          <button
            onClick={onOpenGoalPlanner}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 text-xs font-semibold border border-indigo-700/40 transition-colors shadow-sm cursor-pointer"
            title="Break down long-term goal with AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Goal Planner</span>
          </button>

          {/* Voice Command Button */}
          <button
            onClick={onOpenVoiceModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            title="Voice Task Input (Tamil / Tanglish / English)"
          >
            <Mic className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="hidden sm:inline">Voice Add</span>
          </button>

          {/* Gamification Points & Streak Badges */}
          {rewards && (
            <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700/60">
              {/* Streak */}
              <div
                onClick={() => onNavigate('rewards')}
                className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                title={`${rewards.currentStreak} day streak!`}
              >
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400/20" />
                <span className="text-xs font-bold text-orange-300">
                  {rewards.currentStreak}d
                </span>
              </div>

              <div className="w-px h-3.5 bg-slate-700" />

              {/* Points */}
              <div
                onClick={() => onNavigate('rewards')}
                className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                title={`${rewards.points} reward points`}
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300">
                  {rewards.points}
                </span>
              </div>
            </div>
          )}

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700/80"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Viewport Frame Toggle (Phone frame vs responsive wide) */}
          <button
            onClick={onToggleFrame}
            className="hidden lg:flex p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer border border-slate-700/80"
            title={isMobileFrame ? 'Expand to Full View' : 'Simulate Mobile Frame'}
          >
            {isMobileFrame ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Smartphone className="w-4 h-4" />
            )}
          </button>

          {/* User Profile Avatar */}
          <div
            onClick={() => onNavigate('profile')}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-500 p-0.5 cursor-pointer hover:scale-105 transition-transform"
            title={`${profile?.name || 'User Profile'}`}
          >
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-indigo-300">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'M'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
