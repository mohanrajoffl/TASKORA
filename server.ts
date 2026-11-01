import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK on server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Database storage setup
const DATA_DIR = path.join(__dirname, '.data');
const DB_FILE = path.join(DATA_DIR, 'taskora_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DBNotification {
  id: string;
  taskId: string;
  taskTitle: string;
  message: string;
  scheduledAt: string;
  triggeredAt: string;
  read: boolean;
  priority: string;
}

interface DatabaseSchema {
  profile: any;
  tasks: any[];
  rewards: {
    points: number;
    currentStreak: number;
    longestStreak: number;
    lastCheckInDate: string;
    level: number;
    levelTitle: string;
    claimedPerks: string[];
  };
  achievements: any[];
  notifications: DBNotification[];
  chatHistory: any[];
}

function getInitialDB(): DatabaseSchema {
  const todayStr = '2026-11-01'; // Default context time
  return {
    profile: {
      name: 'Mohanraj',
      email: 'mohanraj.mm18@gmail.com',
      ageRange: '20-25',
      profession: 'Student',
      education: 'B.Tech Computer Science',
      interests: ['Artificial Intelligence', 'Mobile App Development', 'Productivity Systems'],
      careerGoals: 'Become a Senior AI Engineer & Full-Stack Architect',
      preferredLanguage: 'Tanglish',
      preferredAIPersonality: 'Friendly Machi',
      dailyActiveHours: { start: '07:00', end: '23:00' },
      notificationsEnabled: true,
      soundEnabled: true,
      theme: 'dark',
      timezone: 'Asia/Kolkata',
    },
    rewards: {
      points: 135,
      currentStreak: 4,
      longestStreak: 7,
      lastCheckInDate: todayStr,
      level: 2,
      levelTitle: 'Momentum Builder',
      claimedPerks: ['focus_soundtrack'],
    },
    achievements: [
      {
        id: 'first_task',
        title: 'Ignition',
        description: 'Completed your very first task in Taskora',
        icon: 'Zap',
        points: 20,
        isUnlocked: true,
        unlockedAt: '2026-10-28T09:00:00Z',
      },
      {
        id: 'streak_3',
        title: '3-Day Dynamo',
        description: 'Maintained a productive streak for 3 consecutive days',
        icon: 'Flame',
        points: 30,
        isUnlocked: true,
        unlockedAt: '2026-10-31T18:00:00Z',
      },
      {
        id: 'future_architect',
        title: 'Future Architect',
        description: 'Scheduled an important task more than 2 months in advance',
        icon: 'CalendarClock',
        points: 40,
        isUnlocked: true,
        unlockedAt: '2026-11-01T08:00:00Z',
      },
      {
        id: 'ai_collaborator',
        title: 'Machi Bond',
        description: 'Extracted and scheduled tasks directly using Taskora AI',
        icon: 'Bot',
        points: 25,
        isUnlocked: false,
        progress: 1,
        maxProgress: 3,
      },
      {
        id: 'century_club',
        title: 'Centurion',
        description: 'Accumulated over 100 productivity reward points',
        icon: 'Award',
        points: 50,
        isUnlocked: true,
        unlockedAt: '2026-10-31T18:00:00Z',
      },
      {
        id: 'master_planner',
        title: 'Goal Conqueror',
        description: 'Generated a full multi-month goal roadmap with Taskora Planner',
        icon: 'Compass',
        points: 50,
        isUnlocked: false,
        progress: 0,
        maxProgress: 1,
      },
    ],
    notifications: [
      {
        id: 'notif_welcome',
        taskId: 'task_1',
        taskTitle: 'College Project Submission',
        message: 'Advance reminder: 2 months remaining until College Project Submission deadline!',
        scheduledAt: '2026-11-01T08:00:00Z',
        triggeredAt: '2026-11-01T08:00:00Z',
        read: false,
        priority: 'Critical',
      },
    ],
    chatHistory: [
      {
        id: 'msg_1',
        sender: 'assistant',
        text: 'Vanakkam Mohanraj! Welcome back to TASKORA. Today is Sunday, Nov 1, 2026. Enna plan innaiku? Nee sollu, task planning naan pathukuren machi! 🚀',
        timestamp: new Date().toISOString(),
      },
    ],
    tasks: [
      {
        id: 'task_1',
        title: 'College Project Submission',
        description: 'Final year capstone submission with comprehensive documentation, demo video, and code repository link.',
        startDate: '2026-11-01',
        startTime: '09:00',
        deadlineDate: '2027-01-01',
        deadlineTime: '17:00',
        category: 'Education',
        priority: 'Critical',
        status: 'In Progress',
        notes: 'Review submission guidelines with HOD and verify database migrations.',
        subtasks: [
          { id: 'sub_1', title: 'Complete system architecture diagram', completed: true },
          { id: 'sub_2', title: 'Record 5-minute video presentation', completed: false },
          { id: 'sub_3', title: 'Final test report binding', completed: false },
        ],
        pointsValue: 25,
        recurrence: { type: 'none' },
        createdAt: '2026-11-01T07:30:00Z',
        updatedAt: '2026-11-01T07:30:00Z',
        reminders: [
          {
            id: 'rem_1_1',
            preset: '1_month',
            label: '1 month before (Dec 1, 2026)',
            scheduledAt: '2026-12-01T17:00:00Z',
            delivered: false,
            status: 'pending',
          },
          {
            id: 'rem_1_2',
            preset: '1_week',
            label: '1 week before (Dec 25, 2026)',
            scheduledAt: '2026-12-25T17:00:00Z',
            delivered: false,
            status: 'pending',
          },
          {
            id: 'rem_1_3',
            preset: '1_day',
            label: '1 day before (Dec 31, 2026)',
            scheduledAt: '2026-12-31T17:00:00Z',
            delivered: false,
            status: 'pending',
          },
          {
            id: 'rem_1_4',
            preset: '30_mins',
            label: '30 minutes before (Jan 1, 2027 4:30 PM)',
            scheduledAt: '2027-01-01T16:30:00Z',
            delivered: false,
            status: 'pending',
          },
        ],
      },
      {
        id: 'task_2',
        title: 'Daily Java & DSA Practice',
        description: 'Solve 2 LeetCode problems and revise Spring Boot fundamentals.',
        startDate: '2026-11-01',
        startTime: '07:00',
        deadlineDate: '2026-11-01',
        deadlineTime: '08:30',
        category: 'Education',
        priority: 'High',
        status: 'Completed',
        completedAt: '2026-11-01T08:15:00Z',
        notes: 'Solved Binary Tree Inorder & Level Order traversal.',
        subtasks: [
          { id: 'sub_4', title: 'Problem 1: Binary Tree Inorder', completed: true },
          { id: 'sub_5', title: 'Problem 2: Level Order Traversal', completed: true },
        ],
        pointsValue: 20,
        recurrence: { type: 'daily' },
        createdAt: '2026-10-31T20:00:00Z',
        updatedAt: '2026-11-01T08:15:00Z',
        reminders: [
          {
            id: 'rem_2_1',
            preset: '30_mins',
            label: '30 minutes before (6:30 AM)',
            scheduledAt: '2026-11-01T06:30:00Z',
            delivered: true,
            status: 'delivered',
          },
        ],
      },
      {
        id: 'task_3',
        title: 'Semester Examination Preparation',
        description: 'Complete 5 model question papers for Advanced DBMS and AI algorithms.',
        startDate: '2026-11-10',
        startTime: '10:00',
        deadlineDate: '2027-01-15',
        deadlineTime: '09:00',
        category: 'Education',
        priority: 'Critical',
        status: 'Pending',
        notes: 'Targeting CGPA > 9.0',
        subtasks: [
          { id: 'sub_6', title: 'Unit 1 & 2 revision', completed: false },
          { id: 'sub_7', title: 'Solve 2024 & 2025 question papers', completed: false },
        ],
        pointsValue: 25,
        recurrence: { type: 'none' },
        createdAt: '2026-11-01T07:45:00Z',
        updatedAt: '2026-11-01T07:45:00Z',
        reminders: [
          {
            id: 'rem_3_1',
            preset: '2_months',
            label: '2 months before (Nov 15, 2026)',
            scheduledAt: '2026-11-15T09:00:00Z',
            delivered: false,
            status: 'pending',
          },
          {
            id: 'rem_3_2',
            preset: '2_weeks',
            label: '2 weeks before (Jan 1, 2027)',
            scheduledAt: '2027-01-01T09:00:00Z',
            delivered: false,
            status: 'pending',
          },
        ],
      },
      {
        id: 'task_4',
        title: 'Google Summer of Code Application',
        description: 'Prepare organization proposal draft and submit early contribution PRs.',
        startDate: '2027-02-01',
        startTime: '10:00',
        deadlineDate: '2027-04-01',
        deadlineTime: '18:00',
        category: 'Career',
        priority: 'High',
        status: 'Pending',
        notes: 'Shortlist 3 organizations in ML and Web infra.',
        subtasks: [],
        pointsValue: 20,
        recurrence: { type: 'none' },
        createdAt: '2026-11-01T07:50:00Z',
        updatedAt: '2026-11-01T07:50:00Z',
        reminders: [
          {
            id: 'rem_4_1',
            preset: '3_months',
            label: '3 months before (Jan 1, 2027)',
            scheduledAt: '2027-01-01T18:00:00Z',
            delivered: false,
            status: 'pending',
          },
        ],
      },
      {
        id: 'task_5',
        title: 'Gym - Upper Body Workout',
        description: 'Bench press, pullups, shoulder press, core training.',
        startDate: '2026-11-01',
        startTime: '18:00',
        deadlineDate: '2026-11-01',
        deadlineTime: '19:30',
        category: 'Fitness',
        priority: 'Medium',
        status: 'Pending',
        notes: 'Track weights in logbook.',
        subtasks: [],
        pointsValue: 15,
        recurrence: { type: 'custom', interval: 2, daysOfWeek: [1, 3, 5] },
        createdAt: '2026-11-01T07:55:00Z',
        updatedAt: '2026-11-01T07:55:00Z',
        reminders: [
          {
            id: 'rem_5_1',
            preset: '1_hour',
            label: '1 hour before (5:00 PM)',
            scheduledAt: '2026-11-01T17:00:00Z',
            delivered: false,
            status: 'pending',
          },
        ],
      },
    ],
  };
}

