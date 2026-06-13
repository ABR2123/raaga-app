import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { usePlayer } from "@/context/PlayerContext";
import { useColors } from "@/hooks/useColors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ART_SIZE = Math.min(SCREEN_WIDTH - 64, 340);

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function PlayerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    currentSong,
    isPlaying,
    isLoading,
    position,
    duration,
    repeatMode,
    isShuffled,
    pauseResume,
    playNext,
    playPrev,
    seekTo,
    toggleLike,
    isLiked,
    toggleShuffle,
    cycleRepeat,
  } = usePlayer();

  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  if (!currentSong) {
    if (router.canGoBack()) router.back();
    return null;
  }

  const liked = isLiked(currentSong.id);
  const progress = duration > 0 ? position / duration : 0;
  const progressBarWidth = SCREEN_WIDTH - 64;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      const x = Math.max(0, Math.min(progressBarWidth, e.nativeEvent.locationX));
      seekTo((x / progressBarWidth) * duration);
    },
    onPanResponderMove: (e) => {
      const x = Math.max(0, Math.min(progressBarWidth, e.nativeEvent.locationX));
      seekTo((x / progressBarWidth) * duration);
    },
  });

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleLike(currentSong);
  };

  const handlePlayPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    pauseResume();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playNext();
  };

  const handlePrev = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playPrev();
  };

  const repeatColor =
    repeatMode === "off" ? colors.mutedForeground : colors.primary;

  return (
    <LinearGradient
      colors={["#1a1030", "#120820", "#0D0D0D"]}
      style={[styles.screen]}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={16}
          style={styles.headerBtn}
        >
          <Feather name="chevron-down" size={28} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.nowPlayingLabel, { color: colors.mutedForeground }]}>
            Now Playing
          </Text>
          <Text
            style={[styles.albumLabel, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {currentSong.album || "Single"}
          </Text>
        </View>
        <TouchableOpacity hitSlop={16} style={styles.headerBtn}>
          <Feather name="more-horizontal" size={24} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* Album Art */}
      <View style={styles.artWrapper}>
        <Image
          source={{ uri: currentSong.image }}
          style={[
            styles.art,
            {
              width: ART_SIZE,
              height: ART_SIZE,
              borderRadius: colors.radius * 2,
            },
          ]}
          contentFit="cover"
        />
        {isLoading && (
          <View style={[StyleSheet.absoluteFill, styles.artLoader]}>
            <ActivityIndicator color="#fff" size="large" />
          </View>
        )}
      </View>

      {/* Song Info + Like */}
      <View style={styles.infoRow}>
        <View style={styles.infoText}>
          <Text
            style={[styles.songTitle, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {currentSong.name}
          </Text>
          <Text
            style={[styles.artistName, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            {currentSong.artists}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLike} hitSlop={12}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={26}
            color={liked ? colors.primary : colors.mutedForeground}
          />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View
          style={[styles.track, { backgroundColor: colors.border }]}
          {...panResponder.panHandlers}
        >
          <View
            style={[
              styles.fill,
              {
                width: `${progress * 100}%`,
                backgroundColor: colors.foreground,
              },
            ]}
          />
          <View
            style={[
              styles.thumb,
              {
                left: `${progress * 100}%`,
                backgroundColor: colors.foreground,
                marginLeft: -8,
              },
            ]}
          />
        </View>
        <View style={styles.timeRow}>
          <Text style={[styles.time, { color: colors.mutedForeground }]}>
            {formatMs(position)}
          </Text>
          <Text style={[styles.time, { color: colors.mutedForeground }]}>
            {formatMs(duration)}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={[styles.controls, { paddingBottom: botPad }]}>
        <TouchableOpacity onPress={toggleShuffle} hitSlop={12}>
          <Feather
            name="shuffle"
            size={22}
            color={isShuffled ? colors.primary : colors.mutedForeground}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePrev} hitSlop={12}>
          <Feather name="skip-back" size={34} color={colors.foreground} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playBtn, { backgroundColor: colors.foreground }]}
          onPress={handlePlayPause}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.background} size="small" />
          ) : (
            <Feather
              name={isPlaying ? "pause" : "play"}
              size={30}
              color={colors.background}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} hitSlop={12}>
          <Feather name="skip-forward" size={34} color={colors.foreground} />
        </TouchableOpacity>

        <TouchableOpacity onPress={cycleRepeat} hitSlop={12}>
          <View>
            <Feather name="repeat" size={22} color={repeatColor} />
            {repeatMode === "one" && (
              <View
                style={[styles.repeatDot, { backgroundColor: repeatColor }]}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerBtn: { width: 40, alignItems: "center" },
  headerCenter: { flex: 1, alignItems: "center" },
  nowPlayingLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 3,
  },
  albumLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  artWrapper: {
    alignItems: "center",
    marginVertical: 20,
  },
  art: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.6,
    shadowRadius: 32,
    elevation: 20,
  },
  artLoader: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    marginBottom: 28,
    gap: 16,
  },
  infoText: { flex: 1 },
  songTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  artistName: { fontSize: 16, fontFamily: "Inter_400Regular" },
  progressSection: { paddingHorizontal: 32, marginBottom: 28 },
  track: {
    height: 4,
    borderRadius: 2,
    position: "relative",
    marginBottom: 10,
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    position: "absolute",
    top: -6,
  },
  timeRow: { flexDirection: "row", justifyContent: "space-between" },
  time: { fontSize: 12, fontFamily: "Inter_400Regular" },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    marginTop: 4,
  },
  playBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  repeatDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 3,
  },
});
