import type { CategoryDef, GameOption, LevelConfig, Question, ShapeName } from "./types";

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

export function shuffle<T>(list: readonly T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function pickOthers<T>(pool: readonly T[], exclude: T, count: number): T[] {
  return shuffle(pool.filter((p) => p !== exclude)).slice(0, count);
}

function randomOf<T>(pool: readonly T[]): T {
  return pool[Math.floor(Math.random() * pool.length)]!;
}

/* ------------------------------------------------------------------ */
/* data                                                                */
/* ------------------------------------------------------------------ */

export const COLORS = [
  { name: "Red", hi: "लाल", hex: "#ef4444", family: "warm" },
  { name: "Pink", hi: "गुलाबी", hex: "#ec4899", family: "warm" },
  { name: "Orange", hi: "नारंगी", hex: "#f97316", family: "warm" },
  { name: "Yellow", hi: "पीला", hex: "#facc15", family: "warm" },
  { name: "Green", hi: "हरा", hex: "#22c55e", family: "cool" },
  { name: "Blue", hi: "नीला", hex: "#3b82f6", family: "cool" },
  { name: "Purple", hi: "बैंगनी", hex: "#a855f7", family: "cool" },
  { name: "Brown", hi: "भूरा", hex: "#92400e", family: "neutral" },
  { name: "Black", hi: "काला", hex: "#1f2937", family: "neutral" },
  { name: "White", hi: "सफ़ेद", hex: "#ffffff", family: "neutral" },
] as const;

export const ALPHABET = [
  { letter: "A", word: "Apple", hi: "सेब", emoji: "🍎" },
  { letter: "B", word: "Ball", hi: "गेंद", emoji: "⚽" },
  { letter: "C", word: "Cat", hi: "बिल्ली", emoji: "🐱" },
  { letter: "D", word: "Dog", hi: "कुत्ता", emoji: "🐶" },
  { letter: "E", word: "Elephant", hi: "हाथी", emoji: "🐘" },
  { letter: "F", word: "Fish", hi: "मछली", emoji: "🐟" },
  { letter: "G", word: "Grapes", hi: "अंगूर", emoji: "🍇" },
  { letter: "H", word: "Hat", hi: "टोपी", emoji: "👒" },
  { letter: "I", word: "Ice cream", hi: "आइसक्रीम", emoji: "🍦" },
  { letter: "J", word: "Jug", hi: "जग", emoji: "🫗" },
  { letter: "K", word: "Kite", hi: "पतंग", emoji: "🪁" },
  { letter: "L", word: "Lion", hi: "शेर", emoji: "🦁" },
  { letter: "M", word: "Moon", hi: "चाँद", emoji: "🌙" },
  { letter: "N", word: "Nest", hi: "घोंसला", emoji: "🪺" },
  { letter: "O", word: "Orange", hi: "संतरा", emoji: "🍊" },
  { letter: "P", word: "Panda", hi: "पांडा", emoji: "🐼" },
  { letter: "Q", word: "Queen", hi: "रानी", emoji: "👑" },
  { letter: "R", word: "Rabbit", hi: "खरगोश", emoji: "🐰" },
  { letter: "S", word: "Sun", hi: "सूरज", emoji: "☀️" },
  { letter: "T", word: "Train", hi: "रेलगाड़ी", emoji: "🚂" },
  { letter: "U", word: "Umbrella", hi: "छतरी", emoji: "☂️" },
  { letter: "V", word: "Van", hi: "वैन", emoji: "🚐" },
  { letter: "W", word: "Watermelon", hi: "तरबूज़", emoji: "🍉" },
  { letter: "X", word: "Xylophone", hi: "बाजा", emoji: "🎹" },
  { letter: "Y", word: "Yo-yo", hi: "यो-यो", emoji: "🪀" },
  { letter: "Z", word: "Zebra", hi: "ज़ेबरा", emoji: "🦓" },
] as const;

export const ANIMALS = [
  { name: "Dog", hi: "कुत्ता", emoji: "🐶" },
  { name: "Cat", hi: "बिल्ली", emoji: "🐱" },
  { name: "Lion", hi: "शेर", emoji: "🦁" },
  { name: "Elephant", hi: "हाथी", emoji: "🐘" },
  { name: "Tiger", hi: "बाघ", emoji: "🐯" },
  { name: "Panda", hi: "पांडा", emoji: "🐼" },
  { name: "Monkey", hi: "बंदर", emoji: "🐵" },
  { name: "Rabbit", hi: "खरगोश", emoji: "🐰" },
  { name: "Frog", hi: "मेंढक", emoji: "🐸" },
  { name: "Cow", hi: "गाय", emoji: "🐮" },
  { name: "Horse", hi: "घोड़ा", emoji: "🐴" },
  { name: "Bear", hi: "भालू", emoji: "🐻" },
  { name: "Pig", hi: "सूअर", emoji: "🐷" },
  { name: "Sheep", hi: "भेड़", emoji: "🐑" },
  { name: "Giraffe", hi: "जिराफ़", emoji: "🦒" },
  { name: "Zebra", hi: "ज़ेबरा", emoji: "🦓" },
  { name: "Camel", hi: "ऊँट", emoji: "🐫" },
  { name: "Fish", hi: "मछली", emoji: "🐟" },
] as const;

export const BIRDS = [
  { name: "Parrot", hi: "तोता", emoji: "🦜" },
  { name: "Peacock", hi: "मोर", emoji: "🦚" },
  { name: "Owl", hi: "उल्लू", emoji: "🦉" },
  { name: "Duck", hi: "बत्तख", emoji: "🦆" },
  { name: "Hen", hi: "मुर्गी", emoji: "🐔" },
  { name: "Eagle", hi: "चील", emoji: "🦅" },
  { name: "Penguin", hi: "पेंगुइन", emoji: "🐧" },
  { name: "Swan", hi: "हंस", emoji: "🦢" },
  { name: "Dove", hi: "कबूतर", emoji: "🕊️" },
  { name: "Chick", hi: "चूज़ा", emoji: "🐤" },
] as const;

export const BODY = [
  { name: "Eye", hi: "आँख", emoji: "👁️" },
  { name: "Ear", hi: "कान", emoji: "👂" },
  { name: "Nose", hi: "नाक", emoji: "👃" },
  { name: "Mouth", hi: "मुँह", emoji: "👄" },
  { name: "Hand", hi: "हाथ", emoji: "✋" },
  { name: "Foot", hi: "पैर", emoji: "🦶" },
  { name: "Tooth", hi: "दाँत", emoji: "🦷" },
  { name: "Tongue", hi: "जीभ", emoji: "👅" },
  { name: "Brain", hi: "दिमाग़", emoji: "🧠" },
  { name: "Arm", hi: "बाँह", emoji: "💪" },
] as const;

export const FRUITS = [
  { name: "Apple", hi: "सेब", emoji: "🍎" },
  { name: "Banana", hi: "केला", emoji: "🍌" },
  { name: "Orange", hi: "संतरा", emoji: "🍊" },
  { name: "Grapes", hi: "अंगूर", emoji: "🍇" },
  { name: "Watermelon", hi: "तरबूज़", emoji: "🍉" },
  { name: "Strawberry", hi: "स्ट्रॉबेरी", emoji: "🍓" },
  { name: "Mango", hi: "आम", emoji: "🥭" },
  { name: "Pineapple", hi: "अनानास", emoji: "🍍" },
  { name: "Cherry", hi: "चेरी", emoji: "🍒" },
  { name: "Pear", hi: "नाशपाती", emoji: "🍐" },
  { name: "Peach", hi: "आड़ू", emoji: "🍑" },
  { name: "Coconut", hi: "नारियल", emoji: "🥥" },
  { name: "Lemon", hi: "नींबू", emoji: "🍋" },
  { name: "Kiwi", hi: "कीवी", emoji: "🥝" },
] as const;

export const VEHICLES = [
  { name: "Car", hi: "कार", emoji: "🚗" },
  { name: "Bus", hi: "बस", emoji: "🚌" },
  { name: "Ambulance", hi: "एम्बुलेंस", emoji: "🚑" },
  { name: "Fire Truck", hi: "दमकल", emoji: "🚒" },
  { name: "Police Car", hi: "पुलिस कार", emoji: "🚓" },
  { name: "Airplane", hi: "हवाई जहाज़", emoji: "✈️" },
  { name: "Helicopter", hi: "हेलीकॉप्टर", emoji: "🚁" },
  { name: "Train", hi: "रेलगाड़ी", emoji: "🚂" },
  { name: "Ship", hi: "जहाज़", emoji: "🚢" },
  { name: "Bicycle", hi: "साइकिल", emoji: "🚲" },
  { name: "Auto Rickshaw", hi: "ऑटो", emoji: "🛺" },
  { name: "Scooter", hi: "स्कूटर", emoji: "🛵" },
  { name: "Tractor", hi: "ट्रैक्टर", emoji: "🚜" },
  { name: "Truck", hi: "ट्रक", emoji: "🚚" },
  { name: "Rocket", hi: "रॉकेट", emoji: "🚀" },
  { name: "Boat", hi: "नाव", emoji: "⛵" },
] as const;

export const SHAPES: { name: string; hi: string; shape: ShapeName }[] = [
  { name: "Circle", hi: "गोल", shape: "circle" },
  { name: "Square", hi: "वर्ग", shape: "square" },
  { name: "Triangle", hi: "त्रिभुज", shape: "triangle" },
  { name: "Rectangle", hi: "आयत", shape: "rectangle" },
  { name: "Star", hi: "तारा", shape: "star" },
  { name: "Heart", hi: "दिल", shape: "heart" },
  { name: "Oval", hi: "अंडाकार", shape: "oval" },
  { name: "Diamond", hi: "हीरा", shape: "diamond" },
];

const SHAPE_COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f97316", "#a855f7", "#ec4899", "#facc15"];
const COUNT_EMOJI = ["🍎", "⭐", "🐟", "🎈", "🍓", "🌸"];

/* ------------------------------------------------------------------ */
/* categories & levels                                                 */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* categories & 25 progressive levels                                 */
/* ------------------------------------------------------------------ */

const LEVEL_25_CONFIGS: { label: string; tier: LevelConfig["tier"]; objects: number; questions: number }[] = [
  // Tier 1: Warm up (Levels 1-5) - 4 options, 10 questions, gentle pace, rich hints
  { label: "Warm up", tier: "warmup", objects: 4, questions: 10 },
  { label: "First Steps", tier: "warmup", objects: 4, questions: 10 },
  { label: "Easy Start", tier: "warmup", objects: 4, questions: 10 },
  { label: "Sweet & Simple", tier: "warmup", objects: 4, questions: 10 },
  { label: "High Five", tier: "warmup", objects: 4, questions: 10 },

  // Tier 2: Explorer (Levels 6-10) - 4 options, 10 questions, expanded variety
  { label: "Explorer", tier: "explorer", objects: 4, questions: 10 },
  { label: "Nice & Steady", tier: "explorer", objects: 4, questions: 10 },
  { label: "Sharp Eyes", tier: "explorer", objects: 4, questions: 10 },
  { label: "Quick Thinker", tier: "explorer", objects: 4, questions: 10 },
  { label: "Halfway Hero", tier: "explorer", objects: 4, questions: 10 },

  // Tier 3: Champion (Levels 11-15) - 4 options, 10 questions, tricky choices
  { label: "Stepping Up", tier: "champion", objects: 4, questions: 10 },
  { label: "Tricky Choices", tier: "champion", objects: 4, questions: 10 },
  { label: "Super Smart", tier: "champion", objects: 4, questions: 10 },
  { label: "Fast Pop", tier: "champion", objects: 4, questions: 10 },
  { label: "Star Champ", tier: "champion", objects: 4, questions: 10 },

  // Tier 4: Master (Levels 16-20) - 4 options, 10 questions, advanced distractors
  { label: "Brain Power", tier: "master", objects: 4, questions: 10 },
  { label: "Mega Match", tier: "master", objects: 4, questions: 10 },
  { label: "Swift Star", tier: "master", objects: 4, questions: 10 },
  { label: "Expert Level", tier: "master", objects: 4, questions: 10 },
  { label: "Master Mind", tier: "master", objects: 4, questions: 10 },

  // Tier 5: Challenge (Levels 21-25) - 4 options, 10 questions, ultimate challenge
  { label: "Challenge Start", tier: "challenge", objects: 4, questions: 10 },
  { label: "Ultra Focus", tier: "challenge", objects: 4, questions: 10 },
  { label: "Super Solver", tier: "challenge", objects: 4, questions: 10 },
  { label: "Crown Seeker", tier: "challenge", objects: 4, questions: 10 },
  { label: "Grand Champion", tier: "challenge", objects: 4, questions: 10 },
];

function generate25Levels(): LevelConfig[] {
  return LEVEL_25_CONFIGS.map((cfg, index) => ({
    index,
    objects: 4,
    questions: cfg.questions,
    label: cfg.label,
    tier: cfg.tier,
  }));
}

const MATCHING_CARD_COUNTS = [
  // 1-5: Warmup
  4, 4, 6, 6, 6,
  // 6-10: Explorer
  8, 8, 8, 10, 10,
  // 11-15: Champion
  12, 12, 12, 14, 14,
  // 16-20: Master
  16, 16, 16, 18, 18,
  // 21-25: Challenge
  20, 20, 20, 24, 24,
];

export const CATEGORIES: CategoryDef[] = [
  {
    id: "colors",
    title: "Colors",
    titleHi: "रंग",
    emoji: "🎨",
    subtitle: "Tap the color",
    subtitleHi: "रंग दबाओ",
    tone: "var(--fun-1)",
    levels: generate25Levels(),
  },
  {
    id: "abc",
    title: "ABC",
    titleHi: "ए बी सी",
    emoji: "🔤",
    subtitle: "Letters A to Z",
    subtitleHi: "A से Z तक अक्षर",
    tone: "var(--fun-2)",
    levels: generate25Levels(),
  },
  {
    id: "numbers",
    title: "Numbers",
    titleHi: "गिनती",
    emoji: "🔢",
    subtitle: "Count and find",
    subtitleHi: "गिनो और ढूँढो",
    tone: "var(--fun-3)",
    levels: generate25Levels(),
  },
  {
    id: "animals",
    title: "Animals",
    titleHi: "जानवर",
    emoji: "🐶",
    subtitle: "Meet the animals",
    subtitleHi: "जानवरों से मिलो",
    tone: "var(--fun-4)",
    levels: generate25Levels(),
  },
  {
    id: "shapes",
    title: "Shapes",
    titleHi: "आकार",
    emoji: "🔷",
    subtitle: "Find the shape",
    subtitleHi: "आकार ढूँढो",
    tone: "var(--fun-5)",
    levels: generate25Levels(),
  },
  {
    id: "fruits",
    title: "Fruits",
    titleHi: "फल",
    emoji: "🍎",
    subtitle: "Yummy fruits",
    subtitleHi: "मज़ेदार फल",
    tone: "var(--fun-6)",
    levels: generate25Levels(),
  },
  {
    id: "vehicles",
    title: "Vehicles",
    titleHi: "गाड़ियाँ",
    emoji: "🚗",
    subtitle: "Things that go",
    subtitleHi: "चलने वाली चीज़ें",
    tone: "var(--fun-7)",
    levels: generate25Levels(),
  },
  {
    id: "birds",
    title: "Birds",
    titleHi: "पक्षी",
    emoji: "🦜",
    subtitle: "Meet the birds",
    subtitleHi: "पक्षियों से मिलो",
    tone: "var(--fun-9)",
    levels: generate25Levels(),
  },
  {
    id: "body",
    title: "My Body",
    titleHi: "मेरा शरीर",
    emoji: "🖐️",
    subtitle: "Parts of the body",
    subtitleHi: "शरीर के अंग",
    tone: "var(--fun-10)",
    levels: generate25Levels(),
  },
  {
    id: "matching",
    title: "Matching",
    titleHi: "जोड़ी मिलाओ",
    emoji: "🧩",
    subtitle: "Find the pairs",
    subtitleHi: "जोड़ी ढूँढो",
    tone: "var(--fun-8)",
    levels: MATCHING_CARD_COUNTS.map((cards, index) => {
      const cfg = LEVEL_25_CONFIGS[index] ?? { label: `${cards} cards`, tier: "warmup" as const };
      return {
        index,
        objects: cards,
        questions: Math.floor(cards / 2),
        label: `${cards} cards • ${cfg.label}`,
        tier: cfg.tier,
      };
    }),
  },
];

export function getCategory(id: string | undefined): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

/* ------------------------------------------------------------------ */
/* question generators with progressive difficulty                     */
/* ------------------------------------------------------------------ */

let questionSeq = 0;
const nextId = () => `q${++questionSeq}`;

const HI_VERB: Record<string, string> = { Find: "ढूँढो", Tap: "दबाओ", Touch: "छुओ" };

function emojiQuestion(
  pool: readonly { name: string; hi: string; emoji: string }[],
  objects: number,
  levelIndex: number,
  verb: string,
): Question {
  // In early levels (0-4), pick from first subset of familiar items (at least 6 items)
  const activePool = levelIndex < 5 ? pool.slice(0, Math.max(6, Math.floor(pool.length * 0.6))) : pool;
  const target = randomOf(activePool);
  const others = pickOthers(activePool, target, 3);
  const options: GameOption[] = shuffle([
    { key: target.name, correct: true, emoji: target.emoji },
    ...others.map((o) => ({ key: o.name, correct: false, emoji: o.emoji })),
  ]);
  const hiVerb = HI_VERB[verb] ?? "ढूँढो";
  return {
    id: nextId(),
    prompt: `${verb} the ${target.name}`,
    speak: `${verb} the ${target.name}`,
    hint: levelIndex < 10 ? `${target.name} looks like this: ${target.emoji}` : `Look for the ${target.name}`,
    promptHi: `${target.hi} ${hiVerb}`,
    speakHi: `${target.hi} ${hiVerb}`,
    hintHi: levelIndex < 10 ? `${target.hi} ऐसा दिखता है: ${target.emoji}` : `${target.hi} ढूँढो`,
    options,
  };
}

function colorQuestion(objects: number, levelIndex: number): Question {
  const verb = randomOf(VERBS);
  const target = randomOf(COLORS);
  // In champion/master/challenge levels (levelIndex >= 10), pick distractors from same color family
  const family = COLORS.filter((c) => c.family === target.family && c !== target);
  const base = levelIndex >= 10 && family.length >= 3 ? family : COLORS;
  const others = pickOthers(base, target, 3);
  const options: GameOption[] = shuffle([
    { key: target.name, correct: true, color: target.hex },
    ...others.map((o) => ({ key: o.name, correct: false, color: o.hex })),
  ]);
  const HI_VERB_MAP: Record<string, string> = { Find: "ढूँढो", Tap: "दबाओ", Touch: "छुओ" };
  const hiVerb = HI_VERB_MAP[verb] ?? "ढूँढो";
  return {
    id: nextId(),
    prompt: `${verb} the ${target.name} color`,
    speak: `${verb} the ${target.name} color`,
    hint: levelIndex < 10 ? `Look for the ${target.name.toLowerCase()} color!` : `Find ${target.name}`,
    promptHi: `${target.hi} रंग ${hiVerb}`,
    speakHi: `${target.hi} रंग ${hiVerb}`,
    hintHi: levelIndex < 10 ? `${target.hi} रंग वाला ढूँढो!` : `${target.hi} रंग चुनो`,
    options,
  };
}

function abcQuestion(objects: number, levelIndex: number, questionIndex: number): Question {
  // In warmup (0-4), prioritize letters A to H
  const pool = levelIndex < 5 ? ALPHABET.slice(0, 8) : levelIndex < 10 ? ALPHABET.slice(0, 16) : ALPHABET;
  const target = randomOf(pool);
  const others = pickOthers(pool, target, 3);
  const verb = randomOf(VERBS);
  
  const useEmoji = (levelIndex + questionIndex) % 2 === 1;
  if (useEmoji) {
    const options: GameOption[] = shuffle([
      { key: target.letter, correct: true, emoji: target.emoji },
      ...others.map((o) => ({ key: o.letter, correct: false, emoji: o.emoji })),
    ]);
    return {
      id: nextId(),
      prompt: `${verb} the ${target.word} ${target.emoji}`,
      speak: `${verb} the ${target.word}. ${target.letter} for ${target.word}`,
      hint: `${target.letter} is for ${target.word}`,
      promptHi: `${target.hi} ${target.emoji} ढूँढो`,
      speakHi: `${target.hi} ढूँढो। ${target.letter} से ${target.hi}`,
      hintHi: `${target.letter} से ${target.hi}`,
      options,
    };
  }

  const options: GameOption[] = shuffle([
    { key: target.letter, correct: true, text: target.letter },
    ...others.map((o) => ({ key: o.letter, correct: false, text: o.letter })),
  ]);
  return {
    id: nextId(),
    prompt: `${verb} the letter ${target.letter}`,
    speak: `${verb} the letter ${target.letter}. ${target.letter} for ${target.word}`,
    hint: `${target.letter} is for ${target.word} ${target.emoji}`,
    promptHi: `अक्षर ${target.letter} ढूँढो`,
    speakHi: `अक्षर ${target.letter} ढूँढो। ${target.letter} से ${target.hi}`,
    hintHi: `${target.letter} से ${target.hi} ${target.emoji}`,
    options,
  };
}

function numberQuestion(objects: number, levelIndex: number): Question {
  const max = Math.max(5, levelIndex < 5 ? 5 : levelIndex < 10 ? 10 : levelIndex < 16 ? 15 : 20);
  const kindPool = levelIndex < 4 ? (["find", "count"] as const) : (["find", "count", "more", "fewer"] as const);
  const kind = randomOf(kindPool);

  if (kind === "find") {
    const target = 1 + Math.floor(Math.random() * max);
    const pool = Array.from({ length: max }, (_, i) => i + 1);
    const others = pickOthers(pool, target, 3);
    return {
      id: nextId(),
      prompt: `Find the number ${target}`,
      speak: `Find the number ${target}`,
      hint: `${target} looks like this: ${target}`,
      promptHi: `संख्या ${target} ढूँढो`,
      speakHi: `संख्या ${target} ढूँढो`,
      hintHi: `${target} ऐसा दिखता है: ${target}`,
      options: shuffle([
        { key: `n${target}`, correct: true, text: String(target) },
        ...others.map((o) => ({ key: `n${o}`, correct: false, text: String(o) })),
      ]),
    };
  }

  const emoji = randomOf(COUNT_EMOJI);
  const maxCount = Math.max(5, levelIndex < 5 ? 5 : levelIndex < 10 ? 7 : 10);
  const counts = shuffle(Array.from({ length: maxCount }, (_, i) => i + 1)).slice(0, 4);

  if (kind === "count") {
    const target = randomOf(counts);
    return {
      id: nextId(),
      prompt: `Tap ${target} ${emoji}`,
      speak: `Tap the group with ${target}`,
      hint: `Count them one by one: 1, 2, 3...`,
      promptHi: `${target} ${emoji} दबाओ`,
      speakHi: `जिसमें ${target} हैं उसे दबाओ`,
      hintHi: `एक-एक करके गिनो: एक, दो, तीन...`,
      options: shuffle(
        counts.map((c) => ({
          key: `c${c}`,
          correct: c === target,
          groupEmoji: emoji,
          groupCount: c,
        })),
      ),
    };
  }

  const more = kind === "more";
  const best = more ? Math.max(...counts) : Math.min(...counts);
  return {
    id: nextId(),
    prompt: more ? "Which has MORE?" : "Which has FEWER?",
    speak: more ? "Which group has more?" : "Which group has fewer?",
    hint: more ? "The biggest group wins!" : "Look for the smallest group",
    promptHi: more ? "किसमें ज़्यादा हैं?" : "किसमें कम हैं?",
    speakHi: more ? "किस समूह में ज़्यादा हैं?" : "किस समूह में कम हैं?",
    hintHi: more ? "सबसे बड़ा समूह चुनो!" : "सबसे छोटा समूह ढूँढो",
    options: shuffle(
      counts.map((c) => ({
        key: `c${c}`,
        correct: c === best,
        groupEmoji: emoji,
        groupCount: c,
      })),
    ),
  };
}

function shapeQuestion(objects: number, levelIndex: number): Question {
  // In early levels (0-4), start with Circle, Square, Triangle, Rectangle (4 shapes)
  const activeShapes = levelIndex < 5 ? SHAPES.slice(0, 4) : levelIndex < 10 ? SHAPES.slice(0, 6) : SHAPES;
  const target = randomOf(activeShapes);
  const others = pickOthers(activeShapes, target, 3);
  const colors = shuffle(SHAPE_COLORS);
  const options: GameOption[] = shuffle(
    [target, ...others].map((s, i) => ({
      key: s.name,
      correct: s === target,
      shape: s.shape,
      shapeColor: colors[i % colors.length] ?? "#3b82f6",
    })),
  );
  return {
    id: nextId(),
    prompt: `Find the ${target.name.toUpperCase()}`,
    speak: `Find the ${target.name}`,
    hint: levelIndex < 10 ? `Look for the ${target.name.toLowerCase()} shape` : `Find ${target.name}`,
    promptHi: `${target.hi} ढूँढो`,
    speakHi: `${target.hi} आकार ढूँढो`,
    hintHi: levelIndex < 10 ? `${target.hi} आकार वाला ढूँढो` : `${target.hi} ढूँढो`,
    options,
  };
}

const VERBS = ["Find", "Tap", "Touch"];

export function buildRound(categoryId: string, levelIndex: number): Question[] {
  const category = getCategory(categoryId);
  if (!category) return [];
  const level = category.levels[Math.min(levelIndex, category.levels.length - 1)]!;
  const questions: Question[] = [];
  const usedPrompts = new Set<string>();
  let attempts = 0;
  const maxAttempts = level.questions * 5; // safety limit

  while (questions.length < level.questions && attempts < maxAttempts) {
    attempts++;
    let q: Question;
    switch (categoryId) {
      case "colors":
        q = colorQuestion(level.objects, levelIndex);
        break;
      case "abc":
        q = abcQuestion(level.objects, levelIndex, questions.length);
        break;
      case "numbers":
        q = numberQuestion(level.objects, levelIndex);
        break;
      case "animals":
        q = emojiQuestion(ANIMALS, level.objects, levelIndex, randomOf(VERBS));
        break;
      case "fruits":
        q = emojiQuestion(FRUITS, level.objects, levelIndex, randomOf(VERBS));
        break;
      case "vehicles":
        q = emojiQuestion(VEHICLES, level.objects, levelIndex, randomOf(VERBS));
        break;
      case "birds":
        q = emojiQuestion(BIRDS, level.objects, levelIndex, randomOf(VERBS));
        break;
      case "body":
        q = emojiQuestion(BODY, level.objects, levelIndex, randomOf(VERBS));
        break;
      case "shapes":
        q = shapeQuestion(level.objects, levelIndex);
        break;
      default:
        return questions;
    }
    // Prevent duplicate questions within same round
    if (usedPrompts.has(q.prompt)) continue;
    usedPrompts.add(q.prompt);
    questions.push(q);
  }
  // Final shuffle for randomized order every time
  return shuffle(questions);
}

/** Emoji deck used by the matching game. */
export function buildMatchingDeck(cards: number): string[] {
  const pool = shuffle([
    ...new Set([
      ...ANIMALS.map((a) => a.emoji),
      ...FRUITS.map((f) => f.emoji),
      ...VEHICLES.map((v) => v.emoji),
      ...BIRDS.map((b) => b.emoji),
    ]),
  ]);
  const pairsNeeded = Math.floor(cards / 2);
  const picks = pool.slice(0, pairsNeeded);
  return shuffle([...picks, ...picks]);
}
