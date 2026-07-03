// Lightweight haptic feedback. No-ops on devices without the Vibration API
// (most desktops and iOS Safari), so callers can fire it unconditionally.
type HapticKind = "light" | "medium" | "success" | "celebrate";

const PATTERNS: Record<HapticKind, number | number[]> = {
  light: 10,
  medium: 20,
  success: [12, 40, 12],
  celebrate: [15, 30, 15, 30, 40],
};

export function haptic(kind: HapticKind = "light") {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(PATTERNS[kind]);
  } catch {
    // Vibration not permitted; ignore.
  }
}
