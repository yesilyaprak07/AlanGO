import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Share,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Share2, ArrowRight, MapPin } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import MapView, { Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import { useGameStore } from "@/stores/gameStore";
import { darkMapStyle } from "@/constants/mapStyles";

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

function formatArea(m2: number): string {
  return `${Math.round(m2).toLocaleString("tr-TR")} m²`;
}

export default function ResultScreen() {
  const router = useRouter();
  const { lastRun, territories } = useGameStore();
  const mapRef = useRef<MapView>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const area = lastRun?.area ?? 0;
  const distance = lastRun?.distance ?? 0;
  const duration = lastRun?.duration ?? 0;
  const polygon = lastRun?.polygon ?? [];
  const xp = Math.round(area / 10) + Math.round(distance / 5);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, slideAnim]);

  // Fit map to polygon
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
        message: `AlanGO'da ${formatArea(area)} alan fethettim! Mesafe: ${formatDistance(distance)}, Süre: ${formatTime(duration)} (+${xp} XP) 🗺️`,
      });
    } catch {}
  };

  const handleContinue = () => {
    router.replace("/(tabs)/map");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Map Preview with actual polygon */}
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
              strokeColor={Colors.primary}
              strokeWidth={3}
              fillColor="rgba(0, 240, 255, 0.3)"
            />
          </MapView>
        ) : (
          <View style={styles.gridBackground}>
            <View style={styles.miniTerritory} />
            <View style={styles.miniCenter} />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.resultContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.areaValue}>{formatArea(area)}</Text>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{xp} XP</Text>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View
          style={[
            styles.statsContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.statCard}>
            <MapPin size={20} color={Colors.primary} />
            <Text style={styles.statValue}>{formatDistance(distance)}</Text>
            <Text style={styles.statLabel}>Mesafe</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statValue}>{formatTime(duration)}</Text>
            <Text style={styles.statLabel}>Süre</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏅</Text>
            <Text style={styles.statValue}>{territories.length}</Text>
            <Text style={styles.statLabel}>Bölge</Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Share2 size={20} color={Colors.primary} />
            <Text style={styles.shareText}>Paylaş</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Devam Et</Text>
            <ArrowRight size={20} color={Colors.background} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  mapPreview: {
    height: 300,
    backgroundColor: "#14181A",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  gridBackground: { flex: 1, position: "relative" },
  miniTerritory: {
    position: "absolute",
    width: 120,
    height: 100,
    backgroundColor: "rgba(0, 240, 255, 0.3)",
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.primary,
    top: 80,
    left: 60,
    transform: [{ rotate: "-15deg" }],
  },
  miniCenter: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    top: 130,
    left: 100,
  },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  resultContainer: { alignItems: "center", marginBottom: 32 },
  areaValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  xpBadge: {
    backgroundColor: "rgba(0, 240, 255, 0.15)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  xpText: { fontSize: 16, fontWeight: "600", color: Colors.primary },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  statCard: {
    width: (width - 72) / 3,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  statIcon: { fontSize: 20, marginBottom: 8 },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: { fontSize: 12, color: Colors.textSecondary },
  actions: { gap: 12 },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: 8,
  },
  shareText: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 12,
    gap: 8,
  },
  continueText: { fontSize: 16, fontWeight: "600", color: Colors.background },
});
