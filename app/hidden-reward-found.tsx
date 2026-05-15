import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Sparkles, Trophy, X } from "lucide-react-native";
import { AlanGoLogo, NeonButton, RewardCard, RewardCratePlaceholder } from "@/components/ui";
import { theme } from "@/constants/theme";
import { GlowPulseView, ShimmerBadge } from "@/components/motion";
import { AmbientGlow, ParticleDots } from "@/components/fx";
import { ROUTES } from "@/constants/routes";
import { getBottomCtaPadding } from "@/constants/safeArea";

export default function HiddenRewardFoundScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;
  const revealFlash = useRef(new Animated.Value(0.18)).current;

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    );

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 920, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 920, useNativeDriver: true }),
      ])
    );

    const particleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(particleAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    );

    const ringLoop = Animated.loop(
      Animated.timing(ringRotate, {
        toValue: 1,
        duration: 3200,
        useNativeDriver: true,
      })
    );

    floatLoop.start();
    glowLoop.start();
    particleLoop.start();
    ringLoop.start();
    Animated.timing(revealFlash, { toValue: 0, duration: 560, useNativeDriver: true }).start();

    return () => {
      floatLoop.stop();
      glowLoop.stop();
      particleLoop.stop();
      ringLoop.stop();
    };
  }, [floatAnim, glowAnim, particleAnim, revealFlash, ringRotate]);

  const ringSpin = ringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <AmbientGlow cyanOpacity={0.04} purpleOpacity={0.03} />
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />
      <ParticleDots count={10} color="rgba(255, 200, 87, 0.34)" />
      <View style={styles.particlesLayer} pointerEvents="none">
        {Array.from({ length: 10 }).map((_, idx) => (
          <Animated.View
            key={idx}
            style={[
              styles.particle,
              {
                top: `${8 + (idx % 6) * 12}%`,
                left: `${6 + (idx * 13) % 88}%`,
                opacity: particleAnim.interpolate({
                  inputRange: [0, 1],
                    outputRange: [0.14 + (idx % 3) * 0.04, 0.44],
                }),
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.headerRow}>
        <Pressable style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]} onPress={() => router.back()}>
          <X size={16} color={theme.colors.textPrimary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <AlanGoLogo size="sm" glow="none" />
          <View style={styles.legendaryPill}>
            <Sparkles size={12} color={theme.colors.goldReward} />
            <Text style={styles.legendaryText}>LEGENDARY DROP</Text>
          </View>
        </View>
        <View style={styles.backBtnGhost} />
      </View>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.crateWrap,
            {
              transform: [
                {
                  translateY: floatAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -8],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View style={[styles.crateRing, { transform: [{ rotate: ringSpin }] }]} />
          <Animated.View style={[styles.crateGlowLarge, { opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.6] }) }]} />
          <Animated.View style={[styles.crateGlowSmall, { opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.36, 0.72] }) }]} />
          <ShimmerBadge style={styles.crateCard} shimmerColor="rgba(255, 200, 87, 0.22)">
            <RewardCratePlaceholder variant="reward" size={160} />
          </ShimmerBadge>
        </Animated.View>

        <Text style={styles.title}>Gizli Ödül Bulundu!</Text>
        <Text style={styles.subtitle}>Bu alanı fethederek nadir bir ödül keşfettin.</Text>

        <RewardCard
          title="Özel Keşif Ödülü"
          description="Sponsorlu Ürün / Token / Kupon varyasyonlarından biri"
          rewardText="1.000 TL Nakit Ödül"
          icon={<Trophy size={18} color={theme.colors.goldReward} />}
          variant="gold"
          onPress={() => {
            // TODO: Open reward detail modal.
          }}
        />

        <Text style={styles.detailText}>Ödülünü almak için doğrulama adımlarını tamamla.</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: getBottomCtaPadding(insets.bottom, theme.spacing.md) }]}>
        <GlowPulseView duration={820} minOpacity={0.93} maxOpacity={1} minScale={1} maxScale={1.02}>
          <ShimmerBadge style={styles.ctaShimmerWrap} shimmerColor="rgba(255, 200, 87, 0.22)">
            <NeonButton label="Ödülü Talep Et" fullWidth variant="gold" onPress={() => router.push(ROUTES.rewardClaim)} />
          </ShimmerBadge>
        </GlowPulseView>
        <NeonButton label="Daha Sonra" fullWidth variant="ghost" onPress={() => router.back()} />
      </View>

      <Animated.View pointerEvents="none" style={[styles.flashOverlay, { opacity: revealFlash }]} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDeep,
    paddingHorizontal: theme.spacing.lg,
  },
  glowOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(255, 200, 87, 0.10)",
    top: -90,
    right: -80,
  },
  glowTwo: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(0, 229, 204, 0.07)",
    bottom: -80,
    left: -90,
  },
  particlesLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255, 200, 87, 0.42)",
  },
  headerRow: {
    marginTop: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceCard,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnGhost: {
    width: 38,
    height: 38,
  },
  legendaryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: "rgba(255, 200, 87, 0.34)",
    backgroundColor: "rgba(255, 200, 87, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  headerCenter: {
    alignItems: "center",
    gap: 6,
  },
  legendaryText: {
    color: theme.colors.goldReward,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.xs,
    letterSpacing: 0.6,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: theme.spacing.md,
  },
  crateWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  crateGlowLarge: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(255, 200, 87, 0.12)",
  },
  crateGlowSmall: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 200, 87, 0.15)",
  },
  crateRing: {
    position: "absolute",
    width: 186,
    height: 186,
    borderRadius: 93,
    borderWidth: 1,
    borderColor: "rgba(255, 200, 87, 0.24)",
    borderTopColor: "rgba(255, 200, 87, 0.56)",
    borderBottomColor: "rgba(255, 200, 87, 0.14)",
  },
  crateCard: {
    width: 160,
    height: 160,
    borderRadius: 28,
  },
  title: {
    color: theme.colors.textPrimary,
    textAlign: "center",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 30,
    lineHeight: 36,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.base,
    lineHeight: 23,
    paddingHorizontal: theme.spacing.md,
  },
  detailText: {
    marginTop: 4,
    color: theme.colors.textMuted,
    textAlign: "center",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
  },
  footer: {
    gap: theme.spacing.sm,
  },
  ctaShimmerWrap: {
    borderRadius: theme.radius.md,
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 236, 180, 0.20)",
  },
  pressed: {
    opacity: 0.86,
  },
});

