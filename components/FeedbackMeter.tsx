
import React from 'react';
import { ParticipantProfile, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { LiquidCard } from './LiquidCard';

interface Props {
  feedback: ParticipantProfile['feedback'];
  lang: Language;
}

export const FeedbackMeter: React.FC<Props> = ({ feedback, lang }) => {
  const t = TRANSLATIONS[lang];

  if (!feedback) return null;

  const items = [
    { label: t.punctuality, value: feedback.punctuality, color: 'bg-neon-cyan' },
    { label: t.interest, value: feedback.interest, color: 'bg-neon-purple' },
    { label: t.thoroughness, value: feedback.thoroughness, color: 'bg-neon-magenta' },
    { label: t.friendliness, value: feedback.friendliness, color: 'bg-green-400' },
  ];

  return (
    <LiquidCard title={t.feedback} glowColor="cyan" className="h-full">
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs text-gray-300">
              <span>{item.label}</span>
              <span>{item.value}/5</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
              <div 
                className={`h-full ${item.color} shadow-[0_0_10px_currentColor] transition-all duration-1000`}
                style={{ width: `${(item.value / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </LiquidCard>
  );
};
