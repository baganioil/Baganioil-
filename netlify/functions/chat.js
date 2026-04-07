// Netlify serverless function — Bagani AI chatbot
// Uses Google Gemini 1.5 Flash (FREE tier via ai.google.dev)
// Set env var GEMINI_API_KEY in Netlify dashboard → Environment variables

const SYSTEM_PROMPT = `You are Bagani AI, the helpful assistant for Bagani Oil — a premium Filipino lubricants brand made in the Philippines.

Your job:
- Answer questions about Bagani Oil products, usage, and compatibility
- Help customers pick the right oil for their motorcycle or vehicle
- Share info about dealers, availability, and where to buy
- Answer general lubricant/engine oil questions

Bagani Oil product lines:
- GOLD LINE (premium performance): Bagani Gold 4T 10W-40, Bagani Gold 4T 20W-50, Bagani Gold 2T
- SILVER LINE (everyday value): Bagani Silver 4T 10W-40, Bagani Silver 4T 20W-50
- GEAR OIL: Bagani Gear 90, Bagani Gear 140
- HYDRAULIC: Bagani Hydraulic 46, Bagani Hydraulic 68
- SPECIALTY: Bagani ATF Dexron III, Bagani Brake Fluid DOT 3, Bagani White Grease

Rules:
- Be friendly, short, and helpful. Use a warm Filipino-friendly tone.
- If asked about pricing, say prices vary by dealer and recommend checking with a local store.
- NEVER make up product specs you are unsure about.
- If the customer needs personalized help, pricing, bulk orders, complaints, or wants to talk to a real person — end your reply with exactly: SUGGEST_MESSENGER
- Do not include SUGGEST_MESSENGER unless genuinely needed.
- Keep replies to 2–4 sentences maximum.`;

exports.handler = async function (event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  let userMessage;
  try {
    const body = JSON.parse(event.body || '{}');
    userMessage = (body.message || '').trim().slice(0, 500);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request' }) };
  }

  if (!userMessage) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Empty message' }) };
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\nUser: ' + userMessage }] }
        ],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7
        }
      })
    });

    const rawText = await response.text();

    if (!response.ok) {
      console.error('Gemini error:', response.status, rawText);
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'AI service unavailable', detail: rawText }) };
    }

    const data = JSON.parse(rawText);
    let reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const suggestMessenger = reply.includes('SUGGEST_MESSENGER');
    reply = reply.replace(/SUGGEST_MESSENGER\n?/g, '').trim();

    if (!reply) {
      return { statusCode: 200, headers, body: JSON.stringify({ reply: "Sorry, I couldn't generate a response. Please try again.", suggestMessenger: false }) };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply, suggestMessenger })
    };
  } catch (err) {
    console.error('Function error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error', detail: err.message }) };
  }
};
