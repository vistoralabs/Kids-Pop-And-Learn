import { sound } from "../../services/sound";

/**
 * "Watch video to get a hint" dialog.
 * Shown when child presses the 💡 Hint button during gameplay.
 */
export function HintDialog({
  open,
  onWatch,
  onClose,
  lang,
}: {
  open: boolean;
  onWatch: () => void;
  onClose: () => void;
  lang: string;
}) {
  if (!open) return null;

  const hi = lang === "hi";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-bounce-in w-full max-w-sm rounded-[2rem] bg-card px-6 py-6 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
        <p className="text-5xl" aria-hidden="true">
          💡
        </p>
        <h2 className="mt-3 font-display text-2xl text-secondary-foreground">
          {hi ? "संकेत चाहिए?" : "Need a hint?"}
        </h2>
        <p className="mt-2 font-display text-base text-muted-foreground">
          {hi
            ? "एक छोटा वीडियो देखो और संकेत पाओ!"
            : "Watch a short video to get a hint!"}
        </p>
        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={() => {
              sound.tap();
              onWatch();
            }}
            className="tap-scale min-h-14 rounded-2xl bg-grass px-5 py-3 font-display text-xl text-card shadow-[0_6px_0_0_rgba(0,0,0,0.12)]"
          >
            🎬 {hi ? "वीडियो देखो" : "Watch Video"}
          </button>
          <button
            type="button"
            onClick={() => {
              sound.tap();
              onClose();
            }}
            className="tap-scale min-h-14 rounded-2xl bg-muted px-5 py-3 font-display text-lg text-muted-foreground"
          >
            {hi ? "नहीं, धन्यवाद" : "No Thanks"}
          </button>
        </div>
      </div>
    </div>
  );
}
