import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";
import { useAuthStore } from "./store/authStore";

import { ToastProvider } from './shared/components/toast/ToastProvider'
import { initBeranaStorage } from './shared/storage/initStorage'
import { ensureDemoSeedData } from './shared/storage/seedDemoData'
import { ensureDemoLearningCourse } from './shared/storage/seedDemoCourse'

initBeranaStorage()
ensureDemoSeedData()
ensureDemoLearningCourse()

const queryClient = new QueryClient();

function Bootstrap() {
  const restoreSession = useAuthStore((s) => s.restoreSession);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-surface-muted">
        Loading…
      </div>
    );
  }

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Bootstrap />
        </ToastProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
