import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bell,
  Coins,
  Heart,
  Map as MapIcon,
  MessageCircle,
  Send,
  ShoppingBag,
  Sparkles,
  Target,
  User,
} from "lucide-react-native";
import {
  AlanGoLogo,
  EmptyRadarState,
  GlassCard,
  HelperText,
  IconBadge,
  LoadingCard,
  MapZonePlaceholder,
  NeonButton,
  SoonBadge,
  StatCard,
  TopModeSwitcher,
} from "@/components/ui";
import { BottomNav } from "@/components/BottomNav";
import { theme } from "@/constants/theme";
import { AnimatedPressable, GlowPulseView, ShimmerBadge } from "@/components/motion";
import { AmbientGlow } from "@/components/fx";
import { ROUTES } from "@/constants/routes";
import { getTabContentBottomSpace, isNarrowWidth } from "@/constants/safeArea";

type FeedTab = "kesfet" | "takip" | "gruplar";
type BottomKey = "map" | "missions" | "feed" | "notifications" | "profile";
type FeedType = "capture" | "reward" | "attack" | "event";

type FeedItem = {
  id: string;
  user: string;
  text: string;
  type: FeedType;
  detail: string;
  xp: string;
  coin: string;
  area: string;
};

const FEED_ITEMS: FeedItem[] = [
  {
    id: "1",
    user: "Caner",
    text: "1.240 m² alan fethetti",
    type: "capture",
    detail: "Lara hattında yeni sınır çizildi.",
    xp: "+340 XP",
    coin: "+120 coin",
    area: "1.240 m²",
  },
  {
    id: "2",
    user: "Ayşe",
    text: "gizli ödül buldu",
    type: "reward",
    detail: "Nadir drop sinyali çözüldü.",
    xp: "+700 XP",
    coin: "₺1.000",
    area: "Ödül",
  },
  {
    id: "3",
    user: "Mehmet",
    text: "rakip alanını ele geçirdi",
    type: "attack",
    detail: "Sahil bölgesinde savunma kırıldı.",
    xp: "+420 XP",
    coin: "+180 coin",
    area: "860 m²",
  },
  {
    id: "4",
    user: "AlanGO",
    text: "Antalya'da Gold Rush etkinliği başladı",
    type: "event",
    detail: "Sadece 12 saat: ekstra ödül ve XP bonusu.",
    xp: "x2 XP",
    coin: "Gold Rush",
    area: "Etkinlik",
  },
];

function eventColors(type: FeedType) {
  if (type === "reward") {
    return {
      badge: "gold" as const,
      badgeText: "Gizli Ödül",
      glow: "rgba(255, 200, 87, 0.22)",
      accent: theme.colors.goldReward,
    };
  }
  if (type === "event") {
    return {
      badge: "cyan" as const,
      badgeText: "Etkinlik",
      glow: "rgba(0, 229, 204, 0.18)",
      accent: theme.colors.primaryCyan,
    };
  }
  if (type === "attack") {
    return {
      badge: "danger" as const,
      badgeText: "Saldırı",
      glow: "rgba(255, 77, 77, 0.14)",
      accent: theme.colors.danger,
    };
  }
  return {
    badge: "success" as const,
    badgeText: "Fetih",
    glow: "rgba(34, 197, 94, 0.14)",
    accent: theme.colors.success,
  };
}

