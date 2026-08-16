import { useEffect, useState } from "react";

const PIECE_COLORS = ["#ef4444", "#3b82f6", "#facc15", "#22c55e", "#a855f7", "#f97316", "#ec4899"];

/** Lightweight confetti burst: a handful of CSS-animated squares, removed when done. */
export function Confetti({ burstKey }: { burstKey: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (burstKey === 0) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1100);
    return () => clearTimeout(t);
  }, [burstKey]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 22 }).map((_, i) => {
        const dx = (Math.random() - 0.5) * 320;
        const dy = 180 + Math.random() * 320;
        return (
          <span
            key={`${burstKey}-${i}`}
            className="absolute left-1/2 top-1/3 h-3 w-3 rounded-[3px]"
            style={{
              backgroundColor: PIECE_COLORS[i % PIECE_COLORS.length],
              ["--dx" as string]: `${dx}px`,
              ["--dy" as string]: `${dy}px`,
              animation: `kid-confetti ${800 + Math.random() * 400}ms ease-out forwards`,
              animationDelay: `${Math.random() * 120}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

/** A single star that floats up — used for "+1 star" feedback. */
export function StarPop({ burstKey }: { burstKey: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (burstKey === 0) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(t);
  }, [burstKey]);
  if (!visible) return null;
  return (
    <div
      className="pointer-events-none fixed left-1/2 top-1/2 z-50 -translate-x-1/2 text-6xl"
      style={{ animation: "kid-star-up 900ms ease-out forwards" }}
      aria-hidden="true"
    >
      ⭐
    </div>
  );
}
