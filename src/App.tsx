import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api } from './api/client';
import { Task, UserProfile, RewardState, RewardRecommendation } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { TaskFormModal } from './components/TaskFormModal';
import { VoiceInputModal } from './components/VoiceInputModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { GoalPlannerModal } from './components/GoalPlannerModal';
import { RescheduleModal } from './components/RescheduleModal';
import { DashboardView } from './views/DashboardView';
import { TasksView } from './views/TasksView';
import { CalendarView } from './views/CalendarView';
import { AICompanionView } from './views/AICompanionView';
import { RewardsView } from './views/RewardsView';
import { AnalyticsView } from './views/AnalyticsView';
import { ProfileView } from './views/ProfileView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [rewards, setRewards] = useState<RewardState | null>(null);
  const [recommendations, setRecommendations] = useState<RewardRecommendation[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isGoalPlannerOpen, setIsGoalPlannerOpen] = useState(false);
  const [reschedulingTask, setReschedulingTask] = useState<Task | null>(null);

  // Mobile frame simulator mode
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Initial load
  useEffect(() => {
    loadAllData();

    // Background reminder polling every 12s
    const interval = setInterval(() => {
      syncRemindersAndNotifications();
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    try {
      const [p, t, r, rem] = await Promise.all([
        api.getProfile(),
        api.getTasks(),
        api.getRewards(),
        api.getReminders(),
      ]);
      setProfile(p);
      setTasks(t);
      setRewards(r.rewards);
      setRecommendations(r.recommendations);
      setReminders(rem.reminders);
      setNotifications(rem.notifications);
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  };

  const syncRemindersAndNotifications = async () => {
    try {
      const res = await api.getReminders();
      const prevCount = notifications.filter((n) => !n.read).length;
      const newCount = res.notifications.filter((n: any) => !n.read).length;

      if (newCount > prevCount) {
        showToast('🔔 New Advance Reminder Received!');
        playCelebrationAudio(440);
      }

      setReminders(res.reminders);
      setNotifications(res.notifications);
    } catch (err) {
      console.warn('Sync reminders error:', err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Audio tone generator (no external audio file required)
  const playCelebrationAudio = (freq: number = 587.33) => {
    if (!profile?.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // AudioContext not allowed or unsupported
    }
  };

  // Task Operations
  const handleCreateOrUpdateTask = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        const updated = await api.updateTask(editingTask.id, taskData);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        showToast(`Task "${updated.title}" updated successfully.`);
      } else {
        const created = await api.createTask(taskData);
        setTasks((prev) => [created, ...prev]);
        showToast(`Task "${created.title}" scheduled for ${created.deadlineDate}!`);
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      syncRemindersAndNotifications();
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleCompleteTask = async (id: string) => {
    try {
      const res = await api.completeTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.task : t)));
      setRewards(res.rewards);

      // Trigger Confetti and Sound!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#f59e0b', '#10b981'],
      });
      playCelebrationAudio(783.99);

      showToast(`🎉 ${res.message}`);
    } catch (err) {
      console.error('Error completing task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast('Task removed.');
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleDuplicateTask = async (id: string) => {
    try {
      const dup = await api.duplicateTask(id);
      setTasks((prev) => [dup, ...prev]);
      showToast(`Duplicated: ${dup.title}`);
    } catch (err) {
      console.error('Error duplicating task:', err);
    }
  };

  const handleReschedule = async (taskId: string, newDate: string, newTime?: string) => {
    try {
      const res = await api.rescheduleTask(taskId, newDate, newTime);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.task : t)));
      showToast(`Task rescheduled to ${newDate}! Reminders updated.`);
      syncRemindersAndNotifications();
    } catch (err) {
      console.error('Error rescheduling:', err);
    }
  };

  const handleSaveProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updated = await api.updateProfile(updates);
      setProfile(updated);
      showToast('Profile and AI personality preferences saved!');
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleRedeemPerk = async (perkId: string, cost: number) => {
    try {
      const res = await api.redeemPerk(perkId, cost);
      setRewards(res.rewards);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      showToast(res.message);
    } catch (err: any) {
      alert(err.message || 'Cannot redeem perk');
    }
  };

  const handleAddMilestonesToTasks = async (milestones: Partial<Task>[]) => {
    try {
      for (const m of milestones) {
        await api.createTask(m);
      }
      const updated = await api.getTasks();
      setTasks(updated);
      showToast(`🚀 Added ${milestones.length} goal milestones to your Taskora schedule!`);
      setActiveTab('tasks');
    } catch (err) {
      console.error('Error importing milestones:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-500 selection:text-white">
      {/* Outer Container (Simulates Phone Frame if isMobileFrame is true) */}
      <div
        className={
          isMobileFrame
            ? 'mx-auto my-4 max-w-[420px] w-full min-h-[850px] bg-slate-900 border-[10px] border-slate-800 rounded-[48px] shadow-2xl overflow-hidden flex flex-col relative'
            : 'w-full flex-1 flex flex-col'
        }
      >
        {/* Mobile Frame Speaker & Camera Notch */}
        {isMobileFrame && (
          <div className="w-full h-7 bg-slate-900 flex items-center justify-center pt-2">
            <div className="w-24 h-4 bg-slate-950 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-800" />
            </div>
          </div>
        )}

        {/* Global Header */}
        <Header
          profile={profile}
          rewards={rewards}
          unreadCount={unreadCount}
          onOpenNotifications={() => setIsNotificationModalOpen(true)}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          onOpenGoalPlanner={() => setIsGoalPlannerOpen(true)}
          isMobileFrame={isMobileFrame}
          onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
        />

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              tasks={tasks}
              profile={profile}
              rewards={rewards}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenCreateTask={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onOpenGoalPlanner={() => setIsGoalPlannerOpen(true)}
              onCompleteTask={handleCompleteTask}
              onEditTask={(t) => {
                setEditingTask(t);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onDuplicateTask={handleDuplicateTask}
              onRescheduleTask={(t) => setReschedulingTask(t)}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              onCompleteTask={handleCompleteTask}
              onEditTask={(t) => {
                setEditingTask(t);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onDuplicateTask={handleDuplicateTask}
              onRescheduleTask={(t) => setReschedulingTask(t)}
              onOpenCreateTask={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              tasks={tasks}
              onCompleteTask={handleCompleteTask}
              onEditTask={(t) => {
                setEditingTask(t);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onDuplicateTask={handleDuplicateTask}
              onRescheduleTask={(t) => setReschedulingTask(t)}
              onOpenCreateTask={(selectedDate) => {
                setEditingTask(
                  selectedDate
                    ? ({
                        title: '',
                        deadlineDate: selectedDate,
                        startDate: selectedDate,
                        category: 'Education',
                        priority: 'Medium',
                        status: 'Pending',
                        reminders: [{ preset: '30_mins' }],
                        recurrence: { type: 'none' },
                        subtasks: [],
                      } as any)
                    : null
                );
                setIsTaskModalOpen(true);
              }}
            />
          )}

          {activeTab === 'ai' && (
            <AICompanionView
              profile={profile}
              onScheduleExtractedTask={(extracted) => {
                handleCreateOrUpdateTask(extracted);
              }}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            />
          )}

          {activeTab === 'rewards' && (
            <RewardsView
              rewards={rewards}
              recommendations={recommendations}
              profile={profile}
              onRedeemPerk={handleRedeemPerk}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsView tasks={tasks} />}

          {activeTab === 'profile' && (
            <ProfileView profile={profile} onSaveProfile={handleSaveProfile} />
          )}
        </main>

        {/* Global Bottom Navigation & FAB */}
        <Navigation
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          onOpenCreateTask={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
        />
      </div>

      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-indigo-600 text-white font-semibold text-xs sm:text-sm shadow-2xl border border-indigo-400 flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Task Creation & Editing Modal */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        initialTask={editingTask}
      />

      {/* Voice & Natural Language Modal */}
      <VoiceInputModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onConfirmTask={(extracted) => {
          handleCreateOrUpdateTask(extracted);
        }}
      />

      {/* Notifications & Reminders Modal */}
      <NotificationCenterModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        reminders={reminders}
        onMarkRead={async (id) => {
          await api.markNotificationRead(id);
          syncRemindersAndNotifications();
        }}
        onClearAll={async () => {
          await api.clearAllNotifications();
          syncRemindersAndNotifications();
        }}
        onSnooze={async (id, minutes) => {
          await api.snoozeReminder(id, minutes);
          syncRemindersAndNotifications();
          showToast(`Snoozed for ${minutes} minutes`);
        }}
      />

      {/* Goal Planner Modal */}
      <GoalPlannerModal
        isOpen={isGoalPlannerOpen}
        onClose={() => setIsGoalPlannerOpen(false)}
        onAddMilestonesToTasks={handleAddMilestonesToTasks}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        task={reschedulingTask}
        isOpen={!!reschedulingTask}
        onClose={() => setReschedulingTask(null)}
        onReschedule={handleReschedule}
      />
    </div>
  );
}
