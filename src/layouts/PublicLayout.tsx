import type { ReactNode } from "react";

interface PublicLayoutProps {
  children: ReactNode;
  backgroundImageUrl?: string;
}

export function PublicLayout({ children, backgroundImageUrl }: PublicLayoutProps) {
  const hasBackgroundImage = Boolean(backgroundImageUrl);

  return (
    <div className={`relative flex min-h-screen items-center justify-center px-4 ${hasBackgroundImage ? "overflow-hidden bg-navy-900" : "bg-surface-canvas"}`}>
      {backgroundImageUrl && (
        <>
          <div className="absolute inset-0 bg-navy-900/70" />
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            aria-hidden="true"
          />
        </>
      )}
      <div className={`relative z-10 w-full max-w-xl ${hasBackgroundImage ? "drop-shadow-[0_28px_60px_rgba(10,16,35,0.38)]" : ""}`}>
        {children}
      </div>
    </div>
  );
}