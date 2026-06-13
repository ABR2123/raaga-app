import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";

import { Song } from "@/services/saavn";

export type RepeatMode = "off" | "one" | "all";

export interface PlayerContextType {
  currentSong: Song | null;
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  position: number;
  duration: number;
  likedSongs: Song[];
  isShuffled: boolean;
  repeatMode: RepeatMode;
  playSong: (song: Song, newQueue?: Song[], index?: number) => void;
  pauseResume: () => void;
  playNext: () => void;
  playPrev: () => void;
  seekTo: (ms: number) => void;
  toggleLike: (song: Song) => void;
  isLiked: (id: string) => boolean;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  addToQueue: (song: Song) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function usePlayer(): PlayerContextType {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number }) => void;
            onError?: (e: { data: number }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(videoId: string): void;
  seekTo(sec: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  destroy(): void;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");

  const ytPlayerRef = useRef<YTPlayer | null>(null);
  const ytContainerRef = useRef<HTMLDivElement | null>(null);
  const queueRef = useRef<Song[]>([]);
  const currentIndexRef = useRef(0);
  const repeatRef = useRef<RepeatMode>("off");
  const positionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingVideoIdRef = useRef<string | null>(null);
  const ytReadyRef = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem("liked_songs").then((data) => {
      if (data) {
        try { setLikedSongs(JSON.parse(data) as Song[]); } catch {}
      }
    });
  }, []);

  const stopPositionTimer = () => {
    if (positionTimerRef.current) {
      clearInterval(positionTimerRef.current);
      positionTimerRef.current = null;
    }
  };

  const startPositionTimer = () => {
    stopPositionTimer();
    positionTimerRef.current = setInterval(() => {
      if (ytPlayerRef.current) {
        try {
          const cur = ytPlayerRef.current.getCurrentTime() * 1000;
          const dur = ytPlayerRef.current.getDuration() * 1000;
          setPosition(cur);
          if (dur > 0) setDuration(dur);
        } catch {}
      }
    }, 500);
  };

  const loadVideo = useCallback((videoId: string) => {
    if (!Platform.OS || Platform.OS === "web") {
      if (ytPlayerRef.current && ytReadyRef.current) {
        ytPlayerRef.current.loadVideoById(videoId);
      } else {
        pendingVideoIdRef.current = videoId;
      }
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const container = document.createElement("div");
    container.id = "yt-player-container";
    container.style.cssText =
      "position:fixed;bottom:-1px;left:-1px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;z-index:-1";
    const playerEl = document.createElement("div");
    playerEl.id = "yt-player";
    container.appendChild(playerEl);
    document.body.appendChild(container);
    ytContainerRef.current = container;

    window.onYouTubeIframeAPIReady = () => {
      ytReadyRef.current = true;
      ytPlayerRef.current = new window.YT.Player(playerEl, {
        videoId: "",
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            ytReadyRef.current = true;
            if (pendingVideoIdRef.current) {
              ytPlayerRef.current?.loadVideoById(pendingVideoIdRef.current);
              pendingVideoIdRef.current = null;
            }
          },
          onStateChange: (e) => {
            const YT = window.YT;
            if (e.data === YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setIsLoading(false);
              startPositionTimer();
              const dur = ytPlayerRef.current?.getDuration() ?? 0;
              if (dur > 0) setDuration(dur * 1000);
            } else if (e.data === YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              stopPositionTimer();
            } else if (e.data === YT.PlayerState.BUFFERING) {
              setIsLoading(true);
            } else if (e.data === YT.PlayerState.ENDED) {
              stopPositionTimer();
              setIsPlaying(false);
              const repeat = repeatRef.current;
              if (repeat === "one") {
                ytPlayerRef.current?.seekTo(0, true);
                ytPlayerRef.current?.playVideo();
              } else {
                const next = currentIndexRef.current + 1;
                if (next < queueRef.current.length) {
                  playAtIndex(next);
                } else if (repeat === "all") {
                  playAtIndex(0);
                }
              }
            } else if (e.data === YT.PlayerState.UNSTARTED) {
              setIsLoading(true);
            }
          },
          onError: () => {
            setIsLoading(false);
            setIsPlaying(false);
          },
        },
      });
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      stopPositionTimer();
      try { ytPlayerRef.current?.destroy(); } catch {}
      if (document.body.contains(container)) document.body.removeChild(container);
    };
  }, []);

  const playAtIndex = useCallback((idx: number) => {
    const song = queueRef.current[idx];
    if (!song) return;

    setCurrentIndex(idx);
    currentIndexRef.current = idx;
    setCurrentSong(song);
    setPosition(0);
    setDuration(song.duration > 0 ? song.duration * 1000 : 0);
    setIsLoading(true);
    setIsPlaying(false);
    loadVideo(song.videoId ?? song.id);
  }, [loadVideo]);

  const playSong = useCallback((song: Song, newQueue?: Song[], index = 0) => {
    const q = newQueue ?? [song];
    const i = newQueue ? index : 0;
    queueRef.current = q;
    currentIndexRef.current = i;
    setQueue(q);
    playAtIndex(i);
  }, [playAtIndex]);

  const pauseResume = useCallback(() => {
    if (!ytPlayerRef.current) return;
    if (isPlaying) {
      ytPlayerRef.current.pauseVideo();
    } else {
      ytPlayerRef.current.playVideo();
    }
  }, [isPlaying]);

  const playNext = useCallback(() => {
    const next = currentIndexRef.current + 1;
    if (next < queueRef.current.length) {
      playAtIndex(next);
    } else if (repeatRef.current === "all") {
      playAtIndex(0);
    }
  }, [playAtIndex]);

  const playPrev = useCallback(() => {
    if (position > 3000 && ytPlayerRef.current) {
      ytPlayerRef.current.seekTo(0, true);
      setPosition(0);
      return;
    }
    const prev = currentIndexRef.current - 1;
    if (prev >= 0) playAtIndex(prev);
  }, [position, playAtIndex]);

  const seekTo = useCallback((ms: number) => {
    ytPlayerRef.current?.seekTo(ms / 1000, true);
    setPosition(ms);
  }, []);

  const toggleLike = useCallback((song: Song) => {
    setLikedSongs((prev) => {
      const exists = prev.some((s) => s.id === song.id);
      const next = exists ? prev.filter((s) => s.id !== song.id) : [song, ...prev];
      AsyncStorage.setItem("liked_songs", JSON.stringify(next));
      return next;
    });
  }, []);

  const isLiked = useCallback(
    (id: string) => likedSongs.some((s) => s.id === id),
    [likedSongs]
  );

  const toggleShuffle = useCallback(() => setIsShuffled((v) => !v), []);

  const cycleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      const next: RepeatMode = prev === "off" ? "all" : prev === "all" ? "one" : "off";
      repeatRef.current = next;
      return next;
    });
  }, []);

  const addToQueue = useCallback((song: Song) => {
    const next = [...queueRef.current, song];
    queueRef.current = next;
    setQueue(next);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentSong, queue, currentIndex, isPlaying, isLoading,
        position, duration, likedSongs, isShuffled, repeatMode,
        playSong, pauseResume, playNext, playPrev, seekTo,
        toggleLike, isLiked, toggleShuffle, cycleRepeat, addToQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