export default function FeedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const narrow = isNarrowWidth(width);
  const [activeTab, setActiveTab] = useState<FeedTab>("kesfet");
  const [isLoading, setIsLoading] = useState(true);
  const revealAnims = useRef(FEED_ITEMS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      90,
      revealAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [revealAnims]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 340);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    if (activeTab === "takip") {
      return FEED_ITEMS.filter((item) => item.type === "capture" || item.type === "reward");
    }
    if (activeTab === "gruplar") {
      return [];
    }
    return FEED_ITEMS;
  }, [activeTab]);

  const tabOptions = useMemo(
    () => [
      { key: "kesfet" as const, label: "Keşfet" },
      { key: "takip" as const, label: "Takip" },
      { key: "gruplar" as const, label: "Gruplar" },
    ],
    []
  );

  const bottomTabs = [
    { key: "map" as const, label: "Harita", icon: <MapIcon size={16} color={theme.colors.textMuted} /> },
    { key: "missions" as const, label: "Görev", icon: <Target size={16} color={theme.colors.textMuted} /> },
    { key: "feed" as const, label: "Feed", icon: <ShoppingBag size={16} color={theme.colors.primaryCyan} /> },
    { key: "notifications" as const, label: "Bildirim", icon: <Bell size={16} color={theme.colors.primaryCyan} /> },
    { key: "profile" as const, label: "Ben", icon: <User size={16} color={theme.colors.textMuted} /> },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AmbientGlow cyanOpacity={0.05} purpleOpacity={0.04} />
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: getTabContentBottomSpace(insets.bottom, 28) }]}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.headerRow}>
          <View>
            <AlanGoLogo size="sm" glow="none" />
            <Text style={styles.title}>Community Feed</Text>
            <HelperText text="Canlı topluluk hareketleri" />
          </View>
          <NeonButton
            label="Canlı"
            size="sm"
            variant="ghost"
            onPress={() => {
              // TODO: Add live feed toggle state.
            }}
          />
        </View>

        <TopModeSwitcher options={tabOptions} value={activeTab} onChange={setActiveTab} />

        <View style={[styles.statRow, narrow && styles.statRowWrap]}>
          <StatCard title="Bugün XP" value="1.460" subtitle="Akış toplam" icon="⚡" progress={0.76} style={[styles.statItem, narrow && styles.statItemNarrow]} />
          <StatCard title="Feed Coin" value="+540" subtitle="Topluluk" icon="g���" progress={0.58} style={[styles.statItem, narrow && styles.statItemNarrow]} />
        </View>

        {isLoading ? (
          <>
            <HelperText text="Yeni bolgeler araniyor..." />
            <LoadingCard lines={4} />
            <LoadingCard lines={3} />
          </>
        ) : null}

        {!isLoading && filteredItems.length === 0 ? (
          <EmptyRadarState
            title="Grup Akışı"
            message="Takım akışı ve grup savaş özetleri bu alanda listelenecek."
          />
        ) : null}

        {!isLoading && filteredItems.map((item, index) => {
          const palette = eventColors(item.type);
          return (
            <Animated.View
              key={item.id}
              style={{
                opacity: revealAnims[index],
                transform: [
                  {
                    translateY: revealAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 0],
                    }),
                  },
                ],
              }}
            >
              <Pressable
                style={({ pressed }) => [pressed && styles.pressed]}
                onPress={() => {
                  if (item.type === "event") {
                    router.push(ROUTES.events);
                    return;
                  }
                  if (item.type === "reward") {
                    router.push(ROUTES.hiddenRewardFound);
                  }
                }}
              >
              <GlassCard style={styles.feedCard} contentStyle={styles.feedContent}>
              {item.type === "reward" ? (
                <>
                  <View style={[styles.cardGlow, { backgroundColor: palette.glow }]} />
                  <ShimmerBadge style={styles.rewardShimmer} shimmerColor="rgba(255, 200, 87, 0.34)" />
                </>
              ) : null}
              {item.type === "event" ? (
                <>
                  <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
                    <View style={styles.eventBorderGlow} />
                  </View>
                  <View style={styles.eventGradientLayer}>
                    <View style={styles.eventGradientOne} />
                    <View style={styles.eventGradientTwo} />
                  </View>
                </>
              ) : null}

              <View style={styles.feedHeader}>
                <View style={styles.userRow}>
                  <IconBadge tone="cyan" icon={item.user.slice(0, 2).toUpperCase()} size={38} />
                  <View>
                    <Text style={styles.userName}>{item.user}</Text>
                    <Text style={styles.userText}>{item.text}</Text>
                  </View>
                </View>
                <View style={styles.feedHeaderRight}>
                  {item.type === "event" ? <SoonBadge /> : null}
                  <IconBadge tone={palette.badge} icon={<Sparkles size={14} color={palette.accent} />} size={28} />
                </View>
              </View>

              <View style={styles.badgeRow}>
                <Pressable
                  style={[styles.typeBadge, { borderColor: `${palette.accent}66`, backgroundColor: `${palette.accent}22` }]}
                  onPress={() => {
                    if (item.type === "event") {
                      router.push(ROUTES.events);
                      return;
                    }
                    if (item.type === "reward") {
                      router.push(ROUTES.hiddenRewardFound);
                    }
                  }}
                >
                  <Text style={[styles.typeBadgeText, { color: palette.accent }]}>{palette.badgeText}</Text>
                </Pressable>
                <Text style={styles.detailText}>{item.detail}</Text>
              </View>

              <MapZonePlaceholder style={styles.miniMapPlaceholder} />

              <View style={styles.metaRow}>
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>{item.xp}</Text>
                </View>
                <View style={styles.metaChip}>
                  <Coins size={12} color={theme.colors.goldReward} />
                  <Text style={styles.metaChipText}>{item.coin}</Text>
                </View>
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>{item.area}</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <AnimatedPressable
                  style={styles.actionBtn}
                  pressedStyle={styles.pressed}
                  scaleTo={0.93}
                  onPress={() => {
                    // TODO: Connect feed like action.
                  }}
                >
                  <View style={styles.likeInnerRow}>
                    <Heart size={14} color={theme.colors.textSecondary} />
                    <Text style={styles.actionText}>Beğen</Text>
                  </View>
                </AnimatedPressable>
                <Pressable
                  style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
                  onPress={() => {
                    // TODO: Open comments for feed item.
                  }}
                >
                  <MessageCircle size={14} color={theme.colors.textSecondary} />
                  <Text style={styles.actionText}>Yorum</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
                  onPress={() => {
                    // TODO: Add share action.
                  }}
                >
                  <Send size={14} color={theme.colors.textSecondary} />
                  <Text style={styles.actionText}>Paylaş</Text>
                </Pressable>
              </View>
              </GlassCard>
              </Pressable>
            </Animated.View>
          );
        })}

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
  glowOne: {
    position: "absolute",
    top: -90,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(0, 229, 204, 0.08)",
  },
  glowTwo: {
    position: "absolute",
    bottom: -90,
    left: -90,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(139, 92, 246, 0.08)",
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 28,
  },
  statRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  statRowWrap: {
    flexWrap: "wrap",
  },
  statItem: {
    flex: 1,
  },
  statItemNarrow: {
    minWidth: "100%",
  },
  feedCard: {
    overflow: "hidden",
  },
  feedContent: {
    gap: theme.spacing.sm,
  },
  rewardShimmer: {
    ...StyleSheet.absoluteFillObject,
  },
  cardGlow: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.34,
  },
  eventGradientLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  eventBorderGlow: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 204, 0.32)",
    borderRadius: theme.radius.lg,
  },
  eventGradientOne: {
    position: "absolute",
    top: -60,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(0, 229, 204, 0.08)",
  },
  eventGradientTwo: {
    position: "absolute",
    bottom: -70,
    left: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(139, 92, 246, 0.08)",
  },
  feedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  feedHeaderRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  userName: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.base,
  },
  userText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeBadge: {
    borderWidth: 1,
    borderRadius: theme.radius.full,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  typeBadgeText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 11,
  },
  detailText: {
    flex: 1,
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
  },
  miniMapPlaceholder: {
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  metaChipText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    minHeight: 40,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  actionText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
  },
  likeInnerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  bottomTabs: {
    borderTopColor: theme.colors.borderSubtle,
  },
  pressed: {
    opacity: 0.86,
  },
});

