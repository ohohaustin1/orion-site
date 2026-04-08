import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function Login() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/war-room");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim().toLowerCase(), password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "登入失敗，請確認帳號密碼");
        return;
      }

      window.location.href = "/war-room";
    } catch {
      setError("網路錯誤，請稍後再試");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#c9a84c] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0d14] via-[#0f1419] to-[#0a0d14] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <circle cx="100" cy="150" r="2" fill="#c9a84c" />
          <circle cx="250" cy="80" r="1.5" fill="#c9a84c" />
          <circle cx="400" cy="200" r="2.5" fill="#c9a84c" />
          <circle cx="600" cy="100" r="2" fill="#c9a84c" />
          <circle cx="700" cy="250" r="1.5" fill="#c9a84c" />
          <circle cx="150" cy="400" r="2" fill="#c9a84c" />
          <circle cx="500" cy="450" r="1.5" fill="#c9a84c" />
          <circle cx="650" cy="380" r="2" fill="#c9a84c" />
          <line x1="100" y1="150" x2="250" y2="80" stroke="#c9a84c" strokeWidth="0.5" />
          <line x1="250" y1="80" x2="400" y2="200" stroke="#c9a84c" strokeWidth="0.5" />
          <line x1="400" y1="200" x2="600" y2="100" stroke="#c9a84c" strokeWidth="0.5" />
          <line x1="600" y1="100" x2="700" y2="250" stroke="#c9a84c" strokeWidth="0.5" />
          <line x1="150" y1="400" x2="500" y2="450" stroke="#c9a84c" strokeWidth="0.5" />
          <line x1="500" y1="450" x2="650" y2="380" stroke="#c9a84c" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-full border-2 border-[#c9a84c]/50 flex items-center justify-center bg-gradient-to-br from-[#c9a84c]/10 to-transparent mb-4">
            <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
              <circle cx="30" cy="20" r="2.5" fill="#c9a84c" />
              <circle cx="70" cy="25" r="2.5" fill="#c9a84c" />
              <circle cx="50" cy="42" r="3.5" fill="#c9a84c" />
              <circle cx="35" cy="62" r="2.5" fill="#c9a84c" />
              <circle cx="65" cy="67" r="2.5" fill="#c9a84c" />
              <circle cx="50" cy="82" r="2.5" fill="#c9a84c" />
              <line x1="30" y1="20" x2="50" y2="42" stroke="#c9a84c" strokeWidth="0.8" opacity="0.7" />
              <line x1="70" y1="25" x2="50" y2="42" stroke="#c9a84c" strokeWidth="0.8" opacity="0.7" />
              <line x1="50" y1="42" x2="35" y2="62" stroke="#c9a84c" strokeWidth="0.8" opacity="0.7" />
              <line x1="50" y1="42" x2="65" y2="67" stroke="#c9a84c" strokeWidth="0.8" opacity="0.7" />
              <line x1="35" y1="62" x2="50" y2="82" stroke="#c9a84c" strokeWidth="0.8" opacity="0.7" />
              <line x1="65" y1="67" x2="50" y2="82" stroke="#c9a84c" strokeWidth="0.8" opacity="0.7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#c9a84c] tracking-wider">獵戶座智鑑</h1>
          <p className="text-gray-400 text-xs mt-1 tracking-widest uppercase">
            ORION AI GROUP · STRATEGY & DOMINANCE
          </p>
        </div>

        <div className="bg-[#0f1419]/90 border border-[#c9a84c]/20 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <h2 className="text-white text-lg font-semibold mb-6">登入系統</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-sm">
                電子郵件
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
                className="bg-[#1a1f2e] border-[#c9a84c]/20 text-white placeholder:text-gray-500 focus:border-[#c9a84c]/60 focus:ring-[#c9a84c]/20 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 text-sm">
                密碼
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="bg-[#1a1f2e] border-[#c9a84c]/20 text-white placeholder:text-gray-500 focus:border-[#c9a84c]/60 focus:ring-[#c9a84c]/20 h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c9a84c] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-[#c9a84c] cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-gray-400 text-sm cursor-pointer select-none">
                保持登入（7 天）
              </label>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting || !email || !password}
              className="w-full bg-gradient-to-r from-[#c9a84c] to-[#a68a3f] hover:from-[#d4b85a] hover:to-[#b89a4f] text-[#0a0d14] font-bold py-5 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 登入中...</>
              ) : (
                "登入"
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-gray-400 hover:text-[#c9a84c] transition-colors"
            >
              忘記密碼？
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-[#c9a84c] hover:text-[#d4b85a] transition-colors font-medium"
            >
              申請帳號 →
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-4">
          測試帳號：demo@orion.ai ／ Demo2026!
        </p>
        <p className="text-center text-gray-600 text-xs mt-2">
          © 2026 ORION AI GROUP. All rights reserved.
        </p>
      </div>
    </div>
  );
}
