"use client";

import { usePathname, useRouter } from "next/navigation";

const TABS = [
  { label: "Home", icon: "🏠", path: "/home" },
  { label: "Tribes", icon: "👥", path: "/tribes" },
  { label: "My Aura", icon: "✦", path: "/aura" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Spacer */}
      <div className="h-20" />
      {/* Gradient fade */}
      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none h-24 bg-gradient-to-t from-bg to-transparent" />
      {/* Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 pt-2 pb-safe bg-bg/90 backdrop-blur-md border-t border-muted-6/50">
        {TABS.map((tab) => {
          const isActive =
            pathname === tab.path ||
            (tab.path !== "/home" && pathname.startsWith(tab.path));
          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className="flex flex-col items-center gap-0.5 py-2 px-4 transition-colors"
            >
              <span
                className="text-lg"
                style={{ opacity: isActive ? 1 : 0.4 }}
              >
                {tab.icon}
              </span>
              <span
                className="text-[10px] font-medium"
                style={{
                  color: isActive
                    ? "var(--color-text)"
                    : "var(--color-muted-2)",
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
