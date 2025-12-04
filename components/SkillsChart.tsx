import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { ParticipantProfile, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { LiquidCard } from './LiquidCard';

interface Props {
  skills: ParticipantProfile['skills'];
  lang: Language;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-xl border border-neon-magenta/30 p-4 rounded-xl shadow-[0_0_25px_rgba(255,0,255,0.2)] animate-[fadeIn_0.2s_ease-out] z-50">
        <p className="text-gray-300 text-sm uppercase tracking-widest font-bold mb-1">{payload[0].payload.subject}</p>
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold text-neon-magenta">{payload[0].value}</span>
          <span className="text-sm text-gray-500 mb-1">points</span>
        </div>
      </div>
    );
  }
  return null;
};

export const SkillsChart = React.memo<Props>(({ skills, lang }) => {
  const t = TRANSLATIONS[lang];

  // Memoize data transformation
  const chartData = React.useMemo(() => {
     const sortedSkills = [...skills].sort((a, b) => b.level - a.level);
     return sortedSkills.slice(0, 8).map(s => ({
        subject: s.name,
        A: s.level,
        fullMark: 100
      }));
  }, [skills]);

  if (skills.length === 0) return null;

  return (
    <LiquidCard title={t.skills} glowColor="magenta" className="flex flex-col h-full min-h-[500px]">
      <div className="flex-grow w-full py-4">
        <ResponsiveContainer width="100%" height="100%" minHeight={450}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#e5e5e5', fontSize: 12, fontWeight: 500 }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
            <Radar
              name="Skill Level"
              dataKey="A"
              stroke="#ff00ff"
              strokeWidth={3}
              fill="#ff00ff"
              fillOpacity={0.2}
              isAnimationActive={true}
              animationDuration={1000}
              activeDot={{ r: 6, fill: '#ff00ff', stroke: '#fff', strokeWidth: 2, filter: 'drop-shadow(0 0 8px #ff00ff)' }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </LiquidCard>
  );
});