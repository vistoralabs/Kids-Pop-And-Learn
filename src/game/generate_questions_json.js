import fs from "fs";
import path from "path";

// Color pools with the user's requested standard translation
const COLORS = [
  { name: "Red", hi: "लाल" },
  { name: "Pink", hi: "गुलाबी" },
  { name: "Orange", hi: "संतरा" }, // Standardized color orange as संतरा everywhere
  { name: "Yellow", hi: "पीला" },
  { name: "Green", hi: "हरा" },
  { name: "Blue", hi: "नीला" },
  { name: "Purple", hi: "बैंगनी" },
  { name: "Brown", hi: "भूरा" },
  { name: "Black", hi: "काला" },
  { name: "White", hi: "सफ़ेद" },
];

const ALPHABET = [
  { letter: "A", word: "Apple", hi: "सेब" },
  { letter: "B", word: "Ball", hi: "गेंद" },
  { letter: "C", word: "Cat", hi: "बिल्ली" },
  { letter: "D", word: "Dog", hi: "कुत्ता" },
  { letter: "E", word: "Elephant", hi: "हाथी" },
  { letter: "F", word: "Fish", hi: "मछली" },
  { letter: "G", word: "Grapes", hi: "अंगूर" },
  { letter: "H", word: "Hat", hi: "टोपी" },
  { letter: "I", word: "Ice cream", hi: "आइसक्रीम" },
  { letter: "J", word: "Jug", hi: "जग" },
  { letter: "K", word: "Kite", hi: "पतंग" },
  { letter: "L", word: "Lion", hi: "शेर" },
  { letter: "M", word: "Moon", hi: "चाँद" },
  { letter: "N", word: "Nest", hi: "घोंसला" },
  { letter: "O", word: "Orange", hi: "संतरा" },
  { letter: "P", word: "Panda", hi: "पांडा" },
  { letter: "Q", word: "Queen", hi: "रानी" },
  { letter: "R", word: "Rabbit", hi: "खरगोश" },
  { letter: "S", word: "Sun", hi: "सूरज" },
  { letter: "T", word: "Train", hi: "रेलगाड़ी" },
  { letter: "U", word: "Umbrella", hi: "छतरी" },
  { letter: "V", word: "Van", hi: "वैन" },
  { letter: "W", word: "Watermelon", hi: "तरबूज़" },
  { letter: "X", word: "Xylophone", hi: "बाजा" },
  { letter: "Y", word: "Yo-yo", hi: "यो-यो" },
  { letter: "Z", word: "Zebra", hi: "ज़ेबरा" },
];

const ANIMALS = [
  { name: "Dog", hi: "कुत्ता" },
  { name: "Cat", hi: "बिल्ली" },
  { name: "Lion", hi: "शेर" },
  { name: "Elephant", hi: "हाथी" },
  { name: "Tiger", hi: "बाघ" },
  { name: "Panda", hi: "पांडा" },
  { name: "Monkey", hi: "बंदर" },
  { name: "Rabbit", hi: "खरगोश" },
  { name: "Frog", hi: "मेंढक" },
  { name: "Cow", hi: "गाय" },
  { name: "Horse", hi: "घोड़ा" },
  { name: "Bear", hi: "भालू" },
  { name: "Pig", hi: "सूअर" },
  { name: "Sheep", hi: "भेड़" },
  { name: "Giraffe", hi: "जिराफ़" },
  { name: "Zebra", hi: "ज़ेबरा" },
  { name: "Camel", hi: "ऊँट" },
  { name: "Fish", hi: "मछली" },
];

const BIRDS = [
  { name: "Parrot", hi: "तोता" },
  { name: "Peacock", hi: "मोर" },
  { name: "Owl", hi: "उल्लू" },
  { name: "Duck", hi: "बत्तख" },
  { name: "Hen", hi: "मुर्गी" },
  { name: "Eagle", hi: "ईगल" }, // Hindi: ईगल
  { name: "Penguin", hi: "पेंगुइन" },
  { name: "Swan", hi: "हंस" },
  { name: "Dove", hi: "कबूतर" },
  { name: "Chick", hi: "चूज़ा" },
];

const BODY = [
  { name: "Eye", hi: "आँख" },
  { name: "Ear", hi: "कान" },
  { name: "Nose", hi: "नाक" },
  { name: "Mouth", hi: "मुँह" },
  { name: "Hand", hi: "हाथ" },
  { name: "Foot", hi: "पैर" },
  { name: "Tooth", hi: "दाँत" },
  { name: "Tongue", hi: "जीभ" },
  { name: "Brain", hi: "दिमाग़" },
  { name: "Arm", hi: "बाँह" },
];

