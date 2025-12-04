import React, { useState } from 'react';
import { ParticipantProfile, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { LiquidCard } from './LiquidCard';
import { CheckCircle, XCircle, Clock, CircleSlash, PlayCircle, ChevronDown, ChevronUp, Users, Calendar } from 'lucide-react';

interface Props {
  projects: ParticipantProfile['projects'];
  lang: Language;
}

export const ProjectsList = React.memo<Props>(({ projects, lang }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const t = TRANSLATIONS[lang];

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusIcon = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'FINISHED' || s === 'COMPLETED') return <CheckCircle size={18} className="text-green-400" />;
    if (s === 'FAILED') return <XCircle size={18} className="text-red-400" />;
    if (s === 'IN_PROGRESS' || s === 'ASSIGNED') return <PlayCircle size={18} className="text-neon-cyan" />;
    if (s === 'WAITING_FOR_CORRECTION') return <Clock size={18} className="text-yellow-400" />;
    return <CircleSlash size={18} className="text-gray-400" />;
  };

  const getStatusStyle = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'FINISHED' || s === 'COMPLETED') return 'border-green-500/30 bg-green-500/10 text-green-300';
    if (s === 'FAILED') return 'border-red-500/30 bg-red-500/10 text-red-300';
    if (s === 'IN_PROGRESS' || s === 'ASSIGNED') return 'border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan';
    if (s === 'WAITING_FOR_CORRECTION') return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';
    return 'border-gray-500/30 bg-gray-500/10 text-gray-300';
  };

  // Sort projects: Active first, then by date descending
  const sortedProjects = React.useMemo(() => {
    return [...projects].sort((a, b) => {
      const aActive = a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS';
      const bActive = b.status === 'ASSIGNED' || b.status === 'IN_PROGRESS';
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [projects]);

  return (
    <LiquidCard title={t.projects} glowColor="cyan" className="h-full max-h-[400px] flex flex-col">
      <div className="overflow-y-auto pr-2 space-y-3 max-h-[320px] custom-scrollbar">
        {sortedProjects.length === 0 && <div className="text-gray-500 text-center py-4">No projects found.</div>}
        {sortedProjects.map((proj, index) => (
          <div 
            key={proj.id} 
            onClick={() => toggleExpand(proj.id)}
            style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
            className={`flex flex-col p-4 rounded-xl transition-all duration-300 border cursor-pointer animate-slideUp
              ${expandedId === proj.id 
                ? 'bg-white/10 border-neon-cyan/40 shadow-[0_0_20px_rgba(0,243,255,0.15)]' 
                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-neon-cyan/50 hover:shadow-[0_0_15px_rgba(0,243,255,0.1)]'
              }`}
          >
            {/* Top Row: Info & Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(proj.status)}
                <div>
                  <div className="font-medium text-sm text-gray-200 group-hover:text-white transition-colors">{proj.name}</div>
                  <div className="text-xs text-gray-500">
                    {proj.updatedAt ? new Date(proj.updatedAt).toLocaleDateString() : '-'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 {proj.finalMark !== undefined && proj.finalMark !== null && (
                    <span className={`text-sm font-bold ${proj.finalMark >= 100 ? 'text-neon-cyan' : proj.finalMark > 0 ? 'text-green-300' : 'text-red-300'}`}>
                      {proj.finalMark}%
                    </span>
                 )}
                 <div className="flex items-center gap-2">
                   {expandedId === proj.id ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-500"/>}
                 </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === proj.id && (
              <div className="mt-3 pt-3 border-t border-white/10 text-sm animate-fadeIn">
                 <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusStyle(proj.status)}`}>
                        {proj.status.replace(/_/g, ' ')}
                    </span>
                 </div>
                 
                 {/* Team Info */}
                 {proj.team && proj.team.length > 0 && (
                   <div className="flex items-start gap-2 mb-3">
                     <Users size={14} className="mt-0.5 text-neon-purple"/>
                     <div className="flex-1">
                       <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 block mb-1">Team</span>
                       <div className="flex flex-wrap gap-1">
                         {proj.team.map(member => (
                            <span key={member} className="text-xs text-gray-300 bg-white/5 rounded px-1.5 py-0.5 border border-white/5">{member}</span>
                         ))}
                       </div>
                     </div>
                   </div>
                 )}
                 
                 {/* Detailed Date */}
                 <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-neon-cyan"/>
                    <span className="text-xs text-gray-400">
                      {proj.status === 'IN_PROGRESS' || proj.status === 'ASSIGNED' ? 'Started:' : 'Completed:'} {new Date(proj.updatedAt).toLocaleString()}
                    </span>
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </LiquidCard>
  );
});