import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { BackHomeBar } from "../components/kids/BigButton";
import { Mascot } from "../components/kids/Mascot";
import { ACHIEVEMENTS } from "../services/achievements";
import {
  completedLevels,
  resetProgress,
  totalLevels,
  useProgress,
  type Lang,
} from "../services/storage";
import { setLang, setSetting } from "../services/rewards";
import { ads } from "../services/ads";
import { sound } from "../services/sound";

export const Route = createFileRoute("/parents")({
  head: () => ({
    meta: [
      { title: "Parents — Kids Pop & Learn" },
      { name: "description", content: "Parent area: sound and music settings, progress overview, privacy and about." },
      { property: "og:title", content: "Parents — Kids Pop & Learn" },
      { property: "og:description", content: "Settings and progress, behind a simple hold-to-enter gate." },
    ],
  }),
  component: ParentsPage,
});

const HOLD_MS = 3000;

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिंदी" },
];

function ParentGate({ onOpen }: { onOpen: () => void }) {
  const [held, setHeld] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef(0);

  const stop = () => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
    setHeld(0);
  };

  useEffect(() => stop, []);

  const tick = () => {
    const elapsed = Date.now() - start.current;
    setHeld(Math.min(1, elapsed / HOLD_MS));
    if (elapsed >= HOLD_MS) {
      stop();
      onOpen();
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };

  const begin = () => {
    start.current = Date.now();
    raf.current = requestAnimationFrame(tick);
  };

  return (
    <main className="page-sky grid place-items-center px-6 pb-10 text-center">
      <div className="w-full max-w-md">
        <Mascot size={120} />
        <h1 className="mt-3 font-display text-3xl text-secondary-foreground">Grown-ups only</h1>
        <p className="mt-2 font-display text-base text-muted-foreground">
          Hold the button for 3 seconds to open the parent area.
        </p>
        <button
          type="button"
          onMouseDown={begin}
          onMouseUp={stop}
          onMouseLeave={stop}
          onTouchStart={begin}
          onTouchEnd={stop}
          onTouchCancel={stop}
          onContextMenu={(e) => e.preventDefault()}
          className="tap-scale relative mt-6 min-h-20 w-full overflow-hidden rounded-3xl bg-primary px-6 py-5 font-display text-2xl text-primary-foreground shadow-[0_8px_0_0_rgba(0,0,0,0.15)]"
        >
          <span
            className="absolute inset-y-0 left-0 bg-card/30 transition-none"
            style={{ width: `${held * 100}%` }}
            aria-hidden="true"
          />
          <span className="relative">Hold to enter</span>
        </button>
        <Link to="/" className="mt-5 inline-block font-display text-lg text-muted-foreground">
          ← Back to the game
        </Link>
      </div>
    </main>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex min-h-20 w-full items-center gap-4 rounded-3xl bg-card px-5 py-4 text-left shadow-[0_6px_0_0_rgba(0,0,0,0.1)]"
    >
      <span className="min-w-0 flex-1">
        <span className="block font-display text-lg">{label}</span>
        <span className="block text-sm font-bold text-muted-foreground">{description}</span>
      </span>
      <span
        className={`relative h-9 w-16 shrink-0 rounded-full transition-colors ${
          checked ? "bg-grass" : "bg-muted"
        }`}
      >
        <span
          className="absolute top-1 h-7 w-7 rounded-full bg-card shadow transition-[left]"
          style={{ left: checked ? "2rem" : "0.25rem" }}
        />
      </span>
    </button>
  );
}

