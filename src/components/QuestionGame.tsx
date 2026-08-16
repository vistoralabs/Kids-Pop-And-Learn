import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildRound, shuffle } from "../game/content";
import type { CategoryDef, GameOption } from "../game/types";
import { HintDialog } from "./kids/HintDialog";
import { adManager } from "../services/adManager";
import { BackHomeBar, StarCounter } from "./kids/BigButton";
import { ObjectTile } from "./kids/ObjectTile";
import { Confetti, StarPop } from "./kids/Confetti";
import { AchievementToast } from "./kids/AchievementToast";
import { Mascot } from "./kids/Mascot";
import { sound } from "../services/sound";
import { awardCorrect, randomPraise } from "../services/rewards";
import type { Achievement } from "../services/achievements";
import { useProgress } from "../services/storage";

export function QuestionGame({
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
  const lang = progress.settings.lang;
  const questions = useMemo(
    () => buildRound(category.id, levelIndex),
    // roundKey lets "play again" rebuild a fresh randomized round
    [category.id, levelIndex, roundKey],
  );

  const [index, setIndex] = useState(0);
  const [marks, setMarks] = useState<Record<string, "right" | "wrong">>({});
  const [praise, setPraise] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [starKey, setStarKey] = useState(0);
  const [earned, setEarned] = useState(0);
  const [badges, setBadges] = useState<Achievement[]>([]);
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<Record<string, boolean>>({});
  const [highlightedOptions, setHighlightedOptions] = useState<Record<string, boolean>>({});
  const locked = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setDisabledOptions({});
    setHighlightedOptions({});
    setShowHint(false);
  }, [index]);

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

  const question = questions[index];

  useEffect(() => {
    if (question) {
      sound.sayBilingual(question.speak, question.speakHi);
    }
    return () => {
      sound.stopSpeech();
    };
  }, [question]);

  if (!question) {
    return (
      <main className="page-sky grid place-items-center px-6 text-center">
        <div>
          <Mascot size={120} />
          <p className="mt-4 font-display text-2xl">Oops! Let&apos;s try again 😊</p>
        </div>
      </main>
    );
  }

  const handleWatchRewarded = async () => {
    setShowHintDialog(false);
    // Play rewarded ad
    const rewardEarned = await adManager.showRewarded();
    // Auto-reward in web preview for easy testing
    const success = rewardEarned || !adManager.enabled;

    if (success) {
      const hintTypes = ["removeOptions", "highlightCorrect", "showVisualClue", "voiceHint"];
      const chosenType = hintTypes[Math.floor(Math.random() * hintTypes.length)];
      const correctOption = question.options.find(o => o.correct);

      if (chosenType === "removeOptions") {
        const incorrects = question.options.filter(o => !o.correct);
        const toDisable = shuffle(incorrects).slice(0, 2);
        const nextDisabled: Record<string, boolean> = {};
        toDisable.forEach(o => {
          nextDisabled[o.key] = true;
        });
        setDisabledOptions(nextDisabled);
      } else if (chosenType === "highlightCorrect") {
        if (correctOption) {
          setHighlightedOptions({ [correctOption.key]: true });
          later(() => {
            setHighlightedOptions({});
          }, 3000);
        }
      } else if (chosenType === "showVisualClue") {
        setShowHint(true);
      } else if (chosenType === "voiceHint") {
        sound.sayBilingual(question.hint, question.hintHi);
      }
    }
  };

  const pick = (option: GameOption) => {
    if (locked.current || disabledOptions[option.key]) return;
    if (option.correct) {
      locked.current = true;
      sound.correct();
      setMarks({ [option.key]: "right" });
      setPraise(randomPraise(lang === "hi" ? "hi" : "en"));
      setConfettiKey((k) => k + 1);
      setStarKey((k) => k + 1);
      setEarned((e) => e + 1);
      const newBadges = awardCorrect(category.id);
      if (newBadges.length) setBadges(newBadges);
      later(() => {
        locked.current = false;
        setMarks({});
        setPraise("");
        setShowHint(false);
        if (index + 1 >= questions.length) onFinish(earned + 1);
        else setIndex((i) => i + 1);
      }, 1400);
    } else {
      sound.wrong();
      setMarks({ [option.key]: "wrong" });
      setShowHint(true);
      later(() => setMarks({}), 500);
    }
  };

  const cols = question.options.length <= 4 ? "grid-cols-2" : "grid-cols-3";

  return (
    <main className="page-sky pb-10">
      <Confetti burstKey={confettiKey} />
      <StarPop burstKey={starKey} />
      <AchievementToast achievements={badges} />

      <div className="mx-auto w-full max-w-2xl">
        <BackHomeBar
          title={`${category.emoji} ${lang === "hi" ? category.titleHi : category.title}`}
          right={<StarCounter stars={progress.stars} />}
          onBack={onExit}
        />

        <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
          {questions.map((q, i) => (
            <span
              key={q.id}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-8 bg-grass" : i < index ? "w-6 bg-grass/80" : "w-4 bg-card/70"
              }`}
            />
          ))}
        </div>

        <div className="glass-card mx-4 mt-3 flex items-center gap-3 px-4 py-4">
          <Mascot size={64} float={false} />
          <p className="min-w-0 flex-1 font-display text-2xl leading-snug text-secondary-foreground">
            {lang !== "hi" && <span className="block">{question.prompt}</span>}
            {lang !== "en" && (
              <span className={`block ${lang === "both" ? "text-xl text-muted-foreground" : ""}`}>
                {question.promptHi}
              </span>
            )}
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                sound.tap();
                setShowHintDialog(true);
              }}
              aria-label="Get a hint"
              className="tap-scale grid h-14 w-14 place-items-center rounded-2xl bg-accent text-2xl shadow-[0_6px_0_0_rgba(0,0,0,0.10)]"
            >
              💡
            </button>
            <button
              type="button"
              onClick={() => sound.sayBilingual(question.speak, question.speakHi)}
              aria-label="Hear the question"
              className="tap-scale grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-2xl shadow-[0_6px_0_0_rgba(0,0,0,0.10)]"
            >
              🔊
            </button>
          </div>
        </div>

        {praise ? (
          <p className="animate-pop mt-3 text-center font-display text-3xl text-grass">{praise}</p>
        ) : showHint ? (
          <p className="animate-pop mt-3 px-4 text-center font-display text-lg text-muted-foreground">
            💡 {lang === "hi" ? question.hintHi : lang === "en" ? question.hint : `${question.hint} • ${question.hintHi}`}
          </p>
        ) : (
          <p className="mt-3 h-8" />
        )}

        <div className={`mt-1 grid ${cols} gap-3 px-4`}>
          {question.options.map((option, i) => (
            <ObjectTile
              key={`${question.id}-${option.key}`}
              option={option}
              index={i}
              state={marks[option.key] ?? "idle"}
              disabled={disabledOptions[option.key]}
              highlighted={highlightedOptions[option.key]}
              onPick={() => pick(option)}
            />
          ))}
        </div>
      </div>

      <HintDialog
        open={showHintDialog}
        lang={lang === "hi" ? "hi" : "en"}
        onWatch={handleWatchRewarded}
        onClose={() => setShowHintDialog(false)}
      />
    </main>
  );
}
