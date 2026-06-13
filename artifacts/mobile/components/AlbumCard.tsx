import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { usePlayer } from "@/context/PlayerContext";
import { useColors } from "@/hooks/useColors";
import { Song } from "@/services/saavn";

interface Props {
  song: Song;
  queue: Song[];
  queueIndex: number;
  size?: number;
}

export function AlbumCard({ song, queue, queueIndex, size = 160 }: Props) {
  const colors = useColors();
  const { playSong, currentSong, isPlaying } = usePlayer();
  const isActive = currentSong?.id === song.id;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    playSong(song, queue, queueIndex);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { width: size, opacity: pressed ? 0.8 : 1 },
      ]}
      onPress={handlePress}
    >
      {/* Image with active glow */}
      <View
        style={[
          styles.imageWrap,
          {
            borderRadius: colors.radius,
            ...(isActive
              ? {
                  shadowColor: colors.primary,
                  shadowOpacity: 0.6,
                  shadowRadius: 14,
                  shadowOffset: { width: 0, height: 4 },
                }
              : {
                  shadowColor: "#000",
                  shadowOpacity: 0.35,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                }),
          },
        ]}
      >
        <Image
          source={{ uri: song.image }}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: colors.radius,
              borderWidth: isActive ? 2 : 0,
              borderColor: colors.primary,
            },
          ]}
          contentFit="cover"
          transition={200}
        />

        {/* Playing overlay */}
        {isActive && (
          <View style={[styles.playOverlay, { borderRadius: colors.radius }]}>
            <View style={[styles.playDot, { backgroundColor: colors.primary }]}>
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={14}
                color="#fff"
              />
            </View>
          </View>
        )}
      </View>

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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { gap: 9 },
  imageWrap: {},
  image: {},
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  playDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.2,
  },
  subtitle: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