const FRUITS = [
  { name: "Apple", hi: "सेब" },
  { name: "Banana", hi: "केला" },
  { name: "Orange", hi: "संतरा" },
  { name: "Grapes", hi: "अंगूर" },
  { name: "Watermelon", hi: "तरबूज़" },
  { name: "Strawberry", hi: "स्ट्रॉबेरी" },
  { name: "Mango", hi: "आम" },
  { name: "Pineapple", hi: "अनानास" },
  { name: "Cherry", hi: "चेरी" },
  { name: "Pear", hi: "नाशपाती" },
  { name: "Peach", hi: "आड़ू" },
  { name: "Coconut", hi: "nariyal" },
  { name: "Lemon", hi: "नींबू" },
  { name: "Kiwi", hi: "कीवी" },
];

const VEHICLES = [
  { name: "Car", hi: "कार" },
  { name: "Bus", hi: "बस" },
  { name: "Ambulance", hi: "एम्बुलेंस" },
  { name: "Fire Engine", hi: "दमकल" },
  { name: "Police Car", hi: "पुलिस कार" },
  { name: "Airplane", hi: "हवाई जहाज़" },
  { name: "Helicopter", hi: "हेलीकॉप्टर" },
  { name: "Train", hi: "रेलगाड़ी" },
  { name: "Ship", hi: "जहाज़" },
  { name: "Bicycle", hi: "साइकिल" },
  { name: "Auto Rickshaw", hi: "ऑटो" },
  { name: "Scooter", hi: "स्कूटर" },
  { name: "Tractor", hi: "ट्रैक्टर" },
  { name: "Truck", hi: "ट्रक" },
  { name: "Rocket", hi: "रॉकेट" },
  { name: "Boat", hi: "नाव" },
];

const SHAPES = [
  { name: "Circle", hi: "गोल" },
  { name: "Square", hi: "वर्ग" },
  { name: "Triangle", hi: "त्रिभुज" },
  { name: "Rectangle", hi: "आयत" },
  { name: "Star", hi: "तारा" },
  { name: "Heart", hi: "दिल" },
  { name: "Oval", hi: "अंडाकार" },
  { name: "Diamond", hi: "हीरा" },
];

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

// Target folder
const outDir = path.join(process.cwd(), "src", "game", "questions");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// --- 1. Colors ---
const colorsQuestions = COLORS.map((color, index) => {
  const others = pickOthers(COLORS, color, 3);
  const options = shuffle([color.name, ...others.map(o => o.name)]);
  return {
    id: `color_${color.name.toLowerCase()}_${String(index + 1).padStart(3, "0")}`,
    category: "colors",
    english: `Find the ${color.name} color`,
    hindi: `${color.hi} रंग ढूँढो`,
    answer: color.name,
    options,
    voiceEnglish: `Find the ${color.name} color`,
    voiceHindi: `${color.hi} रंग ढूँढो`,
  };
});
fs.writeFileSync(path.join(outDir, "colors.json"), JSON.stringify(colorsQuestions, null, 2));

// --- 2. ABC ---
const abcQuestions = [];
ALPHABET.forEach((item, index) => {
  const others = pickOthers(ALPHABET, item, 3);
  
  // Word question
  const wordOptions = shuffle([item.letter, ...others.map(o => o.letter)]);
  abcQuestions.push({
    id: `abc_word_${item.letter.toLowerCase()}_${String(index + 1).padStart(3, "0")}`,
    category: "abc",
    english: `Find the ${item.word}`,
    hindi: `${item.hi} ढूँढो`,
    answer: item.letter,
    options: wordOptions,
    voiceEnglish: `Find the ${item.word}`,
    voiceHindi: `${item.hi} ढूँढो`,
  });

  // Letter question
  const letterOptions = shuffle([item.letter, ...others.map(o => o.letter)]);
  abcQuestions.push({
    id: `abc_letter_${item.letter.toLowerCase()}_${String(index + 1).padStart(3, "0")}`,
    category: "abc",
    english: `Find the letter ${item.letter}`,
    hindi: `अक्षर ${item.letter} ढूँढो`,
    answer: item.letter,
    options: letterOptions,
    voiceEnglish: `Find the letter ${item.letter}`,
    voiceHindi: `अक्षर ${item.letter} ढूँढो`,
  });
});
fs.writeFileSync(path.join(outDir, "abc.json"), JSON.stringify(abcQuestions, null, 2));

// --- 3. Numbers ---
const numbersQuestions = [];
// Find numbers 1 to 20
for (let n = 1; n <= 20; n++) {
  const allNums = Array.from({ length: 20 }, (_, i) => i + 1);
  const others = pickOthers(allNums, n, 3);
  const options = shuffle([String(n), ...others.map(o => String(o))]);
  numbersQuestions.push({
    id: `numbers_find_${String(n).padStart(3, "0")}`,
    category: "numbers",
    english: `Find the number ${n}`,
    hindi: `संख्या ${n} ढूँढो`,
    answer: String(n),
    options,
    voiceEnglish: `Find the number ${n}`,
    voiceHindi: `संख्या ${n} ढूँढो`,
  });
}
// Count numbers 1 to 10
for (let n = 1; n <= 10; n++) {
  const allCounts = Array.from({ length: 10 }, (_, i) => i + 1);
  const others = pickOthers(allCounts, n, 3);
  const options = shuffle([String(n), ...others.map(o => String(o))]);
  numbersQuestions.push({
    id: `numbers_count_${String(n).padStart(3, "0")}`,
    category: "numbers",
    english: `Count the items`,
    hindi: `वस्तुओं को गिनो`,
    answer: String(n),
    options,
    voiceEnglish: `Count the items`,
    voiceHindi: `वस्तुओं को गिनो`,
  });
}
fs.writeFileSync(path.join(outDir, "numbers.json"), JSON.stringify(numbersQuestions, null, 2));