function loadDB(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading db file, restoring defaults:', err);
  }
  const initial = getInitialDB();
  saveDB(initial);
  return initial;
}

function saveDB(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db file:', err);
  }
}

// Helper to compute reminder ISO timestamp based on target datetime & preset
function calculateReminderTimestamp(
  deadlineDate: string,
  deadlineTime: string,
  preset: string,
  customMinutes?: number
): { scheduledAt: string; label: string } {
  const [year, month, day] = deadlineDate.split('-').map(Number);
  const [hours, minutes] = (deadlineTime || '09:00').split(':').map(Number);
  const target = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));

  let offsetMinutes = 30; // default 30 mins
  let label = '30 minutes before';

  switch (preset) {
    case '12_months':
      target.setUTCFullYear(target.getUTCFullYear() - 1);
      label = '12 months before';
      return { scheduledAt: target.toISOString(), label };
    case '6_months':
      target.setUTCMonth(target.getUTCMonth() - 6);
      label = '6 months before';
      return { scheduledAt: target.toISOString(), label };
    case '3_months':
      target.setUTCMonth(target.getUTCMonth() - 3);
      label = '3 months before';
      return { scheduledAt: target.toISOString(), label };
    case '2_months':
      target.setUTCMonth(target.getUTCMonth() - 2);
      label = '2 months before';
      return { scheduledAt: target.toISOString(), label };
    case '1_month':
      target.setUTCMonth(target.getUTCMonth() - 1);
      label = '1 month before';
      return { scheduledAt: target.toISOString(), label };
    case '2_weeks':
      offsetMinutes = 14 * 24 * 60;
      label = '2 weeks before';
      break;
    case '1_week':
      offsetMinutes = 7 * 24 * 60;
      label = '1 week before';
      break;
    case '3_days':
      offsetMinutes = 3 * 24 * 60;
      label = '3 days before';
      break;
    case '2_days':
      offsetMinutes = 2 * 24 * 60;
      label = '2 days before';
      break;
    case '1_day':
      offsetMinutes = 24 * 60;
      label = '1 day before';
      break;
    case '12_hours':
      offsetMinutes = 12 * 60;
      label = '12 hours before';
      break;
    case '6_hours':
      offsetMinutes = 6 * 60;
      label = '6 hours before';
      break;
    case '1_hour':
      offsetMinutes = 60;
      label = '1 hour before';
      break;
    case '30_mins':
      offsetMinutes = 30;
      label = '30 minutes before';
      break;
    case '15_mins':
      offsetMinutes = 15;
      label = '15 minutes before';
      break;
    case '5_mins':
      offsetMinutes = 5;
      label = '5 minutes before';
      break;
    case 'custom':
      offsetMinutes = customMinutes && customMinutes > 0 ? customMinutes : 60;
      label = `${offsetMinutes} mins before`;
      break;
  }

  const reminderDate = new Date(target.getTime() - offsetMinutes * 60 * 1000);
  return { scheduledAt: reminderDate.toISOString(), label };
}

