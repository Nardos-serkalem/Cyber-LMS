import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { PublicLayout } from "../../layouts/PublicLayout";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useAuthStore } from "../../store/authStore";
import { loginUser } from "../../lib/api/auth";
import { ApiError } from "../../lib/api/client";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { token, user } = await loginUser({ email, password });
      setSession({ id: user.id, email: user.email, fullName: user.fullName, role: user.role, token });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't reach the server. Is the backend running?");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PublicLayout backgroundImageUrl="/login-bg.jpg">
      <Card className="overflow-hidden border-white/70 bg-white/92 p-0 shadow-[0_28px_70px_rgba(8,16,35,0.26)] backdrop-blur-xl">
        <div className="border-b border-surface-divider bg-gradient-to-br from-navy-900 via-navy-700 to-navy-900 px-6 py-6 text-white">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-surface-card shadow-lg shadow-lemon-500/20 ring-1 ring-white/10">
              <img src="/Branalms.jpg" alt="Branalms logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.32em] text-lemon-200/90">Brana LMS</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight">Welcome back</div>
            </div>
          </div>
          <p className="max-w-xs text-sm leading-6 text-navy-50/90">
            Sign in to continue learning, tracking progress, and accessing your dashboard.
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="mb-5 space-y-1">
            <div className="text-base font-semibold tracking-tight text-navy-900">Log in to your account</div>
            <div className="text-sm text-surface-muted">Use your email and password to continue.</div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="space-y-2">
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-navy-500">
                Email address <span className="text-status-danger">*</span>
              </span>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-navy-200 bg-surface-card px-4 py-3 text-sm text-navy-900 outline-none transition-colors placeholder:text-surface-muted focus:border-lemon-500 focus:ring-4 focus:ring-lemon-50"
              />
            </label>

            <label className="space-y-2">
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-navy-500">
                Password <span className="text-status-danger">*</span>
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-navy-200 bg-surface-card px-4 py-3 pr-12 text-sm text-navy-900 outline-none transition-colors placeholder:text-surface-muted focus:border-lemon-500 focus:ring-4 focus:ring-lemon-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-muted transition-colors hover:text-navy-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-xs text-surface-muted">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-navy-300 text-lemon-500 focus:ring-lemon-500" />
                Remember me
              </label>
              <button type="button" className="font-medium text-navy-700 hover:text-navy-900">
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-status-danger bg-status-dangerBg px-4 py-3 text-sm text-status-danger">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="mt-1 w-full rounded-xl py-3 text-sm font-semibold shadow-[0_16px_32px_rgba(168,212,0,0.22)] disabled:opacity-60"
            >
              {isSubmitting ? "Logging in…" : "Log in"}
            </Button>
          </form>

          <div className="mt-5 rounded-xl border border-navy-200 bg-surface-canvas px-4 py-3 text-center text-sm text-surface-muted">
            New here? <Link to="/register" className="font-semibold text-navy-700 hover:text-navy-900">Create an account</Link>
          </div>
        </div>
      </Card>
    </PublicLayout>
  );
}