"use client";

import { useRef, useState } from "react";
import type { DeckBook } from "@/lib/types";

interface SwipeCardProps {
  book: DeckBook;
  index: number;
  total: number;
  onSwipe: (liked: boolean) => void;
  isActive: boolean;
}

export default function SwipeCard({ book, index, total, onSwipe, isActive }: SwipeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exiting, setExiting] = useState<"left" | "right" | null>(null);
  const startX = useRef(0);

  function handleStart(clientX: number) {
    if (!isActive) return;
    startX.current = clientX;
    setDragging(true);
  }

  function handleMove(clientX: number) {
    if (!dragging) return;
    setDragX(clientX - startX.current);
  }

  function handleEnd() {
    if (!dragging) return;
    setDragging(false);

    if (Math.abs(dragX) > 80) {
      const liked = dragX > 0;
      setExiting(liked ? "right" : "left");
      setTimeout(() => onSwipe(liked), 300);
    } else {
      setDragX(0);
    }
  }

  const rotation = dragX * 0.05;
  const yesOpacity = Math.min(Math.max(dragX / 80, 0), 1);
  const nahOpacity = Math.min(Math.max(-dragX / 80, 0), 1);

  return (
    <div
      ref={cardRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none select-none"
      style={{
        transform: exiting
          ? undefined
          : `translateX(${dragX}px) rotate(${rotation}deg)`,
        transition: dragging ? "none" : "transform 0.3s ease",
        animation: exiting === "left"
          ? "slideOutLeft 0.3s ease-out forwards"
          : exiting === "right"
            ? "slideOutRight 0.3s ease-out forwards"
            : undefined,
        zIndex: isActive ? 10 : 1,
        opacity: isActive ? 1 : 0.5,
        scale: isActive ? "1" : "0.95",
      }}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={() => { if (dragging) handleEnd(); }}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      <div
        className="card h-full flex flex-col justify-between relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #1e1d1c, #141312 50%, #1a1918)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* YES label */}
        <div
          className="absolute top-6 left-6 px-4 py-2 rounded-xl border-2 border-success text-success font-bold text-xl -rotate-12 z-20"
          style={{ opacity: yesOpacity }}
        >
          YES
        </div>

        {/* NAH label */}
        <div
          className="absolute top-6 right-6 px-4 py-2 rounded-xl border-2 border-error text-error font-bold text-xl rotate-12 z-20"
          style={{ opacity: nahOpacity }}
        >
          NAH
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center px-2 pt-12">
          {/* Genre tag */}
          <div className="mb-4">
            <span className="label-mono text-accent text-[9px]">
              {book.genre}
            </span>
          </div>

          {/* Vibe description */}
          <p className="text-text font-light text-base leading-relaxed italic mb-6">
            &ldquo;{book.vibe}&rdquo;
          </p>

          {/* Mood tags */}
          <div className="flex flex-wrap gap-2">
            {book.moodTags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full text-xs text-muted-1 border border-muted-5/50 bg-muted-6/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Card number */}
        <div className="text-center pb-2">
          <span className="label-mono text-muted-3 text-[9px]">
            {index + 1} / {total}
          </span>
        </div>
      </div>
    </div>
  );
}
