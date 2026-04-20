import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X, Pause } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useEffect, useState, useRef, useCallback } from "react";
import MapView, { Marker, Polyline, Polygon, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useGameStore, computePolygonArea } from "@/stores/gameStore";
import { darkMapStyle } from "@/constants/mapStyles";

const FALLBACK = { latitude: 36.8969, longitude: 30.7133 };
const CLOSE_DISTANCE_THRESHOLD = 30;
const MIN_TRAIL_POINTS = 10;
const SPEED_LIMIT_KMH = 25;

function getDistanceMeters(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinLon * sinLon;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function formatTime(seconds: number): string {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ActiveGameScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const { addTerritory, setLastRun, territories } = useGameStore();

  const [currentPos, setCurrentPos] = useState<{ latitude: number; longitude: number } | null>(null);
  const [trail, setTrail] = useState<{ latitude: number; longitude: number }[]>([]);
  const startPoint = useRef<{ latitude: number; longitude: number } | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [closed, setClosed] = useState(false);
  const [nearStart, setNearStart] = useState(false);
  const [liveArea, setLiveArea] = useState(0);
  const [speedViolation, setSpeedViolation] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (closed) return;
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [closed]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.8, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let isMounted = true;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted" || !isMounted) return;
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 2 },
        (loc) => {
          if (!isMounted || closed) return;
          const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          const rawSpeed = loc.coords.speed != null && loc.coords.speed >= 0 ? loc.coords.speed : 0;
          setSpeed(rawSpeed);
          setCurrentPos(coords);
          if (rawSpeed * 3.6 > SPEED_LIMIT_KMH) { setSpeedViolation(true); return; }
          setSpeedViolation(false);
          setTrail((prev) => {
            if (prev.length > 0) {
              const dist = getDistanceMeters(prev[prev.length - 1], coords);
              if (dist < 2) return prev;
              setTotalDistance((d) => d + dist);
            }
            if (prev.length === 0) {
              startPoint.current = coords;
              mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.003, longitudeDelta: 0.003 }, 600);
            }
            const updated = [...prev, coords];
            if (startPoint.current && updated.length >= MIN_TRAIL_POINTS) {
              setNearStart(getDistanceMeters(coords, startPoint.current) <= CLOSE_DISTANCE_THRESHOLD);
            }
            if (updated.length >= 3) setLiveArea(computePolygonArea(updated));
            return updated;
          });
        }
      );
    })();
    return () => { isMounted = false; subscription?.remove(); };
  }, [closed]);

  const handleClose = () => router.replace("/(tabs)/map");

  const handleCapture = useCallback(() => {
    if (closed) { router.push("/result"); return; }
    if (trail.length < MIN_TRAIL_POINTS) { router.replace("/(tabs)/map"); return; }
    const closedTrail = [...trail, trail[0]];
    const area = computePolygonArea(closedTrail);
    addTerritory({ polygon: closedTrail, area, distance: totalDistance, duration: elapsed });
    setLastRun({ polygon: closedTrail, area, distance: totalDistance, duration: elapsed });
    setTrail(closedTrail);
    setLiveArea(area);
    setClosed(true);
  }, [trail, closed, router, totalDistance, elapsed, addTerritory, setLastRun]);

  const region = currentPos
    ? { ...currentPos, latitudeDelta: 0.003, longitudeDelta: 0.003 }
    : { ...FALLBACK, latitudeDelta: 0.003, longitudeDelta: 0.003 };

  const pulseOpacity = pulseAnim.interpolate({ inputRange: [1, 1.8], outputRange: [0.4, 0] });
  const canClose = trail.length >= MIN_TRAIL_POINTS;
  const distKm = (totalDistance / 1000).toFixed(2);
  const areaKm2 = (liveArea / 1_000_000).toFixed(2);

  // Closing distance progress (0 to 1 when within threshold)
  const closeProgress = nearStart ? 1 : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top metrics bar */}
      <View style={styles.topMetrics}>
        <View style={styles.topLeft}>
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <X size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.statusPill}>
            <View style={[styles.statusDot, closed ? styles.statusDotClosed : styles.statusDotActive]} />
            <Text style={styles.statusText}>
              {closed ? "TAMAMLANDI" : "YAKALAMA AKTİF"}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.closeLineBtn} onPress={() => {}}>
          <Text style={styles.closeLineTxt}>Çizgiyi kapat</Text>
        </TouchableOpacity>
      </View>

      {/* Metric pills */}
      <View style={styles.metricBar}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>SÜRE</Text>
          <Text style={styles.metricValue}>{formatTime(elapsed)}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>KM</Text>
          <Text style={styles.metricValue}>{distKm}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>KM²</Text>
          <Text style={styles.metricValue}>{areaKm2}</Text>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          customMapStyle={Platform.OS === "android" ? darkMapStyle : undefined}
          initialRegion={region}
          showsCompass={false}
          showsScale={false}
          toolbarEnabled={false}
        >
          {territories.map((t) => (
            <Polygon key={t.id} coordinates={t.polygon} strokeColor={`${Colors.cyan}50`} strokeWidth={2} fillColor={t.color ?? `${Colors.cyan}18`} />
          ))}
          {trail.length >= 2 && (
            <Polyline coordinates={trail} strokeColor={Colors.cyan} strokeWidth={4} lineDashPattern={closed ? undefined : [8, 4]} />
          )}
          {closed && trail.length >= 3 && (
            <Polygon coordinates={trail} strokeColor={Colors.cyan} strokeWidth={3} fillColor={`${Colors.cyan}28`} />
          )}
          {startPoint.current && !closed && trail.length >= 3 && (
            <>
              <Circle center={startPoint.current} radius={CLOSE_DISTANCE_THRESHOLD} strokeColor={`${Colors.cyan}30`} fillColor={`${Colors.cyan}08`} strokeWidth={1} />
              <Marker coordinate={startPoint.current} anchor={{ x: 0.5, y: 0.5 }}>
                <View style={styles.startMarker} />
              </Marker>
            </>
          )}
          {currentPos && (
            <Marker coordinate={currentPos} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.playerMarkerContainer}>
                <Animated.View style={[styles.playerPulse, { transform: [{ scale: pulseAnim }], opacity: pulseOpacity }]} />
                <View style={styles.playerDot} />
              </View>
            </Marker>
          )}
        </MapView>

        {/* Rival warning on map */}
        {!closed && (
          <View style={styles.rivalBadge}>
            <Text style={styles.rivalBadgeIcon}>⚠️</Text>
            <Text style={styles.rivalBadgeText}>Rakip 80m yakında</Text>
          </View>
        )}

        {/* Speed violation */}
        {speedViolation && !closed && (
          <View style={styles.speedBadge}>
            <Text style={styles.speedBadgeText}>Hız limiti: maks {SPEED_LIMIT_KMH} km/s</Text>
          </View>
        )}
      </View>

      {/* Bottom panel */}
      <View style={[styles.bottomPanel, { paddingBottom: insets.bottom + 12 }]}>
        {/* Closing distance */}
        <View style={styles.closeDistSection}>
          <View style={styles.closeDistRow}>
            <Text style={styles.closeDistLabel}>KAPANMA MESAFESİ</Text>
            <Text style={[styles.closeDistValue, nearStart && { color: Colors.emerald }]}>
              {nearStart ? "Kapat!" : `${Math.max(0, Math.round(CLOSE_DISTANCE_THRESHOLD - (startPoint.current && trail.length > 0 ? getDistanceMeters(trail[trail.length - 1] ?? FALLBACK, startPoint.current) : CLOSE_DISTANCE_THRESHOLD)))}m kaldı`}
            </Text>
          </View>
          <View style={styles.closeTrack}>
            <View
              style={[
                styles.closeBar,
                {
                  width: `${Math.min(100, canClose ? (nearStart ? 100 : 60) : 20)}%`,
                  backgroundColor: nearStart ? Colors.emerald : Colors.cyan,
                },
              ]}
            />
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.pauseBtn} onPress={handleClose}>
            <Pause size={18} color={Colors.textPrimary} />
            <Text style={styles.pauseTxt}>Duraklat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.captureBtn,
              closed ? styles.captureBtnResult : nearStart ? styles.captureBtnReady : styles.captureBtnDefault,
            ]}
            onPress={handleCapture}
          >
            <Text style={styles.captureTxt}>
              {closed ? "Sonuçları Gör ›" : "Bölgeyi Kapat ✓"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.background,
    zIndex: 10,
  },
  topLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceSolid,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.surfaceSolid,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusDotActive: { backgroundColor: Colors.coral },
  statusDotClosed: { backgroundColor: Colors.emerald },
  statusText: { fontSize: 11, fontWeight: "700", color: Colors.textPrimary, letterSpacing: 0.5 },
  closeLineBtn: {
    backgroundColor: `${Colors.cyan}18`,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${Colors.cyan}40`,
  },
  closeLineTxt: { fontSize: 12, fontWeight: "600", color: Colors.cyan },
  metricBar: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceSolid,
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 8,
    overflow: "hidden",
  },
  metricItem: { flex: 1, alignItems: "center", paddingVertical: 12 },
  metricLabel: { fontSize: 9, fontWeight: "700", color: Colors.textMuted, letterSpacing: 1.5, marginBottom: 4 },
  metricValue: { fontSize: 20, fontWeight: "800", color: Colors.textPrimary },
  metricDivider: { width: 1, backgroundColor: Colors.surfaceBorder, marginVertical: 10 },
  mapContainer: { flex: 1, position: "relative" },
  startMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.cyan,
    borderWidth: 3,
    borderColor: Colors.background,
  },
  playerMarkerContainer: { width: 60, height: 60, justifyContent: "center", alignItems: "center" },
  playerPulse: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.cyan,
  },
  playerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.cyan,
    borderWidth: 3,
    borderColor: Colors.background,
  },
  rivalBadge: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(26, 20, 40, 0.92)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: `${Colors.warning}50`,
  },
  rivalBadgeIcon: { fontSize: 14 },
  rivalBadgeText: { fontSize: 13, fontWeight: "600", color: Colors.warning },
  speedBadge: {
    position: "absolute",
    top: 12,
    alignSelf: "center",
    backgroundColor: `${Colors.coral}20`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${Colors.coral}60`,
  },
  speedBadgeText: { fontSize: 12, fontWeight: "600", color: Colors.coral },
  bottomPanel: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
  },
  closeDistSection: { marginBottom: 16 },
  closeDistRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  closeDistLabel: { fontSize: 10, fontWeight: "700", color: Colors.textSecondary, letterSpacing: 1 },
  closeDistValue: { fontSize: 12, fontWeight: "700", color: Colors.cyan },
  closeTrack: {
    height: 4,
    backgroundColor: Colors.surfaceBorder,
    borderRadius: 2,
    overflow: "hidden",
  },
  closeBar: { height: "100%", borderRadius: 2 },
  actionRow: { flexDirection: "row", gap: 12 },
  pauseBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.surfaceSolid,
    paddingHorizontal: 20,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  pauseTxt: { fontSize: 14, fontWeight: "600", color: Colors.textPrimary },
  captureBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  captureBtnDefault: { backgroundColor: `${Colors.cyan}30`, borderWidth: 1, borderColor: Colors.cyan },
  captureBtnReady: { backgroundColor: Colors.emerald },
  captureBtnResult: { backgroundColor: Colors.cyan },
  captureTxt: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary },
});
