const fs = require("fs");
const path = require("path");

// ── RSS helpers ────────────────────────────────────────────────────────────────
const OIL_KEYWORDS = [
	'oil', 'petroleum', 'petron', 'shell', 'caltex', 'seaoil', 'jetti', 'phoenix',
	'fuel', 'gasoline', 'diesel', 'lubricant', 'crude', 'kerosene', 'lng', 'lpg',
	'department of energy', 'doe energy', 'fuel price', 'oil price', 'pump price',
];

async function fetchRssText(url) {
	try {
		const res = await fetch(url, {
			headers: { 'User-Agent': 'BaganiOil-NewsBot/1.0' },
			signal: AbortSignal.timeout(8000),
		});
		if (!res.ok) return null;
		return await res.text();
	} catch (e) {
		console.warn('[RSS] Failed to fetch', url, ':', e.message);
		return null;
	}
}

function parseRssItems(xml) {
	const items = [];
	const itemRegex = /<item>([\s\S]*?)<\/item>/g;

	const extractImageFromBlock = (block, descriptionRaw) => {
		let m = block.match(/<media:content[^>]+url=["']([^"']+)["'][^>]*>/i);
		if (m) return m[1];

		m = block.match(/<media:thumbnail[^>]+url=["']([^"']+)["'][^>]*>/i);
		if (m) return m[1];

		m = block.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image\//i);
		if (m) return m[1];

		m = (descriptionRaw || '').match(/<img[^>]+src=["']([^"']+)["']/i);
		return m ? m[1] : '';
	};

	let match;
	while ((match = itemRegex.exec(xml)) !== null) {
		const block = match[1];

		const getText = (tag) => {
			const m =
				block.match(new RegExp('<' + tag + '[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/' + tag + '>')) ||
				block.match(new RegExp('<' + tag + '(?:\\s[^>]*)?>([\\s\\S]*?)<\\/' + tag + '>'));
			return m ? m[1].trim() : '';
		};

		const extractImg = (html) => {
			const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
			return m ? m[1] : '';
		};

		const rawLink = getText('link');
		const rawGuid = getText('guid');
		const url = rawLink || (rawGuid.startsWith('http') ? rawGuid : '');
		const rawDesc = getText('description');
		const image = extractImageFromBlock(block, rawDesc) || extractImg(rawDesc);
		const cleanDesc = rawDesc.replace(/<[^>]+>/g, '').trim();

		if (url) {
			items.push({
				title: getText('title'),
				url,
				description: cleanDesc,
				pubDate: getText('pubDate') || getText('dc:date'),
				image,
			});
		}
	}
	return items;
}

function isOilRelated(item) {
	const text = (item.title + ' ' + item.description).toLowerCase();
	return OIL_KEYWORDS.some((kw) => text.includes(kw));
}

// Sanity client — only created when SANITY_PROJECT_ID env var is set
function getSanityClient() {
	if (!process.env.SANITY_PROJECT_ID) return null;
	try {
		const {createClient} = require("@sanity/client");
		return createClient({
			projectId: process.env.SANITY_PROJECT_ID,
			dataset: process.env.SANITY_DATASET || "production",
			useCdn: true,
			apiVersion: "2024-01-01",
		});
	} catch (e) {
		console.warn("[Sanity] Client error:", e.message);
		return null;
	}
}

