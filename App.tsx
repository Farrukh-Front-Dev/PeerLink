
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Globe, LogOut, Maximize, Minimize } from 'lucide-react';
import { AppState, Language } from './types';
import { TRANSLATIONS } from './constants';
import { ApiService } from './services/api';
import { ProfileHeader } from './components/ProfileHeader';
import { SkillsChart } from './components/SkillsChart';
import { ProjectsList } from './components/ProjectsList';
import { BadgesGallery } from './components/BadgesGallery';
import { LogtimeGraph } from './components/LogtimeGraph';
import { LoginPage } from './components/LoginPage';
import { XPTimeline } from './components/XPTimeline';
import { CoalitionCard } from './components/CoalitionCard';
import { ThemeController } from './components/ThemeController';
// import { sendLoginToBot } from "./services/telegram";


function App() {
  const [state, setState] = useState<AppState>({
    currentProfile: null,
    isLoading: false,
    error: null,
    language: 'EN',
    offlineMode: localStorage.getItem('s21_offline') === 'true',
    isAuthenticated: !!ApiService.getToken()
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const t = TRANSLATIONS[state.language];

  // Fullscreen Logic
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };


//   const handleLogin = async (username: string) => {
//   // 1. Userni statega yozish
//   setUser(username);

//   // 2. BOT'ga yuborish
//   await sendLoginToBot(username);

//   // 3. Dashboard/Asosiy sahifaga yo‘naltirish
//   setCurrentPage("dashboard");
// };


  const loadProfile = useCallback(async (login: string) => {
    if (!login) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Check Cache first if offline mode is enabled
    if (state.offlineMode) {
      const cached = localStorage.getItem(`profile_${login.toLowerCase()}`);
      if (cached) {
        try {
          const profile = JSON.parse(cached);
          if (Date.now() - profile.loadedAt < 86400000) { // 24h validity
            setState(prev => ({ ...prev, currentProfile: profile, isLoading: false }));
            return;
          }
        } catch (e) {
          localStorage.removeItem(`profile_${login.toLowerCase()}`);
        }
      }
    }

    try {
      const profile = await ApiService.getParticipant(login);
      
      // Update Cache
      if (state.offlineMode) {
        localStorage.setItem(`profile_${login.toLowerCase()}`, JSON.stringify(profile));
      }

      setState(prev => ({ ...prev, currentProfile: profile, isLoading: false }));
    } catch (err: any) {
      console.error(err);
      if (err.message === 'Unauthorized') {
        setState(prev => ({ ...prev, isAuthenticated: false, currentProfile: null, isLoading: false }));
      } else {
        setState(prev => ({ ...prev, error: t.notFound, isLoading: false }));
      }
    }
  }, [state.offlineMode, t.notFound]);

  // Handle Login Success
  const handleLoginSuccess = (login: string) => {
    setState(prev => ({ ...prev, isAuthenticated: true }));
    loadProfile(login); // Load the logged-in user's profile immediately
  };

  // Handle Logout
  const handleLogout = () => {
    ApiService.logout();
    setState(prev => ({ ...prev, isAuthenticated: false, currentProfile: null }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      loadProfile(searchQuery.trim());
    }
  };

  const toggleLanguage = () => {
    const langs: Language[] = ['EN', 'RU', 'UZ'];
    const nextIdx = (langs.indexOf(state.language) + 1) % langs.length;
    setState(prev => ({ ...prev, language: langs[nextIdx] }));
  };

  // Render Login Page if not authenticated
  if (!state.isAuthenticated) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess} 
        lang={state.language} 
        setLang={(l) => setState(prev => ({ ...prev, language: l }))}
      />
    );
  }

  // Render Dashboard
  return (
    <>
      {/* 
        FIXED BACKGROUND: 
        This div sits behind everything (z-[-1]) and covers the entire viewport using 'fixed inset-0'.
        This solves the issue of white gaps on mobile during overscroll or fullscreen.
      */}
      <div 
  className="fixed inset-0 z-[-1]"
  style={{
    backgroundColor: '#030305',
    backgroundImage: `
      radial-gradient(circle at 15% 50%, rgb(var(--color-secondary) / 0.15) 0%, transparent 40%),
      radial-gradient(circle at 85% 30%, rgb(var(--color-primary) / 0.15) 0%, transparent 40%)
    `,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',   // <-- muhim
  }}
/>


      <div className="min-h-[100svh] h-[100svh] flex flex-col transition-all duration-300 relative">

        
        {/* --- HEADER --- */}
        <header className="sticky top-0 z-40 bg-black/30 backdrop-blur-xl border-b border-white/10 shadow-2xl pt-[env(safe-area-inset-top)]">
          <div className="flex items-center justify-between h-16 gap-4 px-4 mx-auto max-w-7xl">
            
            {/* Logo - Clicks to rrangesi */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => loadProfile('rrangesi')}>
              <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-black rounded bg-gradient-to-br from-neon-cyan to-neon-purple">PL</div>
              <span className="hidden text-xl font-bold tracking-wider text-transparent sm:block bg-clip-text bg-gradient-to-r from-white to-gray-400">PeerLink Pro</span>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md group">
              <input 
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:bg-white/10 focus:border-neon-cyan/50 focus:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-neon-cyan transition-colors" size={16} />
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              
              {/* Color Theme Controller */}
              <ThemeController lang={state.language} />

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-400 transition-colors rounded-full hover:text-white hover:bg-white/10"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>

              {/* Language */}
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1 text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                <Globe size={16} />
                <span className="hidden sm:inline">{state.language}</span>
              </button>

              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="p-2 text-red-400 transition-colors rounded-full hover:bg-red-500/10 hover:text-red-300"
                title={t.logout}
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-grow max-w-[1600px] w-full mx-auto px-4 py-8 pb-8">
          
          {/* Loading State */}
          {state.isLoading && (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-12 h-12 border-4 rounded-full border-neon-cyan border-t-transparent animate-spin"></div>
              <p className="text-neon-cyan animate-pulse">{t.loading}</p>
            </div>
          )}

          {/* Error State */}
          {!state.isLoading && state.error && (
            <div className="py-12 text-center">
               <div className="inline-block p-4 mb-4 rounded-full bg-red-500/10">
                  <Search size={32} className="text-red-400" />
               </div>
               <div className="mb-2 text-xl font-bold text-red-400">{state.error}</div>
               <p className="text-gray-500">Please check the login and try again.</p>
            </div>
          )}

          {/* Empty State / Search Prompt */}
          {!state.isLoading && !state.error && !state.currentProfile && (
             <div className="py-20 text-center opacity-50">
               <Search size={48} className="mx-auto mb-4 text-gray-600" />
               <p>Enter a participant login to view their profile.</p>
             </div>
          )}

          {/* Content */}
          {!state.isLoading && state.currentProfile && (
            <div className="animate-[fadeIn_0.5s_ease-out] space-y-8">
              
              {/* 1. Header Section */}
              <ProfileHeader profile={state.currentProfile} lang={state.language} />
              
              {/* 2. Stats Row (Coalition + Logtime) */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
                 <div className="h-full lg:col-span-5">
                    <CoalitionCard 
                      coalition={state.currentProfile.coalition} 
                      workstation={state.currentProfile.workstation} 
                      lang={state.language} 
                    />
                 </div>
                 <div className="h-full lg:col-span-7">
                    <LogtimeGraph 
                      logtime={state.currentProfile.logtime} 
                      averageLogtime={state.currentProfile.averageLogtime}
                      lang={state.language} 
                    />
                 </div>
              </div>

              {/* 3. Big Charts Row (Skills + XP Timeline) */}
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                 {/* Skills Chart - Now Massive */}
                 <div className="w-full">
                    <SkillsChart skills={state.currentProfile.skills} lang={state.language} />
                 </div>
                 
                 {/* XP Timeline & Projects */}
                 <div className="flex flex-col space-y-6">
                    <XPTimeline history={state.currentProfile.xpHistory} lang={state.language} />
                    <div className="flex-grow">
                      <ProjectsList projects={state.currentProfile.projects} lang={state.language} />
                    </div>
                 </div>
              </div>

              {/* 4. Badges Gallery - Full Width at Bottom */}
              <div className="w-full col-span-full">
                 <BadgesGallery badges={state.currentProfile.badges} lang={state.language} />
              </div>

            </div>
          )}

        </main>
      </div>
    </>
  );
}

export default App;
function setUser(username: string) {
  throw new Error('Function not implemented.');
}

function setCurrentPage(arg0: string) {
  throw new Error('Function not implemented.');
}

