import type { ShapeName } from "../../game/types";

export function Shape({ name, color, size = 96 }: { name: ShapeName; color: string; size?: number }) {
  const common = { fill: color, stroke: "rgba(0,0,0,0.12)", strokeWidth: 4 };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      {name === "circle" && <circle cx="50" cy="50" r="40" {...common} />}
      {name === "square" && <rect x="12" y="12" width="76" height="76" rx="8" {...common} />}
      {name === "triangle" && <polygon points="50,10 92,88 8,88" {...common} />}
      {name === "rectangle" && <rect x="6" y="26" width="88" height="48" rx="8" {...common} />}
      {name === "star" && (
        <polygon points="50,6 62,38 96,38 68,58 78,92 50,71 22,92 32,58 4,38 38,38" {...common} />
      )}
      {name === "heart" && (
        <path
          d="M50 88C20 66 8 52 8 36 8 22 19 12 32 12c8 0 14 4 18 10 4-6 10-10 18-10 13 0 24 10 24 24 0 16-12 30-42 52z"
          {...common}
        />
      )}
      {name === "oval" && <ellipse cx="50" cy="50" rx="44" ry="28" {...common} />}
      {name === "diamond" && <polygon points="50,6 94,50 50,94 6,50" {...common} />}
    </svg>
  );
}
