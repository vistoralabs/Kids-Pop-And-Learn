/**
 * Devanagari → Latin transliteration.
 * Used only as a speech fallback: many devices have no Hindi (hi-IN) voice, and
 * asking an English voice to read Devanagari produces silence. Transliterating
 * lets an Indian English voice pronounce the Hindi word closely enough.
 */

const VOWELS: Record<string, string> = {
  अ: "a",
  आ: "aa",
  इ: "i",
  ई: "ee",
  उ: "u",
  ऊ: "oo",
  ए: "e",
  ऐ: "ai",
  ओ: "o",
  औ: "au",
  ऋ: "ri",
};

const MATRAS: Record<string, string> = {
  "ा": "aa",
  "ि": "i",
  "ी": "ee",
  "ु": "u",
  "ू": "oo",
  "े": "e",
  "ै": "ai",
  "ो": "o",
  "ौ": "au",
  "ृ": "ri",
  "ं": "n",
  "ँ": "n",
  "ः": "h",
};

const CONSONANTS: Record<string, string> = {
  क: "k",
  ख: "kh",
  ग: "g",
  घ: "gh",
  ङ: "ng",
  च: "ch",
  छ: "chh",
  ज: "j",
  झ: "jh",
  ञ: "ny",
  ट: "t",
  ठ: "th",
  ड: "d",
  ढ: "dh",
  ण: "n",
  त: "t",
  थ: "th",
  द: "d",
  ध: "dh",
  न: "n",
  प: "p",
  फ: "ph",
  ब: "b",
  भ: "bh",
  म: "m",
  य: "y",
  र: "r",
  ल: "l",
  व: "v",
  श: "sh",
  ष: "sh",
  स: "s",
  ह: "h",
  ळ: "l",
  क़: "q",
  ख़: "kh",
  ग़: "g",
  ज़: "z",
  ड़: "r",
  ढ़: "rh",
  फ़: "f",
};

const NUKTA = "\u093c";
const VIRAMA = "\u094d";
const DIGITS: Record<string, string> = {
  "०": "0",
  "१": "1",
  "२": "2",
  "३": "3",
  "४": "4",
  "५": "5",
  "६": "6",
  "७": "7",
  "८": "8",
  "९": "9",
};

export function hasDevanagari(text: string) {
  return /[\u0900-\u097f]/.test(text);
}

/** Rough but readable Roman spelling of a Hindi phrase. */
export function transliterateHindi(text: string): string {
  let out = "";
  const chars = [...text];

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]!;
    const next = chars[i + 1];

    if (DIGITS[ch]) {
      out += DIGITS[ch];
      continue;
    }
    if (VOWELS[ch]) {
      out += VOWELS[ch];
      continue;
    }
    if (MATRAS[ch]) {
      out += MATRAS[ch];
      continue;
    }
    if (ch === VIRAMA || ch === NUKTA) continue;

    let base = CONSONANTS[ch];
    if (base) {
      if (next === NUKTA) {
        base = CONSONANTS[ch + NUKTA] ?? base;
        i++;
      }
      out += base;
      const after = chars[i + 1];
      // Hindi drops the inherent "a" at the end of a word (रंग → rang).
      const wordEnd = after === undefined || /[\s.,!?।]/.test(after);
      const nasal = after === "\u0902" || after === "\u0901"; // anusvara / candrabindu keep the "a"
      const suppressed =
        !nasal &&
        (wordEnd || after === VIRAMA || (after !== undefined && MATRAS[after] !== undefined));
      if (!suppressed) out += "a";
      continue;

    }

    out += ch;
  }

  return out.replace(/।/g, ".").replace(/\s+/g, " ").trim();
}
