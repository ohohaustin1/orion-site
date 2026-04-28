import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { API_BASE } from "../lib/api-base";

export default function Register() {
  const [, navigate] = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !confirm) return;

    if (password !== confirm) {
      setError("兩次密碼不一致");
      return;
    }
    if (password.length < 8) {
      setError("密碼至少需要 8 個字元");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "註冊失敗，請稍後再試");
        return;
      }

      setSuccess(true);
    } catch {
      setError("網路錯誤，請稍後再試");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-[#0f1419]/90 border border-[#c9a84c]/20 rounded-2xl p-10 shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-[#c9a84c] mx-auto mb-4" />
            <h2 className="text-white text-xl font-bold mb-2">申請已送出</h2>
            <p className="text-gray-400 text-sm mb-6">
              您的帳號申請已收到，管理員審核後將通知您。
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="bg-[#c9a84c] hover:bg-[#d4b85a] text-[#0a0d14] font-semibold px-8"
            >
              返回登入
            </Button>
          </div>
        </div>
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
          <line x1="100" y1="150" x2="250" y2="80" stroke="#c9a84c" strokeWidth="0.5" />
          <line x1="250" y1="80" x2="400" y2="200" stroke="#c9a84c" strokeWidth="0.5" />
          <line x1="400" y1="200" x2="600" y2="100" stroke="#c9a84c" strokeWidth="0.5" />
          <line x1="600" y1="100" x2="700" y2="250" stroke="#c9a84c" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full border-2 border-[#c9a84c]/50 flex items-center justify-center bg-gradient-to-br from-[#c9a84c]/10 to-transparent mb-3">
            <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
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
          <h1 className="text-xl font-bold text-[#c9a84c] tracking-wider">獵戶座智鑑</h1>
        </div>

        <div className="bg-[#0f1419]/90 border border-[#c9a84c]/20 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <h2 className="text-white text-lg font-semibold mb-6">申請帳號</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300 text-sm">姓名</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="您的姓名"
                required
                className="bg-[#1a1f2e] border-[#c9a84c]/20 text-white placeholder:text-gray-500 focus:border-[#c9a84c]/60 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-sm">電子郵件</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
                className="bg-[#1a1f2e] border-[#c9a84c]/20 text-white placeholder:text-gray-500 focus:border-[#c9a84c]/60 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 text-sm">密碼（至少 8 字元）</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className="bg-[#1a1f2e] border-[#c9a84c]/20 text-white placeholder:text-gray-500 focus:border-[#c9a84c]/60 h-11 pr-10"
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

            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-gray-300 text-sm">確認密碼</Label>
              <Input
                id="confirm"
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className="bg-[#1a1f2e] border-[#c9a84c]/20 text-white placeholder:text-gray-500 focus:border-[#c9a84c]/60 h-11"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting || !name || !email || !password || !confirm}
              className="w-full bg-gradient-to-r from-[#c9a84c] to-[#a68a3f] hover:from-[#d4b85a] hover:to-[#b89a4f] text-[#0a0d14] font-bold py-5 rounded-lg transition-all duration-200 disabled:opacity-50 mt-2"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 提交中...</>
              ) : (
                "送出申請"
              )}
            </Button>
          </form>

          <div className="mt-5 text-center text-sm">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-400 hover:text-[#c9a84c] transition-colors"
            >
              ← 返回登入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
