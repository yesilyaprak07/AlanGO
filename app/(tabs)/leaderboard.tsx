import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, Crown, Map as MapIcon, Shield, ShoppingBag, Target, User, Zap } from "lucide-react-native";
import { BottomTabBar, GlassCard, IconBadge } from "@/components/ui";
import { EmptyState } from "@/components/ui";
import { theme } from "@/constants/theme";
import { GlowPulseView } from "@/components/motion";
import { useFadeIn } from "@/hooks/useFadeIn";
import { AmbientGlow, AnimatedGradient, NeonOutline } from "@/components/fx";
import { ROUTES } from "@/constants/routes";
import { getTabContentBottomSpace, isNarrowWidth } from "@/constants/safeArea";

type FilterKey = "mahalle" | "sehir" | "turkiye" | "dunya";
type BottomKey = "map" | "missions" | "feed" | "notifications" | "profile";

type PodiumPlayer = {
  rank: 1 | 2 | 3;
  name: string;
  level: number;
  area: string;
  weeklyXp: string;
};

type RankedPlayer = {
  rank: number;
  initials: string;
  username: string;
  level: number;
  totalArea: string;
  weeklyXp: string;
  premium: boolean;
};

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "mahalle", label: "Mahalle" },
  { key: "sehir", label: "�?ehir" },
  { key: "turkiye", label: "Türkiye" },
  { key: "dunya", label: "Dünya" },
];

const PODIUM: PodiumPlayer[] = [
  { rank: 2, name: "ZehraT42", level: 29, area: "74.920 m²", weeklyXp: "+6.100 XP" },
  { rank: 1, name: "MertKing", level: 34, area: "89.450 m²", weeklyXp: "+8.420 XP" },
  { rank: 3, name: "Burak61", level: 27, area: "69.380 m²", weeklyXp: "+5.760 XP" },
];

const RANKING: RankedPlayer[] = [
  { rank: 4, initials: "EO", username: "Eylul06", level: 25, totalArea: "62.940 m²", weeklyXp: "+4.800 XP", premium: true },
  { rank: 5, initials: "KA", username: "KaanArena", level: 24, totalArea: "58.210 m²", weeklyXp: "+4.100 XP", premium: false },
  { rank: 6, initials: "AD", username: "AdaDrift", level: 23, totalArea: "56.870 m²", weeklyXp: "+3.940 XP", premium: true },
  { rank: 7, initials: "GP", username: "GPSMaster", level: 22, totalArea: "54.430 m²", weeklyXp: "+3.650 XP", premium: false },
  { rank: 8, initials: "TK", username: "TurkKral", level: 21, totalArea: "52.210 m²", weeklyXp: "+3.410 XP", premium: true },
  { rank: 9, initials: "AY", username: "Ays3", level: 21, totalArea: "50.930 m²", weeklyXp: "+3.120 XP", premium: false },
  { rank: 10, initials: "RZ", username: "RizaRun", level: 20, totalArea: "49.870 m²", weeklyXp: "+2.980 XP", premium: false },
];

function podiumPalette(rank: 1 | 2 | 3) {
  if (rank === 1) {
    return {
      tone: "gold" as const,
      glow: "rgba(255, 200, 87, 0.20)",
      border: "rgba(255, 200, 87, 0.45)",
      text: theme.colors.goldReward,
      badge: "#1",
      colHeight: 122,
    };
  }

  if (rank === 2) {
    return {
      tone: "neutral" as const,
      glow: "rgba(185, 195, 208, 0.16)",
      border: "rgba(185, 195, 208, 0.38)",
      text: "#D5DEE8",
      badge: "#2",
      colHeight: 96,
    };
  }

  return {
    tone: "neutral" as const,
    glow: "rgba(201, 122, 69, 0.16)",
    border: "rgba(201, 122, 69, 0.42)",
    text: "#C97A45",
    badge: "#3",
    colHeight: 84,
  };
}

