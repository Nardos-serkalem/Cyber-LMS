import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { PublicLayout } from "../../layouts/PublicLayout";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useAuthStore } from "../../store/authStore";

export function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    login(fullName || "Learner"); // mocked — no real account creation yet
    navigate("/dashboard");
  }

  return (
    <PublicLayout backgroundImageUrl="regback.jpg">
      <Card className="overflow-hidden border-white/70 bg-white/92 p-0 shadow-[0_28px_70px_rgba(8,16,35,0.26)] backdrop-blur-xl">
        <div className="border-b border-surface-divider bg-gradient-to-br from-navy-900 via-navy-700 to-navy-900 px-6 py-6 text-white">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-surface-card shadow-lg shadow-lemon-500/20 ring-1 ring-white/10">
              <img src="/Branalms.jpg" alt="Branalms logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.32em] text-lemon-200/90">BRANA LMS</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight">Create account</div>
            </div>
          </div>
          <p className="max-w-xs text-sm leading-6 text-navy-50/90">
            Join the learning platform and start tracking your progress in one place.
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="mb-5 space-y-1">
            <div className="text-base font-semibold tracking-tight text-navy-900">Register your account</div>
            <div className="text-sm text-surface-muted">Fill in your details to get started.</div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="space-y-2">
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-navy-500">
                Full name <span className="text-status-danger">*</span>
              </span>
              <input
                type="text"
                required
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-navy-200 bg-surface-card px-4 py-3 text-sm text-navy-900 outline-none transition-colors placeholder:text-surface-muted focus:border-lemon-500 focus:ring-4 focus:ring-lemon-50"
              />
            </label>

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
                  placeholder="Create a password"
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

            <label className="space-y-2">
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-navy-500">
                Confirm password <span className="text-status-danger">*</span>
              </span>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-navy-200 bg-surface-card px-4 py-3 pr-12 text-sm text-navy-900 outline-none transition-colors placeholder:text-surface-muted focus:border-lemon-500 focus:ring-4 focus:ring-lemon-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-muted transition-colors hover:text-navy-700"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {error && <div className="rounded-xl border border-status-danger bg-status-dangerBg px-4 py-3 text-sm text-status-danger">{error}</div>}

            <Button type="submit" variant="primary" className="mt-1 w-full rounded-xl py-3 text-sm font-semibold shadow-[0_16px_32px_rgba(168,212,0,0.22)]">
              Register
            </Button>
          </form>

          <div className="mt-5 rounded-xl border border-navy-200 bg-surface-canvas px-4 py-3 text-center text-sm text-surface-muted">
            Already have an account? <Link to="/login" className="font-semibold text-navy-700 hover:text-navy-900">Log in</Link>
          </div>
        </div>
      </Card>
    </PublicLayout>
  );
}