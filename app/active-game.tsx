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
import {
  MapPin,
  X,
} from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useEffect, useState, useRef, useCallback } from "react";
import MapView, { Marker, Polyline, Polygon, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useGameStore, computePolygonArea } from "@/stores/gameStore";
import { darkMapStyle } from "@/constants/mapStyles";

const FALLBACK = { latitude: 36.8969, longitude: 30.7133 };
const CLOSE_DISTANCE_THRESHOLD = 30; // meters — auto-close suggestion
const MIN_TRAIL_POINTS = 10; // minimum points before allowing close
const SPEED_LIMIT_KMH = 25; // max allowed speed in km/h

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
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function formatDistanceM(meters: number): string {
  return Math.round(meters).toString();
}

function formatAreaM2(m2: number): string {
  return Math.round(m2).toLocaleString();
}

function formatPace(meters: number, seconds: number): string {
  if (meters < 10 || seconds < 1) return "--:--";
  const paceSeconds = seconds / (meters / 1000); // seconds per km
  const m = Math.floor(paceSeconds / 60);
  const s = Math.floor(paceSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
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

  // Timer
  useEffect(() => {
    if (closed) return;
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [closed]);

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
          const rawSpeed = loc.coords.speed != null && loc.coords.speed >= 0 ? loc.coords.speed : 0;
          const currentKmh = rawSpeed * 3.6;
          setSpeed(rawSpeed);
          setCurrentPos(coords);

          // Speed limit check — skip point if too fast
          if (currentKmh > SPEED_LIMIT_KMH) {
            setSpeedViolation(true);
            return;
          }
          setSpeedViolation(false);

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
      router.push("/result");
      return;
    }

    // Not enough trail points — end without capturing
    if (trail.length < MIN_TRAIL_POINTS) {
      router.replace("/(tabs)/map");
      return;
    }

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
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }]}>
      {/* Map Area */}
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
            <Polygon
              key={t.id}
              coordinates={t.polygon}
              strokeColor="rgba(0, 240, 255, 0.5)"
              strokeWidth={2}
              fillColor={t.color}
            />
          ))}

          {trail.length >= 2 && (
            <Polyline
              coordinates={trail}
              strokeColor={Colors.primary}
              strokeWidth={4}
            />
          )}

          {closed && trail.length >= 3 && (
            <Polygon
              coordinates={trail}
              strokeColor={Colors.primary}
              strokeWidth={3}
              fillColor="rgba(0, 240, 255, 0.3)"
            />
          )}

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

        {/* Close button */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Near-start hint */}
        {nearStart && !closed && (
          <View style={styles.nearStartBadge}>
            <MapPin size={14} color={Colors.primary} />
            <Text style={styles.nearStartText}>Başlangıca yakınsın!</Text>
          </View>
        )}

        {/* Speed violation warning */}
        {speedViolation && !closed && (
          <View style={styles.speedWarningBadge}>
            <Text style={styles.speedWarningText}>Hız limiti aşıldı! (maks {SPEED_LIMIT_KMH} km/s)</Text>
          </View>
        )}
      </View>

      {/* Stats Panel */}
      <View style={styles.statsPanel}>
        {/* GPS indicator + status */}
        <View style={styles.statusRow}>
          <View style={styles.gpsIndicator}>
            <View style={styles.gpsDot} />
            <Text style={styles.gpsText}>GPS</Text>
          </View>
        </View>

        {/* Main area display */}
        <View style={styles.mainStat}>
          <Text style={styles.mainValue}>{formatDistanceM(totalDistance)}</Text>
          <Text style={styles.mainUnit}>m</Text>
        </View>
        <Text style={styles.captureLabel}>
          {closed ? "Alan Kapatıldı" : "Yakalama Devam Ediyor"}
        </Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatAreaM2(liveArea)}</Text>
            <Text style={styles.statUnit}>m²</Text>
            <Text style={styles.statLabel}>Alan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.round(totalDistance / 0.75)}</Text>
            <Text style={styles.statUnit}> </Text>
            <Text style={styles.statLabel}>Adım</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatTime(elapsed)}</Text>
            <Text style={styles.statUnit}> </Text>
            <Text style={styles.statLabel}>Süre</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatPace(totalDistance, elapsed)}</Text>
            <Text style={styles.statUnit}>/km</Text>
            <Text style={styles.statLabel}>Tempo</Text>
          </View>
        </View>

        {/* Action button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              closed && styles.resultButton,
              nearStart && !closed && styles.closeAreaButton,
              !canClose && !closed && styles.endEarlyButton,
            ]}
            onPress={handleCapture}
          >
            <Text style={[styles.actionButtonText, closed && styles.resultButtonText]}>
              {closed ? "Sonuçları Gör" : nearStart ? "Alanı Fethet!" : "Alanı Fethet!"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  mapContainer: { flex: 2, position: "relative" },
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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(26, 29, 32, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  nearStartBadge: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 240, 255, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  nearStartText: { fontSize: 13, fontWeight: "600", color: Colors.primary },
  speedWarningBadge: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 59, 48, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  speedWarningText: { fontSize: 13, fontWeight: "600", color: Colors.danger },

  /* Stats Panel */
  statsPanel: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  statusRow: {
    alignItems: "center",
    marginBottom: 2,
  },
  gpsIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  gpsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  gpsText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  mainStat: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginBottom: 2,
  },
  mainValue: {
    fontSize: 40,
    fontWeight: "700",
    color: Colors.textPrimary,
    fontVariant: ["tabular-nums"],
  },
  mainUnit: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  captureLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    fontVariant: ["tabular-nums"],
  },
  statUnit: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginTop: -2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.surfaceBorder,
  },
  buttonContainer: { marginTop: "auto" },
  actionButton: {
    backgroundColor: Colors.surface,
    height: 48,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 8,
  },
  resultButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  closeAreaButton: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  endEarlyButton: {
    backgroundColor: "rgba(255, 59, 48, 0.15)",
    borderColor: Colors.danger,
  },
  actionButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  resultButtonText: {
    color: Colors.background,
  },
});
