import { Feather } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SongCard } from "@/components/SongCard";
import { useColors } from "@/hooks/useColors";
import { searchSongs, Song } from "@/services/saavn";

interface Category {
  label: string;
  query: string;
  color: string;
  icon: keyof typeof Feather.glyphMap;
}

const CATEGORIES: Category[] = [
  { label: "Bollywood", query: "bollywood hits 2024", color: "#FF6B35", icon: "film" },
  { label: "Punjabi", query: "punjabi hits diljit 2024", color: "#F72585", icon: "music" },
  { label: "Classical", query: "indian classical ragas sitar", color: "#7B2D8B", icon: "headphones" },
  { label: "Romantic", query: "romantic hindi love songs arijit", color: "#E63946", icon: "heart" },
  { label: "Devotional", query: "bhajan aarti devotional songs", color: "#F4A261", icon: "sun" },
  { label: "Party", query: "party dance hindi songs 2024", color: "#4CC9F0", icon: "zap" },
  { label: "Arijit Singh", query: "arijit singh songs best", color: "#8338EC", icon: "mic" },
  { label: "A.R. Rahman", query: "ar rahman songs best", color: "#06D6A0", icon: "radio" },
  { label: "Shreya Ghoshal", query: "shreya ghoshal songs best", color: "#FF006E", icon: "star" },
  { label: "90s Hits", query: "90s bollywood hindi best songs", color: "#FB5607", icon: "clock" },
];

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top + 12;

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    const songs = await searchSongs(q);
    setResults(songs);
    setLoading(false);
  }, []);

  const handleCategoryPress = (cat: Category) => {
    setActiveCategory(cat.label);
    setQuery(cat.label);
    handleSearch(cat.query);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
    setActiveCategory(null);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View
        style={[
          styles.searchHeader,
          { paddingTop: topPad, backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Search</Text>
        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: colors.card,
              borderRadius: colors.radius,
              borderColor: colors.border,
            },
          ]}
        >
          <Feather
            name="search"
            size={18}
            color={colors.mutedForeground}
            style={{ marginLeft: 14 }}
          />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder="Songs, artists, albums..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={(t) => {
              setQuery(t);
              if (!t) {
                setResults([]);
                setSearched(false);
                setActiveCategory(null);
              }
            }}
            onSubmitEditing={() => handleSearch(query)}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <Pressable onPress={handleClear} style={styles.clearBtn} hitSlop={8}>
              <Feather name="x-circle" size={18} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Content */}
      {!searched ? (
        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item.label}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 200,
            gap: 12,
          }}
          columnWrapperStyle={{ gap: 12 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text
              style={[
                styles.browseTitle,
                { color: colors.foreground, marginBottom: 4 },
              ]}
            >
              Browse
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.catCard,
                {
                  backgroundColor: item.color + "20",
                  borderRadius: colors.radius,
                  borderColor: item.color + "40",
                  flex: 1,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              onPress={() => handleCategoryPress(item)}
            >
              <View
                style={[styles.catIcon, { backgroundColor: item.color + "30" }]}
              >
                <Feather name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={[styles.catLabel, { color: colors.foreground }]}>
                {item.label}
              </Text>
            </Pressable>
          )}
        />
      ) : loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Searching...
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 200 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <SongCard song={item} queue={results} index={index} />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="search" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No songs found for "{query}"
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  searchHeader: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", marginBottom: 14 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    height: "100%",
  },
  clearBtn: { padding: 14 },
  browseTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  catCard: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    padding: 12,
  },
  catIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  catLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  empty: {
    marginTop: 80,
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