module.exports = function (eleventyConfig) {
	// Passthrough copy static assets
	eleventyConfig.addPassthroughCopy("src/css");
	eleventyConfig.addPassthroughCopy("src/js");
	eleventyConfig.addPassthroughCopy("src/images");
	eleventyConfig.addPassthroughCopy("src/videos");
	eleventyConfig.addPassthroughCopy("src/webfonts");
	eleventyConfig.addPassthroughCopy("src/admin");
	eleventyConfig.addPassthroughCopy("src/.htaccess");
	eleventyConfig.addPassthroughCopy("src/chat.php");

	// Products: Sanity first, fallback to local JSON files
	eleventyConfig.addGlobalData("productsList", async () => {
		const client = getSanityClient();
		if (client) {
			try {
				const products = await client.fetch(`
					*[_type == "product"] | order(line asc, name asc) {
						"slug": slug.current,
						name, line, category, spec, shortDesc,
						"image": image.asset->url,
						description, description2,
						"specs": specs[]{key, value},
						features[]{title, desc, icon},
						applications,
						benefits[]{title, desc},
						applicationText,
						approvalsText,
						availableSizes,
						"typicalProperties": typicalProperties{grades, "rows": rows[]{property, values}},
						faqs[]{q, a}
					}
				`);
				// Transform specs from [{key,value}] to {Key: Value} object for templates
				return products.map((p) => ({
					...p,
					specs: Object.fromEntries((p.specs || []).map((s) => [s.key, s.value])),
				}));
			} catch (e) {
				console.warn("[Sanity] Products fetch failed:", e.message);
			}
		}
		// Local JSON fallback
		const productsDir = path.join(__dirname, "src", "_data", "products");
		if (!fs.existsSync(productsDir)) return [];
		const files = fs.readdirSync(productsDir).filter((f) => f.endsWith(".json"));
		return files.map((f) => JSON.parse(fs.readFileSync(path.join(productsDir, f), "utf8")));
	});

	// FAQs: Sanity first, fallback to local JSON files
	eleventyConfig.addGlobalData("faqsList", async () => {
		const client = getSanityClient();
		if (client) {
			try {
				return await client.fetch(`
					*[_type == "faq"] | order(order asc) {
						question, answer, category, order
					}
				`);
			} catch (e) {
				console.warn("[Sanity] FAQs fetch failed:", e.message);
			}
		}
		const faqsDir = path.join(__dirname, "src", "_data", "faqs");
		if (!fs.existsSync(faqsDir)) return [];
		const files = fs.readdirSync(faqsDir).filter((f) => f.endsWith(".json"));
		return files
			.map((f) => JSON.parse(fs.readFileSync(path.join(faqsDir, f), "utf8")))
			.sort((a, b) => (a.order || 99) - (b.order || 99));
	});

	// Stores: Sanity first, fallback to local JSON files
	eleventyConfig.addGlobalData("storesList", async () => {
		const client = getSanityClient();
		if (client) {
			try {
				return await client.fetch(`
					*[_type == "store"] | order(city asc) {
						"slug": slug.current,
						name, address, city, phone, lat, lng
					}
				`);
			} catch (e) {
				console.warn("[Sanity] Stores fetch failed:", e.message);
			}
		}
		const storesDir = path.join(__dirname, "src", "_data", "stores");
		if (!fs.existsSync(storesDir)) return [];
		const files = fs.readdirSync(storesDir).filter((f) => f.endsWith(".json"));
		return files.map((f) => JSON.parse(fs.readFileSync(path.join(storesDir, f), "utf8")));
	});

	// Site settings: Sanity first, fallback to site.json
	eleventyConfig.addGlobalData("site", async () => {
		const client = getSanityClient();
		if (client) {
			try {
				const settings = await client.fetch(`
					*[_type == "siteSettings" && _id == "siteSettings"][0] {
						name, description, keywords, phone, email, address, year, facebookPageId,
						social{facebook, instagram, youtube}
					}
				`);
				if (settings) return settings;
			} catch (e) {
				console.warn("[Sanity] Site settings fetch failed:", e.message);
			}
		}
		const sitePath = path.join(__dirname, "src", "_data", "site.json");
		return JSON.parse(fs.readFileSync(sitePath, "utf8"));
	});

	// Homepage content: Sanity first, fallback to homepage.json
	eleventyConfig.addGlobalData("homepage", async () => {
		const client = getSanityClient();
		if (client) {
			try {
				const data = await client.fetch(`
					*[_type == "homepage" && _id == "homepage"][0] {
						hero,
						about,
						"testimonials": testimonials[]{
							quote, author, role,
							"image": image.asset->url
						}
					}
				`);
				if (data) return data;
			} catch (e) {
				console.warn("[Sanity] Homepage fetch failed:", e.message);
			}
		}
		const homepagePath = path.join(__dirname, "src", "_data", "homepage.json");
		return JSON.parse(fs.readFileSync(homepagePath, "utf8"));
	});

	// External oil news from Philippine RSS feeds (fetched at build time)
	eleventyConfig.addGlobalData("externalNewsList", async () => {
		const sources = [
			{ url: 'https://data.gmanews.tv/gno/rss/news/feed.xml', source: 'GMA News' },
			{ url: 'https://www.philstar.com/rss/headlines', source: 'Philstar' },
			{ url: 'https://www.philstar.com/rss/business', source: 'Philstar Business' },
		];

		const all = [];
		for (const src of sources) {
			const xml = await fetchRssText(src.url);
			if (!xml) continue;
			const items = parseRssItems(xml)
				.filter(isOilRelated)
				.map((item) => ({
					slug: null,
					title: item.title,
					date: item.pubDate ? new Date(item.pubDate).toISOString() : null,
					image: item.image || null,
					excerpt: item.description.slice(0, 220),
					tags: ['Oil & Gas'],
					isExternal: true,
					url: item.url,
					source: src.source,
				}));
			all.push(...items);
		}

		// Sort newest first, deduplicate by title
		all.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
		const seen = new Set();
		return all.filter((item) => {
			if (seen.has(item.title)) return false;
			seen.add(item.title);
			return true;
		});
	});

	// News articles: Sanity first, no local fallback (hardcoded in template previously)
	eleventyConfig.addGlobalData("articlesList", async () => {
		const client = getSanityClient();
		if (client) {
			try {
				return await client.fetch(`
					*[_type == "article"] | order(date desc) {
						"slug": slug.current,
						title,
						date,
						"image": image.asset->url,
						excerpt,
						tags,
						body
					}
				`);
			} catch (e) {
				console.warn("[Sanity] Articles fetch failed:", e.message);
			}
		}
		return [];
	});

	// Cache-busting: unique version per build so browsers always fetch fresh assets
	eleventyConfig.addGlobalData("buildVersion", () => Date.now());

	// Nunjucks filter: filter array by property value
	eleventyConfig.addFilter("where", (arr, key, val) => {
		return (arr || []).filter((item) => item[key] === val);
	});

	// Nunjucks filter: render Sanity portable text blocks to HTML
	eleventyConfig.addFilter("portableText", (blocks) => {
		if (!blocks || !Array.isArray(blocks)) return "";
		return blocks.map((block) => {
			if (block._type === "image") return "";
			if (block._type !== "block" || !block.children) return "";
			const text = block.children
				.map((child) => {
					let t = child.text || "";
					if (child.marks && child.marks.includes("strong")) t = `<strong>${t}</strong>`;
					if (child.marks && child.marks.includes("em")) t = `<em>${t}</em>`;
					return t;
				})
				.join("");
			switch (block.style) {
				case "h1": return `<h1>${text}</h1>`;
				case "h2": return `<h2>${text}</h2>`;
				case "h3": return `<h3>${text}</h3>`;
				case "h4": return `<h4>${text}</h4>`;
				case "blockquote": return `<blockquote><p>${text}</p></blockquote>`;
				default: return `<p>${text}</p>`;
			}
		}).join("\n");
	});

	// Safe JSON injection into <script> tags (prevents </script> injection)
	eleventyConfig.addFilter("jsonSafe", (obj) => {
		return JSON.stringify(obj).replace(/<\/script>/gi, '<\\/script>');
	});

	return {
		dir: {
			input: "src",
			output: "_site",
			includes: "_includes",
			data: "_data",
		},
		templateFormats: ["njk", "html", "md"],
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
	};
};
