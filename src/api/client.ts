import {
  Task,
  UserProfile,
  RewardState,
  RewardRecommendation,
  GoalPlanBreakdown,
  AIChatMessage,
} from '../types';

export const api = {
  // Profile
  async getProfile(): Promise<UserProfile> {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('Failed to load profile');
    return res.json();
  },

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Tasks
  async getTasks(params?: {
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
    range?: string;
  }): Promise<Task[]> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val) query.set(key, val);
      });
    }
    const res = await fetch(`/api/tasks?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  async getTask(id: string): Promise<Task> {
    const res = await fetch(`/api/tasks/${id}`);
    if (!res.ok) throw new Error('Task not found');
    return res.json();
  },

  async createTask(task: Partial<Task>): Promise<Task> {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  async deleteTask(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
    return res.json();
  },

  async completeTask(id: string): Promise<{
    message: string;
    earnedPoints: number;
    task: Task;
    rewards: RewardState;
  }> {
    const res = await fetch(`/api/tasks/${id}/complete`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to complete task');
    return res.json();
  },

  async rescheduleTask(
    id: string,
    newDeadlineDate: string,
    newDeadlineTime?: string
  ): Promise<{ message: string; task: Task }> {
    const res = await fetch(`/api/tasks/${id}/reschedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newDeadlineDate, newDeadlineTime }),
    });
    if (!res.ok) throw new Error('Failed to reschedule task');
    return res.json();
  },

  async duplicateTask(id: string): Promise<Task> {
    const res = await fetch(`/api/tasks/${id}/duplicate`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to duplicate task');
    return res.json();
  },

  // Reminders & Notifications
  async getReminders(): Promise<{
    reminders: any[];
    notifications: any[];
  }> {
    const res = await fetch('/api/reminders');
    if (!res.ok) throw new Error('Failed to fetch reminders');
    return res.json();
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
  },

  async clearAllNotifications(): Promise<void> {
    await fetch('/api/notifications/clear-all', { method: 'POST' });
  },

  async snoozeReminder(id: string, minutes: number = 15): Promise<void> {
    await fetch(`/api/reminders/${id}/snooze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes }),
    });
  },

  // Rewards
  async getRewards(): Promise<{
    rewards: RewardState;
    achievements: any[];
    recommendations: RewardRecommendation[];
  }> {
    const res = await fetch('/api/rewards');
    if (!res.ok) throw new Error('Failed to fetch rewards');
    return res.json();
  },

  async redeemPerk(perkId: string, cost: number): Promise<{ message: string; rewards: RewardState }> {
    const res = await fetch('/api/rewards/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ perkId, cost }),
    });
    if (!res.ok) throw new Error('Failed to redeem perk');
    return res.json();
  },

  // Analytics
  async getAnalytics(): Promise<any> {
    const res = await fetch('/api/analytics');
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // AI Companion
  async chatWithAI(message: string, history: AIChatMessage[]): Promise<{ reply: string }> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    if (!res.ok) throw new Error('AI service error');
    return res.json();
  },

  async extractTaskWithAI(input: string): Promise<Partial<Task>> {
    const res = await fetch('/api/ai/extract-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });
    if (!res.ok) throw new Error('Failed to extract task');
    return res.json();
  },

  async planGoalWithAI(goal: string, timeframe: string): Promise<GoalPlanBreakdown> {
    const res = await fetch('/api/ai/plan-goal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, timeframe }),
    });
    if (!res.ok) throw new Error('Failed to plan goal');
    return res.json();
  },

  async getProductivityReport(): Promise<{ report: string }> {
    const res = await fetch('/api/ai/productivity-report', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to generate report');
    return res.json();
  },
};
