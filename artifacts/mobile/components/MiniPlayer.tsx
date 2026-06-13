import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { usePlayer } from "@/context/PlayerContext";
import { useColors } from "@/hooks/useColors";

const TAB_BAR_HEIGHT = Platform.OS === "web" ? 84 : 49;

export function MiniPlayer() {
  const colors = useColors();
  const { currentSong, isPlaying, isLoading, position, duration, pauseResume, playNext } =
    usePlayer();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(120)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: currentSong ? 0 : 120,
      useNativeDriver: true,
      tension: 70,
      friction: 11,
    }).start();
  }, [!!currentSong]);

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.06, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isPlaying]);

  if (!currentSong) return null;

  const bottom = TAB_BAR_HEIGHT + (Platform.OS !== "web" ? insets.bottom : 0) + 10;
  const progress = duration > 0 ? position / duration : 0;

  const handlePause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    pauseResume();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playNext();
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { bottom, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Orange progress bar on top edge */}
      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>

      <Pressable
        style={[
          styles.container,
          {
            backgroundColor: "rgba(18,18,18,0.97)",
            borderColor: colors.border,
          },
        ]}
        onPress={() => router.push("/player")}
      >
        {/* Album art with pulse */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Image
            source={{ uri: currentSong.image }}
            style={[styles.image, { borderRadius: colors.radius - 4 }]}
            contentFit="cover"
          />
        </Animated.View>

        {/* Song info */}
        <View style={styles.info}>
          <Text
            style={[styles.title, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {currentSong.name}
          </Text>
          <Text
            style={[styles.artist, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            {currentSong.artists}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <Pressable onPress={handlePause} style={styles.btn} hitSlop={14}>
            {isLoading ? (
              <View style={[styles.loadDot, { backgroundColor: colors.primary }]} />
            ) : (
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={24}
                color={colors.foreground}
              />
            )}
          </Pressable>
          <Pressable onPress={handleNext} style={styles.btn} hitSlop={14}>
            <Feather name="skip-forward" size={22} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 10,
    right: 10,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 16,
  },
  progressTrack: {
    height: 2,
    width: "100%",
  },
  progressFill: {
    height: 2,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    gap: 12,
  },
  image: { width: 46, height: 46 },
  info: { flex: 1, gap: 3 },
  title: { fontSize: 14, fontFamily: "Inter_600SemiBold", letterSpacing: -0.2 },
  artist: { fontSize: 12, fontFamily: "Inter_400Regular" },
  controls: { flexDirection: "row", alignItems: "center", gap: 4 },
  btn: { padding: 5 },
  loadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