export default function LeaderboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const narrow = isNarrowWidth(width);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("sehir");
  const podiumReveal = useRef(PODIUM.map(() => new Animated.Value(0))).current;
  const stickyReveal = useFadeIn({ duration: 360, delay: 220, fromY: 30, fromScale: 0.99 });

  useEffect(() => {
    Animated.stagger(
      120,
      podiumReveal.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 340,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [podiumReveal]);

  const bottomTabs = useMemo(
    () => [
      { key: "map" as const, label: "Harita", icon: <MapIcon size={16} color={theme.colors.textMuted} /> },
      { key: "missions" as const, label: "Görev", icon: <Target size={16} color={theme.colors.textMuted} /> },
      { key: "feed" as const, label: "Feed", icon: <ShoppingBag size={16} color={theme.colors.textMuted} /> },
      { key: "notifications" as const, label: "Bildirim", icon: <Bell size={16} color={theme.colors.textMuted} /> },
      { key: "profile" as const, label: "Ben", icon: <User size={16} color={theme.colors.primaryCyan} /> },
    ],
    []
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AmbientGlow cyanOpacity={0.04} purpleOpacity={0.03} />
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: getTabContentBottomSpace(insets.bottom, 136) }]}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
      >
        <View style={styles.headerWrap}>
          <Text style={styles.title}>Liderlik</Text>
          <Text style={styles.subtitle}>�?ehrindeki en güçlü alan sahipleri</Text>
        </View>

        <View style={[styles.filterRow, narrow && styles.filterRowWrap]}>
          {FILTERS.map((filter) => {
            const active = filter.key === activeFilter;
            return (
              <Pressable
                key={filter.key}
                onPress={() => setActiveFilter(filter.key)}
                style={({ pressed }) => [styles.filterPill, narrow && styles.filterPillNarrow, active && styles.filterPillActive, pressed && styles.pressed]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{filter.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <GlassCard style={styles.podiumCard} contentStyle={styles.podiumContent}>
          <Text style={styles.sectionLabel}>TOP 3 PODIUM</Text>
          <View style={styles.podiumRow}>
            {PODIUM.map((player, index) => {
              const palette = podiumPalette(player.rank);
              return (
                <Animated.View
                  key={player.rank}
                  style={[
                    styles.podiumItem,
                    player.rank === 1 && styles.podiumCenter,
                    {
                      opacity: podiumReveal[index],
                      transform: [
                        {
                          translateY: podiumReveal[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [18, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  {player.rank === 1 ? (
                    <GlowPulseView style={[styles.podiumGlow, { backgroundColor: palette.glow }]} duration={600} minOpacity={0.7} maxOpacity={1} minScale={1} maxScale={1.05} />
                  ) : (
                    <View style={[styles.podiumGlow, { backgroundColor: palette.glow }]} />
                  )}
                  <IconBadge
                    tone={palette.tone}
                    size={player.rank === 1 ? 56 : 48}
                    icon={player.name.slice(0, 2).toUpperCase()}
                    style={[styles.avatar, { borderColor: palette.border }]}
                  />
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={[styles.playerRank, { color: palette.text }]}>{palette.badge}</Text>
                  <Text style={styles.playerMeta}>Lv {player.level}</Text>
                  <Text style={styles.playerMeta}>{player.area}</Text>
                  <Text style={styles.playerMeta}>{player.weeklyXp}</Text>
                  <View style={[styles.podiumColumn, { height: palette.colHeight, borderColor: palette.border, backgroundColor: palette.glow }]}>
                    <AnimatedGradient color="rgba(255,255,255,0.22)" duration={980} />
                  </View>
                </Animated.View>
              );
            })}
          </View>
        </GlassCard>

        <View style={styles.listWrap}>
          {RANKING.length === 0 ? (
            <EmptyState
              title="Liderlik Verisi Hazırlanıyor"
              message="Sıralama listesi birkaç saniye içinde yenilenecek."
            />
          ) : null}
          {RANKING.map((player) => (
            <Pressable
              key={player.rank}
              onPress={() => {
                // TODO: Open player detail panel.
              }}
            >
            <GlassCard style={styles.rowCard} contentStyle={styles.rowContent}>
              <View style={styles.leftRow}>
                <Text style={styles.rankText}>#{player.rank}</Text>
                <IconBadge tone="neutral" size={40} icon={player.initials} />
                <View>
                  <View style={styles.nameRow}>
                    <Text style={styles.username}>{player.username}</Text>
                    {player.premium ? (
                      <Pressable style={styles.premiumBadge} onPress={() => router.push(ROUTES.premium)}>
                        <Crown size={10} color={theme.colors.goldReward} />
                        <Text style={styles.premiumText}>PREMIUM</Text>
                      </Pressable>
                    ) : null}
                  </View>
                  <Text style={styles.detailText}>Level {player.level}</Text>
                </View>
              </View>

              <View style={styles.rightMeta}>
                <Text style={styles.areaValue}>{player.totalArea}</Text>
                <View style={styles.xpRow}>
                  <Zap size={12} color={theme.colors.primaryCyan} />
                  <Text style={styles.xpValue}>{player.weeklyXp}</Text>
                </View>
              </View>
            </GlassCard>
            </Pressable>
          ))}
        </View>

      </ScrollView>

      <Animated.View style={[styles.stickyWrap, { bottom: getTabContentBottomSpace(insets.bottom, 4) }, stickyReveal.style]}>
        <NeonOutline borderRadius={theme.radius.lg} color="rgba(0, 229, 204, 0.46)">
          <GlassCard style={styles.selfCard} contentStyle={styles.selfContent}>
          <View style={styles.selfTopRow}>
            <View style={styles.selfLabelRow}>
              <Shield size={14} color={theme.colors.primaryCyan} />
              <Text style={styles.selfTitle}>Sen #18</Text>
            </View>
            <View style={styles.selfPremiumBadge}>
              <Text style={styles.selfPremiumBadgeText}>PREMIUM</Text>
            </View>
          </View>

          <View style={styles.selfStatsRow}>
            <Text style={styles.selfStatValue}>12.450 m²</Text>
            <Text style={styles.selfStatValue}>3.200 XP</Text>
          </View>

          <Text style={styles.motivation}>İlk 10'a girmek için 2.100 m² daha fethet.</Text>
          </GlassCard>
        </NeonOutline>
      </Animated.View>

      <BottomTabBar<BottomKey>
        tabs={bottomTabs}
        activeKey="profile"
        onTabPress={(key) => {
          if (key === "map") router.push(ROUTES.tabs.map);
          if (key === "missions") router.push(ROUTES.tabs.missions);
          if (key === "feed") router.push(ROUTES.tabs.feed);
          if (key === "notifications") router.push(ROUTES.tabs.notifications);
          if (key === "profile") router.push(ROUTES.tabs.profile);
        }}
        style={styles.bottomTabs}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDeep,
  },
  glowTop: {
    position: "absolute",
    top: -120,
    right: -90,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255, 200, 87, 0.08)",
  },
  glowBottom: {
    position: "absolute",
    bottom: 110,
    left: -110,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(0, 229, 204, 0.07)",
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  headerWrap: {
    gap: 4,
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 28,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterRowWrap: {
    flexWrap: "wrap",
  },
  filterPill: {
    flex: 1,
    minHeight: 38,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  filterPillNarrow: {
    minWidth: "48%",
  },
  filterPillActive: {
    borderColor: "rgba(0, 229, 204, 0.54)",
    backgroundColor: "rgba(0, 229, 204, 0.11)",
  },
  filterText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
  },
  filterTextActive: {
    color: theme.colors.primaryCyan,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  podiumCard: {
    marginTop: 4,
  },
  podiumContent: {
    gap: theme.spacing.sm,
  },
  sectionLabel: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 11,
    letterSpacing: 1,
  },
  podiumRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
  },
  podiumItem: {
    flex: 1,
    alignItems: "center",
  },
  podiumCenter: {
    marginTop: -8,
  },
  podiumGlow: {
    position: "absolute",
    top: -12,
    width: 86,
    height: 86,
    borderRadius: 43,
    opacity: 0.55,
  },
  avatar: {
    marginBottom: 6,
  },
  playerName: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 12,
  },
  playerRank: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
    marginTop: 2,
  },
  playerMeta: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 10,
    marginTop: 1,
  },
  podiumColumn: {
    overflow: "hidden",
    marginTop: 8,
    width: "82%",
    borderTopLeftRadius: theme.radius.md,
    borderTopRightRadius: theme.radius.md,
    borderWidth: 1,
  },
  listWrap: {
    gap: 8,
  },
  rowCard: {
    borderRadius: theme.radius.md,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  rankText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.bold,
    width: 34,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  username: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 13,
  },
  detailText: {
    marginTop: 2,
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: "rgba(255, 200, 87, 0.32)",
    backgroundColor: "rgba(255, 200, 87, 0.09)",
  },
  premiumText: {
    color: theme.colors.goldReward,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 9,
  },
  rightMeta: {
    alignItems: "flex-end",
    gap: 4,
  },
  areaValue: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 12,
  },
  xpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  xpValue: {
    color: theme.colors.primaryCyan,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 11,
  },
  stickyWrap: {
    position: "absolute",
    left: theme.spacing.md,
    right: theme.spacing.md,
  },
  selfCard: {
    borderColor: "rgba(0, 229, 204, 0.40)",
  },
  selfContent: {
    paddingVertical: 12,
    gap: 8,
  },
  selfTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selfLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  selfTitle: {
    color: theme.colors.primaryCyan,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
  },
  selfPremiumBadge: {
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  selfPremiumBadgeText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 10,
  },
  selfStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selfStatValue: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 14,
  },
  motivation: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
  },
  bottomTabs: {
    borderTopColor: theme.colors.borderSubtle,
  },
  pressed: {
    opacity: 0.88,
  },
});

