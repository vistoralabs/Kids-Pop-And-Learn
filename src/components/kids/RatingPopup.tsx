import { useState } from "react";
import { sound } from "../../services/sound";
import { Mascot } from "./Mascot";

/**
 * Custom Rating Review Popup.
 * Provides interactive star rating, rate later, and feedback option.
 */
export function RatingPopup({
  open,
  onClose,
  onRateApp,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  onRateApp: () => void;
  lang: string;
}) {
  const [stars, setStars] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const hi = lang === "hi";

  if (!open) return null;

  const handleStarClick = (rating: number) => {
    sound.tap();
    setStars(rating);
  };

  const handleSubmitFeedback = () => {
    sound.achievement();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      // Reset state for next time
      setSubmitted(false);
      setStars(0);
      setFeedbackText("");
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-bounce-in w-full max-w-sm rounded-[2.5rem] bg-card px-6 py-6 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-berry">
        <div className="-mt-14 mb-2 flex justify-center">
          <div className="rounded-full bg-card p-3 shadow-lg">
            <Mascot size={80} float={false} />
          </div>
        </div>

        {submitted ? (
          <div className="py-6">
            <p className="text-5xl">🎉</p>
            <h2 className="mt-3 font-display text-2xl text-grass">
              {hi ? "धन्यवाद!" : "Thank You!"}
            </h2>
            <p className="mt-2 font-display text-base text-muted-foreground">
              {hi
                ? "आपके सुझाव के लिए धन्यवाद!"
                : "Thank you for your valuable feedback!"}
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-display text-2xl text-secondary-foreground">
              {hi ? "हमें रेट करें! ⭐" : "Rate Us! ⭐"}
            </h2>
            <p className="mt-2 font-display text-sm text-muted-foreground">
              {hi
                ? "क्या आपको यह खेल पसंद आया? हमें स्टार रेटिंग दें!"
                : "Do you love the game? Give us a star rating!"}
            </p>

            {/* Stars selection */}
            <div className="my-5 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="tap-scale text-4xl focus:outline-none transition-transform"
                >
                  {star <= stars ? "⭐" : "☆"}
                </button>
              ))}
            </div>

            {stars > 0 && stars >= 4 && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.achievement();
                    onRateApp();
                    onClose();
                  }}
                  className="tap-scale min-h-14 w-full rounded-2xl bg-grass px-5 py-3 font-display text-xl text-card shadow-[0_6px_0_0_rgba(0,0,0,0.12)]"
                >
                  🌟 {hi ? "प्ले स्टोर पर रेट करें" : "Rate on Play Store"}
                </button>
              </div>
            )}

            {stars > 0 && stars < 4 && (
              <div className="mt-2 text-left">
                <p className="font-display text-sm text-muted-foreground mb-1">
                  {hi ? "हम इसे कैसे सुधार सकते हैं?" : "How can we improve?"}
                </p>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={hi ? "अपना सुझाव लिखें..." : "Type your feedback here..."}
                  className="w-full rounded-xl border border-input p-2 font-display text-sm bg-muted/50 focus:outline-none focus:ring-2 focus:ring-berry"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={handleSubmitFeedback}
                  className="tap-scale mt-3 min-h-12 w-full rounded-xl bg-berry px-4 py-2 font-display text-base text-card shadow-[0_4px_0_0_rgba(0,0,0,0.1)]"
                >
                  {hi ? "भेजें" : "Submit"}
                </button>
              </div>
            )}

            <div className="mt-3">
              <button
                type="button"
                onClick={() => {
                  sound.tap();
                  onClose();
                }}
                className="tap-scale font-display text-sm text-muted-foreground hover:text-secondary-foreground"
              >
                {hi ? "बाद में रेट करें" : "Rate Later"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
