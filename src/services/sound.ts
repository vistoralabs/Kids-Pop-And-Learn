import { registerPlugin } from "@capacitor/core";
import { getProgress } from "./storage";
import { hasDevanagari, transliterateHindi } from "./translit";

interface NativeTTSPlugin {
  speak(options: { text: string; lang?: string; queue?: boolean }): Promise<{ spoken: boolean }>;
  stop(): Promise<void>;
}

const NativeTTS = registerPlugin<NativeTTSPlugin>("NativeTTS");

let ctx: AudioContext | null = null;
let musicTimer: ReturnType<typeof setInterval> | null = null;
let voiceCache: SpeechSynthesisVoice[] = [];
let speechTimers: ReturnType<typeof setTimeout>[] = [];

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) {
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") {
    void ctx.resume().catch(() => {});
  }
  return ctx;
}

// User-gesture unlock for Web Audio & Speech on mobile WebViews
if (typeof window !== "undefined") {
  const unlock = () => {
    try {
      const ac = audio();
      if (ac && ac.state === "suspended") {
        void ac.resume();
      }
      warmUpVoices();
    } catch {
      /* ignore */
    }
  };
  window.addEventListener("touchstart", unlock, { passive: true, capture: true });
  window.addEventListener("click", unlock, { passive: true, capture: true });
}

function tone(
  freq: number,
  start: number,
  duration: number,
  volume = 0.18,
  type: OscillatorType = "sine",
) {
  const ac = audio();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t0 = ac.currentTime + start;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  } catch {
    /* audio context not ready */
  }
}

function soundOn() {
  return getProgress().settings.sound;
}

function voices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  try {
    const list = window.speechSynthesis.getVoices();
    if (list && list.length > 0) voiceCache = list;
  } catch {
    /* ignore */
  }
  return voiceCache;
}

export function warmUpVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  voices();
  try {
    window.speechSynthesis.onvoiceschanged = () => {
      voiceCache = window.speechSynthesis.getVoices();
    };
  } catch {
    /* ignore */
  }
}

function pickVoice(lang: "en" | "hi"): SpeechSynthesisVoice | null {
  const list = voices();
  if (!list.length) return null;
  const wanted = lang === "hi" ? ["hi-in", "hi"] : ["en-in", "en-gb", "en"];
  for (const prefix of wanted) {
    const match = list.find((v) => v.lang.replace("_", "-").toLowerCase().startsWith(prefix));
    if (match) return match;
  }
  if (lang === "hi") return null;
  const indian = list.find((v) => /india/i.test(v.name));
  return indian ?? null;
}

export function hasHindiVoice(): boolean {
  return voices().some((v) => v.lang.replace("_", "-").toLowerCase().startsWith("hi"));
}

function clearSpeechTimers() {
  speechTimers.forEach(clearTimeout);
  speechTimers = [];
}

export const sound = {
  tap() {
    if (!soundOn()) return;
    tone(660, 0, 0.09, 0.1, "triangle");
  },
  correct() {
    if (!soundOn()) return;
    [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.09, 0.22, 0.16, "triangle"));
  },
  wrong() {
    if (!soundOn()) return;
    tone(300, 0, 0.16, 0.09, "sine");
    tone(240, 0.14, 0.2, 0.08, "sine");
  },
  levelComplete() {
    if (!soundOn()) return;
    [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, i * 0.11, 0.3, 0.15, "triangle"));
  },
  achievement() {
    if (!soundOn()) return;
    [784, 988, 1318].forEach((f, i) => tone(f, i * 0.14, 0.4, 0.14, "sine"));
  },
  reward() {
    if (!soundOn()) return;
    [659, 880, 1046].forEach((f, i) => tone(f, i * 0.1, 0.25, 0.14, "triangle"));
  },

  /** Stop speech synthesis immediately (both native and web fallback). */
  stopSpeech() {
    clearSpeechTimers();
    try {
      NativeTTS.stop().catch(() => {});
    } catch {
      /* ignore */
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* ignore */
      }
    }
  },

  /** Speak one phrase in the requested language. */
  say(text: string, lang: "en" | "hi" = "en") {
    this.speakList([{ text, lang }]);
  },

  /**
   * Speak an English/Hindi pair according to the chosen learning language.
   * Uses Native Android OS TTS first for flawless audio in APK, with Web Speech fallback.
   */
  sayBilingual(en: string, hi: string) {
    const lang = getProgress().settings.lang;
    if (lang === "hi") {
      this.speakList([{ text: hi, lang: "hi" }]);
    } else {
      this.speakList([{ text: en, lang: "en" }]);
    }
  },

  /**
   * Hybrid speech runner: Native Android OS TTS with Web Speech API fallback.
   */
  speakList(items: { text: string; lang: "en" | "hi" }[]) {
    if (!soundOn()) return;
    if (!items.length) return;

    this.stopSpeech();

    // 1. Try Native Android TTS first (100% reliable inside APK)
    try {
      if (typeof window !== "undefined" && (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.()) {
        items.forEach((item, idx) => {
          NativeTTS.speak({
            text: item.text,
            lang: item.lang,
            queue: idx > 0,
          }).catch(() => {
            // If native fails, fallback to web
            this.speakListWeb(items);
          });
        });
        return;
      }
    } catch {
      /* fall through to Web Speech */
    }

    // 2. Web Speech API fallback (for browser preview)
    this.speakListWeb(items);
  },

  speakListWeb(items: { text: string; lang: "en" | "hi" }[]) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const timer = setTimeout(() => {
      const hindiVoice = hasHindiVoice();
      let currentIndex = 0;

      const speakNext = () => {
        if (currentIndex >= items.length) return;

        const item = items[currentIndex]!;
        currentIndex++;

        const hindi = item.lang === "hi";
        const fallback = hindi && !hindiVoice;
        const text = fallback && hasDevanagari(item.text) ? transliterateHindi(item.text) : item.text;

        try {
          const utter = new SpeechSynthesisUtterance(text);
          const voice = pickVoice(fallback ? "en" : item.lang);
          if (voice) utter.voice = voice;
          utter.lang = hindi && !fallback ? "hi-IN" : "en-IN";
          utter.rate = hindi ? 0.8 : 0.88;
          utter.pitch = 1.15;

          let done = false;
          const advance = () => {
            if (done) return;
            done = true;
            const nextTimer = setTimeout(speakNext, 120);
            speechTimers.push(nextTimer);
          };

          utter.onend = advance;
          utter.onerror = advance;

          const safetyTimeout = setTimeout(advance, 4500);
          speechTimers.push(safetyTimeout);

          window.speechSynthesis.speak(utter);
        } catch {
          speakNext();
        }
      };

      speakNext();
    }, 60);

    speechTimers.push(timer);
  },

  startMusic() {
    if (typeof window === "undefined") return;
    const p = getProgress();
    if (!p.settings.music || !p.settings.sound || musicTimer) return;
    const notes = [392, 440, 523, 440, 587, 523, 440, 392];
    let i = 0;
    const play = () => {
      if (!getProgress().settings.music || !getProgress().settings.sound) return;
      tone(notes[i % notes.length]!, 0, 0.5, 0.035, "sine");
      i++;
    };
    play();
    musicTimer = setInterval(play, 700);
  },

  stopMusic() {
    if (musicTimer) clearInterval(musicTimer);
    musicTimer = null;
  },

  syncMusic() {
    const p = getProgress();
    if (p.settings.music && p.settings.sound) this.startMusic();
    else this.stopMusic();
  },
};
