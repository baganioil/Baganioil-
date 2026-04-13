const OIL_KEYWORDS = [
  'oil', 'petroleum', 'petron', 'shell', 'caltex', 'seaoil', 'jetti', 'phoenix',
  'fuel', 'gasoline', 'diesel', 'lubricant', 'crude', 'kerosene', 'lng', 'lpg',
  'department of energy', 'doe energy', 'fuel price', 'oil price', 'pump price'
];

const SOURCES = [
  { url: 'https://data.gmanews.tv/gno/rss/news/feed.xml', source: 'GMA News' },
  { url: 'https://www.philstar.com/rss/headlines', source: 'Philstar' },
  { url: 'https://www.philstar.com/rss/business', source: 'Philstar Business' }
];

function stripHtml(input) {
  return (input || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractTag(block, tag) {
  const cdata = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'));
  if (cdata) return cdata[1].trim();

  const normal = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return normal ? normal[1].trim() : '';
}

function extractImageFromBlock(block, descriptionRaw) {
  var match;

  // Common RSS image tags that keep URL in attributes.
  match = block.match(/<media:content[^>]+url=["']([^"']+)["'][^>]*>/i);
  if (match) return match[1];

  match = block.match(/<media:thumbnail[^>]+url=["']([^"']+)["'][^>]*>/i);
  if (match) return match[1];

  match = block.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image\//i);
  if (match) return match[1];

  // Fallback to embedded image inside description HTML.
  match = (descriptionRaw || '').match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match) return match[1];

  return '';
}

function parseRssItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = stripHtml(extractTag(block, 'title'));
    const link = stripHtml(extractTag(block, 'link'));
    const guid = stripHtml(extractTag(block, 'guid'));
    const descriptionRaw = extractTag(block, 'description');
    const pubDate = stripHtml(extractTag(block, 'pubDate') || extractTag(block, 'dc:date'));

    const description = stripHtml(descriptionRaw);
    const image = extractImageFromBlock(block, descriptionRaw);
    const url = link || (guid.startsWith('http') ? guid : '');

    if (url && title) {
      items.push({ title, url, description, image, pubDate });
    }
  }

  return items;
}

function isOilRelated(item) {
  const text = `${item.title} ${item.description}`.toLowerCase();
  return OIL_KEYWORDS.some((kw) => text.includes(kw));
}

async function fetchWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'BaganiOil-NewsBot/1.0' },
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

exports.handler = async function handler() {
  const all = [];

  for (const source of SOURCES) {
    const xml = await fetchWithTimeout(source.url);
    if (!xml) continue;

    const parsed = parseRssItems(xml)
      .filter(isOilRelated)
      .map((item) => ({
        slug: null,
        title: item.title,
        date: item.pubDate ? new Date(item.pubDate).toISOString() : null,
        image: item.image || null,
        excerpt: (item.description || '').slice(0, 220),
        tags: ['Oil & Gas'],
        isExternal: true,
        url: item.url,
        source: source.source,
      }));

    all.push(...parsed);
  }

  all.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const seen = new Set();
  const deduped = all.filter((item) => {
    const key = `${item.title}|${item.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 24);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=7200, stale-while-revalidate=86400'
    },
    body: JSON.stringify({
      refreshedAt: new Date().toISOString(),
      count: deduped.length,
      items: deduped,
    }),
  };
};
