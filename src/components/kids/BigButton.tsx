import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { sound } from "../../services/sound";

/** Big rounded child-friendly button. Minimum 64px tall touch target. */
export function BigButton({
  children,
  onClick,
  tone,
  className = "",
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: string;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => {
        sound.tap();
        onClick?.();
      }}
      className={`tap-scale min-h-16 rounded-3xl px-6 py-4 font-display text-xl text-card shadow-[0_8px_0_0_rgba(0,0,0,0.15)] ${className}`}
      style={tone ? { backgroundColor: tone } : undefined}
    >
      {children}
    </button>
  );
}

export function BackHomeBar({
  title,
  right,
  onBack,
  to = "/",
}: {
  title: string;
  right?: ReactNode;
  onBack?: () => void;
  to?: string;
}) {
  return (
    <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 pt-4">
      {onBack ? (
        <button
          type="button"
          onClick={() => {
            sound.tap();
            onBack();
          }}
          aria-label="Go back"
          className="tap-scale grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-card text-2xl shadow-[0_6px_0_0_rgba(0,0,0,0.12)]"
        >
          🏠
        </button>
      ) : (
        <Link
          to={to}
          onClick={() => sound.tap()}
          aria-label="Go home"
          className="tap-scale grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-card text-2xl shadow-[0_6px_0_0_rgba(0,0,0,0.12)]"
        >
          🏠
        </Link>
      )}
      <h1 className="min-w-0 truncate text-center font-display text-2xl text-secondary-foreground">
        {title}
      </h1>
      <div className="shrink-0">{right}</div>
    </header>
  );
}

export function StarCounter({ stars }: { stars: number }) {
  return (
    <div className="flex shrink-0 items-center gap-1 rounded-2xl bg-card px-4 py-2 font-display text-lg shadow-[0_6px_0_0_rgba(0,0,0,0.12)]">
      <span aria-hidden="true">⭐</span>
      <span aria-label={`${stars} stars`}>{stars}</span>
    </div>
  );
}
