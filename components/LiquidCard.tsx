
import React, { ReactNode } from 'react';

interface LiquidCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'magenta' | 'purple' | 'none';
  title?: string;
}

export const LiquidCard = React.memo<LiquidCardProps>(({ 
  children, 
  className = '', 
  glowColor = 'none',
  title 
}) => {
  let glowStyle = '';
  
  // We map the old prop names to the new CSS Variable classes.
  // 'cyan' -> Primary Theme Color
  // 'purple/magenta' -> Secondary Theme Color
  switch (glowColor) {
    case 'cyan': 
      glowStyle = 'hover:shadow-[0_0_30px_rgb(var(--color-primary)/0.2)] border-neon-cyan/20'; 
      break;
    case 'magenta': 
    case 'purple': 
      glowStyle = 'hover:shadow-[0_0_30px_rgb(var(--color-secondary)/0.2)] border-neon-purple/20'; 
      break;
    default: 
      glowStyle = 'border-white/5 hover:border-white/10';
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-white/[0.03] backdrop-blur-2xl border transition-all duration-500 ease-out ${glowStyle} ${className}`}>
      {/* Glossy shine effect */}
      <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
      
      {title && (
        <div className="px-6 py-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
          <h3 className="text-lg font-medium tracking-wide text-white/90 font-sans">{title}</h3>
          <div 
            className={`w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor] transition-colors duration-500 ${
              glowColor === 'none' ? 'bg-white/30' : 
              glowColor === 'cyan' ? 'bg-neon-cyan text-neon-cyan' : 'bg-neon-purple text-neon-purple'
            }`} 
          />
        </div>
      )}
      
      <div className="p-6">
        {children}
      </div>
    </div>
  );
});
