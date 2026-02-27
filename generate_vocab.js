const fs = require('fs');

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// We want ~500 for each level. By previous count we need:
// B2: 200 more, C1: 350 more, C2: 350 more
const targets = [
    { level: 'B2', totalFramesNeeded: 4 }, // 4 * 50 = 200
    { level: 'C1', totalFramesNeeded: 7 }, // 7 * 50 = 350
    { level: 'C2', totalFramesNeeded: 7 }  // 7 * 50 = 350
];
const WORDS_PER_BATCH = 50;

async function fetchWords(level) {
    const prompt = `Generate a strict JSON array of exactly ${WORDS_PER_BATCH} unique, advanced medical/healthcare Dutch vocabulary words for CEFR level ${level}. 
Focus on complex clinical terms, medical procedures, equipment, diseases, anatomy, and professional healthcare communication.
Format EACH object EXACTLY like this:
{
  "dutch": "Word in Dutch",
  "english": "English translation",
  "level": "${level}",
  "category": "Choose one: Symptoms, Procedures, Equipment, Anatomy, Diseases, Professional, Medication",
  "explanation": "Clear medical English explanation of what it is.",
  "example": "A professional medical Dutch sentence using the word."
}
Return ONLY the raw JSON array, with NO markdown formatting, NO \`\`\`json, and NO backticks.`;

    try {
        const res = await fetch(`${MODEL_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await res.json();
        let text = data.candidates[0].content.parts[0].text;

        // clean any potential accidental markdown 
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (err) {
        console.error(`Failed to fetch ${level}:`, err.message);
        return [];
    }
}

async function run() {
    let newWords = [];
    for (const target of targets) {
        for (let i = 0; i < target.totalFramesNeeded; i++) {
            console.log(`Generating batch ${i + 1}/${target.totalFramesNeeded} for ${target.level}...`);
            const words = await fetchWords(target.level);
            newWords = newWords.concat(words);
        }
    }

    // Read the current data.js
    let dataFile = fs.readFileSync('scripts/data.js', 'utf8');

    // We want to insert the new words before the closing bracket of the medicalVocab array
    const stringified = newWords.map(w => JSON.stringify(w, null, 4)).join(",\n    ") + ",\n";

    const insertionPoint = dataFile.lastIndexOf('];');
    if (insertionPoint !== -1) {
        const updated = dataFile.slice(0, insertionPoint) + "    ,\n    " + stringified + dataFile.slice(insertionPoint);
        fs.writeFileSync('scripts/data.js', updated);
        console.log(`Successfully added ${newWords.length} new medical words to data.js!`);
    }
}

run();
