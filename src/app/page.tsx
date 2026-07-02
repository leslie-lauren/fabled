"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase
          .from("auras")
          .select("id")
          .eq("user_id", session.user.id)
          .limit(1)
          .then(({ data }) => {
            if (data && data.length > 0) {
              router.replace("/home");
            } else {
              router.replace("/aura/generate");
            }
          });
      } else {
        router.replace("/welcome");
      }
    });
  }, [router]);

  return (
    <div className="min-h-dvh bg-bg flex items-center justify-center">
      <div className="animate-float">
        <div className="w-12 h-12 rounded-full bg-accent/20 animate-pulseGlow" />
      </div>
    </div>
  );
}
