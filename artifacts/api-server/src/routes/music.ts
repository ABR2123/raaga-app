import { Router } from "express";
import YTMusic from "ytmusic-api";

const router = Router();

let ytmusic: YTMusic | null = null;
let initPromise: Promise<void> | null = null;

async function getClient(): Promise<YTMusic> {
  if (ytmusic) return ytmusic;
  if (!initPromise) {
    initPromise = (async () => {
      ytmusic = new YTMusic();
      await ytmusic.initialize();
    })();
  }
  await initPromise;
  return ytmusic!;
}

interface YTSong {
  videoId: string;
  name: string;
  artist: { name: string };
  album?: { name: string };
  duration?: number;
  thumbnails?: { url: string; width: number; height: number }[];
}

function toBestThumb(thumbnails?: YTSong["thumbnails"]): string {
  if (!thumbnails || thumbnails.length === 0) return "";
  const sorted = [...thumbnails].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return sorted[0].url ?? "";
}

function toApiSong(raw: YTSong) {
  return {
    id: raw.videoId,
    name: raw.name ?? "",
    artists: raw.artist?.name ?? "",
    album: raw.album?.name ?? "",
    image: toBestThumb(raw.thumbnails),
    duration: raw.duration ?? 0,
    videoId: raw.videoId,
    downloadUrl: `https://www.youtube.com/watch?v=${raw.videoId}`,
    language: "hindi",
  };
}

router.get("/music/search", async (req, res) => {
  const query = req.query["query"] as string;
  if (!query) {
    res.status(400).json({ error: "query required" });
    return;
  }
  try {
    const client = await getClient();
    const results: YTSong[] = await client.searchSongs(query);
    res.json({ results: results.slice(0, 20).map(toApiSong) });
  } catch (err) {
    req.log.error({ err }, "ytmusic search failed");
    res.status(502).json({ error: "upstream failed" });
  }
});

router.get("/music/home", async (req, res) => {
  const queries = [
    { key: "latest2026", q: "new hindi songs 2026" },
    { key: "trending", q: "top hindi songs 2025" },
    { key: "bollywood", q: "bollywood hits 2025" },
    { key: "punjabi", q: "punjabi hits 2025 2026" },
    { key: "romantic", q: "arijit singh romantic songs" },
  ];
  try {
    const client = await getClient();
    const sections = await Promise.all(
      queries.map(async ({ key, q }) => {
        const r: YTSong[] = await client.searchSongs(q);
        return [key, r.slice(0, 20).map(toApiSong)] as const;
      })
    );
    res.json(Object.fromEntries(sections));
  } catch (err) {
    req.log.error({ err }, "ytmusic home failed");
    res.status(502).json({ error: "upstream failed" });
  }
});

export default router;
