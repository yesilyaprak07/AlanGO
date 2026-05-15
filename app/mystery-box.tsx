import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, Crown, Gift, Map as MapIcon, ShoppingBag, Target, User } from "lucide-react-native";
import {
  BottomTabBar,
  GlassCard,
  HelperText,
  MysteryBoxCard,
  RewardPoolItem,
  SoonBadge,
} from "@/components/ui";
import { GlowPulseView } from "@/components/motion";
import { AmbientGlow, ParticleDots } from "@/components/fx";
import { theme } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import { getTabContentBottomSpace } from "@/constants/safeArea";

type BottomKey = "map" | "missions" | "feed" | "notifications" | "profile";
type BoxType = "daily" | "premium";

const REWARD_POOL = [
  "Coin",
  "Power-up",
  "Sponsor kuponu",
  "Oyun ici token",
  "Gercek urun",
  "Nakit odul",
] as const;

const REVEALS = ["+250 Coin", "Radar Boost", "%20 Sponsor Kuponu", "Gercek Odul Sansi"] as const;

export default function MysteryBoxScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [openedDaily, setOpenedDaily] = useState(false);
  const [openedPremium, setOpenedPremium] = useState(false);
  const [activeBox, setActiveBox] = useState<BoxType>("daily");
  const [lastReward, setLastReward] = useState<string | null>(null);

  const crateTone = activeBox === "daily" ? "rgba(0, 229, 204, 0.10)" : "rgba(255, 200, 87, 0.10)";

  const canOpenActive = useMemo(() => {
    if (activeBox === "daily") return !openedDaily;
    return !openedPremium;
  }, [activeBox, openedDaily, openedPremium]);

  const openActiveBox = () => {
    const pick = REVEALS[Math.floor(Math.random() * REVEALS.length)];
    setLastReward(pick);

    if (activeBox === "daily") {
      setOpenedDaily(true);
    } else {
      setOpenedPremium(true);
    }
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
      <ParticleDots count={8} color="rgba(255, 200, 87, 0.18)" />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: getTabContentBottomSpace(insets.bottom, 30) }]}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
      >
        <View style={styles.headerWrap}>
          <Text style={styles.title}>Mystery Box</Text>
          <HelperText text="Her kutuda coin, boost, kupon veya gercek odul sansi var." />
        </View>

        <GlassCard contentStyle={styles.heroCardContent}>
          <GlowPulseView duration={960} minOpacity={0.94} maxOpacity={1} minScale={1} maxScale={1.01}>
            <View style={[styles.cratePlaceholder, { backgroundColor: crateTone }]}>
              <Gift size={34} color={activeBox === "daily" ? theme.colors.primaryCyan : theme.colors.goldReward} />
              <Text style={styles.crateTitle}>{activeBox === "daily" ? "Gunluk Kutu" : "Premium Kutu"}</Text>
            </View>
          </GlowPulseView>

          <View style={styles.revealRow}>
            <Text style={styles.revealLabel}>Son acilan odul:</Text>
            <Text style={styles.revealValue}>{lastReward ?? "Henuz acilmadi"}</Text>
          </View>

          <MysteryBoxCard
            title="Gunluk Ucretsiz Kutu"
            subtitle="Her gun 1 kez acilir"
            tone="cyan"
            opened={openedDaily}
            onOpenPress={() => {
              setActiveBox("daily");
              openActiveBox();
            }}
          />

          <MysteryBoxCard
            title="Premium Mystery Box"
            subtitle="Daha yuksek kaliteli odul havuzu"
            tone="gold"
            premium
            opened={openedPremium}
            onOpenPress={() => {
              router.push(ROUTES.premium);
              setActiveBox("premium");
              openActiveBox();
            }}
          />

          <MysteryBoxCard
            title="Legendary Box"
            subtitle="Sezonluk ozel kutu"
            tone="gold"
            locked
            premium
          />

          {!canOpenActive ? <Text style={styles.tomorrowText}>Yarin tekrar gel</Text> : null}

          {lastReward === "Gercek Odul Sansi" ? (
            <View style={styles.realRewardCtaWrap}>
              <Text style={styles.realRewardHint}>Gercek odul sansi yakalandi.</Text>
              <View>
                <SoonBadge label="CANLI ODUL" />
              </View>
              <Text style={styles.realRewardLink} onPress={() => router.push(ROUTES.hiddenRewardFound)}>
                Odul detayina git
              </Text>
            </View>
          ) : null}
        </GlassCard>

        <GlassCard contentStyle={styles.poolContent}>
          <View style={styles.poolTitleRow}>
            <Text style={styles.sectionTitle}>Odul Havuzu</Text>
            <SoonBadge label="DROP TABLE" />
          </View>
          <View style={styles.poolList}>
            {REWARD_POOL.map((item) => (
              <RewardPoolItem key={item} label={item} />
            ))}
          </View>
        </GlassCard>

        <View style={styles.linkRow}>
          <SoonBadge label="PREMIUM" />
          <Text style={styles.linkText}>Premium kutular daha yuksek sans oranina sahiptir.</Text>
        </View>

      </ScrollView>

      <BottomTabBar<BottomKey>
        tabs={bottomTabs}
        activeKey="store"
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
  heroCardContent: {
    gap: theme.spacing.sm,
  },
  cratePlaceholder: {
    width: "100%",
    minHeight: 172,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  crateTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.base,
  },
  revealRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 9,
  },
  revealLabel: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  revealValue: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
  },
  tomorrowText: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
    textAlign: "center",
  },
  realRewardCtaWrap: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "rgba(255, 200, 87, 0.30)",
    backgroundColor: "rgba(255, 200, 87, 0.08)",
    padding: theme.spacing.sm,
    gap: 7,
  },
  realRewardHint: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  realRewardLink: {
    color: theme.colors.goldReward,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
  },
  poolContent: {
    gap: theme.spacing.sm,
  },
  poolTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.base,
  },
  poolList: {
    gap: theme.spacing.xs,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  linkText: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  bottomTabs: {
    borderTopColor: theme.colors.borderSubtle,
  },
});

