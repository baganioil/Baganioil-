// Netlify serverless function — Bagani AI chatbot (RAG pipeline)
// Retrieves content from Sanity CMS, sends matched context to Groq, logs conversations.
// Required env vars: GROQ_API_KEY, SANITY_WRITE_TOKEN
// Already in netlify.toml: SANITY_PROJECT_ID, SANITY_DATASET

const {createClient} = require('@sanity/client');

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || 'c7mgn6k7';
const SANITY_DATASET   = process.env.SANITY_DATASET   || 'production';
const SANITY_WRITE_TOKEN = process.env.SANITY_WRITE_TOKEN || '';
const GROQ_API_KEY       = process.env.GROQ_API_KEY || '';

// Read-only Sanity client (CDN for speed)
const readClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset:   SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
});

// Write client for logging (only available if token is set)
const writeClient = SANITY_WRITE_TOKEN
  ? createClient({
      projectId: SANITY_PROJECT_ID,
      dataset:   SANITY_DATASET,
      apiVersion: '2024-01-01',
      useCdn: false,
      token: SANITY_WRITE_TOKEN,
    })
  : null;

// ── Keyword extraction ─────────────────────────────────────────────────────
const STOPWORDS = new Set([
  'a','an','the','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','can','able',
  'about','above','after','again','against','all','along','also','although',
  'among','and','any','anyone','anything','as','at','because','before','both',
  'but','by','each','else','every','few','for','from','get','give','he','her',
  'here','him','his','how','i','if','in','into','just','like','look','many',
  'me','more','most','much','my','no','not','now','of','off','on','only','or',
  'other','our','out','over','own','please','same','see','she','since','so',
  'some','still','take','than','that','their','them','then','there','these',
  'they','this','those','through','to','too','under','until','up','very','was',
  'way','we','well','were','what','when','where','which','while','who','why',
  'with','you','your','po','ang','ng','na','sa','mga','ba','ko','mo','hindi',
  'ito','iyan','yung','yun','ano','saan','paano','pwede','gusto',
]);

// Synonym expansion: user words → search tokens
const SYNONYMS = {
  scooter:       'scooter JASO MB',
  automatic:     'automatic ATF transmission',
  atf:           'ATF automatic transmission',
  gear:          'gear GL-4',
  diesel:        'diesel CI-4',
  gasoline:      'gasoline SL',
  petrol:        'gasoline SL',
  motorbike:     'motorcycle 4T',
  bike:          'motorcycle 4T',
  motor:         'motorcycle 4T',
  engine:        'engine oil',
  lubricant:     'oil lubricant',
  lubrication:   'oil lubricant',
  store:         'store location',
  dealer:        'dealer store location',
  reseller:      'dealer store',
  buy:           'store dealer location buy',
  purchase:      'store dealer buy',
  price:         'price dealer',
  contact:       'contact phone email',
  phone:         'phone contact',
  address:       'address location',
  amihan:        'Amihan motorcycle',
  laon:          'Laon diesel engine',
  aman:          'Aman gear',
  anitun:        'Anitun ATF transmission',
  hanan:         'Hanan gasoline',
  '2t':          '2T two-stroke',
  '4t':          '4T four-stroke',
  twostroke:     '2T two-stroke',
  fourstroke:    '4T four-stroke',
  manual:        'manual gear GL-4',
  transmission:  'transmission ATF gear',
};

function extractKeywords(text) {
  const lower = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const tokens = lower.split(/\s+/).filter(t => t.length > 1 && !STOPWORDS.has(t));
  const expanded = new Set(tokens);
  tokens.forEach(t => {
    if (SYNONYMS[t]) SYNONYMS[t].split(' ').forEach(s => expanded.add(s));
  });
  return Array.from(expanded).join(' ');
}

