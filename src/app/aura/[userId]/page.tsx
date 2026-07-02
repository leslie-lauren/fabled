"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Aura } from "@/lib/types";
import AuraCard from "@/components/aura/aura-card";
import BookRow from "@/components/aura/book-row";

interface PastRead {
  title: string;
  author: string;
  tribeName: string;
}

export default function MemberAuraPage() {
  const router = useRouter();
  const params = useParams();
  const targetUserId = params.userId as string;

  const [aura, setAura] = useState<Aura | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [pastReads, setPastReads] = useState<PastRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/welcome"); return; }
      setIsOwnProfile(session.user.id === targetUserId);

      const { data: userData } = await supabase
        .from("users")
        .select("display_name")
        .eq("id", targetUserId)
        .single();
      if (userData) setDisplayName(userData.display_name);

      const { data: auraData } = await supabase
        .from("auras")
        .select("*")
        .eq("user_id", targetUserId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (auraData) setAura(auraData);

      const { data: memberships } = await supabase
        .from("tribe_members")
        .select("tribe_id")
        .eq("user_id", targetUserId);

      if (memberships && memberships.length > 0) {
        const tribeIds = memberships.map((m) => m.tribe_id);
        const { data: tribes } = await supabase
          .from("tribes")
          .select("id, name, current_book_title, current_book_author, status")
          .in("id", tribeIds)
          .eq("status", "reading");

        const reads: PastRead[] = [];
        if (tribes) {
          for (const t of tribes) {
            if (t.current_book_title) {
              reads.push({
                title: t.current_book_title,
                author: t.current_book_author || "",
                tribeName: t.name,
              });
            }
          }
        }
        setPastReads(reads);
      }

      setLoading(false);
    }
    load();
  }, [targetUserId, router]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="animate-float">
          <div className="w-10 h-10 rounded-full bg-accent/20 animate-pulseGlow" />
        </div>
      </div>
    );
  }

  if (!aura) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6">
        <p className="text-muted-2 text-sm">This user hasn&apos;t generated their aura yet.</p>
        <button
          onClick={() => router.back()}
          className="btn-ghost mt-4 text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  const c1 = aura.color_primary;
  const c2 = aura.color_secondary;

  const booksTheyLove = (aura.books_input || []).map((b: string) => {
    const parts = b.split(" by ");
    return parts.length > 1
      ? { title: parts.slice(0, -1).join(" by "), author: parts[parts.length - 1] }
      : { title: b };
  });

  const tribeReads = pastReads.map((r) => ({
    title: r.title,
    author: r.author,
    tribe: r.tribeName,
  }));

  return (
    <div className="min-h-dvh pb-8">
      <div className="px-5 pt-6">
        <button
          onClick={() => router.back()}
          className="text-muted-2 text-sm mb-4 hover:text-text-secondary transition-colors"
        >
          ← Back
        </button>

        {!isOwnProfile && (
          <p className="text-center text-muted-1 text-sm mb-4">
            {displayName}&apos;s Reading Aura
          </p>
        )}
      </div>

      <div className="max-w-sm mx-auto px-5">
        <AuraCard aura={aura} />

        {/* Bookshelf */}
        <div className="mt-8">
          <p className="label-mono mb-4">
            {isOwnProfile ? "My Bookshelf" : `${displayName}'s Bookshelf`}
          </p>
          <BookRow
            books={booksTheyLove}
            c1={c1}
            c2={c2}
            label={isOwnProfile ? "Books I Love" : "Books They Love"}
          />
          {tribeReads.length > 0 && (
            <BookRow books={tribeReads} c1={c1} c2={c2} label="Tribe Reads" />
          )}
          {tribeReads.length === 0 && (
            <div className="mb-5">
              <p className="text-muted-2 text-xs font-medium mb-2.5">Tribe Reads</p>
              <p className="text-muted-3 text-xs italic">No tribe reads yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
