import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { usePlayer } from "@/context/PlayerContext";
import { useColors } from "@/hooks/useColors";
import { Song } from "@/services/saavn";

const { width: SCREEN_W } = Dimensions.get("window");
const BANNER_H = 260;
const AUTO_SCROLL_MS = 4500;

interface Props {
  songs: Song[];
}

export function TrendingBanner({ songs }: Props) {
  const colors = useColors();
  const { playSong, currentSong, isPlaying } = usePlayer();
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dotScales = useRef(songs.slice(0, 6).map(() => new Animated.Value(1))).current;

  const visibleSongs = songs.slice(0, 6);

  const goTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(visibleSongs.length - 1, idx));
      scrollRef.current?.scrollTo({ x: clamped * SCREEN_W, animated: true });
      setActiveIdx(clamped);
      Animated.sequence([
        Animated.timing(dotScales[clamped], {
          toValue: 1.4,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(dotScales[clamped], {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [visibleSongs.length, dotScales]
  );

  useEffect(() => {
    if (visibleSongs.length < 2) return;
    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % visibleSongs.length;
        scrollRef.current?.scrollTo({ x: next * SCREEN_W, animated: true });
        return next;
      });
    }, AUTO_SCROLL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [visibleSongs.length]);

  const handleScrollEnd = (e: { nativeEvent: { contentOffset: { x: number } } }) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    setActiveIdx(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % visibleSongs.length;
        scrollRef.current?.scrollTo({ x: next * SCREEN_W, animated: true });
        return next;
      });
    }, AUTO_SCROLL_MS);
  };

  const handlePlay = (song: Song, idx: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    playSong(song, visibleSongs, idx);
  };

  if (visibleSongs.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      {/* Slide label */}
      <View style={styles.labelRow} pointerEvents="none">
        <View style={[styles.label, { backgroundColor: colors.primary }]}>
          <Text style={styles.labelText}>🔥 TRENDING NOW</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
      >
        {visibleSongs.map((song, idx) => {
          const isActive = currentSong?.id === song.id;
          return (
            <Pressable
              key={song.id}
              style={styles.slide}
              onPress={() => handlePlay(song, idx)}
              accessibilityRole="button"
              accessibilityLabel={`Play ${song.name} by ${song.artists}`}
            >
              {/* Background image */}
              <Image
                source={{ uri: song.image }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                transition={300}
              />

              {/* Gradient overlay */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.55)", "rgba(13,13,13,0.97)"]}
                locations={[0.2, 0.6, 1]}
                style={StyleSheet.absoluteFill}
              />

              {/* Content */}
              <View style={styles.content}>
                <View style={styles.meta}>
                  {/* Rank badge */}
                  <View style={[styles.rankBadge, { borderColor: colors.primary + "60" }]}>
                    <Text style={[styles.rankText, { color: colors.primary }]}>
                      #{idx + 1}
                    </Text>
                  </View>
                  <View style={styles.textBlock}>
                    <Text style={styles.songTitle} numberOfLines={1}>
                      {song.name}
                    </Text>
                    <Text style={styles.artistName} numberOfLines={1}>
                      {song.artists}
                    </Text>
                    {song.album ? (
                      <Text style={styles.albumName} numberOfLines={1}>
                        {song.album}
                      </Text>
                    ) : null}
                  </View>
                </View>

                {/* Play button */}
                <Pressable
                  onPress={() => handlePlay(song, idx)}
                  style={({ pressed }) => [
                    styles.playBtn,
                    {
                      backgroundColor: isActive
                        ? colors.primary
                        : "rgba(255,255,255,0.15)",
                      borderColor: isActive
                        ? colors.primary
                        : "rgba(255,255,255,0.4)",
                      transform: [{ scale: pressed ? 0.92 : 1 }],
                    },
                  ]}
                >
                  <Ionicons
                    name={isActive && isPlaying ? "pause" : "play"}
                    size={22}
                    color="#fff"
                  />
                </Pressable>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Dot indicators */}
      <View style={styles.dots} pointerEvents="none">
        {visibleSongs.map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === activeIdx ? colors.primary : "rgba(255,255,255,0.3)",
                width: i === activeIdx ? 20 : 6,
                transform: [{ scaleY: dotScales[i] ?? 1 }],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: SCREEN_W,
    height: BANNER_H + 28,
    marginBottom: 8,
    overflow: "hidden",
  },
  labelRow: {
    position: "absolute",
    top: 14,
    left: 16,
    zIndex: 10,
  },
  label: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  labelText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.8,
  },
  slide: {
    width: SCREEN_W,
    height: BANNER_H,
    overflow: "hidden",
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  meta: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    marginRight: 12,
  },
  rankBadge: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 2,
  },
  rankText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  textBlock: { flex: 1 },
  songTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  artistName: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    marginBottom: 2,
  },
  albumName: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  playBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingTop: 10,
    height: 28,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
