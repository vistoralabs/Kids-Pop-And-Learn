import { createFileRoute } from "@tanstack/react-router";
import { BackHomeBar } from "../components/kids/BigButton";
import { ACHIEVEMENTS } from "../services/achievements";
import { useProgress } from "../services/storage";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Badges — Kids Pop & Learn" },
      { name: "description", content: "Collect friendly badges for finishing levels and earning stars." },
      { property: "og:title", content: "Badges — Kids Pop & Learn" },
      { property: "og:description", content: "Seven cheerful achievements to unlock while learning." },
    ],
  }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const progress = useProgress();

  return (
    <main className="page-sky pb-10">
      <div className="mx-auto w-full max-w-2xl">
        <BackHomeBar title="🏆 Badges" />
        <div className="mt-4 grid grid-cols-2 gap-3 px-4 sm:grid-cols-3">
          {ACHIEVEMENTS.map((achievement, i) => {
            const earned = achievement.earned(progress);
            return (
              <div
                key={achievement.id}
                className={`animate-bounce-in flex min-h-36 flex-col items-center justify-center gap-1 rounded-3xl px-3 py-4 text-center shadow-[0_8px_0_0_rgba(0,0,0,0.12)] ${
                  earned ? "bg-card" : "bg-muted opacity-70"
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="text-5xl leading-none" aria-hidden="true">
                  {earned ? achievement.emoji : "🔒"}
                </span>
                <span className="font-display text-base">{achievement.title}</span>
                <span className="text-xs font-bold text-muted-foreground">
                  {achievement.description}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
