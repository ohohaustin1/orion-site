import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "請求失敗，請稍後再試");
        return;
      }

      setSent(true);
    } catch {
      setError("網路錯誤，請稍後再試");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0d14] via-[#0f1419] to-[#0a0d14] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#0f1419]/90 border border-[#c9a84c]/20 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-14 h-14 text-[#c9a84c] mx-auto mb-4" />
              <h2 className="text-white text-lg font-bold mb-2">重設連結已發送</h2>
              <p className="text-gray-400 text-sm mb-6">
                請檢查你的信箱 <span className="text-[#c9a84c]">{email}</span>，
                依照信件中的連結重設密碼。
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="bg-[#c9a84c] hover:bg-[#d4b85a] text-[#0a0d14] font-semibold"
              >
                返回登入
              </Button>
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-1 text-gray-400 hover:text-[#c9a84c] text-sm mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> 返回登入
              </button>

              <h2 className="text-white text-lg font-semibold mb-2">忘記密碼</h2>
              <p className="text-gray-400 text-sm mb-6">
                輸入你的電子郵件，我們將發送密碼重設連結。
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
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

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting || !email}
                  className="w-full bg-gradient-to-r from-[#c9a84c] to-[#a68a3f] hover:from-[#d4b85a] hover:to-[#b89a4f] text-[#0a0d14] font-bold py-5 rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 發送中...</>
                  ) : (
                    "發送重設連結"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
