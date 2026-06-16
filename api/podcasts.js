// api/podcasts.js
// Serverless function: searches Spotify for SHOWS (podcasts) matching a theme,
// in the app's language (keywords + market), and returns a few clickable links.
// Two steps: (A) get a token, (B) search.
// Note: the `limit` param triggers a spurious 400 on this app, so it is omitted.
// Credentials stay server-side, never in the browser.

// Search keywords per language, per theme. Keys must match the app's theme ids.
const THEME_QUERIES = {
  fr: {
    geopolitics: "géopolitique", history: "histoire", geography: "géographie",
    ai: "intelligence artificielle", politics: "politique", science: "science",
    environment: "environnement climat", technology: "technologie", economy: "économie",
    culture: "culture", books: "littérature", travel: "voyage", society: "société", film: "cinéma",
  },
  it: {
    geopolitics: "geopolitica", history: "storia", geography: "geografia",
    ai: "intelligenza artificiale", politics: "politica", science: "scienza",
    environment: "ambiente clima", technology: "tecnologia", economy: "economia",
    culture: "cultura", books: "letteratura", travel: "viaggi", society: "società", film: "cinema",
  },
  en: {
    geopolitics: "geopolitics", history: "history", geography: "geography",
    ai: "artificial intelligence", politics: "politics", science: "science",
    environment: "environment climate", technology: "technology", economy: "economy",
    culture: "culture", books: "literature", travel: "travel", society: "society", film: "film",
  },
};

// Spotify market per app language.
const MARKETS = { fr: "FR", it: "IT", en: "GB" };

// Step A: get a temporary access token via the Client Credentials flow.
async function getToken(id, secret) {
  const creds = Buffer.from(`${id}:${secret}`).toString("base64");
  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await r.json();
  return data.access_token;
}

export default async function handler(req, res) {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) {
    return res.status(500).json({ error: "Missing Spotify credentials" });
  }

  const theme = (req.query.theme || "geopolitics").toLowerCase();
  const lang = (req.query.lang || "fr").toLowerCase();
  const queries = THEME_QUERIES[lang] || THEME_QUERIES.fr;
  const q = queries[theme] || theme;
  const market = MARKETS[lang] || "FR";

  try {
    const token = await getToken(id, secret);
    if (!token) {
      return res.status(500).json({ error: "Could not get Spotify token" });
    }

    // Search for shows (podcasts). No `limit` param (it 400s on this app).
    const params = new URLSearchParams({ q: q, type: "show", market: market });
    const url = `https://api.spotify.com/v1/search?${params.toString()}`;

    const r = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
    const data = await r.json();
    const items = (data && data.shows && data.shows.items) ? data.shows.items : [];

    const shows = items
      .filter((s) => s && s.external_urls && s.external_urls.spotify)
      .map((s) => ({
        title: s.name,
        url: s.external_urls.spotify,
        publisher: s.publisher || "",
        description: (s.description || "").slice(0, 120),
      }))
      .slice(0, 5);

    return res.status(200).json({ theme, lang, shows });
  } catch (e) {
    return res.status(500).json({ error: "Failed to fetch podcasts" });
  }
}