// Background reminder check runner (executes every 10 seconds)
setInterval(() => {
  try {
    const db = loadDB();
    const now = new Date();
    let hasUpdates = false;

    for (const task of db.tasks) {
      if (task.status === 'Completed' || task.status === 'Cancelled') continue;
      if (!task.reminders || !Array.isArray(task.reminders)) continue;

      for (const reminder of task.reminders) {
        if (!reminder.delivered && reminder.status === 'pending') {
          const scheduled = new Date(reminder.scheduledAt);
          if (scheduled <= now) {
            reminder.delivered = true;
            reminder.status = 'delivered';
            reminder.deliveredAt = now.toISOString();

            // Push notification
            db.notifications.unshift({
              id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
              taskId: task.id,
              taskTitle: task.title,
              message: `⏰ Reminder for "${task.title}": ${reminder.label} (Deadline: ${task.deadlineDate} ${task.deadlineTime || ''})`,
              scheduledAt: reminder.scheduledAt,
              triggeredAt: now.toISOString(),
              read: false,
              priority: task.priority,
            });

            hasUpdates = true;
          }
        }
      }
    }

    if (hasUpdates) {
      if (db.notifications.length > 50) {
        db.notifications = db.notifications.slice(0, 50);
      }
      saveDB(db);
    }
  } catch (err) {
    console.error('Error in reminder runner:', err);
  }
}, 10000);

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', name: 'TASKORA API', time: new Date().toISOString() });
});

// Profile APIs
app.get('/api/profile', (_req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.profile);
});

app.put('/api/profile', (req: Request, res: Response) => {
  const db = loadDB();
  db.profile = { ...db.profile, ...req.body };
  saveDB(db);
  res.json(db.profile);
});

// Tasks APIs
app.get('/api/tasks', (req: Request, res: Response) => {
  const db = loadDB();
  let tasks = [...db.tasks];
  const { status, category, priority, search, range } = req.query;

  if (status) {
    tasks = tasks.filter((t) => t.status === status);
  }
  if (category) {
    tasks = tasks.filter((t) => t.category === category);
  }
  if (priority) {
    tasks = tasks.filter((t) => t.priority === priority);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.notes?.toLowerCase().includes(q)
    );
  }

  // Range filtering
  const now = new Date('2026-11-01T08:04:00Z');
  const todayStr = '2026-11-01';
  const tomorrowStr = '2026-11-02';

  if (range === 'today') {
    tasks = tasks.filter((t) => t.startDate <= todayStr && t.deadlineDate >= todayStr);
  } else if (range === 'tomorrow') {
    tasks = tasks.filter((t) => t.deadlineDate === tomorrowStr);
  } else if (range === 'week') {
    const weekEnd = '2026-11-08';
    tasks = tasks.filter((t) => t.deadlineDate >= todayStr && t.deadlineDate <= weekEnd);
  } else if (range === 'month') {
    const monthEnd = '2026-11-30';
    tasks = tasks.filter((t) => t.deadlineDate >= todayStr && t.deadlineDate <= monthEnd);
  } else if (range === 'future') {
    const nextMonthStart = '2026-12-01';
    tasks = tasks.filter((t) => t.deadlineDate >= nextMonthStart);
  }

  // Sort by deadline date ascending
  tasks.sort((a, b) => {
    const da = `${a.deadlineDate} ${a.deadlineTime || '23:59'}`;
    const db = `${b.deadlineDate} ${b.deadlineTime || '23:59'}`;
    return da.localeCompare(db);
  });

  res.json(tasks);
});

