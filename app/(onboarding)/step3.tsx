import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OnboardingStep3() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 1400, useNativeDriver: true }),
      ])
    ).start();

    Animated.timing(progressAnim, { toValue: 1, duration: 2200, useNativeDriver: false }).start();

    const timer = setTimeout(async () => {
      await AsyncStorage.setItem("alango_onboarding_done", "true");
      router.replace("/(auth)/signin");
    }, 2800);

    return () => clearTimeout(timer);
  }, [router, scaleAnim, opacityAnim, glowAnim, progressAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.glowBlob, { opacity: glowAnim }]} />

      <Animated.View style={[styles.content, { opacity: opacityAnim }]}>
        {/* Victory hex */}
        <Animated.View style={[styles.hexWrapper, { transform: [{ scale: scaleAnim }] }]}>
          <Animated.View style={[styles.hexGlow, { opacity: glowAnim }]} />
          <View style={styles.hexContainer}>
            <View style={styles.hexInner}>
              <Text style={styles.hexEmoji}>🏴</Text>
            </View>
          </View>
        </Animated.View>

        <Text style={styles.title}>Komutan Hazır!</Text>
        <Text style={styles.subtitle}>
          Profilin oluşturuldu. Mahallenin hükümdarı olmak için savaşa hazırsın.
        </Text>

        {/* Stats preview */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0 m²</Text>
            <Text style={styles.statLabel}>Bölge</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>LV 1</Text>
            <Text style={styles.statLabel}>Seviye</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>ÇAVUŞ</Text>
            <Text style={styles.statLabel}>Rütbe</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
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
          </View>
          <Text style={styles.progressText}>Haritana yönlendiriliyorsun...</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  glowBlob: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: Colors.emerald,
    opacity: 0.05,
    top: "10%",
    left: "-25%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  hexWrapper: { position: "relative", marginBottom: 40 },
  hexGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.emerald,
    opacity: 0.2,
    top: -20,
    left: -20,
  },
  hexContainer: {
    width: 140,
    height: 140,
    borderRadius: 28,
    backgroundColor: `${Colors.emerald}18`,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: `${Colors.emerald}40`,
  },
  hexInner: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: `${Colors.emerald}28`,
    justifyContent: "center",
    alignItems: "center",
  },
  hexEmoji: { fontSize: 48 },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceSolid,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 48,
    width: "100%",
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 16, fontWeight: "700", color: Colors.emerald, marginBottom: 4 },
  statLabel: { fontSize: 11, color: Colors.textSecondary },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.surfaceBorder },
  progressSection: { width: "70%", alignItems: "center" },
  progressTrack: {
    width: "100%",
    height: 2,
    backgroundColor: Colors.surfaceBorder,
    borderRadius: 1,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBar: { height: "100%", backgroundColor: Colors.emerald, borderRadius: 1 },
  progressText: { fontSize: 12, color: Colors.textMuted, letterSpacing: 0.5 },
});
