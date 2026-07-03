"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";

interface ToastState {
  id: number;
  type: ToastType;
  text: string;
}

interface ToastContextValue {
  toast: (type: ToastType, text: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const toast = useCallback((type: ToastType, text: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none w-[calc(100%-2rem)] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-center animate-fadeInUp shadow-lg"
            style={{
              background:
                t.type === "success" ? "#6BCB7720" : t.type === "error" ? "#E85D5D20" : "#1a1918",
              color:
                t.type === "success" ? "#6BCB77" : t.type === "error" ? "#E85D5D" : "#E8E2D8",
              border: `1px solid ${
                t.type === "success" ? "#6BCB7740" : t.type === "error" ? "#E85D5D40" : "rgba(255,255,255,0.1)"
              }`,
              backdropFilter: "blur(8px)",
            }}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback so a missing provider never crashes a flow.
    return { toast: (_type: ToastType, text: string) => console.warn("[toast]", text) };
  }
  return ctx;
}
