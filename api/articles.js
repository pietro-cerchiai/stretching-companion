// api/articles.js
// Serverless function: queries The Guardian, estimates each article's reading
// time, excludes live blogs, and returns a few articles whose total reading
// time lands somewhere around the requested session length.
// The API key stays server-side, never in the browser.

// Map our app themes to Guardian sections.
const THEMES = {
  history: "history",
  geography: "world", // Guardian has no "geography" section; world is the closest fit
  geopolitics: "world",
};

const WORDS_PER_MINUTE = 200; // average adult reading speed

export default async function handler(req, res) {
  const key = process.env.GUARDIAN_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "Missing API key" });
  }

  const theme = (req.query.theme || "geopolitics").toLowerCase();
  const targetMin = Number(req.query.minutes) || 6;
  const section = THEMES[theme] || "world";

  // Ask the Guardian for recent articles, including body text (to measure
  // length) and the content type (to filter out live blogs).
  const url =
    `https://content.guardianapis.com/search?section=${section}` +
    `&order-by=newest&page-size=30&show-fields=bodyText,trailText` +
    `&type=article&api-key=${key}`;

  try {
    const r = await fetch(url);
    const data = await r.json();
    const results = data?.response?.results || [];

    // Build a clean list: reading time, exclude live blogs, exclude very short items.
    const articles = results
      .filter((a) => !/\/live\//.test(a.webUrl)) // drop live blogs by URL pattern
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
      .filter((a) => a.readMin >= 2); // skip near-empty stubs

    // Pick up to 3 articles, stopping once we're around the target time.
    const picked = [];
    let total = 0;
    for (const a of articles) {
      if (picked.length >= 3) break;
      picked.push(a);
      total += a.readMin;
      if (total >= targetMin) break; // close enough, stop here
    }

    return res.status(200).json({ theme, targetMin, totalMin: total, articles: picked });
  } catch (e) {
    return res.status(500).json({ error: "Failed to fetch articles" });
  }
}