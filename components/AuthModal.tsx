import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { ApiService } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSuccess: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, lang, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const success = await ApiService.authenticate(username, password);
    setLoading(false);
    
    if (success) {
      onSuccess();
      onClose();
    } else {
      setError('Authentication failed. Please check credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 animate-pulse-slow">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-6 text-neon-cyan">
          <Lock size={24} />
          <h2 className="text-xl font-bold">{t.connect}</h2>
        </div>

        <p className="text-sm text-gray-400 mb-6">{t.authDesc}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">{t.login}</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
              placeholder="e.g. rrangesi"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">{t.password}</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
              required
            />
          </div>

          {error && <div className="text-red-400 text-xs">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-neon-cyan to-blue-600 text-black font-bold py-3 rounded-lg hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '...' : t.connect}
          </button>
        </form>
      </div>
    </div>
  );
};