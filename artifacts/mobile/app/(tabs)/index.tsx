import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AlbumCard } from "@/components/AlbumCard";
import { SongCard } from "@/components/SongCard";
import { TrendingBanner } from "@/components/TrendingBanner";
import { useColors } from "@/hooks/useColors";
import { getHomeSections, Song } from "@/services/saavn";

interface HomeSections {
  latest2026: Song[];
  trending: Song[];
  bollywood: Song[];
  punjabi: Song[];
  romantic: Song[];
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [sections, setSections] = useState<HomeSections | null>(null);
  const [loading, setLoading] = useState(true);

  const topPad = Platform.OS === "web" ? 67 : insets.top + 16;

  useEffect(() => {
    getHomeSections()
      .then((data) => setSections(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: 200 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            {getGreeting()} 👋
          </Text>
          <View style={styles.brandRow}>
            <Text style={[styles.brand, { color: colors.foreground }]}>Raaga</Text>
            <View style={[styles.badge, { backgroundColor: colors.primary + "20", borderColor: colors.primary + "40" }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>🇮🇳 IN</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="bell" size={17} color={colors.mutedForeground} />
          </Pressable>
          <Pressable style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="settings" size={17} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Loading Indian music...
          </Text>
        </View>
      ) : (
        <>
          {/* ── Trending Banner (latest 2026 releases) ── */}
          {(sections?.latest2026.length ?? 0) > 0 && (
            <TrendingBanner songs={sections!.latest2026} />
          )}

          {/* ── Latest 2026 ── */}
          {(sections?.latest2026.length ?? 0) > 0 && (
            <View style={styles.section}>
              <SectionHeader title="New in 2026" emoji="✨" />
              <FlatList
                horizontal
                data={sections!.latest2026.slice(0, 12)}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hList}
                renderItem={({ item, index }) => (
                  <AlbumCard
                    song={item}
                    queue={sections!.latest2026}
                    queueIndex={index}
                    size={148}
                  />
                )}
              />
            </View>
          )}

          {/* ── Bollywood Hits ── */}
          {(sections?.bollywood.length ?? 0) > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Bollywood Hits" emoji="🎬" />
              {sections!.bollywood.slice(0, 6).map((song, i) => (
                <SongCard
                  key={song.id}
                  song={song}
                  queue={sections!.bollywood}
                  index={i}
                  showIndex
                />
              ))}
            </View>
          )}

          {/* ── Punjabi Vibes ── */}
          {(sections?.punjabi.length ?? 0) > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Punjabi Vibes" emoji="🎤" />
              <FlatList
                horizontal
                data={sections!.punjabi.slice(0, 10)}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hList}
                renderItem={({ item, index }) => (
                  <AlbumCard
                    song={item}
                    queue={sections!.punjabi}
                    queueIndex={index}
                    size={148}
                  />
                )}
              />
            </View>
          )}

          {/* ── Love Songs ── */}
          {(sections?.romantic.length ?? 0) > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Love Songs" emoji="💕" />
              {sections!.romantic.slice(0, 6).map((song, i) => (
                <SongCard
                  key={song.id}
                  song={song}
                  queue={sections!.romantic}
                  index={i}
                  showIndex
                />
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

function SectionHeader({ title, emoji }: { title: string; emoji: string }) {
  const colors = useColors();
  return (
    <View style={sectionHeaderStyles.row}>
      <Text style={sectionHeaderStyles.emoji}>{emoji}</Text>
      <Text style={[sectionHeaderStyles.title, { color: colors.foreground }]}>
        {title}
      </Text>
    </View>
  );
}

const sectionHeaderStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  emoji: { fontSize: 20 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
});

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 22,
  },
  headerLeft: { gap: 4 },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  brand: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1.5 },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 4,
  },
  badgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold", letterSpacing: 0.3 },
  headerRight: { flexDirection: "row", gap: 8, marginTop: 4 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  loader: { paddingTop: 80, alignItems: "center", gap: 16 },
  loadingText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  section: { marginBottom: 36 },
  hList: { paddingHorizontal: 16, gap: 14 },
});