function ParentsPage() {
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const progress = useProgress();

  useEffect(() => {
    sound.syncMusic();
  }, [progress.settings.sound, progress.settings.music]);

  if (!open) return <ParentGate onOpen={() => setOpen(true)} />;

  const earnedBadges = ACHIEVEMENTS.filter((a) => a.earned(progress)).length;

  return (
    <main className="page-sky pb-10">
      <div className="mx-auto w-full max-w-2xl">
        <BackHomeBar title="⚙️ Parents" />

        <section className="mt-4 grid gap-3 px-4">
          <h2 className="px-1 font-display text-xl text-secondary-foreground">Language / भाषा</h2>
          <div className="rounded-3xl bg-card px-4 py-4 shadow-[0_6px_0_0_rgba(0,0,0,0.1)]">
            <p className="text-sm font-bold text-muted-foreground">
              Choose the language your child learns in. Questions are spoken with an Indian voice.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {LANG_OPTIONS.map((option) => {
                const active = progress.settings.lang === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setLang(option.value);
                      sound.tap();
                    }}
                    className={`tap-scale min-h-16 rounded-2xl px-2 py-3 font-display text-base ${
                      active ? "bg-grass text-card" : "bg-muted text-secondary-foreground"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <h2 className="mt-3 px-1 font-display text-xl text-secondary-foreground">Sound</h2>
          <Toggle
            label="Sound effects"
            description="Taps, praise and celebration sounds"
            checked={progress.settings.sound}
            onChange={(v) => setSetting("sound", v)}
          />
          <Toggle
            label="Background music"
            description="A soft looping melody while playing"
            checked={progress.settings.music}
            onChange={(v) => setSetting("music", v)}
          />
        </section>

        <section className="mt-6 grid gap-3 px-4">
          <h2 className="px-1 font-display text-xl text-secondary-foreground">Progress</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-3xl bg-card px-3 py-4 text-center shadow-[0_6px_0_0_rgba(0,0,0,0.1)]">
              <p className="font-display text-3xl">{progress.stars}</p>
              <p className="text-xs font-bold text-muted-foreground">Stars</p>
            </div>
            <div className="rounded-3xl bg-card px-3 py-4 text-center shadow-[0_6px_0_0_rgba(0,0,0,0.1)]">
              <p className="font-display text-3xl">
                {completedLevels(progress)}/{totalLevels()}
              </p>
              <p className="text-xs font-bold text-muted-foreground">Levels</p>
            </div>
            <div className="rounded-3xl bg-card px-3 py-4 text-center shadow-[0_6px_0_0_rgba(0,0,0,0.1)]">
              <p className="font-display text-3xl">
                {earnedBadges}/{ACHIEVEMENTS.length}
              </p>
              <p className="text-xs font-bold text-muted-foreground">Badges</p>
            </div>
          </div>
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="min-h-16 rounded-3xl bg-card px-5 py-4 font-display text-lg text-muted-foreground shadow-[0_6px_0_0_rgba(0,0,0,0.1)]"
            >
              Reset all progress
            </button>
          ) : (
            <div className="grid gap-2 rounded-3xl bg-card px-5 py-4 shadow-[0_6px_0_0_rgba(0,0,0,0.1)]">
              <p className="font-display text-base">
                Reset stars, levels and badges? This cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="min-h-14 rounded-2xl bg-muted font-display text-base"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetProgress();
                    setConfirmReset(false);
                  }}
                  className="min-h-14 rounded-2xl bg-destructive font-display text-base text-destructive-foreground"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-3 px-4">
          <h2 className="px-1 font-display text-xl text-secondary-foreground">Ads &amp; premium</h2>
          <div className="rounded-3xl bg-card px-5 py-4 shadow-[0_6px_0_0_rgba(0,0,0,0.1)]">
            <p className="font-display text-lg">
              Ads are currently {ads.enabled ? "enabled" : "off"}
            </p>
            <p className="mt-1 text-sm font-bold text-muted-foreground">
              This build shows no advertising. If ads are enabled in a future Android release they
              will only appear between play sessions, never inside a game, and will follow the Google
              Play Families policy. A one-time ad-free option would live here.
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-3 px-4">
          <h2 className="px-1 font-display text-xl text-secondary-foreground">More</h2>
          <Link
            to="/privacy"
            className="min-h-16 rounded-3xl bg-card px-5 py-4 font-display text-lg shadow-[0_6px_0_0_rgba(0,0,0,0.1)]"
          >
            Privacy policy
          </Link>
          <Link
            to="/about"
            className="min-h-16 rounded-3xl bg-card px-5 py-4 font-display text-lg shadow-[0_6px_0_0_rgba(0,0,0,0.1)]"
          >
            About &amp; contact
          </Link>
        </section>
      </div>
    </main>
  );
}
