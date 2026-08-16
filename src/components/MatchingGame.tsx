import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildMatchingDeck } from "../game/content";
import type { CategoryDef } from "../game/types";
import { BackHomeBar, StarCounter } from "./kids/BigButton";
import { Confetti, StarPop } from "./kids/Confetti";
import { AchievementToast } from "./kids/AchievementToast";
import { Mascot } from "./kids/Mascot";
import { sound } from "../services/sound";
import { awardCorrect } from "../services/rewards";
import type { Achievement } from "../services/achievements";
import { useProgress } from "../services/storage";

export function MatchingGame({
  category,
  levelIndex,
  roundKey,
  onFinish,
  onExit,
}: {
  category: CategoryDef;
  levelIndex: number;
  roundKey: number;
  onFinish: (stars: number) => void;
  onExit?: () => void;
}) {
  const progress = useProgress();
  const level = category.levels[Math.min(levelIndex, category.levels.length - 1)]!;
  const deck = useMemo(
    () => buildMatchingDeck(level.objects),
    [level.objects, roundKey],
  );

  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [confettiKey, setConfettiKey] = useState(0);
  const [starKey, setStarKey] = useState(0);
  const [earned, setEarned] = useState(0);
  const [badges, setBadges] = useState<Achievement[]>([]);
  const busy = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      sound.stopSpeech();
    },
    [],
  );

  useEffect(() => {
    setFlipped([]);
    setMatched([]);
    setEarned(0);
  }, [deck]);

  const flip = (i: number) => {
    if (busy.current || flipped.includes(i) || matched.includes(i)) return;
    sound.tap();
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length < 2) return;

    const [a, b] = next as [number, number];
    busy.current = true;
    if (deck[a] === deck[b]) {
      sound.correct();
      setConfettiKey((k) => k + 1);
      setStarKey((k) => k + 1);
      const newBadges = awardCorrect(category.id);
      if (newBadges.length) setBadges(newBadges);
      const totalMatched = matched.length + 2;
      setEarned((e) => e + 1);
      later(() => {
        setMatched((m) => [...m, a, b]);
        setFlipped([]);
        busy.current = false;
        if (totalMatched >= deck.length) later(() => onFinish(earned + 1), 400);
      }, 600);
    } else {
      sound.wrong();
      later(() => {
        setFlipped([]);
        busy.current = false;
      }, 800);
    }
  };

  const cols = deck.length <= 4 ? "grid-cols-2" : deck.length <= 8 ? "grid-cols-3" : "grid-cols-4";

  return (
    <main className="page-sky pb-10">
      <Confetti burstKey={confettiKey} />
      <StarPop burstKey={starKey} />
      <AchievementToast achievements={badges} />

      <div className="mx-auto w-full max-w-2xl">
        <BackHomeBar
          title={`${category.emoji} ${category.title}`}
          right={<StarCounter stars={progress.stars} />}
          onBack={onExit}
        />

        <div className="mx-4 mt-3 flex items-center gap-3 rounded-3xl bg-card px-4 py-3 shadow-[0_8px_0_0_rgba(0,0,0,0.12)]">
          <Mascot size={56} float={false} />
          <div className="min-w-0 flex-1 flex flex-col gap-0.5 font-display text-secondary-foreground">
            {progress.settings.lang !== "hi" && (
              <div className="text-xl font-bold">Find the matching pairs!</div>
            )}
            {progress.settings.lang !== "en" && (
              <div className={progress.settings.lang === "both" ? "text-sm text-muted-foreground font-medium" : "text-xl font-bold"}>
                समान जोड़ी ढूँढो!
              </div>
            )}
          </div>
        </div>

        <div className={`mt-4 grid ${cols} gap-2.5 px-4 sm:gap-3`}>
          {deck.map((emoji, i) => {
            const open = flipped.includes(i) || matched.includes(i);
            return (
              <button
                key={`${roundKey}-${i}`}
                type="button"
                onClick={() => flip(i)}
                aria-label={open ? emoji : "Hidden card"}
                className={`tap-scale grid aspect-square place-items-center rounded-3xl shadow-[0_8px_0_0_rgba(0,0,0,0.12)] transition-colors duration-200 ${
                  open ? "bg-card" : "bg-fun-2"
                } ${matched.includes(i) ? "animate-pop ring-4 ring-grass" : ""}`}
              >
                <span className="text-4xl leading-none sm:text-5xl" aria-hidden="true">
                  {open ? emoji : "❓"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
