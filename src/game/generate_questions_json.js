import fs from "fs";
import path from "path";

// Copy-paste data pools from content.ts to generate the exact database
const COLORS = [
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
];

const ALPHABET = [
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
];

const ANIMALS = [
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
];

const BIRDS = [
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
];

const BODY = [
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
];

const FRUITS = [
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
];

const VEHICLES = [
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
];

const SHAPES = [
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

function shuffle(list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickOthers(pool, exclude, count) {
  return shuffle(pool.filter((p) => p !== exclude)).slice(0, count);
}

// Generate directory
const outDir = path.join(process.cwd(), "src", "game", "questions");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// --- 1. Colors ---
const colorsQuestions = COLORS.map((color, index) => {
  const others = pickOthers(COLORS, color, 3);
  const options = shuffle([
    { key: color.name, correct: true, color: color.hex },
    ...others.map((o) => ({ key: o.name, correct: false, color: o.hex })),
  ]);
  return {
    id: `colors-${index + 1}`,
    category: "colors",
    english: `Find the ${color.name} color`,
    hindi: `${color.hi} रंग ढूँढो`,
    voiceEnglish: `Find the ${color.name} color`,
    voiceHindi: `${color.hi} रंग ढूँढो`,
    answer: color.name,
    options,
  };
});
fs.writeFileSync(path.join(outDir, "colors.json"), JSON.stringify(colorsQuestions, null, 2));

// --- 2. ABC ---
const abcQuestions = [];
ALPHABET.forEach((letter, index) => {
  const others = pickOthers(ALPHABET, letter, 3);
  
  // Word question
  const wordOptions = shuffle([
    { key: letter.letter, correct: true, emoji: letter.emoji },
    ...others.map((o) => ({ key: o.letter, correct: false, emoji: o.emoji })),
  ]);
  abcQuestions.push({
    id: `abc-word-${index + 1}`,
    category: "abc",
    english: `Find the ${letter.word} ${letter.emoji}`,
    hindi: `${letter.hi} ${letter.emoji} ढूँढो`,
    voiceEnglish: `Find the ${letter.word}. ${letter.letter} for ${letter.word}`,
    voiceHindi: `${letter.hi} ढूँढो। ${letter.letter} से ${letter.hi}`,
    answer: letter.letter,
    options: wordOptions,
  });

  // Letter question
  const letterOptions = shuffle([
    { key: letter.letter, correct: true, text: letter.letter },
    ...others.map((o) => ({ key: o.letter, correct: false, text: o.letter })),
  ]);
  abcQuestions.push({
    id: `abc-letter-${index + 1}`,
    category: "abc",
    english: `Find the letter ${letter.letter}`,
    hindi: `अक्षर ${letter.letter} ढूँढो`,
    voiceEnglish: `Find the letter ${letter.letter}. ${letter.letter} for ${letter.word}`,
    voiceHindi: `अक्षर ${letter.letter} ढूँढो। ${letter.letter} से ${letter.hi}`,
    answer: letter.letter,
    options: letterOptions,
  });
});
fs.writeFileSync(path.join(outDir, "abc.json"), JSON.stringify(abcQuestions, null, 2));

// --- 3. Numbers ---
const numbersQuestions = [];
// Find numbers 1 to 20
for (let n = 1; n <= 20; n++) {
  const allNums = Array.from({ length: 20 }, (_, i) => i + 1);
  const others = pickOthers(allNums, n, 3);
  const options = shuffle([
    { key: String(n), correct: true, text: String(n) },
    ...others.map((o) => ({ key: String(o), correct: false, text: String(o) })),
  ]);
  numbersQuestions.push({
    id: `numbers-find-${n}`,
    category: "numbers",
    english: `Find the number ${n}`,
    hindi: `संख्या ${n} ढूँढो`,
    voiceEnglish: `Find the number ${n}`,
    voiceHindi: `संख्या ${n} ढूँढो`,
    answer: String(n),
    options,
  });
}
// Count emoji 1 to 10
for (let n = 1; n <= 10; n++) {
  const emoji = COUNT_EMOJI[n % COUNT_EMOJI.length];
  const allCounts = Array.from({ length: 10 }, (_, i) => i + 1);
  const others = pickOthers(allCounts, n, 3);
  const options = shuffle([
    { key: String(n), correct: true, groupEmoji: emoji, groupCount: n },
    ...others.map((o) => ({ key: String(o), correct: false, groupEmoji: emoji, groupCount: o })),
  ]);
  numbersQuestions.push({
    id: `numbers-count-${n}`,
    category: "numbers",
    english: `Count the items`,
    hindi: `वस्तुओं को गिनो`,
    voiceEnglish: `Count the items`,
    voiceHindi: `वस्तुओं को गिनो`,
    answer: String(n),
    options,
  });
}
fs.writeFileSync(path.join(outDir, "numbers.json"), JSON.stringify(numbersQuestions, null, 2));

// --- Helper for Emoji Categories ---
function generateEmojiQuestions(categoryName, pool) {
  return pool.map((item, index) => {
    const others = pickOthers(pool, item, 3);
    const options = shuffle([
      { key: item.name, correct: true, emoji: item.emoji },
      ...others.map((o) => ({ key: o.name, correct: false, emoji: o.emoji })),
    ]);
    const HI_TRANSLATIONS = {
      Dog: "कुत्ता", Cat: "बिल्ली", Lion: "शेर", Elephant: "हाथी", Tiger: "बाघ", Panda: "पांडा", Monkey: "बंदर",
      Rabbit: "खरगोश", Frog: "मेंढक", Cow: "गाय", Horse: "घोड़ा", Bear: "भालू", Pig: "सूअर", Sheep: "भेड़",
      Giraffe: "जिराफ़", Zebra: "ज़ेबरा", Camel: "ऊँट", Fish: "मछली", Parrot: "तोता", Peacock: "मोर", Owl: "उल्लू",
      Duck: "बत्तख", Hen: "मुर्गी", Eagle: "चील", Penguin: "पेंगुइन", Swan: "हंस", Dove: "कबूतर", Chick: "चूज़ा",
      Eye: "आँख", Ear: "कान", Nose: "नाक", Mouth: "मुँह", Hand: "हाथ", Foot: "पैर", Tooth: "दाँत", Tongue: "जीभ",
      Brain: "दिमाग़", Arm: "बाँह", Apple: "सेब", Banana: "केला", Orange: "संतरा", Grapes: "अंगूर", Watermelon: "तरबूज़",
      Strawberry: "स्ट्रॉबेरी", Mango: "आम", Pineapple: "अनानास", Cherry: "चेरी", Pear: "नाशपाती", Peach: "आड़ू",
      Coconut: "नारियल", Lemon: "नींबू", Kiwi: "कीवी", Car: "कार", Bus: "बस", Ambulance: "एम्बुलेंस", "Fire Truck": "दमकल",
      "Police Car": "पुलिस कार", Airplane: "हवाई जहाज़", Helicopter: "हेलीकॉप्टर", Train: "रेलगाड़ी", Ship: "जहाज़",
      Bicycle: "साइकिल", "Auto Rickshaw": "ऑटो", Scooter: "स्कूटर", Tractor: "ट्रैक्टर", Truck: "ट्रक", Rocket: "रॉकेट",
      Boat: "नाव"
    };
    const hiName = HI_TRANSLATIONS[item.name] || item.hi;
    return {
      id: `${categoryName}-${index + 1}`,
      category: categoryName,
      english: `Find the ${item.name} ${item.emoji}`,
      hindi: `${hiName} ${item.emoji} ढूँढो`,
      voiceEnglish: `Find the ${item.name}`,
      voiceHindi: `${hiName} ढूँढो`,
      answer: item.name,
      options,
    };
  });
}

fs.writeFileSync(path.join(outDir, "animals.json"), JSON.stringify(generateEmojiQuestions("animals", ANIMALS), null, 2));
fs.writeFileSync(path.join(outDir, "birds.json"), JSON.stringify(generateEmojiQuestions("birds", BIRDS), null, 2));
fs.writeFileSync(path.join(outDir, "body.json"), JSON.stringify(generateEmojiQuestions("body", BODY), null, 2));
fs.writeFileSync(path.join(outDir, "fruits.json"), JSON.stringify(generateEmojiQuestions("fruits", FRUITS), null, 2));
fs.writeFileSync(path.join(outDir, "vehicles.json"), JSON.stringify(generateEmojiQuestions("vehicles", VEHICLES), null, 2));

// --- 9. Shapes ---
const shapesQuestions = SHAPES.map((shape, index) => {
  const others = pickOthers(SHAPES, shape, 3);
  const colors = shuffle(SHAPE_COLORS);
  const options = shuffle(
    [shape, ...others].map((s, i) => ({
      key: s.name,
      correct: s === shape,
      shape: s.shape,
      shapeColor: colors[i],
    })),
  );
  return {
    id: `shapes-${index + 1}`,
    category: "shapes",
    english: `Find the ${shape.name}`,
    hindi: `${shape.hi} आकार ढूँढो`,
    voiceEnglish: `Find the ${shape.name}`,
    voiceHindi: `${shape.hi} आकार ढूँढो`,
    answer: shape.name,
    options,
  };
});
fs.writeFileSync(path.join(outDir, "shapes.json"), JSON.stringify(shapesQuestions, null, 2));

console.log("All JSON question files generated successfully!");
