"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Splash from "@/components/Splash";

const SPLASH_FLAG = "fabled_splash_shown";
const AUTH_TIMEOUT_MS = 4000;

async function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms),
    ),
  ]);
}

async function resolveTarget(): Promise<string> {
  console.log("[root] AUTH checking");
  try {
    const { data: { session } } = await withTimeout(
      supabase.auth.getSession(),
      AUTH_TIMEOUT_MS,
      "getSession",
    );

    if (!session) {
      console.log("[root] AUTH result: no session");
      return "/welcome";
    }

    console.log("[root] AUTH result: session for", session.user.id);

    const { data, error } = await withTimeout<{
      data: { id: string }[] | null;
      error: { message: string } | null;
    }>(
      supabase
        .from("auras")
        .select("id")
        .eq("user_id", session.user.id)
        .limit(1) as unknown as Promise<{
          data: { id: string }[] | null;
          error: { message: string } | null;
        }>,
      AUTH_TIMEOUT_MS,
      "auras query",
    );

    if (error) {
      console.warn("[root] auras query error, defaulting to /aura/generate", error);
      return "/aura/generate";
    }

    if (data && data.length > 0) {
      console.log("[root] AUTH result: has aura");
      return "/home";
    }
    console.log("[root] AUTH result: no aura");
    return "/aura/generate";
  } catch (err) {
    console.warn("[root] auth resolution failed, defaulting to /welcome", err);
    return "/welcome";
  }
}

export default function RootPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState<boolean | null>(null);
  const [splashDone, setSplashDone] = useState(false);
  const targetRef = useRef<string | null>(null);
  const redirectedRef = useRef(false);

  useEffect(() => {
    console.log("[root] SPLASH mounted");
    const alreadyShown =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(SPLASH_FLAG) === "1";
    setShowSplash(!alreadyShown);
    if (alreadyShown) setSplashDone(true);

    resolveTarget().then((t) => {
      console.log("[root] target resolved:", t);
      targetRef.current = t;
    });
  }, []);

  useEffect(() => {
    if (!splashDone || redirectedRef.current) return;

    const doRedirect = (target: string) => {
      if (redirectedRef.current) return;
      redirectedRef.current = true;
      try {
        window.sessionStorage.setItem(SPLASH_FLAG, "1");
      } catch {}
      console.log("[root] REDIRECT going to", target);
      router.replace(target);
    };

    if (targetRef.current) {
      doRedirect(targetRef.current);
      return;
    }

    console.log("[root] splash done but no target yet; polling briefly");
    const poll = setInterval(() => {
      if (targetRef.current) {
        clearInterval(poll);
        clearTimeout(fallback);
        doRedirect(targetRef.current);
      }
    }, 100);

    const fallback = setTimeout(() => {
      clearInterval(poll);
      if (!redirectedRef.current) {
        console.warn("[root] target never resolved; defaulting to /welcome");
        doRedirect("/welcome");
      }
    }, 1500);

    return () => {
      clearInterval(poll);
      clearTimeout(fallback);
    };
  }, [splashDone, router]);

  if (showSplash === null) {
    return (
      <div className="min-h-dvh bg-bg flex items-center justify-center">
        <div className="animate-float">
          <div className="w-12 h-12 rounded-full bg-accent/20 animate-pulseGlow" />
        </div>
      </div>
    );
  }

  if (showSplash && !splashDone) {
    return <Splash onComplete={() => setSplashDone(true)} />;
  }

  return (
    <div className="min-h-dvh bg-bg flex items-center justify-center">
      <div className="animate-float">
        <div className="w-12 h-12 rounded-full bg-accent/20 animate-pulseGlow" />
      </div>
    </div>
  );
}
