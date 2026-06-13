import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SongCard } from "@/components/SongCard";
import { usePlayer } from "@/context/PlayerContext";
import { useColors } from "@/hooks/useColors";

export default function LibraryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { likedSongs, playSong } = usePlayer();

  const topPad = Platform.OS === "web" ? 67 : insets.top + 16;

  const playAll = () => {
    if (likedSongs.length > 0) {
      playSong(likedSongs[0], likedSongs, 0);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={likedSongs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200, flexGrow: 1 }}
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: topPad }]}>
            <View style={styles.headerTop}>
              <View>
                <Text style={[styles.title, { color: colors.foreground }]}>
                  Your Library
                </Text>
                <Text
                  style={[styles.subtitle, { color: colors.mutedForeground }]}
                >
                  {likedSongs.length}{" "}
                  {likedSongs.length === 1 ? "song" : "songs"}
                </Text>
              </View>
              {likedSongs.length > 0 && (
                <Pressable
                  onPress={playAll}
                  style={[
                    styles.playAllBtn,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Ionicons name="play" size={14} color="#fff" />
                  <Text style={[styles.playAllText, { color: "#fff" }]}>
                    Play All
                  </Text>
                </Pressable>
              )}
            </View>

            {likedSongs.length === 0 && (
              <View style={styles.empty}>
                <View
                  style={[
                    styles.emptyIcon,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <Ionicons
                    name="heart-outline"
                    size={40}
                    color={colors.primary}
                  />
                </View>
                <Text
                  style={[styles.emptyTitle, { color: colors.foreground }]}
                >
                  No liked songs yet
                </Text>
                <Text
                  style={[styles.emptyText, { color: colors.mutedForeground }]}
                >
                  Tap the heart icon on any song to save it here
                </Text>
              </View>
            )}

            {likedSongs.length > 0 && (
              <Text
                style={[
                  styles.sectionLabel,
                  { color: colors.mutedForeground },
                ]}
              >
                LIKED SONGS
              </Text>
            )}
          </View>
        }
        renderItem={({ item, index }) => (
          <SongCard
            song={item}
            queue={likedSongs}
            index={index}
            showIndex
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", marginTop: 4 },
  playAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
  },
  playAllText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  empty: { alignItems: "center", paddingTop: 60, gap: 16 },
  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: { fontSize: 20, fontFamily: "Inter_600SemiBold" },
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2,
    marginBottom: 8,
    marginTop: 8,
  },
});
