// api/articles.js
// Serverless function: queries The Guardian, estimates each article's reading
// time, excludes live blogs, and returns a few articles whose total reading
// time lands around the requested session length.
// The API key stays server-side, never in the browser.

// Each theme maps to EITHER a real Guardian section, OR a keyword search (`q`)
// for themes that don't exist as a section (history, geopolitics, AI...).
const THEMES = {
  geopolitics: { q: "geopolitics OR diplomacy OR \"international relations\"" },
  history:     { q: "history OR historical OR archaeology" },
  geography:   { q: "geography OR cartography OR landscape" },
  ai:          { q: "\"artificial intelligence\" OR \"machine learning\"" },
  politics:    { section: "politics" },
  science:     { section: "science" },
  environment: { section: "environment" },
  technology:  { section: "technology" },
  economy:     { section: "business" },
  culture:     { section: "culture" },
  books:       { section: "books" },
  travel:      { section: "travel" },
  society:     { section: "society" },
  film:        { section: "film" },
};

const WORDS_PER_MINUTE = 200; // average adult reading speed

export default async function handler(req, res) {
  const key = process.env.GUARDIAN_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "Missing API key" });
  }

  const theme = (req.query.theme || "geopolitics").toLowerCase();
  const targetMin = Number(req.query.minutes) || 6;
  const conf = THEMES[theme] || { section: "world" };

  // Build the query: section-based or keyword-based depending on the theme.
  let url =
    `https://content.guardianapis.com/search?order-by=newest&page-size=30` +
    `&show-fields=bodyText,trailText&type=article&api-key=${key}`;
  if (conf.section) {
    url += `&section=${conf.section}`;
  } else if (conf.q) {
    url += `&q=${encodeURIComponent(conf.q)}`;
  }

  try {
    const r = await fetch(url);
    const data = await r.json();
    const results = data?.response?.results || [];

    // Build a clean list: reading time, exclude live blogs and near-empty stubs.
    const articles = results
      .filter((a) => !/\/live\//.test(a.webUrl))
      .map((a) => {
        const words = (a.fields?.bodyText || "").split(/\s+/).filter(Boolean).length;
        const readMin = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
        return {
          title: a.webTitle,
          url: a.webUrl,
          readMin,
          trail: a.fields?.trailText || "",
        };
      })
      .filter((a) => a.readMin >= 2);

    // Pick up to 3 articles, stopping once we're around the target time.
    const picked = [];
    let total = 0;
    for (const a of articles) {
      if (picked.length >= 3) break;
      picked.push(a);
      total += a.readMin;
      if (total >= targetMin) break;
    }

    return res.status(200).json({ theme, targetMin, totalMin: total, articles: picked });
  } catch (e) {
    return res.status(500).json({ error: "Failed to fetch articles" });
  }
}