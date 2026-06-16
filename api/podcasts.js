// api/podcasts.js
// Serverless function: searches Spotify podcast EPISODES for a theme, filters
// by duration to fit the session, and returns a few clickable links.
// Two steps: (A) exchange client id/secret for a token, (B) search with it.
// Credentials stay server-side, never in the browser.

// Map our app themes to Spotify search keywords (kept aligned with the article themes).
const THEME_QUERIES = {
  geopolitics: "géopolitique",
  history: "histoire",
  geography: "géographie",
  ai: "intelligence artificielle",
  politics: "politique",
  science: "science",
  environment: "environnement climat",
  technology: "technologie",
  economy: "économie",
  culture: "culture",
  books: "littérature livres",
  travel: "voyage",
  society: "société",
  film: "cinéma",
};

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
  const targetMin = Number(req.query.minutes) || 20;
  const q = THEME_QUERIES[theme] || theme;

  try {
    // Step A: token
    const token = await getToken(id, secret);
    if (!token) {
      return res.status(500).json({ error: "Could not get Spotify token" });
    }

    // Step B: search episodes (market=FR is required for results).
    const url =
      `https://api.spotify.com/v1/search?type=episode&limit=30` +
      `&q=${encodeURIComponent(q)}`;
    const r = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
    const data = await r.json();
    const items = data?.episodes?.items || [];

    // Keep episodes whose length is in a sensible window around the target.
    // Aim for one episode that roughly fills the session.
    const minMs = (targetMin - 8) * 60 * 1000; // lower bound
    const maxMs = (targetMin + 15) * 60 * 1000; // upper bound

    const episodes = items
      .filter((e) => e && e.duration_ms)
      .map((e) => ({
        title: e.name,
        url: e.external_urls?.spotify || "",
        durationMin: Math.round(e.duration_ms / 60000),
        show: e.show?.name || "",
        durationMs: e.duration_ms,
      }))
      .filter((e) => e.url);

    // Prefer episodes within the window; if none, fall back to the closest ones.
    let picked = episodes.filter((e) => e.durationMs >= minMs && e.durationMs <= maxMs);
    if (picked.length === 0) {
      picked = episodes
        .slice()
        .sort((a, b) => Math.abs(a.durationMs - targetMin * 60000) - Math.abs(b.durationMs - targetMin * 60000));
    }
    picked = picked.slice(0, 4);

    return res.status(200).json({ theme, targetMin, rawCount: items.length, mappedCount: episodes.length, episodes: picked });
  } catch (e) {
    return res.status(500).json({ error: "Failed to fetch podcasts" });
  }
}