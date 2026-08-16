import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CATEGORIES } from "../game/content";
import { Mascot } from "../components/kids/Mascot";
import { completedLevels, totalLevels, useProgress, type Lang } from "../services/storage";
import { claimDailyReward, dailyRewardAvailable, setLang } from "../services/rewards";
import { sound, warmUpVoices } from "../services/sound";
import { CustomPopup } from "../components/kids/CustomPopup";
import { RatingPopup } from "../components/kids/RatingPopup";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kids Pop & Learn — Fun Tap & Learn Game for Toddlers" },
      {
        name: "description",
        content:
          "A colorful tap-and-learn game for young children in Hindi and English: colors, ABC, numbers, animals, birds, body parts, shapes, fruits, vehicles and matching.",
      },
      { property: "og:title", content: "Kids Pop & Learn — Play • Learn • Smile" },
      {
        property: "og:description",
        content:
          "Ten playful learning games for little kids in Hindi and English, with stars, streaks and badges.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const LANGS: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिंदी" },
];

function Home() {
  const progress = useProgress();
  const [gift, setGift] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const lang = progress.settings.lang;
  const hi = lang === "hi";
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const [showRatePopup, setShowRatePopup] = useState(false);
  
  const [config, setConfig] = useState({ rewardPopupDelay: 12000, ratingPopupDelay: 30000 });
  const [popupTexts, setPopupTexts] = useState<any>(null);

  useEffect(() => {
    // Fetch remote config for popup timings
    fetch("https://kids.vistora.workers.dev/api/config.json")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.rewardPopupDelay === "number" && typeof data.ratingPopupDelay === "number") {
          setConfig(data);
        }
      })
      .catch(() => { /* fallback to default */ });

    // Fetch remote custom reward popup content
    fetch("https://kids.vistora.workers.dev/api/popup.json")
      .then((r) => r.json())
      .then((data) => {
        if (data) setPopupTexts(data);
      })
      .catch(() => { /* fallback to default */ });
  }, []);

  useEffect(() => {
    // Custom popup appears dynamically based on cloud config (default 12 seconds)
    const promoTimer = setTimeout(() => {
      const shown = sessionStorage.getItem("custom_popup_shown");
      if (!shown) {
        setShowPromoPopup(true);
        sessionStorage.setItem("custom_popup_shown", "true");
      }
    }, config.rewardPopupDelay);

    // Rating popup appears dynamically based on cloud config (default 30 seconds)
    const rateTimer = setTimeout(() => {
      const shown = sessionStorage.getItem("rating_popup_shown");
      if (!shown) {
        setShowRatePopup(true);
        sessionStorage.setItem("rating_popup_shown", "true");
      }
    }, config.ratingPopupDelay);

    return () => {
      clearTimeout(promoTimer);
      clearTimeout(rateTimer);
    };
  }, [config.rewardPopupDelay, config.ratingPopupDelay]);

  useEffect(() => {
    setCanClaim(dailyRewardAvailable());
    sound.syncMusic();
    warmUpVoices();
  }, [progress.lastDailyReward, progress.settings.music, progress.settings.sound]);

  const doneLevels = completedLevels(progress);
  const allLevels = totalLevels();
  const pct = Math.round((doneLevels / allLevels) * 100);

  return (
    <main className="page-sky pb-8">
      <div className="mx-auto w-full max-w-3xl px-4">
        {/* Hero */}
        <section className="hero-gradient animate-shimmer relative mt-2 overflow-hidden rounded-[2.5rem] px-5 py-5">
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="font-display text-xs tracking-[0.2em] text-card/80 uppercase">
                {hi ? "खेलो • सीखो • मुस्कुराओ" : "Play • Learn • Smile"}
              </p>
              <h1 className="mt-1 font-display text-4xl leading-tight text-card sm:text-5xl">
                Kids Pop &amp; Learn
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-card/25 px-3 py-1.5 font-display text-sm text-card">
                  ⭐ {progress.stars}
                </span>
                <span className="rounded-full bg-card/25 px-3 py-1.5 font-display text-sm text-card">
                  🔥 {progress.streak} {hi ? "दिन" : "day"}
                </span>
                <span className="rounded-full bg-card/25 px-3 py-1.5 font-display text-sm text-card">
                  🎯 {doneLevels}/{allLevels}
                </span>
              </div>
            </div>
            <Mascot size={116} priority />
          </div>

          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-card/30">
            <div
              className="h-full rounded-full bg-card transition-[width] duration-500"
              style={{ width: `${Math.max(pct, 3)}%` }}
            />
          </div>
        </section>

        {/* Language switch */}
        <div className="glass-card mt-3 flex items-center gap-2 p-2" role="group" aria-label="Language">
          <span className="pl-2 font-display text-sm text-muted-foreground">
            {hi ? "भाषा" : "Language"}
          </span>
          <div className="ml-auto flex gap-1.5">
            {LANGS.map((option) => {
              const active = lang === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setLang(option.value);
                    sound.tap();
                  }}
                  className={`tap-scale min-h-11 rounded-2xl px-4 font-display text-sm transition-colors ${
                    active
                      ? "bg-secondary-foreground text-card"
                      : "bg-muted text-secondary-foreground"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {canClaim && (
          <button
            type="button"
            onClick={() => {
              const bonus = claimDailyReward();
              if (bonus) {
                sound.reward();
                setGift(bonus);
                setCanClaim(false);
              }
            }}
            className="tap-scale animate-bounce-in mt-3 flex w-full items-center justify-center gap-2 rounded-3xl bg-accent px-4 py-4 font-display text-xl text-accent-foreground shadow-[0_8px_0_0_rgba(0,0,0,0.12)]"
          >
            🎁 {hi ? "आज का तोहफ़ा" : "Today's gift"}
          </button>
        )}
        {gift > 0 && (
          <p className="animate-pop mt-2 text-center font-display text-xl text-secondary-foreground">
            +{gift} ⭐ {hi ? "वाह!" : "Yay!"}
          </p>
        )}

        {/* Categories */}
        <h2 className="mt-5 px-1 font-display text-xl text-secondary-foreground">
          {hi ? "क्या सीखना है?" : "What shall we learn?"}
        </h2>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {CATEGORIES.map((category, i) => {
            const done = progress.completed[category.id] ?? 0;
            const total = category.levels.length;
            return (
              <Link
                key={category.id}
                to="/play/$category"
                params={{ category: category.id }}
                onClick={() => sound.tap()}
                className="tap-scale tile-sheen animate-bounce-in flex min-h-36 flex-col justify-between rounded-[1.75rem] p-4 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.45)]"
                style={{
                  background: `linear-gradient(150deg, ${category.tone}, color-mix(in oklab, ${category.tone} 62%, black))`,
                  animationDelay: `${i * 55}ms`,
                }}
              >
                <span className="text-4xl leading-none" aria-hidden="true">
                  {category.emoji}
                </span>
                <span className="mt-2 block">
                  <span className="block font-display text-lg text-card">
                    {hi ? category.titleHi : category.title}
                  </span>
                  <span className="block truncate text-[0.7rem] font-bold text-card/85">
                    {hi ? category.subtitleHi : category.subtitle}
                  </span>
                </span>
                <span className="mt-2 flex items-center gap-2">
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-card/30">
                    <span
                      className="block h-full rounded-full bg-card"
                      style={{ width: `${(done / total) * 100}%` }}
                    />
                  </span>
                  <span className="font-display text-[0.7rem] text-card/90">
                    {done}/{total}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        <nav className="mt-5 grid grid-cols-3 gap-3">
          {[
            { to: "/stars" as const, emoji: "⭐", en: "My Stars", hi: "मेरे तारे" },
            { to: "/achievements" as const, emoji: "🏆", en: "Badges", hi: "बैज" },
            { to: "/parents" as const, emoji: "⚙️", en: "Parents", hi: "माता-पिता" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => sound.tap()}
              className="tap-scale glass-card flex min-h-20 flex-col items-center justify-center gap-1 font-display text-sm"
            >
              <span className="text-3xl" aria-hidden="true">
                {item.emoji}
              </span>
              {hi ? item.hi : item.en}
            </Link>
          ))}
        </nav>
        <CustomPopup
          open={showPromoPopup}
          lang={lang === "hi" ? "hi" : "en"}
          title={lang === "hi" ? popupTexts?.rewardTitleHi : popupTexts?.rewardTitle}
          desc={lang === "hi" ? popupTexts?.rewardDescHi : popupTexts?.rewardDesc}
          btnText={lang === "hi" ? popupTexts?.buttonTextHi : popupTexts?.buttonText}
          onClose={() => setShowPromoPopup(false)}
        />

        <RatingPopup
          open={showRatePopup}
          lang={lang === "hi" ? "hi" : "en"}
          onClose={() => setShowRatePopup(false)}
          onRateApp={() => {
            window.open("https://play.google.com/store/apps/details?id=com.kidspopandlearn.app", "_blank");
          }}
        />
      </div>
    </main>
  );
}
