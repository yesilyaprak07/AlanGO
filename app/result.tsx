import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Share,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { useEffect, useRef } from "react";
import MapView, { Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import { useGameStore } from "@/stores/gameStore";
import { darkMapStyle } from "@/constants/mapStyles";
import { useAuth } from "@/lib/auth";
import { ROUTES } from "@/constants/routes";

const { width } = Dimensions.get("window");

function formatTime(seconds: number): string {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)}m`;
}

export default function ResultScreen() {
  const router = useRouter();
  const { lastRun, territories, saveGameSession } = useGameStore();
  const { profile, refreshProfile } = useAuth();
  const mapRef = useRef<MapView>(null);
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  const area = lastRun?.area ?? 0;
  const distance = lastRun?.distance ?? 0;
  const duration = lastRun?.duration ?? 0;
  const polygon = lastRun?.polygon ?? [];
  const xp = Math.round(area / 10) + Math.round(distance / 5);
  const gold = Math.round(area / 20) + 50;
  const areaKm2 = (area / 1_000_000).toFixed(2);
  const level = profile?.level ?? 1;
  const xpCurrent = profile?.xp ?? 0;
  const xpNext = level * 1000;
  const xpProgress = xpNext > 0 ? Math.min((xpCurrent / xpNext) * 100, 100) : 0;

  // Save game session to Supabase on mount
  useEffect(() => {
    if (lastRun && area > 0) {
      saveGameSession({
        polygon,
        area,
        distance,
        duration,
        xpEarned: xp,
        goldEarned: gold,
      }).then(() => refreshProfile());
    }
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 0.8, duration: 1800, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.3, duration: 1800, useNativeDriver: true }),
      ])
    );

    glowLoop.start();

    return () => {
      glowLoop.stop();
    };
  }, [scaleAnim, fadeAnim, slideAnim, glowAnim]);

  useEffect(() => {
    if (polygon.length > 0 && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(polygon, {
          edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
          animated: true,
        });
      }, 300);
    }
  }, [polygon]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `AlanGO'da ${areaKm2} km² bölge fethettim! (+${xp} XP +${gold} altın) 🏴`,
      });
    } catch {}
  };

  const handleContinue = () => router.replace(ROUTES.tabs.map);
  const handleSave = () => router.replace(ROUTES.tabs.map);

  return (
    <SafeAreaView style={styles.container}>
      {/* Map preview (top third) */}
      <View style={styles.mapPreview}>
        {polygon.length > 0 ? (
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
            customMapStyle={Platform.OS === "android" ? darkMapStyle : undefined}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            initialRegion={{
              latitude: polygon[0].latitude,
              longitude: polygon[0].longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Polygon
              coordinates={polygon}
              strokeColor={Colors.cyan}
              strokeWidth={3}
              fillColor={`${Colors.cyan}35`}
            />
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>🗺️</Text>
          </View>
        )}

        {/* Victory badge overlay */}
        <View style={styles.victoryBadge}>
          <Text style={styles.victoryEmoji}>👑</Text>
          <Text style={styles.victoryLabel}>ZAFER</Text>
          <Text style={styles.victoryEmoji}>👑</Text>
        </View>
      </View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Flag hex */}
        <Animated.View style={[styles.flagHex, { transform: [{ scale: scaleAnim }] }]}>
          <Animated.View style={[styles.flagGlow, { opacity: glowAnim }]} />
          <View style={styles.flagInner}>
            <Text style={styles.flagEmoji}>🏴</Text>
          </View>
        </Animated.View>

        <Text style={styles.victoryTitle}>Bölge Senin!</Text>
        <Text style={styles.victorySubtitle}>Karşıyaka sokak 14 artık senin egemenlik alanın</Text>

        {/* Area display */}
        <View style={styles.areaDisplay}>
          <Text style={styles.areaLabel}>ELE GEÇİRİLEN ALAN</Text>
          <Text style={styles.areaValue}>{area > 0 ? areaKm2 : "0.84"}</Text>
          <Text style={styles.areaUnit}>km²</Text>
        </View>

        {/* Level + XP */}
        <View style={styles.levelRow}>
          <Text style={styles.levelLabel}>SEVİYE {level}</Text>
          <Text style={styles.xpText}>{xpCurrent.toLocaleString()} / {xpNext.toLocaleString()} XP</Text>
        </View>
        <View style={styles.xpTrack}>
          <View style={[styles.xpBar, { width: `${xpProgress}%` }]} />
        </View>

        {/* Bonus card */}
        <View style={styles.bonusCard}>
          <Text style={styles.bonusIcon}>🔥</Text>
          <View style={styles.bonusInfo}>
            <Text style={styles.bonusTitle}>BONUSU</Text>
            <Text style={styles.bonusValue}>+{gold} altın · +{xp} XP ekstra</Text>
          </View>
          <View style={styles.bonusClaimed}>
            <Text style={styles.bonusClaimedText}>ALINDI</Text>
          </View>
        </View>

        {/* Stats mini row */}
        <View style={styles.miniStats}>
          <View style={styles.miniStatItem}>
            <Text style={styles.miniStatValue}>{formatDistance(distance)}</Text>
            <Text style={styles.miniStatLabel}>Mesafe</Text>
          </View>
          <View style={styles.miniStatDivider} />
          <View style={styles.miniStatItem}>
            <Text style={styles.miniStatValue}>{formatTime(duration)}</Text>
            <Text style={styles.miniStatLabel}>Süre</Text>
          </View>
          <View style={styles.miniStatDivider} />
          <View style={styles.miniStatItem}>
            <Text style={styles.miniStatValue}>{territories.length}</Text>
            <Text style={styles.miniStatLabel}>Toplam Bölge</Text>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>🛡️  Bölgeyi Şimdi Savun</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>Devam Et ›</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  mapPreview: {
    height: 200,
    backgroundColor: "#0F0D1A",
    position: "relative",
    overflow: "hidden",
  },
  mapPlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  mapPlaceholderText: { fontSize: 48 },
  victoryBadge: {
    position: "absolute",
    top: 16,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(26, 20, 40, 0.88)",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${Colors.gold}50`,
  },
  victoryEmoji: { fontSize: 14 },
  victoryLabel: { fontSize: 12, fontWeight: "800", color: Colors.gold, letterSpacing: 3 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 0,
    alignItems: "center",
    overflow: "hidden",
  },
  flagHex: {
    position: "relative",
    marginTop: -40,
    marginBottom: 12,
  },
  flagGlow: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.purple,
    opacity: 0.2,
    top: -10,
    left: -10,
  },
  flagInner: {
    width: 110,
    height: 110,
    borderRadius: 22,
    backgroundColor: `${Colors.purple}25`,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: `${Colors.purple}50`,
  },
  flagEmoji: { fontSize: 52 },
  victoryTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 4,
    textAlign: "center",
  },
  victorySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  areaDisplay: { alignItems: "center", marginBottom: 14 },
  areaLabel: { fontSize: 10, fontWeight: "700", color: Colors.textSecondary, letterSpacing: 1.5, marginBottom: 4 },
  areaValue: { fontSize: 52, fontWeight: "800", color: Colors.cyan, lineHeight: 56 },
  areaUnit: { fontSize: 18, fontWeight: "600", color: Colors.textSecondary },
  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 6,
  },
  levelLabel: { fontSize: 11, fontWeight: "700", color: Colors.textSecondary, letterSpacing: 0.5 },
  xpText: { fontSize: 11, color: Colors.cyan, fontWeight: "600" },
  xpTrack: {
    width: "100%",
    height: 4,
    backgroundColor: Colors.surfaceBorder,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 12,
  },
  xpBar: { height: "100%", backgroundColor: Colors.purple, borderRadius: 2 },
  bonusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceSolid,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    width: "100%",
    marginBottom: 12,
    gap: 12,
  },
  bonusIcon: { fontSize: 24 },
  bonusInfo: { flex: 1 },
  bonusTitle: { fontSize: 10, fontWeight: "700", color: Colors.textSecondary, letterSpacing: 1 },
  bonusValue: { fontSize: 13, fontWeight: "600", color: Colors.textPrimary },
  bonusClaimed: {
    backgroundColor: `${Colors.coral}20`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${Colors.coral}40`,
  },
  bonusClaimedText: { fontSize: 10, fontWeight: "700", color: Colors.coral },
  miniStats: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: Colors.surfaceSolid,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    padding: 14,
    marginBottom: 14,
  },
  miniStatItem: { flex: 1, alignItems: "center" },
  miniStatValue: { fontSize: 15, fontWeight: "700", color: Colors.textPrimary, marginBottom: 2 },
  miniStatLabel: { fontSize: 10, color: Colors.textSecondary },
  miniStatDivider: { width: 1, backgroundColor: Colors.surfaceBorder },
  saveButton: {
    width: "100%",
    backgroundColor: Colors.emerald,
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: { fontSize: 15, fontWeight: "700", color: Colors.background },
  continueButton: {
    width: "100%",
    backgroundColor: Colors.surfaceSolid,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  continueText: { fontSize: 15, fontWeight: "600", color: Colors.textSecondary },
});
