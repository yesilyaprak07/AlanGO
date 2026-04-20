import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { useEffect, useRef, useState } from "react";

export default function KillDeathScreen() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [countdown, setCountdown] = useState(42);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.6, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    const timer = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [pulseAnim, fadeAnim]);

  const handleIgnore = () => router.replace("/(tabs)/map");
  const handleShield = () => router.replace("/(tabs)/map");
  const handleCounter = () => router.push("/active-game");

  const mm = String(Math.floor(countdown / 60)).padStart(2, "0");
  const ss = String(countdown % 60).padStart(2, "0");

  return (
    <View style={styles.container}>
      {/* Red background overlay */}
      <Animated.View style={[styles.redOverlay, { opacity: pulseAnim }]} />

      {/* Map-like dark background pattern */}
      <View style={styles.mapBg}>
        {/* Fake territory shapes */}
        <View style={styles.fakeTerr1} />
        <View style={styles.fakeTerr2} />
        <View style={styles.fakeAttacker} />
        <View style={styles.fakeAttackerLabel}>
          <Text style={styles.fakeAttackerText}>K42</Text>
          <Text style={styles.fakeAttackerSub}>DÜŞMAN</Text>
        </View>
        <View style={styles.fakePlayer}>
          <Text style={styles.fakePlayerText}>SEN</Text>
        </View>
      </View>

      <SafeAreaView style={styles.overlay} edges={["top", "bottom"]}>
        {/* Header alert */}
        <Animated.View style={[styles.alertHeader, { opacity: fadeAnim }]}>
          <View style={styles.alertIconRow}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <Text style={styles.alertTitle}>BÖLGEN SALDIRI ALTINDA</Text>
          </View>
          <Text style={styles.alertBody}>
            <Text style={styles.attackerName}>Kaan_42</Text>
            {" "}sınırını ihlal ediyor
          </Text>
          <View style={styles.lossRow}>
            <Text style={styles.lossLabel}>Karşıyaka HQ ·</Text>
            <Text style={styles.lossValue}> 0.4 km² kaybediyorsun</Text>
          </View>
        </Animated.View>

        <View style={styles.spacer} />

        {/* Stats row */}
        <Animated.View style={[styles.statsRow, { opacity: fadeAnim }]}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>TEHDİT</Text>
            <Text style={[styles.statValue, { color: Colors.coral }]}>YÜKSEK</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>MESAFE</Text>
            <Text style={styles.statValue}>90m</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>GERİ SAYIM</Text>
            <Text style={[styles.statValue, { color: Colors.gold }]}>{mm}:{ss}</Text>
          </View>
        </Animated.View>

        {/* Decision label */}
        <Text style={styles.decisionLabel}>KARAR VER</Text>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.shieldBtn} onPress={handleShield}>
            <Text style={styles.actionIcon}>🛡️</Text>
            <Text style={styles.shieldTxt}>Kalkan Aç</Text>
            <Text style={styles.actionSub}>120 altın · 2 saat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.counterBtn} onPress={handleCounter}>
            <Text style={styles.actionIcon}>⚔️</Text>
            <Text style={styles.counterTxt}>Karşı Saldırı</Text>
            <Text style={[styles.actionSub, { color: `${Colors.coral}CC` }]}>2x XP · şimdi</Text>
          </TouchableOpacity>
        </View>

        {/* Ignore */}
        <TouchableOpacity style={styles.ignoreBtn} onPress={handleIgnore}>
          <Text style={styles.ignoreTxt}>YOKSAY</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#150D1E" },
  redOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.coral,
    opacity: 0.08,
  },
  // Map background
  mapBg: {
    ...StyleSheet.absoluteFillObject,
  },
  fakeTerr1: {
    position: "absolute",
    width: 180,
    height: 160,
    borderRadius: 16,
    backgroundColor: `${Colors.coral}18`,
    borderWidth: 2,
    borderColor: `${Colors.coral}50`,
    top: "20%",
    right: "5%",
    transform: [{ rotate: "8deg" }],
  },
  fakeTerr2: {
    position: "absolute",
    width: 140,
    height: 120,
    borderRadius: 12,
    backgroundColor: `${Colors.purple}15`,
    borderWidth: 2,
    borderColor: `${Colors.purple}40`,
    top: "30%",
    left: "5%",
    transform: [{ rotate: "-5deg" }],
  },
  fakeAttacker: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: `${Colors.coral}30`,
    borderWidth: 2,
    borderColor: Colors.coral,
    top: "24%",
    right: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  fakeAttackerLabel: {
    position: "absolute",
    top: "20%",
    right: "12%",
    backgroundColor: `${Colors.coral}CC`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignItems: "center",
  },
  fakeAttackerText: { fontSize: 10, fontWeight: "800", color: "#fff" },
  fakeAttackerSub: { fontSize: 8, fontWeight: "600", color: "#fff" },
  fakePlayer: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: `${Colors.cyan}25`,
    borderWidth: 2,
    borderColor: Colors.cyan,
    top: "38%",
    left: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  fakePlayerText: { fontSize: 9, fontWeight: "800", color: Colors.cyan },
  overlay: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "flex-end",
  },
  alertHeader: {
    backgroundColor: "rgba(26, 20, 40, 0.95)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: `${Colors.coral}40`,
    marginBottom: 0,
    marginTop: 16,
  },
  alertIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  alertIcon: { fontSize: 18 },
  alertTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.coral,
    letterSpacing: 1,
  },
  alertBody: { fontSize: 20, fontWeight: "800", color: Colors.textPrimary, marginBottom: 4 },
  attackerName: { color: Colors.coral },
  lossRow: { flexDirection: "row", alignItems: "center" },
  lossLabel: { fontSize: 13, color: Colors.textSecondary },
  lossValue: { fontSize: 13, color: Colors.coral, fontWeight: "700" },
  spacer: { flex: 1 },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(26, 20, 40, 0.9)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 16,
  },
  statItem: { flex: 1, alignItems: "center" },
  statLabel: { fontSize: 9, fontWeight: "700", color: Colors.textSecondary, letterSpacing: 1, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: "800", color: Colors.textPrimary },
  statDivider: { width: 1, backgroundColor: Colors.surfaceBorder },
  decisionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textMuted,
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 12,
  },
  actionRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  shieldBtn: {
    flex: 1,
    backgroundColor: `${Colors.emerald}20`,
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: `${Colors.emerald}50`,
    gap: 4,
  },
  counterBtn: {
    flex: 1,
    backgroundColor: `${Colors.coral}20`,
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: `${Colors.coral}50`,
    gap: 4,
  },
  actionIcon: { fontSize: 28, marginBottom: 4 },
  shieldTxt: { fontSize: 15, fontWeight: "700", color: Colors.emerald },
  counterTxt: { fontSize: 15, fontWeight: "700", color: Colors.coral },
  actionSub: { fontSize: 11, color: `${Colors.emerald}AA`, fontWeight: "500" },
  ignoreBtn: {
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 8,
  },
  ignoreTxt: { fontSize: 12, fontWeight: "600", color: Colors.textMuted, letterSpacing: 2 },
});
