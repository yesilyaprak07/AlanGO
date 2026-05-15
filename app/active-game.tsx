import { View, Text, StyleSheet, Animated, Pressable, Platform, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Flag, Pause, Radar, Shield, Timer, X } from "lucide-react-native";
import { useEffect, useState, useRef, useCallback } from "react";
import MapView, { Marker, Polyline, Polygon, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useGameStore, computePolygonArea } from "@/stores/gameStore";
import { darkMapStyle } from "@/constants/mapStyles";
import { GlassCard, NeonButton, TopModeSwitcher } from "@/components/ui";
import { theme } from "@/constants/theme";
import { GlowPulseView, ShimmerBadge } from "@/components/motion";
import { ROUTES } from "@/constants/routes";
import { getBottomCtaPadding, isCompactHeight, isNarrowWidth } from "@/constants/safeArea";

const FALLBACK = { latitude: 36.8969, longitude: 30.7133 };
const CLOSE_DISTANCE_THRESHOLD = 30;
const MIN_TRAIL_POINTS = 10;
const SPEED_LIMIT_KMH = 25;

type ModeKey = "private" | "solo" | "squad";

const RUN_MODE_OPTIONS: { key: ModeKey; label: string }[] = [
  { key: "private", label: "Özel Lobi" },
  { key: "solo", label: "Tek Kişi" },
  { key: "squad", label: "Grubum" },
];

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

function ActionCircleButton({
  icon,
  label,
  compact = false,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  compact?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.actionCircle, compact && styles.actionCircleCompact, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.actionCircleIcon}>{icon}</View>
      {!compact ? <Text style={styles.actionCircleText}>{label}</Text> : null}
    </Pressable>
  );
}

function SafeTop({ insetsTop, children }: { insetsTop: number; children: React.ReactNode }) {
  return <View style={[styles.topOverlay, { paddingTop: insetsTop + 6 }]}>{children}</View>;
}

