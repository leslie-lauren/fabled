"use client";

interface MemberPillProps {
  name: string;
  color?: string;
  onClick?: () => void;
  size?: "sm" | "md";
  isLeader?: boolean;
}

export default function MemberPill({
  name,
  color = "#C4956A",
  onClick,
  size = "sm",
  isLeader = false,
}: MemberPillProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full transition-all hover:scale-105 active:scale-95"
      style={{
        background: `${color}14`,
        border: `1px solid ${color}25`,
        padding: size === "sm" ? "4px 10px" : "6px 14px",
      }}
    >
      <span
        className="rounded-full"
        style={{
          width: size === "sm" ? 6 : 8,
          height: size === "sm" ? 6 : 8,
          background: color,
        }}
      />
      {isLeader && <span style={{ fontSize: size === "sm" ? 9 : 11 }}>👑</span>}
      <span
        className="font-medium"
        style={{
          fontSize: size === "sm" ? 11 : 13,
          color: "var(--color-text-secondary)",
        }}
      >
        {name}
      </span>
    </button>
  );
}
