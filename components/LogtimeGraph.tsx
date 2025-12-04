import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ParticipantProfile, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { LiquidCard } from './LiquidCard';
import { Clock } from 'lucide-react';

interface Props {
  logtime: ParticipantProfile['logtime'];
  averageLogtime?: number; 
  lang: Language;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-xl border border-neon-purple/30 p-3 rounded-xl shadow-[0_0_20px_rgba(188,19,254,0.15)] animate-[fadeIn_0.2s_ease-out]">
        <p className="text-gray-400 text-xs mb-1">{payload[0].payload.fullDate ? new Date(payload[0].payload.fullDate).toDateString() : label}</p>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-bold text-neon-purple">{payload[0].value}</span>
          <span className="text-xs text-gray-500 mb-1">hrs</span>
        </div>
      </div>
    );
  }
  return null;
};

export const LogtimeGraph = React.memo<Props>(({ logtime, averageLogtime, lang }) => {
  const t = TRANSLATIONS[lang];

  // If we have history array, show chart
  if (logtime && logtime.length > 0) {
    const data = React.useMemo(() => {
        return logtime.map(l => ({
            date: new Date(l.date).toLocaleDateString(undefined, { weekday: 'short' }),
            fullDate: l.date,
            hours: parseFloat((l.hours + l.minutes / 60).toFixed(1))
        })).slice(-7);
    }, [logtime]);

    return (
      <LiquidCard title={t.logtime} glowColor="purple">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(188,19,254,0.05)', radius: 4 }}
                content={<CustomTooltip />}
              />
              <Bar 
                dataKey="hours" 
                fill="#bc13fe" 
                radius={[4, 4, 4, 4]} 
                animationDuration={1500}
                activeBar={{ fill: '#e879f9', stroke: '#fff', strokeWidth: 0, filter: 'drop-shadow(0 0 8px #d946ef)' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </LiquidCard>
    );
  }

  // Fallback: Display Average if single number provided
  const avg = averageLogtime !== undefined ? averageLogtime : 0;
  
  return (
    <LiquidCard title={t.logtime} glowColor="purple">
      <div className="h-[200px] w-full flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-neon-purple/5 text-neon-purple border border-neon-purple/20 shadow-[0_0_20px_rgba(188,19,254,0.15)] animate-[pulse-slow_4s_infinite]">
          <Clock size={32} />
        </div>
        <div>
          <span className="text-4xl font-bold text-white tracking-tight">{avg.toFixed(2)}</span>
          <span className="text-sm text-gray-400 ml-2 font-medium">h / avg</span>
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-wider">Weekly Activity</div>
      </div>
    </LiquidCard>
  );
});