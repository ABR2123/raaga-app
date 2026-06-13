import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { usePlayer } from "@/context/PlayerContext";
import { useColors } from "@/hooks/useColors";
import { Song } from "@/services/saavn";

interface Props {
  song: Song;
  queue: Song[];
  index: number;
  showIndex?: boolean;
}

export function SongCard({ song, queue, index, showIndex = false }: Props) {
  const colors = useColors();
  const { playSong, currentSong, isPlaying, toggleLike, isLiked } = usePlayer();
  const isActive = currentSong?.id === song.id;
  const liked = isLiked(song.id);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playSong(song, queue, index);
  };

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleLike(song);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        isActive && styles.containerActive,
        { opacity: pressed ? 0.75 : 1 },
      ]}
      onPress={handlePress}
    >
      {/* Active left-edge glow strip */}
      {isActive && (
        <LinearGradient
          colors={[colors.primary, colors.primary + "00"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.activeStrip, { backgroundColor: colors.primary }]}
        />
      )}

      {/* Index / playing indicator */}
      <View style={styles.indexWrap}>
        {isActive ? (
          <Feather
            name={isPlaying ? "volume-2" : "volume-1"}
            size={15}
            color={colors.primary}
          />
        ) : showIndex ? (
          <Text style={[styles.indexText, { color: colors.mutedForeground }]}>
            {String(index + 1).padStart(2, "0")}
          </Text>
        ) : null}
      </View>

      {/* Album art */}
      <View style={[styles.imageWrap, isActive && { shadowColor: colors.primary, shadowOpacity: 0.5, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } }]}>
        <Image
          source={{ uri: song.image }}
          style={[styles.image, { borderRadius: colors.radius - 4 }]}
          contentFit="cover"
        />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text
          style={[
            styles.title,
            { color: isActive ? colors.primary : colors.foreground },
          ]}
          numberOfLines={1}
        >
          {song.name}
        </Text>
        <Text
          style={[styles.subtitle, { color: colors.mutedForeground }]}
          numberOfLines={1}
        >
          {song.artists}
        </Text>
      </View>

      {/* Like */}
      <Pressable onPress={handleLike} hitSlop={14} style={styles.likeBtn}>
        <Ionicons
          name={liked ? "heart" : "heart-outline"}
          size={17}
          color={liked ? colors.primary : colors.mutedForeground + "99"}
        />
      </Pressable>

      {/* Duration */}
      <Text style={[styles.duration, { color: colors.mutedForeground + "88" }]}>
        {formatDuration(song.duration)}
      </Text>
    </Pressable>
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 16,
    gap: 12,
    position: "relative",
    overflow: "hidden",
  },
  containerActive: {
    backgroundColor: "rgba(255,107,53,0.06)",
  },
  activeStrip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  indexWrap: { width: 22, alignItems: "center" },
  indexText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
  },
  imageWrap: {},
  image: { width: 54, height: 54 },
  info: { flex: 1, gap: 4 },
  title: { fontSize: 15, fontFamily: "Inter_600SemiBold", letterSpacing: -0.2 },
  subtitle: { fontSize: 12, fontFamily: "Inter_400Regular" },
  likeBtn: { padding: 4 },
  duration: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    minWidth: 36,
    textAlign: "right",
    letterSpacing: 0.3,
  },
});
