import { Platform } from "react-native";

function getApiBase(): string {
  if (Platform.OS === "web") return "/api";
  const domain = process.env["EXPO_PUBLIC_DOMAIN"];
  return domain ? `https://${domain}/api` : "/api";
}

export interface Song {
  id: string;
  name: string;
  artists: string;
  album: string;
  image: string;
  duration: number;
  downloadUrl: string;
  videoId: string;
  language: string;
}

export async function searchSongs(query: string, limit = 20): Promise<Song[]> {
  try {
    const base = getApiBase();
    const res = await fetch(
      `${base}/music/search?query=${encodeURIComponent(query)}&limit=${limit}`
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { results?: Song[] };
    return json.results ?? [];
  } catch {
    return [];
  }
}

export async function getHomeSections(): Promise<{
  latest2026: Song[];
  trending: Song[];
  bollywood: Song[];
  punjabi: Song[];
  romantic: Song[];
}> {
  try {
    const base = getApiBase();
    const res = await fetch(`${base}/music/home`);
    if (!res.ok) throw new Error("home failed");
    return (await res.json()) as {
      latest2026: Song[];
      trending: Song[];
      bollywood: Song[];
      punjabi: Song[];
      romantic: Song[];
    };
  } catch {
    return { latest2026: [], trending: [], bollywood: [], punjabi: [], romantic: [] };
  }
}

export async function getGenreSongs(genre: string): Promise<Song[]> {
  const queries: Record<string, string> = {
    bollywood: "bollywood hits 2024",
    punjabi: "punjabi diljit 2024",
    classical: "indian classical ragas",
    romantic: "arijit singh romantic",
    devotional: "bhajan devotional",
    party: "party dance bollywood",
    arijit: "arijit singh",
    rahman: "ar rahman",
    shreya: "shreya ghoshal",
  };
  return searchSongs(queries[genre] ?? `${genre} india`);
}
