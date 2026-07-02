"use client";

const AXES_INFO = [
  {
    key: "heartVsHead",
    left: "Heart",
    right: "Head",
    desc: "Are you reading to feel or to think? Heart readers want to be emotionally wrecked. Head readers want to be intellectually rewired.",
  },
  {
    key: "plotVsProse",
    left: "Plot",
    right: "Prose",
    desc: "Are you here for what happens or how it's written? Plot readers need momentum. Prose readers will reread a single paragraph for the rhythm.",
  },
  {
    key: "familiarVsFrontier",
    left: "Familiar",
    right: "Frontier",
    desc: "Do you go deeper or wider? Familiar readers love their corner of the bookstore. Frontier readers would rather be confused by something new.",
  },
  {
    key: "lightVsDark",
    left: "Light",
    right: "Dark",
    desc: "Do you reach for warmth or weight? Light readers use books as refuge. Dark readers use books as confrontation.",
  },
  {
    key: "realVsImagined",
    left: "Real",
    right: "Imagined",
    desc: "This world or an invented one? Real readers stay close to what happened. Imagined readers want to leave this world entirely.",
  },
];

interface AxesInfoModalProps {
  onClose: () => void;
}

export default function AxesInfoModal({ onClose }: AxesInfoModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5 animate-fadeIn"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="bg-bg-card border border-muted-5/30 rounded-2xl p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto animate-popIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display text-lg font-semibold">
            Reading Dimensions
          </h3>
          <button
            onClick={onClose}
            className="text-muted-2 hover:text-text transition-colors text-xl"
          >
            &times;
          </button>
        </div>

        <div className="space-y-5">
          {AXES_INFO.map((axis) => (
            <div key={axis.key}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-accent text-sm font-medium">
                  {axis.left}
                </span>
                <span className="text-muted-3 text-xs">vs</span>
                <span className="text-accent text-sm font-medium">
                  {axis.right}
                </span>
              </div>
              <p className="text-muted-1 text-xs leading-relaxed">
                {axis.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
