// api/podcasts.js
// Serverless function: searches Spotify for SHOWS (podcasts) matching a theme
// and returns a few clickable links. Two steps: (A) get a token, (B) search.
// Searching shows is more reliable than episodes on Spotify's API.
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

    // Build the query string cleanly to avoid encoding/parsing issues.
    const params = new URLSearchParams({
      q: q,
      type: "show",
      market: "FR",
      limit: "20",
    });
    const url = `https://api.spotify.com/v1/search?${params.toString()}`;

    const r = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
    const data = await r.json();
    // DEBUG
    return res.status(200).json({
      status: r.status,
      errorMessage: data?.error?.message || null,
      total: data?.shows?.total ?? null,
      sample: data?.shows?.items?.[0] ? { name: data.shows.items[0].name, url: data.shows.items[0].external_urls?.spotify } : null,
      finalUrl: url,
    });

    const shows = items
      .filter((s) => s && s.external_urls?.spotify)
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