app.get('/api/tasks/:id', (req: Request, res: Response) => {
  const db = loadDB();
  const task = db.tasks.find((t) => t.id === req.params.id);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.json(task);
});

app.post('/api/tasks', (req: Request, res: Response) => {
  const db = loadDB();
  const body = req.body;

  const pointsMap: Record<string, number> = {
    Critical: 25,
    High: 20,
    Medium: 15,
    Low: 10,
  };

  const priority = body.priority || 'Medium';
  const pointsValue = pointsMap[priority] || 15;

  // Process reminder schedules
  const rawReminders = Array.isArray(body.reminders) ? body.reminders : [];
  const processedReminders = rawReminders.map((r: any, idx: number) => {
    const calc = calculateReminderTimestamp(
      body.deadlineDate || '2026-11-01',
      body.deadlineTime || '18:00',
      r.preset || '30_mins',
      r.customMinutesBefore
    );
    return {
      id: `rem_${Date.now()}_${idx}`,
      preset: r.preset,
      label: r.label || calc.label,
      customMinutesBefore: r.customMinutesBefore,
      scheduledAt: calc.scheduledAt,
      delivered: false,
      status: 'pending',
    };
  });

  const newTask = {
    id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: body.title || 'Untitled Task',
    description: body.description || '',
    startDate: body.startDate || '2026-11-01',
    startTime: body.startTime || '09:00',
    deadlineDate: body.deadlineDate || '2026-11-01',
    deadlineTime: body.deadlineTime || '18:00',
    category: body.category || 'Personal',
    priority,
    status: body.status || 'Pending',
    reminders: processedReminders,
    recurrence: body.recurrence || { type: 'none' },
    notes: body.notes || '',
    subtasks: body.subtasks || [],
    pointsValue,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.tasks.unshift(newTask);
  saveDB(db);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req: Request, res: Response) => {
  const db = loadDB();
  const index = db.tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  const existing = db.tasks[index];
  const body = req.body;

  // If deadline updated, recalculate pending reminders
  let reminders = body.reminders || existing.reminders || [];
  if (body.deadlineDate && (body.deadlineDate !== existing.deadlineDate || body.deadlineTime !== existing.deadlineTime)) {
    reminders = reminders.map((r: any) => {
      if (r.status === 'delivered') return r;
      const calc = calculateReminderTimestamp(
        body.deadlineDate,
        body.deadlineTime || '18:00',
        r.preset,
        r.customMinutesBefore
      );
      return {
        ...r,
        scheduledAt: calc.scheduledAt,
        label: calc.label,
      };
    });
  }

  db.tasks[index] = {
    ...existing,
    ...body,
    reminders,
    updatedAt: new Date().toISOString(),
  };

  saveDB(db);
  res.json(db.tasks[index]);
});

app.delete('/api/tasks/:id', (req: Request, res: Response) => {
  const db = loadDB();
  const task = db.tasks.find((t) => t.id === req.params.id);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  db.tasks = db.tasks.filter((t) => t.id !== req.params.id);
  saveDB(db);
  res.json({ message: 'Task deleted successfully', id: req.params.id });
});

// Complete Task (Awards Points & updates streak securely)
app.post('/api/tasks/:id/complete', (req: Request, res: Response) => {
  const db = loadDB();
  const task = db.tasks.find((t) => t.id === req.params.id);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  if (task.status === 'Completed') {
    res.json({ message: 'Task already completed', task, rewards: db.rewards });
    return;
  }

  task.status = 'Completed';
  task.completedAt = new Date().toISOString();
  task.updatedAt = new Date().toISOString();

  // Cancel remaining pending reminders
  if (task.reminders) {
    task.reminders.forEach((r: any) => {
      if (r.status === 'pending') r.status = 'dismissed';
    });
  }

  // Backend Reward points calculation
  const earnedPoints = task.pointsValue || 15;
  db.rewards.points += earnedPoints;

  // Streak calculation
  const todayStr = '2026-11-01';
  if (db.rewards.lastCheckInDate !== todayStr) {
    db.rewards.currentStreak += 1;
    if (db.rewards.currentStreak > db.rewards.longestStreak) {
      db.rewards.longestStreak = db.rewards.currentStreak;
    }
    db.rewards.lastCheckInDate = todayStr;
  }

  // Level Progression: Level up every 100 points
  const newLevel = Math.floor(db.rewards.points / 100) + 1;
  const levelTitles = [
    'Beginner Planner',
    'Momentum Builder',
    'Focus Master',
    'Discipline Vanguard',
    'Time Architect',
    'Titan of Productivity',
  ];
  db.rewards.level = newLevel;
  db.rewards.levelTitle = levelTitles[Math.min(newLevel - 1, levelTitles.length - 1)];

  // Check achievements
  for (const ach of db.achievements) {
    if (ach.id === 'century_club' && db.rewards.points >= 100 && !ach.isUnlocked) {
      ach.isUnlocked = true;
      ach.unlockedAt = new Date().toISOString();
    }
    if (ach.id === 'streak_3' && db.rewards.currentStreak >= 3 && !ach.isUnlocked) {
      ach.isUnlocked = true;
      ach.unlockedAt = new Date().toISOString();
    }
  }

  // Handle Recurrence auto-advancement if enabled
  if (task.recurrence && task.recurrence.type !== 'none') {
    const curDate = new Date(`${task.deadlineDate}T${task.deadlineTime || '09:00'}:00Z`);
    let nextDate = new Date(curDate);

    switch (task.recurrence.type) {
      case 'daily':
        nextDate.setUTCDate(curDate.getUTCDate() + 1);
        break;
      case 'weekdays':
        const day = curDate.getUTCDay();
        const add = day === 5 ? 3 : day === 6 ? 2 : 1;
        nextDate.setUTCDate(curDate.getUTCDate() + add);
        break;
      case 'weekly':
        nextDate.setUTCDate(curDate.getUTCDate() + 7);
        break;
      case 'biweekly':
        nextDate.setUTCDate(curDate.getUTCDate() + 14);
        break;
      case 'monthly':
        nextDate.setUTCMonth(curDate.getUTCMonth() + 1);
        break;
      case 'yearly':
        nextDate.setUTCFullYear(curDate.getUTCFullYear() + 1);
        break;
    }

    const nextDateStr = nextDate.toISOString().split('T')[0];
    const recurringClone = {
      ...task,
      id: `task_${Date.now()}_rec`,
      deadlineDate: nextDateStr,
      startDate: nextDateStr,
      status: 'Pending',
      completedAt: undefined,
      subtasks: task.subtasks.map((s: any) => ({ ...s, completed: false })),
      reminders: task.reminders.map((r: any, idx: number) => {
        const calc = calculateReminderTimestamp(nextDateStr, task.deadlineTime, r.preset, r.customMinutesBefore);
        return {
          ...r,
          id: `rem_${Date.now()}_${idx}`,
          scheduledAt: calc.scheduledAt,
          delivered: false,
          status: 'pending',
        };
      }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.tasks.unshift(recurringClone);
  }

  saveDB(db);
  res.json({
    message: `Task completed! +${earnedPoints} points awarded.`,
    earnedPoints,
    task,
    rewards: db.rewards,
    achievements: db.achievements,
  });
});

// Reschedule Task
app.post('/api/tasks/:id/reschedule', (req: Request, res: Response) => {
  const db = loadDB();
  const task = db.tasks.find((t) => t.id === req.params.id);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  const { newDeadlineDate, newDeadlineTime } = req.body;
  if (!newDeadlineDate) {
    res.status(400).json({ error: 'newDeadlineDate is required' });
    return;
  }

  task.deadlineDate = newDeadlineDate;
  if (newDeadlineTime) task.deadlineTime = newDeadlineTime;
  task.status = 'Rescheduled';
  task.updatedAt = new Date().toISOString();

  // Recalculate reminders
  if (task.reminders) {
    task.reminders = task.reminders.map((r: any) => {
      const calc = calculateReminderTimestamp(newDeadlineDate, task.deadlineTime, r.preset, r.customMinutesBefore);
      return {
        ...r,
        scheduledAt: calc.scheduledAt,
        delivered: false,
        status: 'pending',
      };
    });
  }

  saveDB(db);
  res.json({ message: 'Task rescheduled successfully', task });
});

// Duplicate Task
app.post('/api/tasks/:id/duplicate', (req: Request, res: Response) => {
  const db = loadDB();
  const source = db.tasks.find((t) => t.id === req.params.id);
  if (!source) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  const clone = {
    ...source,
    id: `task_${Date.now()}_dup`,
    title: `${source.title} (Copy)`,
    status: 'Pending',
    completedAt: undefined,
    subtasks: source.subtasks.map((s: any) => ({ ...s, id: `sub_${Date.now()}_${Math.random()}`, completed: false })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.tasks.unshift(clone);
  saveDB(db);
  res.status(201).json(clone);
});

// Reminders & Notifications
app.get('/api/reminders', (_req: Request, res: Response) => {
  const db = loadDB();
  const allReminders: any[] = [];

  for (const t of db.tasks) {
    if (t.reminders && Array.isArray(t.reminders)) {
      for (const r of t.reminders) {
        allReminders.push({
          ...r,
          taskId: t.id,
          taskTitle: t.title,
          taskCategory: t.category,
          taskPriority: t.priority,
          deadlineDate: t.deadlineDate,
          deadlineTime: t.deadlineTime,
        });
      }
    }
  }

  res.json({
    reminders: allReminders,
    notifications: db.notifications || [],
  });
});

app.post('/api/notifications/:id/read', (req: Request, res: Response) => {
  const db = loadDB();
  const notif = db.notifications.find((n) => n.id === req.params.id);
  if (notif) {
    notif.read = true;
    saveDB(db);
  }
  res.json({ success: true });
});

app.post('/api/notifications/clear-all', (_req: Request, res: Response) => {
  const db = loadDB();
  db.notifications = [];
  saveDB(db);
  res.json({ success: true });
});

app.post('/api/reminders/:id/snooze', (req: Request, res: Response) => {
  const db = loadDB();
  const { minutes = 15 } = req.body;
  let found = false;

  for (const t of db.tasks) {
    if (t.reminders) {
      const r = t.reminders.find((item: any) => item.id === req.params.id);
      if (r) {
        const snoozeDate = new Date(Date.now() + minutes * 60 * 1000);
        r.scheduledAt = snoozeDate.toISOString();
        r.status = 'snoozed';
        r.delivered = false;
        r.label = `Snoozed (${minutes}m)`;
        found = true;
        break;
      }
    }
  }

  if (found) {
    saveDB(db);
    res.json({ success: true, message: `Reminder snoozed for ${minutes} minutes` });
  } else {
    res.status(404).json({ error: 'Reminder not found' });
  }
});

// Rewards & Recommendations
app.get('/api/rewards', (_req: Request, res: Response) => {
  const db = loadDB();
  const profile = db.profile;

  // Curated, genuine external learning tools and opportunities tailored to profession & interests
  const recommendations = [
    {
      id: 'rec_hf',
      title: 'Hugging Face Open Source Hub',
      provider: 'Hugging Face',
      type: 'FREE',
      category: 'AI & Machine Learning',
      description: 'Access thousands of free pre-trained models, datasets, and Spaces for building AI solutions.',
      benefit: 'Ideal for hands-on fine-tuning and state-of-the-art transformer learning.',
      url: 'https://huggingface.co',
      tag: 'Trending for AI Students',
    },
    {
      id: 'rec_colab',
      title: 'Google Colaboratory (Free GPU)',
      provider: 'Google Research',
      type: 'FREE',
      category: 'Data Science & AI',
      description: 'Interactive Jupyter notebook environment with zero setup and free access to T4 GPUs.',
      benefit: 'Train models and execute deep learning experiments in the cloud.',
      url: 'https://colab.research.google.com',
      tag: 'Essential Resource',
    },
    {
      id: 'rec_gh_pack',
      title: 'GitHub Student Developer Pack',
      provider: 'GitHub Education',
      type: 'FREE',
      category: 'Developer Tools',
      description: 'Over $200k in free cloud credits, domain registration, Copilot access, and developer tooling.',
      benefit: 'Free access to JetBrains, DigitalOcean, Canva Pro, and Termius.',
      url: 'https://education.github.com/pack',
      tag: 'Must-Have for Students',
    },
    {
      id: 'rec_kaggle',
      title: 'Kaggle Micro-Courses & Certifications',
      provider: 'Google / Kaggle',
      type: 'CERTIFICATION',
      category: 'Education & Career',
      description: 'Free, bite-sized courses with certificates on Machine Learning, Deep Learning, Feature Engineering, and SQL.',
      benefit: 'Hands-on practical coding experience and resume certifications.',
      url: 'https://www.kaggle.com/learn',
      tag: 'Free Certificate',
    },
    {
      id: 'rec_deeplearning',
      title: 'DeepLearning.AI Short Courses',
      provider: 'DeepLearning.AI & Andrew Ng',
      type: 'FREE',
      category: 'AI Engineering',
      description: 'Cutting-edge courses on LangChain, Multi-Agent Systems, RAG, and Vector Databases in partnership with industry leaders.',
      benefit: 'Learn production-grade AI application patterns.',
      url: 'https://www.deeplearning.ai/short-courses/',
      tag: 'Top Rated',
    },
    {
      id: 'rec_notion',
      title: 'Notion for Personal & Project Planning',
      provider: 'Notion',
      type: 'FREE',
      category: 'Productivity',
      description: 'All-in-one workspace for notes, project roadmaps, knowledge bases, and task trackers.',
      benefit: 'Free personal plan with unlimited blocks and rich integrations.',
      url: 'https://www.notion.so',
      tag: 'Productivity Staple',
    },
  ];

  res.json({
    rewards: db.rewards,
    achievements: db.achievements,
    recommendations,
  });
});

app.post('/api/rewards/redeem', (req: Request, res: Response) => {
  const db = loadDB();
  const { perkId, cost } = req.body;

  if (db.rewards.points < cost) {
    res.status(400).json({ error: 'Insufficient points to redeem this perk' });
    return;
  }

  db.rewards.points -= cost;
  if (!db.rewards.claimedPerks.includes(perkId)) {
    db.rewards.claimedPerks.push(perkId);
  }

  saveDB(db);
  res.json({
    message: 'Perk redeemed successfully!',
    rewards: db.rewards,
  });
});

// Analytics API
app.get('/api/analytics', (_req: Request, res: Response) => {
  const db = loadDB();
  const tasks = db.tasks;

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const overdue = tasks.filter((t) => {
    if (t.status === 'Completed' || t.status === 'Cancelled') return false;
    return t.deadlineDate < '2026-11-01';
  }).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Category distribution
  const categoryCounts: Record<string, { total: number; completed: number }> = {};
  tasks.forEach((t) => {
    if (!categoryCounts[t.category]) {
      categoryCounts[t.category] = { total: 0, completed: 0 };
    }
    categoryCounts[t.category].total += 1;
    if (t.status === 'Completed') {
      categoryCounts[t.category].completed += 1;
    }
  });

  // Productivity score calculation
  const productivityScore = Math.min(
    100,
    Math.round(completionRate * 0.6 + db.rewards.currentStreak * 5 + (completed * 4))
  );

  res.json({
    total,
    completed,
    inProgress,
    pending,
    overdue,
    completionRate,
    productivityScore,
    mostProductiveDay: 'Saturday',
    streak: db.rewards.currentStreak,
    points: db.rewards.points,
    categoryCounts,
  });
});

// ==========================================
// AI COMPANION (GEMINI 3.8 FLASH) ROUTES
// ==========================================

function withTimeout<T>(promise: Promise<T>, ms: number = 6000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('AI Request Timeout')), ms)),
  ]);
}