// ── Context formatter ──────────────────────────────────────────────────────
function formatContext(products, faqs, stores, articles, site) {
  let ctx = '';

  if (products.length) {
    ctx += '\nPRODUCTS:\n';
    products.forEach(p => {
      ctx += `- ${p.name} (${p.line || ''}) | ${p.spec || ''}\n`;
      if (p.shortDesc)       ctx += `  ${p.shortDesc}\n`;
      if (p.applicationText) ctx += `  For use: ${p.applicationText}\n`;
      if (p.approvalsText)   ctx += `  Standards: ${p.approvalsText}\n`;
      if (p.availableSizes && p.availableSizes.length)
        ctx += `  Sizes: ${p.availableSizes.join(', ')}\n`;
      if (p.faqs && p.faqs.length)
        p.faqs.forEach(f => { ctx += `  Q: ${f.q}\n  A: ${f.a}\n`; });
    });
  }

  if (faqs.length) {
    ctx += '\nFREQUENTLY ASKED QUESTIONS:\n';
    faqs.forEach(f => { ctx += `Q: ${f.question}\nA: ${f.answer}\n`; });
  }

  if (stores.length) {
    ctx += '\nSTORE LOCATIONS:\n';
    stores.forEach(s => {
      ctx += `- ${s.name}: ${s.address || ''}, ${s.city || ''} | Phone: ${s.phone || 'N/A'}\n`;
    });
  }

  if (articles.length) {
    ctx += '\nRECENT NEWS/ARTICLES:\n';
    articles.forEach(a => {
      ctx += `- ${a.title} (${a.category || 'News'}${a.date ? ', ' + a.date : ''}): ${a.excerpt || ''}\n`;
    });
  }

  if (site) {
    ctx += '\nCONTACT INFORMATION:\n';
    if (site.phone)   ctx += `Phone: ${site.phone}\n`;
    if (site.email)   ctx += `Email: ${site.email}\n`;
    if (site.address) ctx += `Address: ${site.address}\n`;
  }

  return ctx;
}

// ── Fire-and-forget chat log ───────────────────────────────────────────────
function saveChatLog(sessionId, userMessage, botReply, retrievedTypes, noContentFound, pageUrl) {
  if (!writeClient) return;
  writeClient.create({
    _type: 'chatLog',
    sessionId: sessionId || 'unknown',
    userMessage,
    botReply,
    retrievedTypes: retrievedTypes || [],
    noContentFound: !!noContentFound,
    pageUrl: pageUrl || '',
    timestamp: new Date().toISOString(),
  }).catch(e => console.warn('[Chat] Log write failed:', e.message));
}

