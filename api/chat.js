// Vercel Serverless Function — /api/chat (CommonJS)
// API key lives ONLY in Vercel environment variables — never in client code.

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `Je bent een realistische, menselijke Nederlandse taalcoach en conversatiepartner voor medische professionals.

CRUCIALE REGELS VOOR JE ANTWOORDEN:
1. BEN EXTREEM KORT EN BONDIG (1 tot maximaal 2 korte zinnen). MENSEN SPREKEN NIET IN LANGE PARAGRAFEN.
2. Gebruik NOOIT opsommingen of bullet points.
3. Klink als een mens in een echt gesprek: spontaan, informeel en vriendelijk.
4. ZORG VOOR INTERACTIE: Stel vrijwel altijd een korte wedervraag aan het einde van je antwoord om de conversatie gaande te houden (small talk, medische situaties, of simpele dagelijkse dingen).
5. Zet bij echt moeilijke medische woorden de Engelse vertaling in haakjes: bijv. "koorts (fever)".

Je tone: natuurlijk, warm, vlot, en menselijk (CEFR A2-B2).`;

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server.' });

    const { messages } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid body. Expected { messages: [] }' });
    }

    try {
        const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: messages,
                generationConfig: { temperature: 0.75, maxOutputTokens: 600, topP: 0.95 }
            })
        });

        const data = await geminiRes.json();
        return res.status(geminiRes.status).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