// --- Helper for Emoji Categories ---
function generateEmojiQuestions(categoryName, pool) {
  return pool.map((item, index) => {
    const others = pickOthers(pool, item, 3);
    const options = shuffle([item.name, ...others.map(o => o.name)]);
    return {
      id: `${categoryName}_${item.name.toLowerCase().replace(/\s+/g, "_")}_${String(index + 1).padStart(3, "0")}`,
      category: categoryName,
      english: `Find the ${item.name}`,
      hindi: `${item.hi} ढूँढो`,
      answer: item.name,
      options,
      voiceEnglish: `Find the ${item.name}`,
      voiceHindi: `${item.hi} ढूँढो`,
    };
  });
}

fs.writeFileSync(path.join(outDir, "animals.json"), JSON.stringify(generateEmojiQuestions("animals", ANIMALS), null, 2));
fs.writeFileSync(path.join(outDir, "birds.json"), JSON.stringify(generateEmojiQuestions("birds", BIRDS), null, 2));
fs.writeFileSync(path.join(outDir, "body.json"), JSON.stringify(generateEmojiQuestions("body", BODY), null, 2));
fs.writeFileSync(path.join(outDir, "fruits.json"), JSON.stringify(generateEmojiQuestions("fruits", FRUITS), null, 2));
fs.writeFileSync(path.join(outDir, "vehicles.json"), JSON.stringify(generateEmojiQuestions("vehicles", VEHICLES), null, 2));

// --- Shapes ---
const shapesQuestions = SHAPES.map((shape, index) => {
  const others = pickOthers(SHAPES, shape, 3);
  const options = shuffle([shape.name, ...others.map(o => o.name)]);
  return {
    id: `shape_${shape.name.toLowerCase()}_${String(index + 1).padStart(3, "0")}`,
    category: "shapes",
    english: `Find the ${shape.name}`,
    hindi: `${shape.hi} आकार ढूँढो`,
    answer: shape.name,
    options,
    voiceEnglish: `Find the ${shape.name}`,
    voiceHindi: `${shape.hi} आकार ढूँढो`,
  };
});
fs.writeFileSync(path.join(outDir, "shapes.json"), JSON.stringify(shapesQuestions, null, 2));

// --- Generate public/api/ JSON structures ---
const apiDir = path.join(process.cwd(), "public", "api");
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

// 1. Write /api/questions.json (all questions bundled)
const allQuestionsBundled = {
  colors: colorsQuestions,
  abc: abcQuestions,
  numbers: numbersQuestions,
  animals: generateEmojiQuestions("animals", ANIMALS),
  birds: generateEmojiQuestions("birds", BIRDS),
  body: generateEmojiQuestions("body", BODY),
  fruits: generateEmojiQuestions("fruits", FRUITS),
  vehicles: generateEmojiQuestions("vehicles", VEHICLES),
  shapes: shapesQuestions,
};
fs.writeFileSync(path.join(apiDir, "questions.json"), JSON.stringify(allQuestionsBundled, null, 2));

// 2. Write /api/config.json
const configData = {
  rewardPopupDelay: 12000,
  ratingPopupDelay: 30000,
};
fs.writeFileSync(path.join(apiDir, "config.json"), JSON.stringify(configData, null, 2));

// 3. Write /api/popup.json
const popupData = {
  rewardPopup: {
    enabled: true,
    delay: 12000,
    title: "Amazing Rewards!",
    titleHi: "अद्भुत पुरस्कार! 🏆",
    desc: "Play all categories, win stars, and unlock badges!",
    descHi: "सभी श्रेणियों को खेलें, सितारे जीतें और बैज अनलॉक करें!",
    btnText: "Keep Playing",
    btnTextHi: "खेल जारी रखें"
  },
  ratingPopup: {
    enabled: true,
    delay: 30000
  }
};
fs.writeFileSync(path.join(apiDir, "popup.json"), JSON.stringify(popupData, null, 2));

// 4. Write /api/ads.json (Google AdMob test IDs)
const adsData = {
  enabled: true,
  testMode: true,
  interstitial: "ca-app-pub-3940256099942544/1033173712",
  rewarded: "ca-app-pub-3940256099942544/5224354917",
  banner: "ca-app-pub-3940256099942544/6300978111"
};
fs.writeFileSync(path.join(apiDir, "ads.json"), JSON.stringify(adsData, null, 2));

console.log("Database question JSON files and remote public/api files regenerated successfully!");

