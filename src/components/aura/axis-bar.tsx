"use client";

interface AxisBarProps {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number; // 1-5
  color: string;
}

export default function AxisBar({ label, leftLabel, rightLabel, value, color }: AxisBarProps) {
  const pct = ((value - 1) / 4) * 100;

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1.5">
        <span
          className="text-xs font-light"
          style={{ color: value <= 2 ? color : "var(--color-muted-2)" }}
        >
          {leftLabel}
        </span>
        <span className="label-mono text-[9px]">{label}</span>
        <span
          className="text-xs font-light"
          style={{ color: value >= 4 ? color : "var(--color-muted-2)" }}
        >
          {rightLabel}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-white/[0.04]">
        {/* Fill */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}33, ${color}88)`,
          }}
        />
        {/* Dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-[11px] h-[11px] rounded-full transition-all duration-700"
          style={{
            left: `${pct}%`,
            transform: `translateX(-50%) translateY(-50%)`,
            background: color,
            boxShadow: `0 0 8px ${color}88, 0 0 16px ${color}44`,
          }}
        />
      </div>
    </div>
  );
}
