import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ParticipantProfile, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { LiquidCard } from './LiquidCard';

interface Props {
  history: ParticipantProfile['xpHistory'];
  lang: Language;
}

export const XPTimeline = React.memo<Props>(({ history, lang }) => {
  const t = TRANSLATIONS[lang];

  if (!history || history.length === 0) return null;

  const data = React.useMemo(() => {
    return history.map(h => ({
        date: new Date(h.date).toLocaleDateString(),
        xp: h.expValue
    }));
  }, [history]);

  return (
    <LiquidCard title={t.xpHistory} glowColor="purple" className="h-[300px]">
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#bc13fe" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={30} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(188,19,254,0.3)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#bc13fe', marginBottom: '4px' }}
            />
            <Area 
                type="monotone" 
                dataKey="xp" 
                stroke="#bc13fe" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorXp)" 
                animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </LiquidCard>
  );
});