// Chat Endpoint: Friendly companion with Tanglish / Tamil / English support
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;
  const db = loadDB();
  const profile = db.profile;

  const systemInstruction = `You are "Taskora AI", an intelligent, empathetic, and supportive personal productivity companion in the TASKORA application.
The user is ${profile.name}, a ${profile.profession} aiming to ${profile.careerGoals}.
The user prefers ${profile.preferredLanguage} language and a "${profile.preferredAIPersonality}" personality.
Current Context Date: Sunday, November 1, 2026.

Language & Style Instructions:
- Support English, Tamil, and Tanglish (Tamil written in English script).
- If the user talks in Tanglish (e.g. "Naalaiku morning 7 maniku Java padikanum", "Enaku innaiku task mudiyala"), reply warmly in natural Tanglish with encouraging words like "machi", "thala", "kandippa", "super machi!".
- If the user talks in English, reply in friendly conversational English.
- Always be encouraging, never shame the user for incomplete tasks ("No problem machi! Don't worry. Indha task-ah tomorrow reschedule pannalama?").
- If the user mentions scheduling an activity, identify the task title, date, time, and advance reminders, and explicitly ask for confirmation before saving.
- Keep replies punchy, warm, and helpful (under 4-5 sentences).`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const conversationHistory = Array.isArray(history)
      ? history.map((h: any) => `${h.sender === 'user' ? 'User' : 'Taskora AI'}: ${h.text}`).join('\n')
      : '';

    const prompt = `${conversationHistory ? `Previous conversation:\n${conversationHistory}\n\n` : ''}User: ${message}\nTaskora AI:`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
        },
      }),
      6000
    );

    const reply = response.text || 'Kandippa machi! I am here to help you plan smart and achieve your goals.';
    res.json({ reply });
  } catch (err: any) {
    console.warn('Gemini chat fallback invoked:', err?.message);
    // Intelligent local conversational fallback supporting Tanglish & English
    const lower = (message || '').toLowerCase();
    let reply = `Kandippa machi! I got your message. Let's make sure you stay on track with your goals. Enna task plan pannanum?`;

    if (lower.includes('java') || lower.includes('padikanum') || lower.includes('study')) {
      reply = `Sure machi! Naalaiku morning 7 AM Java study task create pannalaam. 6:30 AM-ku advance reminder set pannalama? Just tap "Add Task" below! 🎯`;
    } else if (lower.includes('project') || lower.includes('submission') || lower.includes('exam')) {
      reply = `Noted machi! Important deadline. Naan 1 month munnadiyum 1 week munnadiyum advance reminders set panren so you can submit cool-ah without rush! 🚀`;
    } else if (lower.includes('mudiyala') || lower.includes("can't") || lower.includes('tired') || lower.includes('incomplete')) {
      reply = `No problem machi! Chill pannu, don't worry. Small breaks are part of the process. Indha task-ah tomorrow-ku reschedule pannalama? 💪`;
    } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('vanakkam')) {
      reply = `Vanakkam machi! Ready to conquer today? Check your dashboard or tell me any goal you want to plan! 🌟`;
    }

    res.json({ reply });
  }
});

