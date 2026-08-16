import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { getCategory } from "../game/content";
import { BackHomeBar, StarCounter } from "../components/kids/BigButton";
import { Mascot } from "../components/kids/Mascot";
import { isLevelUnlocked, useProgress } from "../services/storage";
import { sound } from "../services/sound";

export const Route = createFileRoute("/play/$category/")({
  head: () => ({
    meta: [
      { title: "Pick a level — Kids Pop & Learn" },
      { name: "description", content: "Choose a level and start playing this learning game." },
      { property: "og:title", content: "Pick a level — Kids Pop & Learn" },
      { property: "og:description", content: "Five gentle levels per category, unlocked one by one." },
    ],
  }),
  component: LevelMap,
});

function LevelMap() {
  const { category: categoryId } = useParams({ from: "/play/$category/" });
  const category = getCategory(categoryId);
  const progress = useProgress();

  if (!category) {
    return (
      <main className="page-sky grid place-items-center px-6 text-center">
        <div>
          <Mascot size={120} />
          <p className="mt-4 font-display text-2xl">Oops! Let&apos;s try again 😊</p>
          <Link to="/" className="tap-scale mt-4 inline-block rounded-3xl bg-primary px-6 py-4 font-display text-xl text-primary-foreground">
            Go home
          </Link>
        </div>
      </main>
    );
  }

  const hi = progress.settings.lang === "hi";
  const done = progress.completed[category.id] ?? 0;

  return (
    <main className="page-sky pb-10">
      <div className="mx-auto w-full max-w-3xl">
        <BackHomeBar
          title={`${category.emoji} ${hi ? category.titleHi : category.title}`}
          right={<StarCounter stars={progress.stars} />}
        />

        <section
          className="tile-sheen mx-4 mt-3 rounded-[2rem] px-5 py-4"
          style={{
            background: `linear-gradient(150deg, ${category.tone}, color-mix(in oklab, ${category.tone} 62%, black))`,
          }}
        >
          <p className="font-display text-xl text-card">
            {hi ? category.subtitleHi : category.subtitle}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-card/30">
              <span
                className="block h-full rounded-full bg-card"
                style={{ width: `${(done / category.levels.length) * 100}%` }}
              />
            </span>
            <span className="font-display text-sm text-card">
              {done}/{category.levels.length}
            </span>
          </div>
        </section>

        <div className="mt-4 space-y-6 px-4">
          {[
            { tier: "warmup", title: "🌟 Warm up", titleHi: "🌟 आसान शुरुआत", range: [0, 4] },
            { tier: "explorer", title: "🚀 Explorer", titleHi: "🚀 खोजकर्ता", range: [5, 9] },
            { tier: "champion", title: "⚡ Champion", titleHi: "⚡ चैम्पियन", range: [10, 14] },
            { tier: "master", title: "👑 Master", titleHi: "👑 मास्टर", range: [15, 19] },
            { tier: "challenge", title: "🏆 Challenge Mode", titleHi: "🏆 चैलेंज मोड", range: [20, 24] },
          ].map((group) => {
            const groupLevels = category.levels.slice(group.range[0], group.range[1] + 1);
            const groupDone = groupLevels.filter((lvl) => lvl.index < done).length;
            return (
              <div key={group.tier} className="rounded-3xl bg-card/60 p-3 shadow-[0_4px_0_0_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-between px-2 pb-2">
                  <h3 className="font-display text-base text-secondary-foreground">
                    {hi ? group.titleHi : group.title}
                  </h3>
                  <span className="font-display text-xs text-muted-foreground">
                    {groupDone}/{groupLevels.length} ⭐
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
                  {groupLevels.map((level) => {
                    const unlocked = isLevelUnlocked(category.id, level.index, progress);
                    const cleared = level.index < done;
                    if (!unlocked) {
                      return (
                        <div
                          key={level.index}
                          className="glass-card flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl opacity-50"
                        >
                          <span className="text-xl" aria-hidden="true">
                            🔒
                          </span>
                          <span className="font-display text-xs text-muted-foreground">
                            {hi ? "स्तर" : "Level"} {level.index + 1}
                          </span>
                        </div>
                      );
                    }
                    return (
                      <Link
                        key={level.index}
                        to="/play/$category/$level"
                        params={{ category: category.id, level: String(level.index + 1) }}
                        onClick={() => sound.tap()}
                        className="tap-scale animate-bounce-in glass-card flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl p-2 text-center shadow-[0_4px_0_0_rgba(0,0,0,0.08)]"
                      >
                        <span
                          className="grid h-9 w-9 place-items-center rounded-xl font-display text-base text-card"
                          style={{ backgroundColor: category.tone }}
                        >
                          {level.index + 1}
                        </span>
                        <span className="block w-full truncate font-display text-xs text-secondary-foreground">
                          {level.label}
                        </span>
                        <span className="text-[0.65rem] font-bold text-grass">
                          {cleared ? "⭐⭐⭐" : hi ? "खेलो" : "Play"}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

