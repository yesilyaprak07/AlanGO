import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/constants/theme";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/lib/auth";
import { AlanGoLogo, AvatarPlaceholder, GlassCard } from "@/components/ui";
import { GlowPulseView, ShimmerBadge } from "@/components/motion";
import { AmbientGlow, ParticleDots } from "@/components/fx";
import { getScreenBottomPadding } from "@/constants/safeArea";
import { ROUTES } from "@/constants/routes";

export default function SplashScreen() {
  const router = useRouter();
  const { session, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const glowAnim = useRef(new Animated.Value(0.6)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const sloganOpacity = useRef(new Animated.Value(0)).current;
  const sloganY = useRef(new Animated.Value(10)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(logoScale, { toValue: 1, duration: 460, useNativeDriver: true }),
      Animated.timing(sloganOpacity, { toValue: 1, duration: 380, delay: 180, useNativeDriver: true }),
      Animated.timing(sloganY, { toValue: 0, duration: 380, delay: 180, useNativeDriver: true }),
    ]).start();

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.6, duration: 1800, useNativeDriver: true }),
      ])
    );

    const ringLoop = Animated.loop(
      Animated.timing(ringRotate, {
        toValue: 1,
        duration: 4800,
        useNativeDriver: true,
      })
    );

    glowLoop.start();
    ringLoop.start();

    Animated.timing(progressAnim, { toValue: 1, duration: 2600, useNativeDriver: false }).start();

    return () => {
      glowLoop.stop();
      ringLoop.stop();
    };
  }, [fadeAnim, glowAnim, logoOpacity, logoScale, progressAnim, ringRotate, sloganOpacity, sloganY]);

  const ringSpin = ringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(async () => {
      if (session) {
        router.replace(ROUTES.tabs.map);
      } else {
        const done = await AsyncStorage.getItem("alango_onboarding_done");
        if (done === "true") {
          router.replace(ROUTES.auth.signin);
        } else {
          router.replace(ROUTES.onboarding.step1);
        }
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [loading, session, router]);

  return (
    <SafeAreaView style={styles.container}>
      <AmbientGlow cyanOpacity={0.08} purpleOpacity={0.08} />
      <ParticleDots count={12} color="rgba(0, 229, 204, 0.48)" />
      {/* Background glow blobs */}
      <Animated.View style={[styles.glowBlob1, { opacity: glowAnim }]} />
      <Animated.View style={[styles.glowBlob2, { opacity: glowAnim }]} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <GlassCard contentStyle={styles.logoPanelContent} style={styles.logoPanel}>
          <Animated.View style={[styles.iconWrapper, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
            <Animated.View style={[styles.logoRing, { transform: [{ rotate: ringSpin }], opacity: glowAnim }]} />
            <Animated.View style={[styles.iconGlow, { opacity: glowAnim }]} />
            <View style={styles.iconContainer}>
              <AlanGoLogo size="lg" glow="none" />
            </View>
          </Animated.View>

          <Animated.Text style={[styles.tagline, { opacity: sloganOpacity, transform: [{ translateY: sloganY }] }]}>Ciz, Kapat, Fethet!</Animated.Text>
          <View style={styles.characterPlaceholderRow}>
            <AvatarPlaceholder initials="AL" size={34} style={styles.characterPlaceholder} />
            <AvatarPlaceholder initials="GO" size={34} style={styles.characterPlaceholder} />
            <AvatarPlaceholder initials="XP" size={34} style={styles.characterPlaceholder} />
          </View>
        </GlassCard>
      </Animated.View>

      {/* Bottom loading section */}
      <View style={[styles.loadingSection, { paddingBottom: getScreenBottomPadding(insets.bottom, theme.spacing.xl) }]}>
        <GlowPulseView duration={560} minOpacity={0.82} maxOpacity={1}>
          <ShimmerBadge style={styles.progressTrack} shimmerColor="rgba(0, 229, 204, 0.24)">
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </ShimmerBadge>
        </GlowPulseView>
        <Text style={styles.loadingText}>YÃ¼kleniyor...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDeep,
    alignItems: "center",
    justifyContent: "center",
  },
  glowBlob1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: theme.colors.primaryCyan,
    opacity: 0.06,
    top: "10%",
    left: "-20%",
  },
  glowBlob2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: theme.colors.purple,
    opacity: 0.08,
    bottom: "12%",
    right: "-15%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: theme.spacing.xl,
  },
  logoPanel: {
    width: "100%",
    maxWidth: 360,
  },
  logoPanelContent: {
    alignItems: "center",
    paddingVertical: theme.spacing.xxl,
  },
  iconWrapper: {
    position: "relative",
    marginBottom: theme.spacing.xl,
  },
  iconGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: theme.colors.primaryCyan,
    opacity: 0.15,
    top: -20,
    left: -20,
  },
  logoRing: {
    position: "absolute",
    width: 168,
    height: 168,
    borderRadius: 84,
    top: -24,
    left: -24,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 204, 0.45)",
    borderTopColor: "rgba(139, 92, 246, 0.45)",
    borderBottomColor: "rgba(0, 229, 204, 0.16)",
  },
  iconContainer: {
    width: 180,
    height: 120,
    borderRadius: 28,
    backgroundColor: "rgba(0, 229, 204, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(0, 229, 204, 0.3)",
  },
  tagline: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.size.base,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
  },
  characterPlaceholderRow: {
    marginTop: theme.spacing.lg,
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  characterPlaceholder: {
    width: 34,
    height: 34,
  },
  loadingSection: {
    width: "72%",
    alignItems: "center",
  },
  progressTrack: {
    width: "100%",
    height: 6,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.radius.full,
    overflow: "hidden",
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  progressBar: {
    height: "100%",
    backgroundColor: theme.colors.primaryCyan,
    borderRadius: 1,
  },
  loadingText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textMuted,
    letterSpacing: 0.4,
  },
});