// ── Handler ────────────────────────────────────────────────────────────────
exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod === 'GET')     return { statusCode: 200, headers, body: JSON.stringify({ ok: true, service: 'bagani-chat' }) };
  if (event.httpMethod !== 'POST')    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  if (!GROQ_API_KEY) return { statusCode: 500, headers, body: JSON.stringify({ error: 'AI service not configured' }) };

  let userMessage, sessionId, pageUrl;
  try {
    const body = JSON.parse(event.body || '{}');
    userMessage = (body.message || '').trim().slice(0, 500).replace(/<[^>]*>/g, '');
    sessionId   = (body.sessionId || '').trim().slice(0, 100);
    pageUrl     = (body.pageUrl   || '').trim().slice(0, 200);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request' }) };
  }

  if (!userMessage) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Empty message' }) };

  // Guard: message too short to be a real question
  if (userMessage.length < 3) {
    return { statusCode: 200, headers, body: JSON.stringify({ reply: 'Maaari mo bang i-type ang iyong buong tanong? (Please type your full question.)', suggestMessenger: false }) };
  }

  const OUT_OF_SCOPE = 'Sorry, your question is outside the information available on this website. You can reach us on Facebook or call us for more help.';

  // Greeting shortcut — no Sanity search needed
  const GREETINGS = ['hello','hi','hey','sup','good morning','good afternoon','good evening','kumusta','kamusta','musta','magandang','ola','helo','howdy'];
  const msgLower = userMessage.toLowerCase().trim();
  if (GREETINGS.some(g => msgLower === g || msgLower.startsWith(g + ' ') || msgLower.startsWith(g + '!'))) {
    const reply = "Hi! Welcome to Bagani Oil! I'm here to help you find the right oil for your vehicle, locate a store, or answer any questions about our products. What can I help you with?";
    saveChatLog(sessionId, userMessage, reply, [], false, pageUrl);
    return { statusCode: 200, headers, body: JSON.stringify({ reply, suggestMessenger: false }) };
  }

  const keywords = extractKeywords(userMessage);

  // ── 1. Retrieve relevant content from Sanity ───────────────────────────
  let products = [], faqs = [], stores = [], articles = [], site = null;

  try {
    [products, faqs, stores, articles, site] = await Promise.all([
      keywords.length > 0
        ? readClient.fetch(
            `*[_type == "product" && (
               name match $kw || line match $kw || spec match $kw ||
               shortDesc match $kw || description match $kw ||
               applicationText match $kw || approvalsText match $kw
             )][0..3]{name, line, spec, shortDesc, applicationText, approvalsText, availableSizes, "faqs": faqs[]{q,a}}`,
            {kw: keywords}
          ).catch(() => [])
        : [],
      keywords.length > 0
        ? readClient.fetch(
            `*[_type == "faq" && (question match $kw || answer match $kw)][0..3]{question, answer, category}`,
            {kw: keywords}
          ).catch(() => [])
        : [],
      keywords.length > 0
        ? readClient.fetch(
            `*[_type == "store" && (name match $kw || city match $kw || address match $kw)][0..5]{name, address, city, phone}`,
            {kw: keywords}
          ).catch(() => [])
        : [],
      keywords.length > 0
        ? readClient.fetch(
            `*[_type == "article" && (title match $kw || excerpt match $kw)][0..2]{title, date, category, excerpt}`,
            {kw: keywords}
          ).catch(() => [])
        : [],
      readClient.fetch(
        `*[_type == "siteSettings" && _id == "siteSettings"][0]{phone, email, address}`,
        {}
      ).catch(() => null),
    ]);
  } catch (e) {
    console.warn('[Chat] Sanity fetch error:', e.message);
  }

  let totalResults = products.length + faqs.length + stores.length + articles.length;

  // ── 2. Fallback: generic product/FAQ context when keywords matched nothing ─
  // This lets Groq answer general questions like "what is the best product?"
  if (totalResults === 0) {
    try {
      const [fallbackProducts, fallbackFaqs] = await Promise.all([
        readClient.fetch(
          `*[_type == "product"] | order(name asc) [0..3] {name, line, spec, shortDesc, applicationText, approvalsText, availableSizes, "faqs": faqs[]{q,a}}`,
          {}
        ).catch(() => []),
        readClient.fetch(
          `*[_type == "faq"] | order(order asc) [0..3] {question, answer}`,
          {}
        ).catch(() => []),
      ]);
      products = fallbackProducts;
      faqs = fallbackFaqs;
      totalResults = products.length + faqs.length;
    } catch (e) {
      console.warn('[Chat] Fallback fetch error:', e.message);
    }
  }

  const retrievedTypes = [
    ...(products.length  ? ['product'] : []),
    ...(faqs.length      ? ['faq']     : []),
    ...(stores.length    ? ['store']   : []),
    ...(articles.length  ? ['article'] : []),
  ];

  // Hard out-of-scope only when Sanity is completely empty or unreachable
  if (totalResults === 0 && !site) {
    saveChatLog(sessionId, userMessage, OUT_OF_SCOPE, [], true, pageUrl);
    return { statusCode: 200, headers, body: JSON.stringify({ reply: OUT_OF_SCOPE, suggestMessenger: false }) };
  }

  // ── 3. Build context + system prompt ──────────────────────────────────
  const context = formatContext(products, faqs, stores, articles, site);

  const SYSTEM_PROMPT =
`You are Bagani AI, the helpful assistant for Bagani Oil — a premium Filipino lubricants brand.

STRICT RULES:
1. You may ONLY answer using the CONTEXT PROVIDED BELOW. Do not use any outside knowledge.
2. If the context does not contain enough information to answer the question, respond EXACTLY with: "${OUT_OF_SCOPE}"
3. Never invent product names, specs, prices, or any details not in the context.
4. Be friendly and concise (2–4 sentences max). Use a warm Filipino-friendly tone.
5. If the user needs pricing, bulk orders, complaints, or wants to talk to a real person, end your reply with exactly: SUGGEST_MESSENGER

=== CONTEXT FROM BAGANI OIL WEBSITE ===${context}
=== END CONTEXT ===`;

  // ── 4. Call Groq API ───────────────────────────────────────────────────
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 300,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Chat] Groq error:', response.status, errText);
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'AI service unavailable' }) };
    }

    const data = await response.json();
    let reply = data?.choices?.[0]?.message?.content || '';

    const suggestMessenger = reply.includes('SUGGEST_MESSENGER');
    reply = reply.replace(/SUGGEST_MESSENGER\n?/g, '').trim();

    if (!reply) {
      return { statusCode: 200, headers, body: JSON.stringify({ reply: "Sorry, I couldn't generate a response. Please try again.", suggestMessenger: false }) };
    }

    // ── 5. Log conversation (fire-and-forget) ──────────────────────────
    saveChatLog(sessionId, userMessage, reply, retrievedTypes, false, pageUrl);

    return { statusCode: 200, headers, body: JSON.stringify({ reply, suggestMessenger }) };

  } catch (err) {
    console.error('[Chat] Function error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
  }
};
