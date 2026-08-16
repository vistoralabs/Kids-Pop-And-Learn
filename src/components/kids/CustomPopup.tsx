import { sound } from "../../services/sound";
import { Mascot } from "./Mascot";

/**
 * Custom promotional popup.
 * Appears 10-15 seconds after app opens, once per session.
 */
export function CustomPopup({
  open,
  onClose,
  lang,
  title,
  desc,
  btnText,
}: {
  open: boolean;
  onClose: () => void;
  lang: string;
  title?: string;
  desc?: string;
  btnText?: string;
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
      <div className="animate-bounce-in w-full max-w-sm rounded-[2.5rem] bg-card px-6 py-6 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-[#ffcb47]">
        <div className="-mt-14 mb-2 flex justify-center">
          <div className="rounded-full bg-card p-3 shadow-lg">
            <Mascot size={80} float={true} />
          </div>
        </div>
        
        <h2 className="font-display text-2xl text-secondary-foreground">
          {title || (hi ? "अद्भुत पुरस्कार! 🏆" : "Amazing Rewards! 🏆")}
        </h2>
        
        <p className="mt-2 font-display text-base text-muted-foreground leading-relaxed">
          {desc || (hi
            ? "सभी श्रेणियों को खेलें, अधिक से अधिक सितारे जीतें और सभी बैज अनलॉक करें!"
            : "Play all categories, win lots of stars, and unlock all the cool badges!")}
        </p>
        
        <div className="mt-5">
          <button
            type="button"
            onClick={() => {
              sound.tap();
              onClose();
            }}
            className="tap-scale min-h-14 w-full rounded-2xl bg-grass px-5 py-3 font-display text-xl text-card shadow-[0_6px_0_0_rgba(0,0,0,0.12)]"
          >
            🚀 {btnText || (hi ? "खेल जारी रखें" : "Keep Playing")}
          </button>
        </div>
      </div>
    </div>
  );
}