function AnimatedMetricValue({ value }: { value: string }) {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    opacity.setValue(0.35);
    translateY.setValue(4);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, value]);

  return <Animated.Text style={[styles.metricNumber, { opacity, transform: [{ translateY }] }]}>{value}</Animated.Text>;
}

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
  const [activeMode, setActiveMode] = useState<ModeKey>("solo");
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const finishPulse = useRef(new Animated.Value(0)).current;
  const gpsPulse = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const compactHeight = isCompactHeight(height);
  const narrow = isNarrowWidth(width);

  useEffect(() => {
    if (closed) return;
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [closed]);

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.8, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );

    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };
  }, [pulseAnim]);

  useEffect(() => {
    const finishLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(finishPulse, { toValue: 1, duration: 560, useNativeDriver: true }),
        Animated.timing(finishPulse, { toValue: 0, duration: 560, useNativeDriver: true }),
      ])
    );

    const gpsLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(gpsPulse, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(gpsPulse, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    );

    finishLoop.start();
    gpsLoop.start();

    return () => {
      finishLoop.stop();
      gpsLoop.stop();
    };
  }, [finishPulse, gpsPulse]);

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

          if (rawSpeed * 3.6 > SPEED_LIMIT_KMH) {
            setSpeedViolation(true);
            return;
          }

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

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [closed]);

  const handleClose = () => router.replace(ROUTES.tabs.map);

  const handleCapture = useCallback(() => {
    if (closed) {
      router.push(ROUTES.result);
      return;
    }

    if (trail.length < MIN_TRAIL_POINTS) {
      router.replace(ROUTES.tabs.map);
      return;
    }

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
  const shieldSeconds = Math.max(0, 150 - elapsed);
  const trailNodes = trail.filter((_, idx) => idx % 3 === 0 || idx === trail.length - 1);
  const hiddenRewardSignal = trail.length > 8 && !closed;

  return (
    <View style={styles.container}>
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
            strokeColor="rgba(0, 229, 204, 0.40)"
            strokeWidth={2}
            fillColor={t.color ?? "rgba(0, 229, 204, 0.14)"}
          />
        ))}

        {trail.length >= 2 && (
          <>
            <Polyline
              coordinates={trail}
              strokeColor="rgba(0, 229, 204, 0.24)"
              strokeWidth={8}
              lineDashPattern={closed ? undefined : [9, 4]}
            />
            <Polyline
              coordinates={trail}
              strokeColor={theme.colors.primaryCyan}
              strokeWidth={5}
              lineDashPattern={closed ? undefined : [9, 4]}
            />
          </>
        )}

        {trailNodes.map((point, idx) => (
          <Marker key={`trail-node-${idx}`} coordinate={point} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.routeNode} />
          </Marker>
        ))}

        {closed && trail.length >= 3 && (
          <Polygon
            coordinates={trail}
            strokeColor={theme.colors.primaryCyan}
            strokeWidth={3}
            fillColor="rgba(0, 229, 204, 0.26)"
          />
        )}

        {startPoint.current && !closed && trail.length >= 3 && (
          <>
            <Circle
              center={startPoint.current}
              radius={CLOSE_DISTANCE_THRESHOLD}
              strokeColor="rgba(0, 229, 204, 0.32)"
              fillColor="rgba(0, 229, 204, 0.08)"
              strokeWidth={1}
            />
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

      <SafeTop insetsTop={insets.top}>
        <View style={styles.headerRow}>
          <Pressable style={({ pressed }) => [styles.iconPill, pressed && styles.pressed]} onPress={handleClose}>
            <X size={16} color={theme.colors.textPrimary} />
          </Pressable>
          <View style={styles.livePill}>
            <View style={[styles.liveDot, closed ? styles.liveDotClosed : styles.liveDotActive]} />
            <Text style={styles.livePillText}>{closed ? "Tamamlandı" : "Aktif Koşu"}</Text>
          </View>
        </View>

        <TopModeSwitcher options={RUN_MODE_OPTIONS} value={activeMode} onChange={setActiveMode} />

        <GlassCard style={styles.metricsCard} contentStyle={styles.metricsContent}>
          <View style={styles.metricItem}>
            <Text style={styles.metricTitle}>Süre</Text>
            <AnimatedMetricValue value={formatTime(elapsed)} />
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricTitle}>Mesafe</Text>
            <AnimatedMetricValue value={`${distKm} km`} />
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricTitle}>Alan</Text>
            <AnimatedMetricValue value={`${areaKm2} km²`} />
          </View>
        </GlassCard>
      </SafeTop>

      <View style={[styles.rightPowerPanel, compactHeight && styles.rightPowerPanelCompact]}>
        <GlassCard contentStyle={styles.powerCardContent}>
          <View style={styles.powerRow}>
            <Shield size={14} color={theme.colors.primaryCyan} />
            <Text style={styles.powerLabel}>Kalkan</Text>
          </View>
          <Text style={styles.powerValue}>{formatTime(shieldSeconds)}</Text>
        </GlassCard>
        <ActionCircleButton
          icon={<Radar size={16} color={theme.colors.primaryCyan} />}
          label="Radar"
          compact={narrow}
          onPress={() => mapRef.current?.animateToRegion({ ...region, latitudeDelta: 0.003, longitudeDelta: 0.003 }, 400)}
        />
      </View>

      {speedViolation && !closed && (
        <View style={styles.warningBadge}>
          <Text style={styles.warningText}>Hız limiti aşıldı: {SPEED_LIMIT_KMH} km/s</Text>
        </View>
      )}

      {hiddenRewardSignal && (
        <ShimmerBadge style={[styles.rewardSignal, { bottom: getBottomCtaPadding(insets.bottom, compactHeight ? 154 : 182) }]} shimmerColor="rgba(255, 200, 87, 0.38)">
          <Text style={styles.rewardSignalText}>Gizli ödül sinyali güçleniyor</Text>
        </ShimmerBadge>
      )}

      <View style={[styles.bottomOverlay, { paddingBottom: getBottomCtaPadding(insets.bottom, 8) }]}>
        <View style={[styles.bottomActionsRow, narrow && styles.bottomActionsRowCompact]}>
          <ActionCircleButton icon={<Pause size={16} color={theme.colors.textPrimary} />} label="Duraklat" compact={narrow} onPress={handleClose} />
          <GlowPulseView duration={600} minOpacity={0.88} maxOpacity={1} minScale={1} maxScale={1.035}>
            <Animated.View
              style={{
                transform: [
                  {
                    scale: finishPulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.04],
                    }),
                  },
                ],
              }}
            >
              <Pressable style={({ pressed }) => [styles.finishButton, narrow && styles.finishButtonCompact, pressed && styles.pressed]} onPress={handleCapture}>
                <Text style={styles.finishTitle}>{closed ? "Sonucu Aç" : "Bitir & Kapat"}</Text>
                <Text style={styles.finishSubtitle}>
                  {closed
                    ? "Koşuyu tamamladın"
                    : nearStart
                      ? "Çember kapatmaya hazır"
                      : canClose
                        ? "Döngüyü tamamla"
                        : "En az 10 rota noktası gerekli"}
                </Text>
              </Pressable>
            </Animated.View>
          </GlowPulseView>
          <ActionCircleButton icon={<Flag size={16} color={theme.colors.goldReward} />} label="Tur Bitir" compact={narrow} onPress={handleCapture} />
        </View>

        <View style={styles.gpsStatusRow}>
          <Timer size={13} color={theme.colors.success} />
          <Text style={styles.gpsStatusText}>GPS güçlü / aktif</Text>
          <Animated.View
            style={[
              styles.gpsDot,
              {
                opacity: gpsPulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
                transform: [
                  {
                    scale: gpsPulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.3] }),
                  },
                ],
              },
            ]}
          />
          <Text style={styles.gpsSpeedText}>{Math.max(0, speed * 3.6).toFixed(1)} km/s</Text>
        </View>

        <NeonButton
          label="Çizgiyi Kapat"
          size="sm"
          variant="ghost"
          fullWidth
          onPress={handleCapture}
          disabled={!canClose && !closed}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDeep,
  },
  topOverlay: {
    position: "absolute",
    left: theme.spacing.md,
    right: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconPill: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceCard,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceCard,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  liveDotActive: {
    backgroundColor: theme.colors.danger,
  },
  liveDotClosed: {
    backgroundColor: theme.colors.success,
  },
  livePillText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.xs,
  },
  metricsCard: {
    borderRadius: theme.radius.lg,
  },
  metricsContent: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  metricTitle: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
    marginBottom: 4,
  },
  metricNumber: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.lg,
  },
  metricDivider: {
    width: 1,
    marginVertical: 8,
    backgroundColor: theme.colors.borderSubtle,
  },
  routeNode: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primaryCyan,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },
  startMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primaryCyan,
    borderWidth: 3,
    borderColor: theme.colors.backgroundDeep,
  },
  playerMarkerContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  playerPulse: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryCyan,
  },
  playerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primaryCyan,
    borderWidth: 3,
    borderColor: theme.colors.backgroundDeep,
  },
  rightPowerPanel: {
    position: "absolute",
    right: theme.spacing.md,
    top: "36%",
    width: 96,
    gap: theme.spacing.xs,
  },
  rightPowerPanelCompact: {
    top: "28%",
  },
  powerCardContent: {
    gap: 4,
    alignItems: "center",
  },
  powerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  powerLabel: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  powerValue: {
    color: theme.colors.primaryCyan,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.base,
  },
  actionCircle: {
    width: 96,
    minHeight: 54,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceCard,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  actionCircleCompact: {
    width: 56,
    minHeight: 48,
    borderRadius: theme.radius.sm,
  },
  actionCircleIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0, 229, 204, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  actionCircleText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
  },
  warningBadge: {
    position: "absolute",
    top: "31%",
    alignSelf: "center",
    backgroundColor: "rgba(255, 77, 77, 0.20)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: "rgba(255, 77, 77, 0.55)",
  },
  warningText: {
    color: theme.colors.danger,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
  },
  rewardSignal: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "rgba(255, 200, 87, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(255, 200, 87, 0.46)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
  },
  rewardSignalText: {
    color: theme.colors.goldReward,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.xs,
  },
  bottomOverlay: {
    position: "absolute",
    left: theme.spacing.md,
    right: theme.spacing.md,
    bottom: 0,
    gap: theme.spacing.sm,
  },
  bottomActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  bottomActionsRowCompact: {
    gap: theme.spacing.xs,
  },
  finishButton: {
    flex: 1,
    minHeight: 64,
    borderRadius: theme.radius.lg,
    backgroundColor: "rgba(255, 77, 77, 0.88)",
    borderWidth: 1,
    borderColor: "rgba(255, 138, 138, 0.75)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.sm,
  },
  finishButtonCompact: {
    minHeight: 58,
    paddingHorizontal: theme.spacing.xs,
  },
  finishTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.base,
  },
  finishSubtitle: {
    marginTop: 2,
    color: "rgba(255,255,255,0.85)",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  gpsStatusRow: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceCard,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  gpsStatusText: {
    color: theme.colors.success,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.xs,
  },
  gpsDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.textMuted,
  },
  gpsSpeedText: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  pressed: {
    opacity: 0.86,
  },
});

