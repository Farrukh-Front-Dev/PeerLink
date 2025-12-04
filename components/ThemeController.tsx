
import React, { useEffect, useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { THEME_PRESETS, TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface Props {
  lang: Language;
}

export const ThemeController: React.FC<Props> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState('cyber');
  const t = TRANSLATIONS[lang];

  // Initialize theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('s21_theme_id');
    if (saved) {
      applyTheme(saved);
    }
  }, []);

  const applyTheme = (id: string) => {
    const theme = THEME_PRESETS.find(t => t.id === id);
    if (!theme) return;

    setActiveThemeId(id);
    localStorage.setItem('s21_theme_id', id);

    // Update CSS variables directly on the root element
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-secondary', theme.secondary);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors relative group"
        title={t.theme}
      >
        <Palette size={20} className="group-hover:text-neon-cyan transition-colors" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          {/* Fix: Use right-4 for desktop, but center horizontally on mobile to prevent cut-off */}
          <div className="fixed top-16 right-4 left-4 sm:left-auto w-auto sm:w-80 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] p-4 z-50 animate-fadeIn overflow-hidden">
            <div className="text-xs text-gray-500 font-bold px-1 mb-3 uppercase tracking-wider flex justify-between items-center">
              <span>{t.theme}</span>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {THEME_PRESETS.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => applyTheme(theme.id)}
                  className={`aspect-square rounded-xl relative flex items-center justify-center border transition-all duration-300 group ${activeThemeId === theme.id ? 'border-white scale-105 shadow-[0_0_15px_white]' : 'border-transparent hover:scale-105 hover:border-white/50'}`}
                  style={{ backgroundColor: theme.hex }}
                  title={theme.name}
                >
                  {activeThemeId === theme.id && <Check size={16} className="text-black/70 font-bold" />}
                </button>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-300 tracking-wide">
                {THEME_PRESETS.find(t => t.id === activeThemeId)?.name} Mode
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
