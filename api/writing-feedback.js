// Vercel Serverless Function — /api/writing-feedback
// AI-powered Dutch writing evaluation for A2 learners using Gemini.

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `Je bent een strenge maar vriendelijke Nederlandse taalcoach. Je beoordeelt schrijfopdrachten van A2-leerlingen.

JOUW TAAK:
Beoordeel het antwoord van de leerling op deze punten:
1. Heeft de leerling alle punten uit de opdracht beantwoord? (Controleer elk bullet point.)
2. Is het taalniveau geschikt voor A2? Te moeilijke woorden of zinnen moeten simpeler.
3. Zijn er spelfouten?
4. Zijn er grammaticafouten?
5. Wat is goed aan het antwoord? (positief!)
6. Wat kan beter?

BELANGRIJK:
- Antwoord ALLEEN met een geldig JSON-object. Geen markdown, geen uitleg buiten de JSON.
- Wees bemoedigend maar eerlijk.
- Geef concrete suggesties voor verbetering.

Het JSON-formaat MOET exact zo zijn:
{
  "bulletCoverage": [
    { "bullet": "tekst van het bullet point", "covered": true/false, "comment": "korte opmerking" }
  ],
  "levelAssessment": "A2-geschikt / te moeilijk / te simpel",
  "spellingErrors": [
    { "word": "fout woord", "suggestion": "correctie", "comment": "uitleg" }
  ],
  "grammarErrors": [
    { "error": "foute zin of woordgroep", "suggestion": "correctie", "comment": "uitleg" }
  ],
  "strengths": "Wat de leerling goed heeft gedaan (1-2 zinnen)",
  "improvements": "Wat de leerling kan verbeteren (1-2 zinnen)",
  "overallScore": 1-10,
  "correctedAnswer": "Het volledige gecorrigeerde antwoord op A2-niveau"
}`;

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server.' });

    const { userAnswer, prompt, bullets, example } = req.body || {};
    if (!userAnswer || !prompt) {
        return res.status(400).json({ error: 'Missing userAnswer or prompt.' });
    }

    const bulletList = (bullets || []).map((b, i) => `${i + 1}. ${b}`).join('\n');

    const userMessage = `OPDRACHT:
${prompt}

${bullets ? `Punten om te beantwoorden:\n${bulletList}\n` : ''}

VOORBEELD ANTWOORD (A2-niveau):
${example || 'Geen voorbeeld beschikbaar.'}

ANTWOORD VAN DE LEERLING:
${userAnswer}

Beoordeel het antwoord en geef ALLEEN het JSON-object terug.`;

    try {
        const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: [{ role: 'user', parts: [{ text: userMessage }] }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 1500, topP: 0.95 }
            })
        });

        const data = await geminiRes.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Strip markdown code fences if present
        let jsonStr = rawText.trim();
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
        }

        const feedback = JSON.parse(jsonStr);
        return res.status(200).json(feedback);
    } catch (err) {
        return res.status(500).json({ error: 'AI feedback generation failed: ' + err.message });
    }
};