// Task Extraction Endpoint: Structured JSON parsing from natural language / speech input
app.post('/api/ai/extract-task', async (req: Request, res: Response) => {
  const { input } = req.body;
  const todayStr = '2026-11-01';

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not set');
    }

    const systemInstruction = `You are a precision task extraction engine for TASKORA.
Current reference date is November 1, 2026 (Sunday).
Extract structured task and reminder information from the user's natural language input (which may be in English, Tamil, or Tanglish).

Examples:
- "Naalaiku morning 7 maniku Java padikanum" -> title: "Java Study", deadlineDate: "2026-11-02", deadlineTime: "07:00", category: "Education", reminders: ["30_mins"]
- "December 15 en project submission irukku. One month munnadiyum one week munnadiyum remind pannu" -> title: "Project Submission", deadlineDate: "2026-12-15", deadlineTime: "17:00", category: "Education", priority: "Critical", reminders: ["1_month", "1_week"]
- "March 15 2027 enakku exam irukku. One month munnadi remind pannu" -> title: "Examination", deadlineDate: "2027-03-15", deadlineTime: "09:00", category: "Education", reminders: ["1_month"]

Valid Categories: Education, Career, Personal, Health, Fitness, Work, Projects, Finance, Events, Other.
Valid Priorities: Critical, High, Medium, Low.
Valid Reminder Presets: 12_months, 6_months, 3_months, 2_months, 1_month, 2_weeks, 1_week, 3_days, 2_days, 1_day, 12_hours, 6_hours, 1_hour, 30_mins, 15_mins, 5_mins.`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Extract task details from: "${input}"`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              priority: { type: Type.STRING },
              startDate: { type: Type.STRING },
              startTime: { type: Type.STRING },
              deadlineDate: { type: Type.STRING },
              deadlineTime: { type: Type.STRING },
              notes: { type: Type.STRING },
              reminders: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['title', 'category', 'priority', 'deadlineDate'],
          },
        },
      }),
      6000
    );

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.warn('Gemini extraction fallback:', err?.message);
    // Rule-based fallback extraction
    const text = (input || '').toLowerCase();
    let title = 'New Task';
    let category = 'Personal';
    let priority = 'Medium';
    let deadlineDate = '2026-11-02';
    let deadlineTime = '09:00';
    let reminders: string[] = ['30_mins'];

    if (text.includes('java')) {
      title = 'Java Study Session';
      category = 'Education';
      priority = 'High';
      deadlineDate = '2026-11-02';
      deadlineTime = '07:00';
      reminders = ['30_mins'];
    } else if (text.includes('project') || text.includes('submission')) {
      title = 'Project Submission';
      category = 'Projects';
      priority = 'Critical';
      deadlineDate = text.includes('december') ? '2026-12-15' : '2027-01-01';
      deadlineTime = '17:00';
      reminders = ['1_month', '1_week', '1_day'];
    } else if (text.includes('exam') || text.includes('semester')) {
      title = 'Semester Examination';
      category = 'Education';
      priority = 'Critical';
      deadlineDate = text.includes('march') ? '2027-03-15' : '2027-01-15';
      deadlineTime = '09:00';
      reminders = ['1_month', '2_weeks', '1_day'];
    } else if (text.includes('gym') || text.includes('workout')) {
      title = 'Gym Workout';
      category = 'Fitness';
      priority = 'Medium';
      deadlineDate = '2026-11-01';
      deadlineTime = '18:00';
      reminders = ['1_hour'];
    }

    res.json({
      title,
      description: input,
      category,
      priority,
      startDate: '2026-11-01',
      startTime: '09:00',
      deadlineDate,
      deadlineTime,
      notes: 'Generated via natural language audio/text input',
      reminders,
    });
  }
});

// AI Goal Roadmap Planner: Deconstructs 3-month to 1-year goals
app.post('/api/ai/plan-goal', async (req: Request, res: Response) => {
  const { goal, timeframe = '6 months' } = req.body;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const systemInstruction = `You are the Taskora Master AI Planner.
Reference Date: November 1, 2026.
Divide the user's high-level goal into actionable milestones across monthly phases, weekly sprints, and daily tasks with suggested deadlines and advance reminders.
Output strictly JSON conforming to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Create an actionable roadmap for goal: "${goal}" over ${timeframe}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            goalTitle: { type: Type.STRING },
            timeline: { type: Type.STRING },
            summary: { type: Type.STRING },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseName: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  milestones: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        suggestedDeadline: { type: Type.STRING },
                        priority: { type: Type.STRING },
                        category: { type: Type.STRING },
                        reminders: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                      },
                      required: ['title', 'suggestedDeadline', 'priority', 'category'],
                    },
                  },
                },
                required: ['phaseName', 'duration', 'milestones'],
              },
            },
          },
          required: ['goalTitle', 'timeline', 'summary', 'phases'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.warn('Gemini goal planner fallback:', err?.message);
    // High-quality structured fallback for common goals (e.g., Become AI Engineer in 6 months)
    res.json({
      goalTitle: goal || 'Become an AI Engineer in 6 Months',
      timeline: timeframe,
      summary: 'A structured, battle-tested 3-phase curriculum starting from Python/Math foundations to Advanced LLM & Agent architectures.',
      phases: [
        {
          phaseName: 'Phase 1: Foundations & Classical ML (Months 1-2)',
          duration: 'Nov 2026 - Dec 2026',
          milestones: [
            {
              title: 'Master Python for Data Science & PyTorch Basics',
              description: 'NumPy, Pandas, Vectorized computing, Tensor operations, and autograd mechanics.',
              suggestedDeadline: '2026-11-30',
              priority: 'High',
              category: 'Education',
              reminders: ['1_week', '1_day'],
            },
            {
              title: 'Supervised & Unsupervised Machine Learning Capstone',
              description: 'Implement regression, decision trees, random forests, and k-means clustering from scratch.',
              suggestedDeadline: '2026-12-25',
              priority: 'High',
              category: 'Education',
              reminders: ['2_weeks', '3_days'],
            },
          ],
        },
        {
          phaseName: 'Phase 2: Deep Learning & NLP Fundamentals (Months 3-4)',
          duration: 'Jan 2027 - Feb 2027',
          milestones: [
            {
              title: 'Neural Networks & Transformer Architecture Deep-Dive',
              description: 'Self-attention, multi-head attention, positional encoding, and BERT/GPT fine-tuning.',
              suggestedDeadline: '2027-01-31',
              priority: 'Critical',
              category: 'Education',
              reminders: ['1_month', '1_week'],
            },
            {
              title: 'Build Retrieval-Augmented Generation (RAG) System',
              description: 'Implement vector embeddings, chunking, hybrid search, and semantic re-ranking with Milvus or Chroma.',
              suggestedDeadline: '2027-02-28',
              priority: 'Critical',
              category: 'Projects',
              reminders: ['2_weeks', '1_week'],
            },
          ],
        },
        {
          phaseName: 'Phase 3: Autonomous Agents, Fine-Tuning & Production Deployment (Months 5-6)',
          duration: 'Mar 2027 - Apr 2027',
          milestones: [
            {
              title: 'Autonomous Multi-Agent Workflow Implementation',
              description: 'Tool use, function calling, evaluation frameworks, and latency optimization.',
              suggestedDeadline: '2027-03-31',
              priority: 'Critical',
              category: 'Projects',
              reminders: ['1_month', '1_week'],
            },
            {
              title: 'End-to-End AI Portfolio Project & Interview Readiness',
              description: 'Deploy full-stack AI application with Docker, FastAPI, and Next.js/Flutter frontend.',
              suggestedDeadline: '2027-04-30',
              priority: 'Critical',
              category: 'Career',
              reminders: ['2_months', '1_month', '1_week'],
            },
          ],
        },
      ],
    });
  }
});

