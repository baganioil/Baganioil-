// Netlify serverless function — Bagani AI chatbot
// Uses Groq API with Llama 3.1 (FREE tier via console.groq.com)
// Set env var GROQ_API_KEY in Netlify dashboard → Environment variables

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

  if (event.httpMethod === 'GET') {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, service: 'bagani-chat' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
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

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const rawText = await response.text();

    if (!response.ok) {
      console.error('Groq error:', response.status, rawText);
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'AI service unavailable', detail: rawText }) };
    }

    const data = JSON.parse(rawText);
    let reply = data?.choices?.[0]?.message?.content || '';

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
