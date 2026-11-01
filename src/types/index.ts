export type TaskCategory =
  | 'Education'
  | 'Career'
  | 'Personal'
  | 'Health'
  | 'Fitness'
  | 'Work'
  | 'Projects'
  | 'Finance'
  | 'Events'
  | 'Other';

export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type TaskStatus =
  | 'Pending'
  | 'In Progress'
  | 'Completed'
  | 'Rescheduled'
  | 'Cancelled'
  | 'Overdue';

export type ReminderPreset =
  | '12_months'
  | '6_months'
  | '3_months'
  | '2_months'
  | '1_month'
  | '2_weeks'
  | '1_week'
  | '3_days'
  | '2_days'
  | '1_day'
  | '12_hours'
  | '6_hours'
  | '1_hour'
  | '30_mins'
  | '15_mins'
  | '5_mins'
  | 'custom';

export interface TaskReminder {
  id: string;
  preset: ReminderPreset;
  label: string;
  customMinutesBefore?: number;
  scheduledAt: string; // ISO UTC string
  delivered: boolean;
  status: 'pending' | 'delivered' | 'dismissed' | 'snoozed';
  deliveredAt?: string;
}

export type RecurrenceType =
  | 'none'
  | 'daily'
  | 'weekdays'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'yearly'
  | 'custom';

export interface RecurrenceSettings {
  type: RecurrenceType;
  interval?: number;
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
  endDate?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  deadlineDate: string; // YYYY-MM-DD
  deadlineTime: string; // HH:mm
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  reminders: TaskReminder[];
  recurrence: RecurrenceSettings;
  notes: string;
  subtasks: Subtask[];
  pointsValue: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProfessionType =
  | 'Student'
  | 'Employee'
  | 'Freelancer'
  | 'Entrepreneur'
  | 'Job seeker'
  | 'Other';

export type AIPersonality =
  | 'Friendly Machi'
  | 'Encouraging Mentor'
  | 'Strategic Executive'
  | 'Energetic Coach';

export type PreferredLanguage = 'English' | 'Tanglish' | 'Tamil';

export interface UserProfile {
  name: string;
  email: string;
  ageRange: string;
  profession: ProfessionType;
  education: string;
  interests: string[];
  careerGoals: string;
  preferredLanguage: PreferredLanguage;
  preferredAIPersonality: AIPersonality;
  dailyActiveHours: {
    start: string; // "07:00"
    end: string; // "23:00"
  };
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  theme: 'dark' | 'light' | 'system';
  timezone: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface RewardRecommendation {
  id: string;
  title: string;
  provider: string;
  type: 'FREE' | 'FREE TRIAL' | 'CERTIFICATION' | 'LEARNING RESOURCE' | 'DEVELOPER TOOL';
  category: string;
  description: string;
  benefit: string;
  url: string;
  tag: string;
}

export interface RewardState {
  points: number;
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string;
  level: number;
  levelTitle: string;
  achievements: Achievement[];
  claimedPerks: string[];
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'create_task' | 'reschedule_task' | 'plan_goal';
    payload: any;
    label: string;
  };
}

export interface GoalPlanBreakdown {
  goalTitle: string;
  timeline: string;
  summary: string;
  phases: {
    phaseName: string;
    duration: string;
    milestones: {
      title: string;
      description: string;
      suggestedDeadline: string;
      priority: TaskPriority;
      category: TaskCategory;
      reminders: ReminderPreset[];
    }[];
  }[];
}
