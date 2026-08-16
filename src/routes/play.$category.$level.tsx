import { createFileRoute, Link, useParams, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getCategory } from "../game/content";
import { QuestionGame } from "../components/QuestionGame";
import { MatchingGame } from "../components/MatchingGame";
import { ResultScreen } from "../components/kids/ResultScreen";
import { ExitConfirmDialog } from "../components/kids/ExitConfirmDialog";
import { Mascot } from "../components/kids/Mascot";
import { completeLevel } from "../services/rewards";
import { registerBackHandler } from "../services/backButton";
import { sound } from "../services/sound";
import { adManager } from "../services/adManager";

export const Route = createFileRoute("/play/$category/$level")({
  head: () => ({
    meta: [
      { title: "Play — Kids Pop & Learn" },
      { name: "description", content: "Tap the right answer, earn stars and finish the level." },
      { property: "og:title", content: "Play — Kids Pop & Learn" },
      { property: "og:description", content: "A gentle tap-and-learn round for young children." },
    ],
  }),
  component: PlayLevel,
});

function FriendlyOops() {
  return (
    <main className="page-sky grid place-items-center px-6 text-center">
      <div>
        <Mascot size={130} />
        <p className="mt-4 font-display text-2xl">Oops! Let&apos;s try again 😊</p>
        <Link
          to="/"
          className="tap-scale mt-4 inline-block rounded-3xl bg-primary px-6 py-4 font-display text-xl text-primary-foreground"
        >
          🏠 Home
        </Link>
      </div>
    </main>
  );
}

function PlayLevel() {
  const params = useParams({ from: "/play/$category/$level" });
  const router = useRouter();
  const category = getCategory(params.category);
  const levelNumber = Number(params.level);
  const [roundKey, setRoundKey] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Automatically reset result state whenever route params change (Next Level fix)
  useEffect(() => {
    setResult(null);
    setShowExitDialog(false);
  }, [params.category, params.level]);

  // Intercept Android hardware back button during gameplay
  useEffect(() => {
    const unregister = registerBackHandler(() => {
      if (showExitDialog) {
        setShowExitDialog(false);
        return true;
      }
      if (result !== null) {
        router.navigate({ to: "/play/$category", params: { category: params.category } });
        return true;
      }
      setShowExitDialog(true);
      return true;
    });

    return () => {
      unregister();
    };
  }, [showExitDialog, result, router, params.category]);

  if (!category || !Number.isFinite(levelNumber) || levelNumber < 1 || levelNumber > category.levels.length) {
    return <FriendlyOops />;
  }

  const levelIndex = levelNumber - 1;

  const finish = async (stars: number) => {
    const bonus = 3;
    completeLevel(category.id, levelIndex, bonus);
    await adManager.showInterstitial();
    setResult(stars + bonus);
  };

  return (
    <>
      <ExitConfirmDialog
        open={showExitDialog}
        onContinue={() => setShowExitDialog(false)}
        onExit={() => {
          setShowExitDialog(false);
          sound.stopSpeech();
          router.navigate({ to: "/play/$category", params: { category: category.id } });
        }}
      />

      {result !== null ? (
        <ResultScreen
          category={category}
          levelIndex={levelIndex}
          starsEarned={result}
          onPlayAgain={() => {
            setResult(null);
            setRoundKey((k) => k + 1);
          }}
          onNextLevel={() => {
            setResult(null);
          }}
        />
      ) : category.id === "matching" ? (
        <MatchingGame
          key={`m-${levelIndex}-${roundKey}`}
          category={category}
          levelIndex={levelIndex}
          roundKey={roundKey}
          onFinish={finish}
          onExit={() => setShowExitDialog(true)}
        />
      ) : (
        <QuestionGame
          key={`q-${levelIndex}-${roundKey}`}
          category={category}
          levelIndex={levelIndex}
          roundKey={roundKey}
          onFinish={finish}
          onExit={() => setShowExitDialog(true)}
        />
      )}
    </>
  );
}
