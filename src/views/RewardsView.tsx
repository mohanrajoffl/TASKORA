import React, { useState } from 'react';
import {
  Award,
  Flame,
  Zap,
  CheckCircle,
  ExternalLink,
  Gift,
  Lock,
  Sparkles,
  Trophy,
  CalendarCheck,
  Compass,
} from 'lucide-react';
import { RewardState, RewardRecommendation, UserProfile } from '../types';

interface RewardsViewProps {
  rewards: RewardState | null;
  recommendations: RewardRecommendation[];
  profile: UserProfile | null;
  onRedeemPerk: (perkId: string, cost: number) => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  rewards,
  recommendations,
  profile,
  onRedeemPerk,
}) => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'achievements' | 'recommendations'>(
    'rewards'
  );

  const perks = [
    {
      id: 'focus_soundtrack',
      title: 'Binaural Focus Soundscapes (Lofi & Alpha Waves)',
      cost: 50,
      description: 'Unlock 4 high-fidelity concentration ambient tracks for deep work sprints.',
      icon: '🎵',
    },
    {
      id: 'custom_ai_avatar',
      title: 'Gold Machi AI Avatar Badge',
      cost: 100,
      description: 'Exclusive golden icon flair for your Taskora profile and AI companion header.',
      icon: '🌟',
    },
    {
      id: 'productivity_certificate',
      title: 'Certified Taskora Goal Conqueror Diploma',
      cost: 200,
      description: 'Digital verified milestone badge celebrating 200+ productivity points.',
      icon: '📜',
    },
  ];

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 pt-2">
      {/* Gamification Stats Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600/30 via-slate-900 to-indigo-900/40 border border-amber-500/30 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-4 h-4" />
              Taskora Gamified Reward Engine
            </span>
            <h2 className="text-2xl font-black text-white">
              Level {rewards?.level || 1} • {rewards?.levelTitle || 'Momentum Builder'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Earn real points for completing tasks based on priority (Critical: +25, High: +20, Medium: +15, Low: +10). Maintain your streak to unlock badges and personalized perks!
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Total Points Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/40 text-center min-w-[100px]">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Total Points
              </span>
              <span className="text-2xl font-black text-amber-300">
                {rewards?.points || 0}
              </span>
            </div>

            {/* Streak Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-orange-500/40 text-center min-w-[100px]">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Active Streak
              </span>
              <span className="text-2xl font-black text-orange-400 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-orange-400/20" />
                {rewards?.currentStreak || 4}d
              </span>
            </div>
          </div>
        </div>

        {/* Level Progress bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-300 font-semibold">
            <span>Progress to Next Level</span>
            <span>{(rewards?.points || 0) % 100} / 100 XP</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (rewards?.points || 0) % 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
            activeTab === 'rewards'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Redeemable Perks
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
            activeTab === 'achievements'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Badges & Milestones ({rewards?.achievements?.filter((a) => a.isUnlocked).length || 0})
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
            activeTab === 'recommendations'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Curated Free Resources ({recommendations.length})
        </button>
      </div>

      {/* Tab 1: Redeemable Perks */}
      {activeTab === 'rewards' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Exchange your earned Taskora productivity points for concentration soundtracks and prestige achievements:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {perks.map((perk) => {
              const isClaimed = rewards?.claimedPerks?.includes(perk.id);
              const canAfford = (rewards?.points || 0) >= perk.cost;

              return (
                <div
                  key={perk.id}
                  className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{perk.icon}</span>
                      <span className="text-xs font-extrabold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        {perk.cost} pts
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{perk.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {perk.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onRedeemPerk(perk.id, perk.cost)}
                    disabled={isClaimed || !canAfford}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isClaimed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    {isClaimed
                      ? 'Unlocked & Active'
                      : canAfford
                      ? 'Redeem Perk'
                      : `Needs ${perk.cost - (rewards?.points || 0)} more pts`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Achievements & Badges */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {rewards?.achievements?.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all ${
                ach.isUnlocked
                  ? 'bg-slate-800/90 border-amber-500/40 shadow-md'
                  : 'bg-slate-900/50 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-xl ${
                    ach.isUnlocked
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  <Trophy className="w-5 h-5" />
                </div>
                {ach.isUnlocked ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">
                    In Progress
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-white">{ach.title}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-snug">
                {ach.description}
              </p>
              <span className="text-[11px] font-semibold text-amber-400 mt-2 block">
                Reward: +{ach.points} pts
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Personalized External Resources */}
      {activeTab === 'recommendations' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-200">
            <span>
              Personalized based on profile:{' '}
              <strong className="text-white">{profile?.profession || 'Student'}</strong> interested in{' '}
              <strong className="text-white">
                {profile?.interests?.join(', ') || 'AI & Productivity'}
              </strong>
            </span>
            <span className="text-[10px] bg-indigo-500/30 px-2 py-0.5 rounded-full">
              Genuine Opportunities
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {rec.type}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {rec.provider}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rec.description}
                  </p>
                  <p className="text-[11px] text-amber-300/90 font-medium">
                    Benefit: {rec.benefit}
                  </p>
                </div>

                <a
                  href={rec.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Explore Opportunity</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
