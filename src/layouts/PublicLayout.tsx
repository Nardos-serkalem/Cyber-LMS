import type { ReactNode } from "react";
import brandLogo from "../assets/logo.png";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src={brandLogo} alt="BIRANA LMS logo" className="mb-3 h-20 w-20 object-contain" />
          <div className="text-xl font-bold text-navy-900">BIRANA LMS</div>
          <div className="text-xs text-surface-muted">Elevate Skills | Empower Teams</div>
        </div>
        {children}
      </div>
    </div>
  );
}