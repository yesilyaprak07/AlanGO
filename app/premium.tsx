import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bell,
  Check,
  Crown,
  Gem,
  Map as MapIcon,
  Shield,
  ShoppingBag,
  Sparkles,
  Target,
  User,
  X,
} from "lucide-react-native";
import {
  AlanGoLogo,
  BottomTabBar,
  ErrorState,
  GlassCard,
  HelperText,
  NeonButton,
  RewardCard,
  SoonBadge,
} from "@/components/ui";
import { AnimatedPressable, GlowPulseView, ShimmerBadge } from "@/components/motion";
import { AmbientGlow, NeonOutline, ParticleDots } from "@/components/fx";
import { theme } from "@/constants/theme";
import { getTabContentBottomSpace, isNarrowWidth } from "@/constants/safeArea";
import { ROUTES } from "@/constants/routes";

type PlanKey = "monthly" | "yearly";
type BottomKey = "map" | "missions" | "store" | "notifications" | "profile";

type Plan = {
  key: PlanKey;
  title: string;
  price: string;
  subtitle?: string;
  highlight?: boolean;
};

const BENEFITS = [
  "3x gizli ödül şansı",
  "Günlük mystery box",
  "Premium radar sinyali",
  "Daha fazla günlük fetih hakkı",
  "+%25 XP ve coin boost",
  "Özel neon iz renkleri",
  "Reklamsız deneyim",
  "Premium etkinliklere erişim",
] as const;

const PLANS: Plan[] = [
  {
    key: "monthly",
    title: "Aylık",
    price: "₺49,90",
  },
  {
    key: "yearly",
    title: "Yıllık",
    price: "₺399,90",
    subtitle: "En avantajlı",
    highlight: true,
  },
];

