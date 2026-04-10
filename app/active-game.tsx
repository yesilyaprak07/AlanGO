import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Clock,
  Gauge,
  Navigation,
  Shield,
  Zap,
  Radar,
  X,
  MapPin,
} from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useEffect, useState, useRef, useCallback } from "react";
import MapView, { Marker, Polyline, Polygon, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useGameStore, computePolygonArea } from "@/stores/gameStore";

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
  { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] },
];

const FALLBACK = { latitude: 36.8969, longitude: 30.7133 };
const CLOSE_DISTANCE_THRESHOLD = 30; // meters — auto-close suggestion
const MIN_TRAIL_POINTS = 10; // minimum points before allowing close

function getDistanceMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number }
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinLon * sinLon;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function formatTime(seconds: number): string {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)}m`;
}

function formatArea(m2: number): string {
  if (m2 >= 1_000_000) return `${(m2 / 1_000_000).toFixed(2)} km²`;
  return `${Math.round(m2).toLocaleString("tr-TR")} m²`;
}

export default function ActiveGameScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const { addTerritory, setLastRun, territories } = useGameStore();

  const [showWarning, setShowWarning] = useState(true);
  const [currentPos, setCurrentPos] = useState<{ latitude: number; longitude: number } | null>(null);
  const [trail, setTrail] = useState<{ latitude: number; longitude: number }[]>([]);
  const startPoint = useRef<{ latitude: number; longitude: number } | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [closed, setClosed] = useState(false);
  const [nearStart, setNearStart] = useState(false);
  const [liveArea, setLiveArea] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Timer
  useEffect(() => {
    if (closed) return;
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [closed]);

  // Warning blink
  useEffect(() => {
    const interval = setInterval(() => setShowWarning((prev) => !prev), 2000);
    return () => clearInterval(interval);
  }, []);

  // Pulse animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.6, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // GPS tracking — free polygon drawing
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
          setSpeed(loc.coords.speed != null && loc.coords.speed >= 0 ? loc.coords.speed : 0);
          setCurrentPos(coords);

          setTrail((prev) => {
            // Skip tiny movements
            if (prev.length > 0) {
              const dist = getDistanceMeters(prev[prev.length - 1], coords);
              if (dist < 2) return prev;
              setTotalDistance((d) => d + dist);
            }

            // Center map on first fix
            if (prev.length === 0) {
              startPoint.current = coords;
              if (mapRef.current) {
                mapRef.current.animateToRegion(
                  { ...coords, latitudeDelta: 0.003, longitudeDelta: 0.003 },
                  600
                );
              }
            }

            const updated = [...prev, coords];

            // Check proximity to start point (auto-close hint)
            if (startPoint.current && updated.length >= MIN_TRAIL_POINTS) {
              const distToStart = getDistanceMeters(coords, startPoint.current);
              setNearStart(distToStart <= CLOSE_DISTANCE_THRESHOLD);
            }

            // Update live area preview
            if (updated.length >= 3) {
              setLiveArea(computePolygonArea(updated));
            }

            return updated;
          });
        }
      );
    })();

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [closed]);

  const handleClose = () => {
    router.replace("/(tabs)/map");
  };

  const handleCapture = useCallback(() => {
    if (closed) {
      // Navigate to result
      router.push("/result");
      return;
    }

    if (trail.length < MIN_TRAIL_POINTS) return;

    // Close the polygon: add start point to end to form a loop
    const closedTrail = [...trail, trail[0]];
    const area = computePolygonArea(closedTrail);

    // Save to store
    addTerritory({
      polygon: closedTrail,
      area,
      distance: totalDistance,
      duration: elapsed,
    });

    setLastRun({
      polygon: closedTrail,
      area,
      distance: totalDistance,
      duration: elapsed,
    });

    setTrail(closedTrail);
    setLiveArea(area);
    setClosed(true);
  }, [trail, closed, router, totalDistance, elapsed, addTerritory, setLastRun]);

  const region = currentPos
    ? { ...currentPos, latitudeDelta: 0.003, longitudeDelta: 0.003 }
    : { ...FALLBACK, latitudeDelta: 0.003, longitudeDelta: 0.003 };

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [1, 1.6],
    outputRange: [0.4, 0],
  });

  const speedKmh = (speed * 3.6).toFixed(1);
  const canClose = trail.length >= MIN_TRAIL_POINTS;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        customMapStyle={darkMapStyle}
        initialRegion={region}
        showsCompass={false}
        showsScale={false}
        toolbarEnabled={false}
      >
        {/* Previously captured territories */}
        {territories.map((t) => (
          <Polygon
            key={t.id}
            coordinates={t.polygon}
            strokeColor="rgba(0, 240, 255, 0.5)"
            strokeWidth={2}
            fillColor={t.color}
          />
        ))}

        {/* Current trail */}
        {trail.length >= 2 && (
          <Polyline
            coordinates={trail}
            strokeColor={Colors.primary}
            strokeWidth={4}
          />
        )}

        {/* Closed polygon fill */}
        {closed && trail.length >= 3 && (
          <Polygon
            coordinates={trail}
            strokeColor={Colors.primary}
            strokeWidth={3}
            fillColor="rgba(0, 240, 255, 0.3)"
          />
        )}

        {/* Start point marker with close radius circle */}
        {startPoint.current && !closed && trail.length >= 3 && (
          <>
            <Circle
              center={startPoint.current}
              radius={CLOSE_DISTANCE_THRESHOLD}
              strokeColor="rgba(0, 240, 255, 0.3)"
              fillColor="rgba(0, 240, 255, 0.08)"
              strokeWidth={1}
            />
            <Marker coordinate={startPoint.current} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.startMarker}>
                <MapPin size={16} color={Colors.primary} />
              </View>
            </Marker>
          </>
        )}

        {/* Player position */}
        {currentPos && (
          <Marker coordinate={currentPos} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.playerMarkerContainer}>
              <Animated.View
                style={[
                  styles.playerPulse,
                  { transform: [{ scale: pulseAnim }], opacity: pulseOpacity },
                ]}
              />
              <View style={styles.playerDotOuter}>
                <View style={styles.playerDotInner} />
              </View>
            </View>
          </Marker>
        )}
      </MapView>

      {/* Top HUD */}
      <SafeAreaView style={styles.topBar} edges={["top"]}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.hudContainer}>
          <View style={styles.hudItem}>
            <Clock size={14} color={Colors.textSecondary} />
            <Text style={styles.hudText}>{formatTime(elapsed)}</Text>
          </View>
          <View style={styles.hudDivider} />
          <View style={styles.hudItem}>
            <Gauge size={14} color={Colors.textSecondary} />
            <Text style={styles.hudText}>{speedKmh} km/s</Text>
          </View>
          <View style={styles.hudDivider} />
          <View style={styles.hudItem}>
            <Navigation size={14} color={Colors.textSecondary} />
            <Text style={styles.hudText}>{formatDistance(totalDistance)}</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Live area preview */}
      {!closed && trail.length >= 3 && (
        <View style={styles.areaBadge}>
          <Text style={styles.areaBadgeText}>{formatArea(liveArea)}</Text>
        </View>
      )}

      {/* Near-start hint */}
      {nearStart && !closed && (
        <View style={styles.nearStartBadge}>
          <MapPin size={14} color={Colors.primary} />
          <Text style={styles.nearStartText}>Başlangıç noktasına yakınsın!</Text>
        </View>
      )}

      {/* Warning Badge */}
      {showWarning && !nearStart && (
        <View style={styles.warningBadge}>
          <View style={styles.pulseDot} />
          <Text style={styles.warningText}>Dikkat! Rakip Yakında</Text>
        </View>
      )}

      {/* Bottom Panel */}
      <SafeAreaView style={styles.bottomPanel} edges={["bottom"]}>
        <TouchableOpacity
          style={[
            styles.captureButton,
            closed && styles.capturedButton,
            nearStart && !closed && styles.nearStartButton,
            !canClose && !closed && styles.disabledButton,
          ]}
          onPress={handleCapture}
          disabled={!canClose && !closed}
        >
          <Text style={styles.captureText}>
            {closed ? "Sonuçları Gör" : nearStart ? "Alanı Kapat!" : "Alan Kapat"}
          </Text>
        </TouchableOpacity>
        <View style={styles.powerUpRow}>
          <TouchableOpacity style={styles.powerUpButton}>
            <Shield size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.powerUpButton}>
            <Zap size={24} color={Colors.warning} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.powerUpButton}>
            <Radar size={24} color={Colors.success} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  startMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 240, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  playerMarkerContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  playerPulse: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
  },
  playerDotOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0, 240, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  playerDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  hudContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(26, 29, 32, 0.95)",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  hudItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  hudText: { fontSize: 13, fontWeight: "600", color: Colors.textPrimary },
  hudDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.surfaceBorder,
    marginHorizontal: 12,
  },
  areaBadge: {
    position: "absolute",
    top: 100,
    left: 16,
    backgroundColor: "rgba(26, 29, 32, 0.95)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  areaBadgeText: { fontSize: 15, fontWeight: "700", color: Colors.primary },
  nearStartBadge: {
    position: "absolute",
    top: 100,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 240, 255, 0.15)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  nearStartText: { fontSize: 13, fontWeight: "600", color: Colors.primary },
  warningBadge: {
    position: "absolute",
    top: 100,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.danger,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textPrimary,
  },
  warningText: { fontSize: 13, fontWeight: "600", color: Colors.textPrimary },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  captureButton: {
    backgroundColor: Colors.surface,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  capturedButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  nearStartButton: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  disabledButton: {
    opacity: 0.5,
  },
  captureText: { fontSize: 18, fontWeight: "bold", color: Colors.textPrimary },
  powerUpRow: { flexDirection: "row", justifyContent: "center", gap: 16 },
  powerUpButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
});
