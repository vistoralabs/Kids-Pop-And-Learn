import { useEffect, useState } from "react";
import type { Achievement } from "../../services/achievements";
import { sound } from "../../services/sound";

export function AchievementToast({ achievements }: { achievements: Achievement[] }) {
  const [shown, setShown] = useState<Achievement | null>(null);

  useEffect(() => {
    if (achievements.length === 0) return;
    setShown(achievements[0]!);
    sound.achievement();
    const t = setTimeout(() => setShown(null), 2600);
    return () => clearTimeout(t);
  }, [achievements]);

  if (!shown) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4">
      <div className="animate-bounce-in flex max-w-sm items-center gap-3 rounded-3xl bg-card px-5 py-3 shadow-[0_10px_0_0_rgba(0,0,0,0.12)]">
        <span className="text-4xl" aria-hidden="true">
          {shown.emoji}
        </span>
        <span className="min-w-0">
          <span className="block font-display text-lg">New badge!</span>
          <span className="block truncate text-sm font-bold text-muted-foreground">{shown.title}</span>
        </span>
      </div>
    </div>
  );
}
