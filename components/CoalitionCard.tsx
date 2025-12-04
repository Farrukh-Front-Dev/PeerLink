import React from 'react';
import { ParticipantProfile, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { LiquidCard } from './LiquidCard';
import { Shield, Trophy, Monitor, MapPin } from 'lucide-react';

interface Props {
  coalition: ParticipantProfile['coalition'];
  workstation: ParticipantProfile['workstation'];
  lang: Language;
}

export const CoalitionCard = React.memo<Props>(({ coalition, workstation, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <LiquidCard glowColor="none" className="h-full min-h-[140px] flex flex-col justify-center">
      <div className="flex flex-row items-stretch gap-4 h-full">
        
        {/* Left Half: Coalition */}
        <div className="flex-1 relative group">
          <h3 className="text-gray-500 text-[10px] uppercase tracking-wider mb-2 font-bold">{t.coalition}</h3>
          
          {coalition ? (
            <div 
              className="h-[calc(100%-24px)] rounded-2xl p-4 border border-white/5 relative overflow-hidden flex flex-col justify-center transition-all duration-300 hover:border-white/10"
              style={{ backgroundColor: coalition.color ? `${coalition.color}08` : 'rgba(255,255,255,0.02)' }}
            >
              {/* Background decorative icon */}
              <div className="absolute -right-4 -bottom-4 opacity-[0.05] rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 pointer-events-none grayscale">
                 {coalition.imageUrl ? <img src={coalition.imageUrl} className="w-24 h-24" /> : <Shield size={80} />}
              </div>
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-black/40 flex items-center justify-center border border-white/10 shadow-lg">
                   {coalition.imageUrl ? <img src={coalition.imageUrl} className="w-7 h-7 object-contain" /> : <Shield size={20} className="text-gray-400"/>}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-base text-white truncate leading-tight mb-1">{coalition.name}</div>
                  <div className="flex flex-col text-xs text-gray-400 gap-0.5">
                    <span className="flex items-center gap-1.5"><Trophy size={11} className="text-yellow-500"/> Rank: {coalition.rank}</span>
                    <span className="opacity-70">Score: {coalition.score}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
             <div className="h-[calc(100%-24px)] flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-gray-600 text-xs italic">No Data</span>
             </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="w-px bg-gradient-to-b from-transparent via-white/10 to-transparent self-center h-2/3" />

        {/* Right Half: Workstation */}
        <div className="flex-1">
          <h3 className="text-gray-500 text-[10px] uppercase tracking-wider mb-2 font-bold">{t.location}</h3>
          
          {workstation ? (
            <div className={`h-[calc(100%-24px)] rounded-2xl p-4 border flex flex-col justify-center transition-all duration-300 ${workstation.isActive ? 'bg-green-500/[0.03] border-green-500/20 shadow-[0_0_20px_rgba(74,222,128,0.02)]' : 'bg-white/[0.02] border-white/5'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center border transition-colors ${workstation.isActive ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-black/20 border-white/5 text-gray-600'}`}>
                  {workstation.isActive ? <Monitor size={20} /> : <MapPin size={20} />}
                </div>
                <div className="min-w-0">
                  <div className="text-base font-bold text-white truncate leading-tight mb-1">
                    {workstation.location.replace('Cluster', 'Cl').replace('Row', 'R').replace('Seat', 'S')}
                  </div>
                  <div className={`text-xs font-medium flex items-center gap-1.5 ${workstation.isActive ? 'text-green-400' : 'text-gray-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${workstation.isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}></span>
                    {workstation.isActive ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[calc(100%-24px)] flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5">
               <span className="text-gray-600 text-xs italic">Remote</span>
            </div>
          )}
        </div>

      </div>
    </LiquidCard>
  );
});