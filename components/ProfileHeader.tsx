
import React from 'react';
import { ParticipantProfile, Language } from '../types';
import { TRANSLATIONS, FALLBACK_IMAGE } from '../constants';
import { LiquidCard } from './LiquidCard';
import { Mail, MapPin, Layers } from 'lucide-react';

interface Props {
  profile: ParticipantProfile;
  lang: Language;
}

export const ProfileHeader = React.memo<Props>(({ profile, lang }) => {
  const t = TRANSLATIONS[lang];
  const progressPercent = profile.expToNextLevel 
    ? Math.min(100, Math.max(0, (profile.expValue / (profile.expValue + profile.expToNextLevel)) * 100))
    : 0;

  return (
    <LiquidCard glowColor="cyan" className="mb-6 overflow-visible">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
        
        {/* Avatar */}
        <div className="relative group shrink-0">
          <div 
            className="w-36 h-36 rounded-full overflow-hidden border-4 border-black transition-all duration-500 bg-black relative z-10 ring-2 ring-neon-cyan/50"
            style={{ boxShadow: '0 0 30px rgb(var(--color-primary) / 0.3)' }}
          >
            <img 
              src={profile.avatarUrl || FALLBACK_IMAGE} 
              alt={profile.login} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
            />
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur border border-neon-cyan/50 text-neon-cyan text-xs font-bold px-4 py-1.5 rounded-full z-20 shadow-lg whitespace-nowrap">
            Level {profile.level}
          </div>
        </div>

        {/* Info */}
        <div className="flex-grow w-full text-center md:text-left space-y-5 pt-2">
          <div>
            <h1 className="text-5xl font-bold text-white tracking-tight mb-2 drop-shadow-lg">{profile.login}</h1>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-400 font-medium">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <Mail size={14} className="text-neon-purple"/> {profile.email}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <MapPin size={14} className="text-neon-magenta"/> {profile.campus}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <Layers size={14} className="text-neon-cyan"/> {profile.className} • {profile.parallelName}
              </span>
            </div>
          </div>

          {/* XP Bar */}
          <div className="space-y-2 max-w-3xl">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
              <span className="text-neon-cyan flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></span>
                 {t.exp} {profile.expValue.toLocaleString()}
              </span>
              <span className="text-gray-500">To Next Lvl: {profile.expToNextLevel.toLocaleString()}</span>
            </div>
            <div className="h-5 bg-black/50 rounded-full overflow-hidden border border-white/10 relative shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-neon-purple via-fuchsia-500 to-neon-cyan transition-all duration-1000 ease-out relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite] skew-x-12" />
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 shadow-[0_0_10px_white]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LiquidCard>
  );
});
