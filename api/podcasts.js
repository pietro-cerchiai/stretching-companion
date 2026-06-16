// api/podcasts.js
// Serverless function: searches Spotify for SHOWS (podcasts) matching a theme
// and returns a few clickable links. Two steps: (A) get a token, (B) search.
// Note: the `limit` param triggers a spurious 400 on this app, so it is omitted.
// Credentials stay server-side, never in the browser.

// Map our app themes to Spotify search keywords (aligned with the article themes).
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
  books: "littérature",
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
  const q = THEME_QUERIES[theme] || theme;

  try {
    const token = await getToken(id, secret);
    if (!token) {
      return res.status(500).json({ error: "Could not get Spotify token" });
    }

    // Search for shows (podcasts). No `limit` param (it 400s on this app).
    const params = new URLSearchParams({ q: q, type: "show", market: "FR" });
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

    return res.status(200).json({ theme, shows });
  } catch (e) {
    return res.status(500).json({ error: "Failed to fetch podcasts" });
  }
}