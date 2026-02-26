// Vercel Serverless Function — /api/chat
// The Gemini API key is stored ONLY in Vercel's environment variables.
// It is never exposed to the browser or committed to GitHub.

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `Je bent een vriendelijke en geduldige Nederlandse taalcoach voor medische professionals.

Je taak:
- Communiceer ALTIJD primair in het Nederlands
- Geef bij elk antwoord nuttige Nederlandse medische uitdrukkingen, woorden of zinnen
- Geef de Engelse vertaling in haakjes achter moeilijke woorden, bijv. "De patiënt (patient) heeft koorts (fever)."
- Help met medische terminologie, dagelijkse communicatie in de zorg, en algemeen conversatievaardigheid
- Vereenvoudig complexe medische concepten
- Wees bemoedigend en positief
- Als de gebruiker Engels schrijft, beantwoord dan in het Nederlands én geef een Engelse vertaling
- Eindig elk antwoord met één oefenopgave of een interessant woord van de dag

Je tone: warm, professioneel, educatief. Gebruik A2–C2 CEFR niveau afhankelijk van de vraag.`;

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // CORS headers — restrict to your Vercel domain in production
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Server is not configured. GEMINI_API_KEY missing.' });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid request body. Expected { messages: [] }' });
    }

    try {
        const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: messages,
                generationConfig: {
                    temperature: 0.75,
                    maxOutputTokens: 600,
                    topP: 0.95
                }
            })
        });

        if (!geminiRes.ok) {
            const errBody = await geminiRes.json();
            return res.status(geminiRes.status).json({ error: errBody.error?.message || 'Gemini API error' });
        }

        const data = await geminiRes.json();
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
