// app/api/fx-insights/route.js

export async function POST(request) {
  try {
    const { pair, price, change, weekly, monthly, signal, strength } = await request.json();

    if (!pair) {
      return Response.json({ error: "Currency pair is required" }, { status: 400 });
    }

    const prompt = `You are a professional forex & indices analyst specialising strictly in supply and demand trading.
Analyse ${pair} given:
Price: ${price} | Change: ${change} | Weekly: ${weekly} | Monthly: ${monthly} | Signal: ${signal} | Strength: ${strength}

Provide a concise analysis in JSON format with these EXACT keys (no extra text):
{
  "bias": "",
  "summary": "",
  "keyLevel": "",
  "setupType": "",
  "riskNote": "",
  "outlook": "",
  "supplyZones": [],
  "demandZones": [],
  "keyLevels": {},
  "tradeSetup": {}
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200,
          },
        }),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error("Gemini API error:", text);
      return Response.json(
        { error: "AI service error", details: text },
        { status: 500 }
      );
    }

    const data = JSON.parse(text);

    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    const clean = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      parsed = { raw: clean }; // fallback if JSON breaks
    }

    return Response.json(parsed);
  } catch (error) {
    console.error("FX Insights API error:", error);
    return Response.json(
      { error: "Failed to generate insights", details: error.message },
      { status: 500 }
    );
  }
}