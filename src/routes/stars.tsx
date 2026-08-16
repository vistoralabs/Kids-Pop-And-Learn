import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES } from "../game/content";
import { BackHomeBar } from "../components/kids/BigButton";
import { Mascot } from "../components/kids/Mascot";
import { completedLevels, totalLevels, useProgress } from "../services/storage";

export const Route = createFileRoute("/stars")({
  head: () => ({
    meta: [
      { title: "My Stars — Kids Pop & Learn" },
      { name: "description", content: "See how many stars you collected and your progress in every game." },
      { property: "og:title", content: "My Stars — Kids Pop & Learn" },
      { property: "og:description", content: "Stars and per-game progress for your little learner." },
    ],
  }),
  component: StarsPage,
});

function StarsPage() {
  const progress = useProgress();

  return (
    <main className="page-sky pb-10">
      <div className="mx-auto w-full max-w-2xl">
        <BackHomeBar title="⭐ My Stars" />

        <div className="mx-4 mt-4 flex items-center gap-4 rounded-3xl bg-card px-5 py-5 shadow-[0_10px_0_0_rgba(0,0,0,0.12)]">
          <Mascot size={92} />
          <div className="min-w-0">
            <p className="font-display text-5xl leading-none text-secondary-foreground">
              {progress.stars}
            </p>
            <p className="font-display text-lg text-muted-foreground">stars collected</p>
            <p className="mt-1 text-sm font-bold text-muted-foreground">
              {completedLevels(progress)} of {totalLevels()} levels done
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 px-4">
          {CATEGORIES.map((category) => {
            const done = progress.completed[category.id] ?? 0;
            const pct = Math.round((done / category.levels.length) * 100);
            return (
              <div key={category.id} className="rounded-3xl bg-card px-4 py-3 shadow-[0_6px_0_0_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-3">
                  <span className="text-3xl" aria-hidden="true">
                    {category.emoji}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-display text-lg">{category.title}</span>
                  <span className="shrink-0 font-display text-sm text-muted-foreground">
                    {done}/{category.levels.length}
                  </span>
                </div>
                <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{ width: `${pct}%`, backgroundColor: category.tone }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
