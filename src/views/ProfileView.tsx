import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Target,
  Languages,
  Bot,
  Clock,
  Bell,
  Volume2,
  Check,
  Save,
} from 'lucide-react';
import { UserProfile, ProfessionType, AIPersonality, PreferredLanguage } from '../types';

interface ProfileViewProps {
  profile: UserProfile | null;
  onSaveProfile: (profile: Partial<UserProfile>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onSaveProfile }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ageRange, setAgeRange] = useState('20-25');
  const [profession, setProfession] = useState<ProfessionType>('Student');
  const [education, setEducation] = useState('');
  const [careerGoals, setCareerGoals] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<PreferredLanguage>('Tanglish');
  const [preferredAIPersonality, setPreferredAIPersonality] = useState<AIPersonality>('Friendly Machi');
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('23:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setAgeRange(profile.ageRange || '20-25');
      setProfession(profile.profession || 'Student');
      setEducation(profile.education || '');
      setCareerGoals(profile.careerGoals || '');
      setPreferredLanguage(profile.preferredLanguage || 'Tanglish');
      setPreferredAIPersonality(profile.preferredAIPersonality || 'Friendly Machi');
      setStartTime(profile.dailyActiveHours?.start || '07:00');
      setEndTime(profile.dailyActiveHours?.end || '23:00');
      setNotificationsEnabled(profile.notificationsEnabled ?? true);
      setSoundEnabled(profile.soundEnabled ?? true);
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name,
      email,
      ageRange,
      profession,
      education,
      careerGoals,
      preferredLanguage,
      preferredAIPersonality,
      dailyActiveHours: { start: startTime, end: endTime },
      notificationsEnabled,
      soundEnabled,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const professions: ProfessionType[] = [
    'Student',
    'Employee',
    'Freelancer',
    'Entrepreneur',
    'Job seeker',
    'Other',
  ];

  const personalities: AIPersonality[] = [
    'Friendly Machi',
    'Encouraging Mentor',
    'Strategic Executive',
    'Energetic Coach',
  ];

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto px-4 pt-2">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            <span>Profile & Personalization</span>
          </h2>
          <p className="text-xs text-slate-400">
            Taskora uses this to personalize your AI responses, reminders, and reward recommendations
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Details */}
        <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/60 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            <span>Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Profession</label>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value as ProfessionType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
              >
                {professions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Education / Major</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Career Goals & Vision</label>
            <input
              type="text"
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              placeholder="e.g. Become a Senior AI Engineer & Full-Stack Architect"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* AI Companion Settings */}
        <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/60 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-400" />
            <span>AI Companion Preferences</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Preferred Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as PreferredLanguage)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Tanglish">Tanglish (Tamil in English Script)</option>
                <option value="English">English</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                AI Companion Personality
              </label>
              <select
                value={preferredAIPersonality}
                onChange={(e) => setPreferredAIPersonality(e.target.value as AIPersonality)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
              >
                {personalities.map((pers) => (
                  <option key={pers} value={pers}>
                    {pers}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Daily Active Hours & Notification Preferences */}
        <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/60 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Active Hours & Notification Policies</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Day Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Day End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-700/60">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-xs text-slate-300 font-medium">
                Enable smart advance reminder push alerts
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-xs text-slate-300 font-medium">
                Play celebratory sound on completing tasks and earning points
              </span>
            </label>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-between">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-4 h-4" />
              Profile updated successfully!
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-amber-500 hover:from-indigo-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Preferences</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
