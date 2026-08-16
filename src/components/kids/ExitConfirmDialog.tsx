import { Mascot } from "./Mascot";
import { sound } from "../../services/sound";
import { useProgress } from "../../services/storage";

interface ExitConfirmDialogProps {
  open: boolean;
  onContinue: () => void;
  onExit: () => void;
}

export function ExitConfirmDialog({ open, onContinue, onExit }: ExitConfirmDialogProps) {
  const progress = useProgress();
  const hi = progress.settings.lang === "hi";

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="animate-bounce-in mx-auto w-full max-w-sm rounded-[2.5rem] bg-card p-6 text-center shadow-2xl">
        <Mascot size={96} float={false} />
        
        <h2 className="mt-3 font-display text-2xl text-secondary-foreground">
          {hi ? "क्या आप बाहर जाना चाहते हैं?" : "Do you want to exit this level?"}
        </h2>
        
        <p className="mt-1 font-display text-sm text-muted-foreground">
          {hi ? "आपकी प्रगति सुरक्षित रहेगी" : "Your stars and progress are safe!"}
        </p>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={() => {
              sound.tap();
              onContinue();
            }}
            className="tap-scale flex min-h-14 items-center justify-center rounded-2xl bg-grass px-5 py-3 font-display text-xl text-card shadow-[0_6px_0_0_rgba(0,0,0,0.15)]"
          >
            ▶️ {hi ? "खेल जारी रखें" : "Continue Game"}
          </button>

          <button
            type="button"
            onClick={() => {
              sound.tap();
              onExit();
            }}
            className="tap-scale flex min-h-14 items-center justify-center rounded-2xl bg-muted px-5 py-3 font-display text-lg text-secondary-foreground shadow-[0_4px_0_0_rgba(0,0,0,0.08)]"
          >
            🏠 {hi ? "होम पर जाएँ" : "Exit to Home"}
          </button>
        </div>
      </div>
    </div>
  );
}
