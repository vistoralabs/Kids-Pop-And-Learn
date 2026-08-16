import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Mascot } from "./Mascot";
import { Confetti } from "./Confetti";
import { sound } from "../../services/sound";
import type { CategoryDef } from "../../game/types";
import { useProgress } from "../../services/storage";

export function ResultScreen({
  category,
  levelIndex,
  starsEarned,
  onPlayAgain,
  onNextLevel,
}: {
  category: CategoryDef;
  levelIndex: number;
  starsEarned: number;
  onPlayAgain: () => void;
  onNextLevel?: () => void;
}) {
  const progress = useProgress();
  const hi = progress.settings.lang === "hi";

  const nextLevel = levelIndex + 1;
  const hasNext = nextLevel < category.levels.length;

  useEffect(() => {
    if (!hasNext) {
      sound.achievement();
      sound.sayBilingual(
        `Amazing! You completed all ${category.levels.length} levels in ${category.title}!`,
        `कमाल है! आपने ${category.titleHi} के सभी स्तर पूरे कर लिए!`,
      );
    } else {
      sound.levelComplete();
      sound.sayBilingual("Level complete! Well done!", "स्तर पूरा! शाबाश!");
    }
  }, [hasNext, category]);

  return (
    <main className="page-sky grid place-items-center px-5 pb-10">
      <Confetti burstKey={1} />
      <div className="animate-bounce-in w-full max-w-md text-center">
        <Mascot size={160} />
        
        <h1 className="mt-2 font-display text-4xl text-secondary-foreground">
          {!hasNext
            ? hi
              ? "🏆 शानदार! चैम्पियन!"
              : "🏆 Grand Champion!"
            : hi
              ? "स्तर पूरा!"
              : "Level complete!"}
        </h1>
        
        <p className="mt-1 font-display text-2xl">
          {hi ? `तुमने ${starsEarned} ⭐ जीते` : `You earned ${starsEarned} ⭐`}
        </p>

        <div className="mt-5 grid gap-3">
          {hasNext ? (
            <Link
              to="/play/$category/$level"
              params={{ category: category.id, level: String(nextLevel + 1) }}
              onClick={() => {
                sound.tap();
                if (onNextLevel) onNextLevel();
              }}
              className="tap-scale flex min-h-16 items-center justify-center rounded-3xl bg-grass px-6 py-4 font-display text-2xl text-card shadow-[0_8px_0_0_rgba(0,0,0,0.15)]"
            >
              ▶️ {hi ? "अगला स्तर" : "Next level"}
            </Link>
          ) : (
            <Link
              to="/"
              onClick={() => sound.tap()}
              className="tap-scale flex min-h-16 items-center justify-center rounded-3xl bg-grass px-6 py-4 font-display text-2xl text-card shadow-[0_8px_0_0_rgba(0,0,0,0.15)]"
            >
              🎉 {hi ? "दूसरा खेल चुनें" : "Choose Next Game"}
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              sound.tap();
              onPlayAgain();
            }}
            className="tap-scale min-h-16 rounded-3xl bg-accent px-6 py-4 font-display text-2xl text-accent-foreground shadow-[0_8px_0_0_rgba(0,0,0,0.15)]"
          >
            🔁 {hi ? "फिर खेलो" : "Play again"}
          </button>

          <Link
            to="/play/$category"
            params={{ category: category.id }}
            onClick={() => sound.tap()}
            className="tap-scale flex min-h-16 items-center justify-center rounded-3xl bg-card px-6 py-4 font-display text-2xl shadow-[0_8px_0_0_rgba(0,0,0,0.12)]"
          >
            🗺️ {hi ? "सभी स्तर" : "All Levels"}
          </Link>
        </div>
      </div>
    </main>
  );
}