export default function PremiumScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const narrow = isNarrowWidth(width);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("yearly");

  const selectedPlanInfo = useMemo(
    () => PLANS.find((plan) => plan.key === selectedPlan) ?? PLANS[1],
    [selectedPlan]
  );

  const bottomTabs = [
    { key: "map" as const, label: "Harita", icon: <MapIcon size={16} color={theme.colors.textMuted} /> },
    { key: "missions" as const, label: "Görev", icon: <Target size={16} color={theme.colors.textMuted} /> },
    { key: "store" as const, label: "Mağaza", icon: <ShoppingBag size={16} color={theme.colors.textMuted} /> },
    { key: "notifications" as const, label: "Bildirim", icon: <Bell size={16} color={theme.colors.textMuted} /> },
    { key: "profile" as const, label: "Ben", icon: <User size={16} color={theme.colors.primaryCyan} /> },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AmbientGlow cyanOpacity={0.05} purpleOpacity={0.04} />
      <ParticleDots count={8} color="rgba(255, 200, 87, 0.20)" />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: getTabContentBottomSpace(insets.bottom, 30) }]}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.headerRow}>
          <View>
            <AlanGoLogo size="md" glow="soft" />
            <Text style={styles.title}>Premium</Text>
            <Text style={styles.subtitle}>Daha fazla keşfet. Daha fazla kazan. Daha fazla fethet.</Text>
            <SoonBadge label="LIMITLI AVANTAJ" style={styles.headerBadge} />
          </View>
          <Pressable
            hitSlop={theme.ux.hitSlop}
            pressRetentionOffset={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
            onPress={() => router.back()}
          >
            <X size={16} color={theme.colors.textPrimary} />
          </Pressable>
        </View>

        <GlassCard style={styles.heroCard} contentStyle={styles.heroContent}>
          <View style={styles.heroGlow} />
          <View style={styles.badgeWrap}>
            <View style={styles.badgePill}>
              <Crown size={12} color={theme.colors.goldReward} />
              <Text style={styles.badgeText}>PREMIUM DROP RATE</Text>
            </View>
          </View>

          <RewardCard
            title="Premium Avcı Profili"
            description="Premium üyeler daha fazla gizli drop keşfeder."
            rewardText="Loot şansı, radar ve XP avantajı aktif"
            icon={<Gem size={16} color={theme.colors.goldReward} />}
            variant="gold"
            onPress={() => {
              // TODO: Navigate to premium detail metrics.
            }}
          />
        </GlassCard>

        <GlassCard contentStyle={styles.benefitsContent}>
          <Text style={styles.sectionTitle}>Avantajlar</Text>
          <View style={styles.benefitsList}>
            {BENEFITS.map((benefit) => (
              <View key={benefit} style={styles.benefitItem}>
                <View style={styles.checkWrap}>
                  <Check size={12} color={theme.colors.primaryCyan} />
                </View>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        <View style={[styles.planRow, narrow && styles.planRowNarrow]}>
          {PLANS.map((plan) => {
            const active = selectedPlan === plan.key;
            const planCard = (
              <AnimatedPressable
                key={plan.key}
                style={[styles.planCard, narrow && styles.planCardNarrow, active && styles.planCardActive]}
                scaleTo={0.96}
                idlePulse={false}
                onPress={() => setSelectedPlan(plan.key)}
              >
                <View style={styles.planTopRow}>
                  <Text style={[styles.planTitle, active && styles.planTitleActive]}>{plan.title}</Text>
                  {plan.highlight ? (
                    <View style={styles.planBadgeWrap}>
                      <View style={styles.planBadge}>
                        <Sparkles size={10} color={theme.colors.goldReward} />
                        <Text style={styles.planBadgeText}>En avantajlı</Text>
                      </View>
                    </View>
                  ) : null}
                </View>
                <Text style={[styles.planPrice, active && styles.planPriceActive]}>{plan.price}</Text>
                {plan.subtitle ? <Text style={styles.planSubtitle}>{plan.subtitle}</Text> : <View style={styles.planSubtitleSpacer} />}
              </AnimatedPressable>
            );

            return active ? (
              <NeonOutline key={plan.key} borderRadius={theme.radius.lg} color="rgba(0, 229, 204, 0.44)">
                {planCard}
              </NeonOutline>
            ) : (
              <View key={plan.key}>{planCard}</View>
            );
          })}
        </View>

        {selectedPlanInfo ? (
          <GlowPulseView duration={900} minOpacity={0.95} maxOpacity={1} minScale={1} maxScale={1.01}>
            <NeonButton
              label="Premium'a Geç"
              fullWidth
              variant="gold"
              onPress={() => {
                // TODO: Connect subscription flow.
              }}
            />
          </GlowPulseView>
        ) : (
          <ErrorState
            title="Plan bilgisi yüklenemedi"
            message="Lütfen tekrar deneyin."
            actionLabel="Yenile"
            onActionPress={() => {
              // TODO: Reload remote plan configuration.
            }}
          />
        )}

        <HelperText text="Ödeme entegrasyonu daha sonra aktif edilecektir." tone="warning" style={styles.noteText} />

        <NeonButton label="Daha sonra" fullWidth variant="ghost" icon={<Shield size={14} color={theme.colors.textSecondary} />} onPress={() => router.back()} />

      </ScrollView>

      <BottomTabBar<BottomKey>
        tabs={bottomTabs}
        activeKey="profile"
        onTabPress={(key) => {
          if (key === "map") router.push(ROUTES.tabs.map);
          if (key === "missions") router.push(ROUTES.tabs.missions);
          if (key === "store") router.push(ROUTES.tabs.store);
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
    gap: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  title: {
    marginTop: 4,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 28,
  },
  subtitle: {
    marginTop: 2,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
    maxWidth: 300,
  },
  headerBadge: {
    marginTop: 8,
  },
  closeBtn: {
    marginTop: 6,
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceCard,
    alignItems: "center",
    justifyContent: "center",
  },
  heroCard: {
    borderColor: "rgba(255, 200, 87, 0.30)",
    backgroundColor: "rgba(18, 14, 6, 0.92)",
  },
  heroContent: {
    gap: theme.spacing.sm,
  },
  heroGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 200, 87, 0.06)",
  },
  badgeWrap: {
    alignSelf: "flex-start",
    borderRadius: theme.radius.full,
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: "rgba(255, 200, 87, 0.34)",
    backgroundColor: "rgba(255, 200, 87, 0.10)",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: theme.colors.goldReward,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 10,
    letterSpacing: 0.6,
  },
  benefitsContent: {
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.base,
  },
  benefitsList: {
    marginTop: 4,
    gap: 8,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 204, 0.34)",
    backgroundColor: "rgba(0, 229, 204, 0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  benefitText: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
  },
  planRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  planRowNarrow: {
    flexDirection: "column",
  },
  planCard: {
    flex: 1,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceCard,
    padding: theme.spacing.sm,
    minHeight: 124,
    justifyContent: "space-between",
  },
  planCardNarrow: {
    width: "100%",
  },
  planCardActive: {
    borderColor: "rgba(0, 229, 204, 0.50)",
    backgroundColor: "rgba(0, 229, 204, 0.07)",
  },
  planTopRow: {
    gap: 8,
  },
  planTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.base,
  },
  planTitleActive: {
    color: theme.colors.primaryCyan,
  },
  planPrice: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xl,
  },
  planPriceActive: {
    color: theme.colors.goldReward,
  },
  planSubtitle: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  planSubtitleSpacer: {
    height: 16,
  },
  planBadgeWrap: {
    alignSelf: "flex-start",
    borderRadius: theme.radius.full,
  },
  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: "rgba(255, 200, 87, 0.34)",
    backgroundColor: "rgba(255, 200, 87, 0.09)",
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  planBadgeText: {
    color: theme.colors.goldReward,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 9,
  },
  noteText: {
    textAlign: "center",
    marginTop: 2,
  },
  bottomTabs: {
    borderTopColor: theme.colors.borderSubtle,
  },
  pressed: {
    opacity: 0.86,
  },
});

