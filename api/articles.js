// api/articles.js
// Serverless function: queries The Guardian, estimates each article's reading
// time, and returns a few articles whose total reading time is close to the
// requested session length. The API key stays server-side, never in the browser.

// Map our app themes to Guardian sections/tags.
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

  // Read query params, with sensible defaults.
  const theme = (req.query.theme || "geopolitics").toLowerCase();
  const targetMin = Number(req.query.minutes) || 6;
  const section = THEMES[theme] || "world";

  // Ask the Guardian for recent articles in that section, including body text
  // so we can measure length.
  const url =
    `https://content.guardianapis.com/search?section=${section}` +
    `&order-by=newest&page-size=20&show-fields=bodyText,trailText` +
    `&api-key=${key}`;

  try {
    const r = await fetch(url);
    const data = await r.json();
    const results = data?.response?.results || [];

    // Compute a reading time for each article.
    const articles = results.map((a) => {
      const words = (a.fields?.bodyText || "").split(/\s+/).filter(Boolean).length;
      const readMin = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
      return {
        title: a.webTitle,
        url: a.webUrl,
        readMin,
        trail: a.fields?.trailText || "",
      };
    }).filter((a) => a.readMin >= 1);

    // Greedily pick articles until we get close to the target total time.
    const picked = [];
    let total = 0;
    for (const a of articles) {
      if (picked.length >= 3) break;
      if (total >= targetMin) break;
      picked.push(a);
      total += a.readMin;
    }

    return res.status(200).json({ theme, targetMin, totalMin: total, articles: picked });
  } catch (e) {
    return res.status(500).json({ error: "Failed to fetch articles" });
  }
}