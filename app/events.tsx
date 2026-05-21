import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, CalendarDays, Map as MapIcon, ShoppingBag, Target, User, Zap } from "lucide-react-native";
import {
  EmptyState,
  EventCard,
  GlassCard,
  HelperText,
  NeonButton,
  SegmentedSelector,
} from "@/components/ui";
import { BottomNav } from "@/components/BottomNav";
import { AmbientGlow } from "@/components/fx";
import { theme } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import { getTabContentBottomSpace } from "@/constants/safeArea";

type BottomKey = "map" | "missions" | "feed" | "notifications" | "profile";
type ViewFilter = "all" | "joined";

type EventItem = {
  id: string;
  title: string;
  description: string;
  duration: string;
  reward: string;
  tone: "gold" | "cyan" | "purple";
};

const EVENTS: EventItem[] = [
  {
    id: "e1",
    title: "Gold Rush Antalya",
    description: "Odullu gizli alanlar aktif.",
    duration: "2 saat kaldi",
    reward: "10.000 TL toplam odul havuzu",
    tone: "gold",
  },
  {
    id: "e2",
    title: "Weekend Territory War",
    description: "Hafta sonu en cok alan fetheden kazanir.",
    duration: "48 saat",
    reward: "Akilli saat + premium uyelik",
    tone: "cyan",
  },
  {
    id: "e3",
    title: "Sponsor Hunt",
    description: "Sponsorlu urun drop'lari sehirde aktif.",
    duration: "6 saat",
    reward: "Kiyafet, suluk, yemek kuponu",
    tone: "purple",
  },
  {
    id: "e4",
    title: "Premium Night Hunt",
    description: "Premium kullanicilara ozel gece etkinligi.",
    duration: "Bu gece 22:00",
    reward: "Legendary Mystery Box",
    tone: "gold",
  },
];

const FILTER_OPTIONS = [
  { key: "all" as const, label: "Tum Etkinlikler" },
  { key: "joined" as const, label: "Katildiklarim" },
];

export default function EventsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [viewFilter, setViewFilter] = useState<ViewFilter>("all");

  const filteredEvents = useMemo(() => {
    if (viewFilter === "joined") {
      return EVENTS.filter((event) => joinedIds.includes(event.id));
    }
    return EVENTS;
  }, [viewFilter, joinedIds]);

  const joinEvent = (id: string) => {
    setJoinedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const bottomTabs = [
    { key: "map" as const, label: "Harita", icon: <MapIcon size={16} color={theme.colors.textMuted} /> },
    { key: "missions" as const, label: "Gorev", icon: <Target size={16} color={theme.colors.textMuted} /> },
    { key: "feed" as const, label: "Feed", icon: <ShoppingBag size={16} color={theme.colors.textMuted} /> },
    { key: "notifications" as const, label: "Bildirim", icon: <Bell size={16} color={theme.colors.textMuted} /> },
    { key: "profile" as const, label: "Profil", icon: <User size={16} color={theme.colors.primaryCyan} /> },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AmbientGlow cyanOpacity={0.04} purpleOpacity={0.03} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: getTabContentBottomSpace(insets.bottom, 30) }]}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
      >
        <View style={styles.headerWrap}>
          <Text style={styles.title}>Etkinlikler</Text>
          <HelperText text="Sehrindeki ozel avlari ve rekabetleri kacirma." />
        </View>

        <GlassCard contentStyle={styles.filterWrap}>
          <SegmentedSelector options={FILTER_OPTIONS} value={viewFilter} onChange={setViewFilter} />
        </GlassCard>

        <GlassCard contentStyle={styles.quickMetaCard}>
          <View style={styles.quickMetaItem}>
            <CalendarDays size={14} color={theme.colors.textSecondary} />
            <Text style={styles.quickMetaText}>{EVENTS.length} aktif etkinlik</Text>
          </View>
          <View style={styles.quickMetaItem}>
            <Zap size={14} color={theme.colors.primaryCyan} />
            <Text style={styles.quickMetaText}>{joinedIds.length} katilim</Text>
          </View>
        </GlassCard>

        {filteredEvents.length === 0 ? (
          <EmptyState
            title="Katildigin Etkinlik Yok"
            message="Henuz bir etkinlige katilmadin. Tum etkinlikler sekmesinden katilabilirsin."
          />
        ) : (
          <View style={styles.listWrap}>
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                description={event.description}
                duration={event.duration}
                reward={event.reward}
                tone={event.tone}
                joined={joinedIds.includes(event.id)}
                onJoinPress={() => joinEvent(event.id)}
              />
            ))}
          </View>
        )}

        <NeonButton label="Mystery Box'a Git" variant="gold" onPress={() => router.push(ROUTES.mysteryBox)} />

      </ScrollView>

      <BottomNav activeTab="rewards" style={styles.bottomTabs} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDeep,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  headerWrap: {
    gap: 4,
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 28,
  },
  filterWrap: {
    gap: 0,
  },
  quickMetaCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  quickMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  quickMetaText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  listWrap: {
    gap: theme.spacing.sm,
  },
  bottomTabs: {
    borderTopColor: theme.colors.borderSubtle,
  },
});

