import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navigation, Layers, Radar, Shield, Swords } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useState, useEffect, useRef } from "react";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useGameStore } from "@/stores/gameStore";
import { darkMapStyle } from "@/constants/mapStyles";

const { height } = Dimensions.get("window");

// Hex avatar component
function HexAvatar({ initials, color = Colors.cyan, size = 44 }: { initials: string; color?: string; size?: number }) {
  return (
    <View style={[styles.hexAvatar, { width: size, height: size, borderRadius: size * 0.22, borderColor: color }]}>
      <Text style={[styles.hexAvatarText, { color, fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [cityName, setCityName] = useState<string>("Konum bekleniyor...");
  const { territories, totalArea, loadTerritories } = useGameStore();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => { loadTerritories(); }, [loadTerritories]);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let isMounted = true;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted" || !isMounted) return;
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 2 },
        (loc) => {
          if (!isMounted) return;
          const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          setLocation((prev) => {
            if (!prev) {
              mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.005, longitudeDelta: 0.005 }, 600);
              Location.reverseGeocodeAsync(coords).then((results) => {
                if (results.length > 0) {
                  const r = results[0];
                  setCityName(r.district ?? r.city ?? r.region ?? "");
                }
              }).catch(() => {});
            }
            return coords;
          });
        }
      );
    })();
    return () => { isMounted = false; subscription?.remove(); };
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.8, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.5, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim, glowAnim]);

  const handleCenterOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({ ...location, latitudeDelta: 0.005, longitudeDelta: 0.005 }, 600);
    }
  };

  const initialRegion = location
    ? { ...location, latitudeDelta: 0.005, longitudeDelta: 0.005 }
    : { latitude: 36.8969, longitude: 30.7133, latitudeDelta: 0.005, longitudeDelta: 0.005 };

  const pulseOpacity = pulseAnim.interpolate({ inputRange: [1, 1.8], outputRange: [0.5, 0] });

  const totalAreaKm2 = (totalArea / 1_000_000).toFixed(1);
  const mahallePct = Math.min(Math.round(totalArea / 500), 100);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        customMapStyle={Platform.OS === "android" ? darkMapStyle : undefined}
        initialRegion={initialRegion}
        showsCompass={false}
        showsScale={false}
        toolbarEnabled={false}
      >
        {territories.map((t) => (
          <Polygon
            key={t.id}
            coordinates={t.polygon}
            strokeColor={`${Colors.cyan}90`}
            strokeWidth={2}
            fillColor={t.color ?? `${Colors.cyan}25`}
          />
        ))}
        {location && (
          <Marker coordinate={location} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.playerMarkerContainer}>
              <Animated.View style={[styles.playerPulse, { transform: [{ scale: pulseAnim }], opacity: pulseOpacity }]} />
              <Animated.View style={[styles.playerPulse2, { opacity: glowAnim }]} />
              <View style={styles.playerDotOuter}>
                <View style={styles.playerDotInner} />
              </View>
            </View>
          </Marker>
        )}
      </MapView>

      {/* Top bar */}
      <SafeAreaView style={styles.topBar} edges={["top"]}>
        {/* Left: user info */}
        <TouchableOpacity style={styles.userCard} onPress={() => router.push("/(tabs)/profile")}>
          <HexAvatar initials="AY" color={Colors.cyan} size={40} />
          <View style={styles.userInfo}>
            <View style={styles.rankRow}>
              <Text style={styles.rankText}>KOMUTAN</Text>
              <View style={styles.eliteBadge}>
                <Text style={styles.eliteText}>ELİTE</Text>
              </View>
            </View>
            <Text style={styles.usernameText}>Ahmet Yılmaz</Text>
          </View>
        </TouchableOpacity>

        {/* Right: currencies */}
        <View style={styles.currencyGroup}>
          <View style={styles.currencyBadge}>
            <Text style={styles.currencyIcon}>🔗</Text>
            <Text style={styles.currencyValue}>2,840</Text>
          </View>
          <View style={styles.currencyBadge}>
            <Text style={styles.currencyIcon}>⚡</Text>
            <Text style={styles.currencyValue}>86</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Rival warning badge */}
      <View style={styles.rivalWarning}>
        <View style={styles.rivalDot} />
        <Text style={styles.rivalText}>2 RAKİP YAKIN</Text>
        <Text style={styles.rivalTime}>· 1s 24dk</Text>
      </View>

      {/* Right floating buttons */}
      <View style={styles.rightButtons}>
        <TouchableOpacity style={styles.floatBtn} onPress={handleCenterOnUser}>
          <Navigation size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatBtn}>
          <Layers size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.floatBtn, { borderColor: `${Colors.cyan}40` }]}>
          <Radar size={18} color={Colors.cyan} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.floatBtn, { borderColor: `${Colors.cyan}40` }]}>
          <Shield size={18} color={Colors.cyan} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.floatBtn, styles.floatBtnDanger]}>
          <Swords size={18} color={Colors.coral} />
          <View style={styles.floatBadge}><Text style={styles.floatBadgeText}>5</Text></View>
        </TouchableOpacity>
      </View>

      {/* Bottom panel */}
      <SafeAreaView style={styles.bottomPanel} edges={["bottom"]}>
        {/* Mahalle progress */}
        <View style={styles.mahalleRow}>
          <Text style={styles.mahalleLabel}>MAHALLE</Text>
          <Text style={styles.mahallePct}>{mahallePct}%</Text>
          <View style={styles.mahalleTrack}>
            <View style={[styles.mahalleBar, { width: `${mahallePct}%` }]} />
          </View>
          <Text style={styles.rivalTag}>· 2 RAKİP</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📍</Text>
            <Text style={styles.statValue}>{totalArea > 0 ? `${totalAreaKm2} km²` : "0 m²"}</Text>
            <Text style={styles.statLabel}>BÖLGEM</Text>
            <Text style={styles.statDelta}>+0.3</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statValue}>#142</Text>
            <Text style={styles.statLabel}>SIRA</Text>
            <Text style={styles.statDeltaUp}>↑3</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>STREAK</Text>
            <Text style={styles.statLabel}>gün</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.ctaButton} onPress={() => router.push("/active-game")}>
          <View style={styles.ctaLeft}>
            <View style={styles.ctaDot} />
            <Text style={styles.ctaHint}>HEDEF HAZIR</Text>
          </View>
          <Text style={styles.ctaTitle}>Bölgeyi Fethet</Text>
          <Text style={styles.ctaSub}>~0.8 km² · +340 XP · +128 altın</Text>
          <View style={styles.ctaArrow}>
            <Text style={styles.ctaArrowText}>+</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Hex avatar
  hexAvatar: {
    backgroundColor: "rgba(91, 200, 224, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  hexAvatarText: { fontWeight: "800" },

  // Player marker
  playerMarkerContainer: { width: 64, height: 64, justifyContent: "center", alignItems: "center" },
  playerPulse: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.cyan,
  },
  playerPulse2: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.cyan,
    opacity: 0.3,
  },
  playerDotOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: `${Colors.cyan}30`,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.cyan,
  },
  playerDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.cyan },

  // Top bar
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 6,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(26, 20, 40, 0.92)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  userInfo: { gap: 2 },
  rankRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  rankText: { fontSize: 9, fontWeight: "700", color: Colors.textSecondary, letterSpacing: 1 },
  eliteBadge: {
    backgroundColor: `${Colors.gold}20`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: `${Colors.gold}50`,
  },
  eliteText: { fontSize: 8, fontWeight: "800", color: Colors.gold, letterSpacing: 0.5 },
  usernameText: { fontSize: 13, fontWeight: "700", color: Colors.textPrimary },
  currencyGroup: { flexDirection: "row", gap: 6 },
  currencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(26, 20, 40, 0.92)",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  currencyIcon: { fontSize: 13 },
  currencyValue: { fontSize: 13, fontWeight: "700", color: Colors.textPrimary },

  // Rival warning
  rivalWarning: {
    position: "absolute",
    top: height * 0.14,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(240, 106, 90, 0.18)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${Colors.coral}60`,
    gap: 6,
  },
  rivalDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.coral },
  rivalText: { fontSize: 12, fontWeight: "700", color: Colors.coral },
  rivalTime: { fontSize: 12, color: Colors.textSecondary },

  // Right floating buttons
  rightButtons: {
    position: "absolute",
    right: 14,
    top: height * 0.28,
    gap: 10,
  },
  floatBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(26, 20, 40, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  floatBtnDanger: { borderColor: `${Colors.coral}40`, position: "relative" },
  floatBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.coral,
    justifyContent: "center",
    alignItems: "center",
  },
  floatBadgeText: { fontSize: 10, fontWeight: "800", color: Colors.textPrimary },

  // Bottom panel
  bottomPanel: {
    position: "absolute",
    bottom: 80,
    left: 14,
    right: 14,
  },
  mahalleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(26, 20, 40, 0.88)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 8,
  },
  mahalleLabel: { fontSize: 10, fontWeight: "700", color: Colors.textSecondary, letterSpacing: 1 },
  mahallePct: { fontSize: 12, fontWeight: "800", color: Colors.textPrimary },
  mahalleTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.surfaceBorder,
    borderRadius: 2,
    overflow: "hidden",
  },
  mahalleBar: { height: "100%", backgroundColor: Colors.cyan, borderRadius: 2 },
  rivalTag: { fontSize: 11, color: Colors.coral, fontWeight: "600" },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(26, 20, 40, 0.9)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    padding: 14,
    marginBottom: 10,
  },
  statItem: { flex: 1, alignItems: "center", gap: 2 },
  statIcon: { fontSize: 14 },
  statValue: { fontSize: 18, fontWeight: "800", color: Colors.textPrimary },
  statLabel: { fontSize: 9, color: Colors.textSecondary, letterSpacing: 0.5, fontWeight: "600" },
  statDelta: { fontSize: 10, color: Colors.textSecondary },
  statDeltaUp: { fontSize: 10, color: Colors.emerald, fontWeight: "700" },
  statDivider: { width: 1, backgroundColor: Colors.surfaceBorder, alignSelf: "stretch", marginVertical: 4 },
  ctaButton: {
    backgroundColor: Colors.cyan,
    borderRadius: 20,
    padding: 18,
    paddingRight: 60,
    position: "relative",
    overflow: "hidden",
  },
  ctaLeft: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  ctaDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.background },
  ctaHint: { fontSize: 10, fontWeight: "700", color: Colors.background, opacity: 0.7, letterSpacing: 1 },
  ctaTitle: { fontSize: 20, fontWeight: "800", color: Colors.background, marginBottom: 2 },
  ctaSub: { fontSize: 11, color: Colors.background, opacity: 0.7 },
  ctaArrow: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.purple,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaArrowText: { fontSize: 24, fontWeight: "300", color: Colors.textPrimary, marginTop: -2 },
});
