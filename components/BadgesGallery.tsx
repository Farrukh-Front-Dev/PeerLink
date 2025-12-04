
import React, { useState } from 'react';
import { ParticipantProfile, Language } from '../types';
import { TRANSLATIONS, FALLBACK_IMAGE } from '../constants';
import { LiquidCard } from './LiquidCard';
import { Award, Calendar } from 'lucide-react';

interface Props {
  badges: ParticipantProfile['badges'];
  lang: Language;
}

export const BadgesGallery = React.memo<Props>(({ badges, lang }) => {
  const t = TRANSLATIONS[lang];
  // Track which badges are currently flipped
  const [flippedIds, setFlippedIds] = useState<Set<number>>(new Set());

 const toggleBadge = (id: number) => {
  if (flippedIds.has(id)) {
    // agar oldin flipped bo‘lgan bo‘lsa, olib tashlaymiz
    setFlippedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  } else {
    // badge ni flip qilamiz
    setFlippedIds(prev => new Set(prev).add(id));

    // 3 soniyadan keyin avtomatik o‘chirib, original holatga qaytaramiz
    setTimeout(() => {
      setFlippedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 3000);
  }
};


  return (
    <LiquidCard title={t.badges} glowColor="magenta" className="w-full">
      {badges.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center text-gray-500">
            <Award size={48} className="mb-4 opacity-20"/>
            <p>No badges earned yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 p-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8">
          {badges.map((badge, idx) => {
            const isFlipped = flippedIds.has(badge.id);
            
            return (
              <div 
                key={badge.id} 
                onClick={() => toggleBadge(badge.id)}
                className="relative h-48 cursor-pointer group sm:h-56 perspective-1000"
                style={{ perspective: '1000px' }}
              >
                <div 
                  className={`w-full h-full relative transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                >
                  {/* --- FRONT FACE --- */}
                  <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white/[0.05] to-transparent rounded-2xl border border-white/5 hover:border-neon-magenta/50 shadow-lg transition-all duration-300">
                    
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none bg-white/5 group-hover:opacity-100 rounded-2xl" />

                    {/* Icon */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 flex items-center justify-center rounded-full bg-black/40 border border-white/10 shadow-inner group-hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] transition-all duration-500 overflow-hidden">
                      <img 
                        src={badge.image || FALLBACK_IMAGE} 
                        alt={badge.name} 
                        loading="lazy"
                        className="w-10 h-10 sm:w-14 sm:h-14 object-contain filter drop-shadow-[0_0_5px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>

                    {/* Name */}
                    <h4 className="text-xs font-bold leading-tight text-center text-gray-200 transition-colors sm:text-sm group-hover:text-neon-magenta">
                        {badge.name}
                    </h4>
                    
                    <div className="mt-2 text-[10px] text-gray-500 flex items-center gap-1 opacity-60">
                      <span>Click to flip</span>
                    </div>
                  </div>

                  {/* --- BACK FACE --- */}
                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-xl rounded-2xl border border-neon-magenta/30 shadow-[0_0_20px_rgba(188,19,254,0.15)] text-center">
                    
                    <h4 className="mb-2 text-sm font-bold text-neon-magenta line-clamp-2">{badge.name}</h4>
                    
                    <div className="flex items-center justify-center flex-1">
                      <p className="text-[11px] text-gray-300 leading-relaxed overflow-y-auto max-h-[80px] custom-scrollbar">
                        {badge.description || "No description."}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/10 w-full flex items-center justify-center gap-1 text-[10px] text-gray-400">
                      <Calendar size={10} />
                      <span>{new Date(badge.awardedAt).toLocaleDateString()}</span>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </LiquidCard>
  );
});