// Friendly Productivity Report Generator
app.post('/api/ai/productivity-report', async (req: Request, res: Response) => {
  const db = loadDB();
  const profile = db.profile;
  const tasks = db.tasks;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const total = tasks.length;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate a personalized, uplifting productivity report for ${profile.name}.
Total tasks: ${total}, Completed: ${completed}, Streak: ${db.rewards.currentStreak} days, Points: ${db.rewards.points}.
Tone: Friendly, inspiring, never shaming. Provide 3 actionable tips in ${profile.preferredLanguage}.`,
    });

    res.json({ report: response.text });
  } catch (err: any) {
    res.json({
      report: `Super performance Mohanraj machi! 🔥 You have completed ${completed} out of ${total} tasks with a solid ${db.rewards.currentStreak}-day streak and ${db.rewards.points} reward points.

Key Insights:
1. **Steady Momentum**: Your daily habit tracking is on point.
2. **Future Readiness**: Planning ahead for your semester exam and capstone gives you an unfair advantage.
3. **Machi's Tip**: Tackle your high-priority items in your morning 7-9 AM power window for maximum output! Keep rocking! 🚀`,
    });
  }
});

// In development, mount Vite dev server; in production, serve built static assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`TASKORA server running on http://localhost:${PORT}`);
  });
}

startServer();
