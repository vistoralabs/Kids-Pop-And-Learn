import type { GameOption } from "../../game/types";
import { Shape } from "./Shape";

export function ObjectTile({
  option,
  state,
  onPick,
  index,
  disabled,
  highlighted,
}: {
  option: GameOption;
  state: "idle" | "right" | "wrong";
  onPick: () => void;
  index: number;
  disabled?: boolean;
  highlighted?: boolean;
}) {
  const anim =
    state === "wrong" ? "animate-shake" : state === "right" ? "animate-pop" : "animate-bounce-in";

  const ringClass = state === "right" 
    ? "ring-4 ring-grass" 
    : highlighted 
      ? "ring-4 ring-sun animate-pulse" 
      : "";

  return (
    <button
      type="button"
      onClick={onPick}
      disabled={disabled}
      aria-label={option.key}
      className={`tap-scale ${anim} grid aspect-square min-h-24 w-full place-items-center overflow-hidden rounded-3xl bg-card p-2 shadow-[0_8px_0_0_rgba(0,0,0,0.12)] ${ringClass} ${
        disabled ? "opacity-20 pointer-events-none" : ""
      }`}
      style={{ animationDelay: state === "idle" ? `${index * 60}ms` : undefined }}
    >
      {option.color && (
        <span
          className="block h-4/5 w-4/5 rounded-full"
          style={{ backgroundColor: option.color, border: "3px solid rgba(0,0,0,0.10)" }}
          aria-hidden="true"
        />
      )}
      {option.shape && <Shape name={option.shape} color={option.shapeColor ?? "#3b82f6"} size={84} />}
      {option.emoji && (
        <span className="text-5xl leading-none sm:text-6xl" aria-hidden="true">
          {option.emoji}
        </span>
      )}
      {option.text && (
        <span className="font-display text-5xl text-secondary-foreground sm:text-6xl">
          {option.text}
        </span>
      )}
      {option.groupEmoji && option.groupCount ? (
        <span className="flex flex-wrap items-center justify-center gap-0.5 p-1" aria-hidden="true">
          {Array.from({ length: option.groupCount }).map((_, i) => (
            <span key={i} className="text-xl leading-none sm:text-2xl">
              {option.groupEmoji}
            </span>
          ))}
        </span>
      ) : null}
    </button>
  );
}
