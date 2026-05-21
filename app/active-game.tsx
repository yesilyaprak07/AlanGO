import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Crown,
  Flag,
  Footprints,
  Gem,
  Gift,
  Map,
  Pause,
  ShoppingCart,
  Shield,
  Square,
  Timer,
  Trophy,
} from "lucide-react-native";
import MapView, { Circle, Marker, Polygon, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useGameStore, computePolygonArea } from "@/stores/gameStore";
import { darkMapStyle } from "@/constants/mapStyles";
import { theme } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";

const FALLBACK = { latitude: 36.8969, longitude: 30.7133 };
const CLOSE_DISTANCE_THRESHOLD = 30;
const MIN_TRAIL_POINTS = 10;
const SPEED_LIMIT_KMH = 25;

type BottomKey = "map" | "leaderboard" | "rewards" | "store";

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

function formatClock(seconds: number): string {
  const hh = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function offset(center: { latitude: number; longitude: number }, lat: number, lng: number) {
  return {
    latitude: center.latitude + lat,
    longitude: center.longitude + lng,
  };
}

export default function ActiveGameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const mapRef = useRef<MapView>(null);
  const { addTerritory, setLastRun, territories } = useGameStore();

  const [currentPos, setCurrentPos] = useState<{ latitude: number; longitude: number } | null>(null);
  const [trail, setTrail] = useState<{ latitude: number; longitude: number }[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [speedViolation, setSpeedViolation] = useState(false);
  const [closed, setClosed] = useState(false);
  const [liveArea, setLiveArea] = useState(0);
  const startPoint = useRef<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (closed) return;
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [closed]);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let mounted = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted" || !mounted) return;

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 2 },
        (loc) => {
          if (!mounted || closed) return;

          const coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };

          const rawSpeed = loc.coords.speed != null && loc.coords.speed >= 0 ? loc.coords.speed : 0;
          if (rawSpeed * 3.6 > SPEED_LIMIT_KMH) {
            setSpeedViolation(true);
            return;
          }

          setSpeedViolation(false);
          setCurrentPos(coords);

          setTrail((prev) => {
            if (prev.length > 0) {
              const dist = getDistanceMeters(prev[prev.length - 1], coords);
              if (dist < 2) return prev;
              setTotalDistance((d) => d + dist);
            }

            if (prev.length === 0) {
              startPoint.current = coords;
              mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.0032, longitudeDelta: 0.0032 }, 500);
            }

            const updated = [...prev, coords];
            if (updated.length >= 3) {
              setLiveArea(computePolygonArea(updated));
            }
            return updated;
          });
        }
      );
    })();

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, [closed]);

  const handlePause = () => router.replace(ROUTES.tabs.map);

  const handleFinish = useCallback(() => {
    if (trail.length < MIN_TRAIL_POINTS) {
      router.replace(ROUTES.tabs.map);
      return;
    }

    if (closed) {
      router.push(ROUTES.result);
      return;
    }

    const closedTrail = [...trail, trail[0]];
    const area = computePolygonArea(closedTrail);
    addTerritory({ polygon: closedTrail, area, distance: totalDistance, duration: elapsed });
    setLastRun({ polygon: closedTrail, area, distance: totalDistance, duration: elapsed });
    setTrail(closedTrail);
    setLiveArea(area);
    setClosed(true);
  }, [addTerritory, closed, elapsed, router, setLastRun, totalDistance, trail]);

  const region = currentPos
    ? { ...currentPos, latitudeDelta: 0.0032, longitudeDelta: 0.0032 }
    : { ...FALLBACK, latitudeDelta: 0.0032, longitudeDelta: 0.0032 };

  const distKm = (totalDistance / 1000).toFixed(2).replace(".", ",");
  const areaM2 = Math.max(0, Math.round(liveArea));
  const stepCount = Math.max(0, Math.round(totalDistance / 0.78));
  const nearStart =
    !!startPoint.current &&
    trail.length >= MIN_TRAIL_POINTS &&
    !!currentPos &&
    getDistanceMeters(currentPos, startPoint.current) <= CLOSE_DISTANCE_THRESHOLD;

  // Scale UI overlays to current viewport to avoid overflow on smaller phones.
  const uiScale = useMemo(() => {
    const widthScale = width / 430;
    const heightScale = height / 932;
    return Math.max(0.62, Math.min(1, Math.min(widthScale, heightScale)));
  }, [width, height]);
  const contentScale = uiScale * 0.6;
  const controlsScale = Math.max(0.6885, uiScale * 0.918);

  const fakeZones = useMemo(
    () => [
      {
        id: "zone-cyan",
        fill: "rgba(54, 240, 122, 0.14)",
        stroke: "rgba(54, 240, 122, 0.42)",
        marker: offset(region, 0.00055, 0.00025),
        nodes: [
          offset(region, 0.00075, 0.00005),
          offset(region, 0.0009, 0.00035),
          offset(region, 0.00045, 0.00065),
          offset(region, 0.0002, 0.00025),
        ],
      },
      {
        id: "zone-purple",
        fill: "rgba(157, 77, 255, 0.18)",
        stroke: "rgba(157, 77, 255, 0.44)",
        marker: offset(region, 0.00035, 0.00075),
        nodes: [
          offset(region, 0.00055, 0.00055),
          offset(region, 0.0007, 0.00095),
          offset(region, 0.0002, 0.00115),
          offset(region, 0.00005, 0.0007),
        ],
      },
      {
        id: "zone-gold",
        fill: "rgba(255, 184, 58, 0.17)",
        stroke: "rgba(255, 184, 58, 0.42)",
        marker: offset(region, -0.00035, 0.00035),
        nodes: [
          offset(region, -0.00005, 0.00015),
          offset(region, -0.00015, 0.00065),
          offset(region, -0.0006, 0.0007),
          offset(region, -0.0008, 0.00025),
        ],
      },
    ],
    [region]
  );

  const routeNodes = trail.filter((_, idx) => idx % 2 === 0 || idx === trail.length - 1);

  const bottomTabs: { key: BottomKey; label: string; icon: React.ReactNode; badge?: boolean }[] = [
    { key: "map", label: "Harita", icon: <Map size={12} color="#10F4E8" /> },
    { key: "leaderboard", label: "Liderlik", icon: <Trophy size={12} color="#A9B4C0" /> },
    { key: "rewards", label: "Ödüller", icon: <Gift size={12} color="#A9B4C0" />, badge: true },
    { key: "store", label: "Dükkan", icon: <ShoppingCart size={12} color="#A9B4C0" /> },
  ];

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
        {territories.map((t) => (
          <Polygon
            key={t.id}
            coordinates={t.polygon}
            strokeColor="rgba(0, 232, 255, 0.4)"
            strokeWidth={2}
            fillColor={t.color ?? "rgba(0, 232, 255, 0.12)"}
          />
        ))}

        {fakeZones.map((z) => (
          <Polygon key={z.id} coordinates={z.nodes} strokeColor={z.stroke} fillColor={z.fill} strokeWidth={1} />
        ))}

        {fakeZones.map((z) => (
          <Marker key={`${z.id}-mark`} coordinate={z.marker} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.zoneMark}>
              <Crown size={12} color="#C1D1F5" />
            </View>
          </Marker>
        ))}

        {trail.length >= 2 ? (
          <>
            <Polyline coordinates={trail} strokeColor="rgba(0, 232, 255, 0.28)" strokeWidth={9} />
            <Polyline coordinates={trail} strokeColor="#7AF2FF" strokeWidth={4.4} />
          </>
        ) : null}

        {routeNodes.map((p, i) => (
          <Marker key={`node-${i}`} coordinate={p} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.routeNode} />
          </Marker>
        ))}

        {startPoint.current ? (
          <>
            <Circle
              center={startPoint.current}
              radius={CLOSE_DISTANCE_THRESHOLD}
              strokeColor="rgba(54, 240, 122, 0.42)"
              fillColor="rgba(54, 240, 122, 0.11)"
              strokeWidth={1}
            />
            <Marker coordinate={startPoint.current} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.startPinOuter}>
                <View style={styles.startPinInner} />
              </View>
            </Marker>
          </>
        ) : null}

        {trail.length > 1 ? (
          <Marker coordinate={trail[trail.length - 1]} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.finishPin}>
              <Text style={styles.finishPinText}>#</Text>
            </View>
          </Marker>
        ) : null}
      </MapView>

      <SafeAreaView style={styles.topWrap} edges={["top"]}>
        <Header onBellPress={() => router.push(ROUTES.tabs.notifications)} />

        <View style={styles.statsScaleWrap}>
          <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statTitle}>Süre</Text>
            <View style={styles.statRow}>
              <Timer size={14} color="#E6EAF0" />
              <Text style={styles.statValue}>{formatClock(elapsed)}</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statTitle}>Mesafe</Text>
            <View style={styles.statRow}>
              <Map size={14} color="#00E8FF" />
              <Text style={styles.statValue}>{distKm} km</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statTitle}>Alan</Text>
            <View style={styles.statRow}>
              <Square size={14} color="#36F07A" />
              <Text style={styles.statValue}>{areaM2.toLocaleString("tr-TR")} m²</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statTitle}>Adım</Text>
            <View style={styles.statRow}>
              <Footprints size={14} color="#FFB83A" />
              <Text style={styles.statValue}>{stepCount.toLocaleString("tr-TR")}</Text>
            </View>
          </View>
          </View>
        </View>
      </SafeAreaView>

      <View
        style={[
          styles.leftPanels,
          {
            top: insets.top + 260 * contentScale,
            transform: [{ scale: contentScale }],
          },
        ]}
      >
        <View style={styles.questCard}>
          <Text style={styles.questTitle}>AKTİF GÖREV</Text>
          <Text style={styles.questLine}>5.000 m² fethet</Text>
          <Text style={styles.questLine}>{Math.min(areaM2, 5000).toLocaleString("tr-TR")} / 5.000</Text>
          <View style={styles.questRewardRow}>
            <Gem size={24} color="#9D4DFF" fill="#9D4DFF" />
            <Text style={styles.questReward}>25</Text>
          </View>
          <Text style={styles.questMuted}>Ödül</Text>
          <Pressable style={styles.questBtn} onPress={() => router.push(ROUTES.mysteryBox)}>
            <Text style={styles.questBtnText}>Görevi Gör</Text>
          </Pressable>
        </View>

        <View style={styles.streakCard}>
          <Text style={styles.streakTitle}>GÜNLÜK SERİ</Text>
          <Text style={styles.streakFlame}>🔥</Text>
          <Text style={styles.streakNumber}>7</Text>
          <Text style={styles.streakMuted}>Gün</Text>
          <Text style={styles.chest}>🎁</Text>
          <Text style={styles.streakMuted}>Yarınki Ödül</Text>
          <View style={styles.streakGemRow}>
            <Gem size={12} color="#9D4DFF" fill="#9D4DFF" />
            <Text style={styles.streakGemText}>10</Text>
          </View>
        </View>
      </View>

      {speedViolation ? (
        <View style={[styles.warningPill, { transform: [{ scale: contentScale }] }]}>
          <Text style={styles.warningText}>Hız limiti aşıldı ({SPEED_LIMIT_KMH} km/s)</Text>
        </View>
      ) : null}

      <View
        style={[
          styles.bottomControls,
          {
            bottom: insets.bottom + 130 * contentScale + 12,
            transform: [{ scale: controlsScale }],
          },
        ]}
      >
        <View style={styles.bottomControlsInner}>
          <Pressable style={styles.ctrlButton} onPress={handlePause}>
            <View style={styles.ctrlCircle}>
              <Pause size={26} color="#E6EAF0" />
            </View>
            <Text style={styles.ctrlLabel}>Duraklat</Text>
          </Pressable>

          <Pressable style={styles.ctrlCenterWrap} onPress={handleFinish}>
            <View style={styles.ctrlCenterCircleOuter}>
              <View style={styles.ctrlCenterCircleInner}>
                <Square size={24} color="#FFFFFF" fill="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.ctrlLabelCenter}>{closed ? "Sonucu Aç" : "Bitir & Kaydet"}</Text>
          </Pressable>

          <Pressable style={styles.ctrlButton} onPress={handleFinish}>
            <View style={styles.ctrlCircle}>
              <Flag size={26} color="#E6EAF0" />
            </View>
            <Text style={styles.ctrlLabel}>Tur Bitir</Text>
          </Pressable>
        </View>
      </View>

      <BottomNav activeTab="map" style={styles.bottomTabOffset} />

      {nearStart && !closed ? (
        <View style={[styles.nearStartBadge, { bottom: 236 * contentScale, transform: [{ scale: contentScale }] }]}>
          <Text style={styles.nearStartText}>Başlangıç noktasına yaklaştın, turu kapatabilirsin</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0F14",
  },
  topWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 6,
    gap: 10,
    zIndex: 5,
  },
  topHudRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 1,
  },
  statsScaleWrap: {
    width: "100%",
  },
  avatarWrap: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1.5,
    borderColor: "rgba(16, 244, 232, 0.85)",
    backgroundColor: "rgba(8, 18, 28, 0.65)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10F4E8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.42,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarCore: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 19,
  },
  levelBadge: {
    position: "absolute",
    right: -6,
    bottom: -5,
    minWidth: 28,
    height: 28,
    borderRadius: 11,
    backgroundColor: "rgba(8, 18, 28, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.42)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  levelText: {
    color: "#FFFFFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 16,
  },
  balancePill: {
    width: 109,
    height: 42,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  coinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFC83D",
    borderWidth: 1,
    borderColor: "#FFE08E",
  },
  balanceText: {
    color: "#FFFFFF",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 16,
  },
  bellButton: {
    width: 55,
    height: 55,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    alignItems: "center",
    justifyContent: "center",
  },
  bellBadge: {
    position: "absolute",
    right: -4,
    top: -4,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#10F4E8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  bellBadgeText: {
    color: "#043038",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 12,
  },
  statsCard: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    backgroundColor: "rgba(17, 24, 33, 0.92)",
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  statCol: {
    flex: 1,
    gap: 4,
  },
  statTitle: {
    color: "#8893A6",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    color: "#E6EAF0",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    marginHorizontal: 8,
    backgroundColor: "rgba(120, 160, 180, 0.22)",
  },
  leftPanels: {
    position: "absolute",
    left: -19,
    gap: 14,
    zIndex: 4,
  },
  questCard: {
    width: 126,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(54, 240, 122, 0.66)",
    backgroundColor: "rgba(17, 24, 33, 0.92)",
    padding: 12,
    gap: 7,
  },
  questTitle: {
    color: "#36F07A",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
  },
  questLine: {
    color: "#E6EAF0",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 13,
  },
  questRewardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  questReward: {
    color: "#E6EAF0",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 36,
  },
  questMuted: {
    color: "#8893A6",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 13,
  },
  questBtn: {
    marginTop: 2,
    borderRadius: 12,
    backgroundColor: "rgba(0, 232, 255, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(0, 232, 255, 0.45)",
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  questBtnText: {
    color: "#6CEFFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 19,
  },
  streakCard: {
    width: 126,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 184, 58, 0.62)",
    backgroundColor: "rgba(17, 24, 33, 0.92)",
    padding: 12,
    gap: 4,
    alignItems: "center",
  },
  streakTitle: {
    color: "#FFB83A",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
  },
  streakFlame: {
    fontSize: 22,
  },
  streakNumber: {
    color: "#FFB83A",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 48,
    lineHeight: 50,
  },
  streakMuted: {
    color: "#8893A6",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 14,
  },
  chest: {
    marginTop: 2,
    fontSize: 42,
  },
  streakGemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  streakGemText: {
    color: "#DDA3FF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
  },
  zoneMark: {
    width: 20,
    height: 20,
    borderRadius: 8,
    backgroundColor: "rgba(10, 15, 22, 0.88)",
    borderWidth: 1,
    borderColor: "rgba(180, 195, 223, 0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  routeNode: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#7AF2FF",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.55)",
    shadowColor: "#00E8FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
  },
  startPinOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#36F07A",
    backgroundColor: "rgba(54, 240, 122, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  startPinInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F2FFF7",
  },
  finishPin: {
    width: 30,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F2F4F8",
    borderWidth: 1,
    borderColor: "#B5BAC5",
    alignItems: "center",
    justifyContent: "center",
  },
  finishPinText: {
    color: "#111821",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 20,
  },
  warningPill: {
    position: "absolute",
    alignSelf: "center",
    top: "36%",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.58)",
    backgroundColor: "rgba(255, 59, 48, 0.2)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    zIndex: 6,
  },
  warningText: {
    color: "#FF5D5D",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 12,
  },
  nearStartBadge: {
    position: "absolute",
    alignSelf: "center",
    bottom: 236,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(54, 240, 122, 0.42)",
    backgroundColor: "rgba(54, 240, 122, 0.14)",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  nearStartText: {
    color: "#95FFC3",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 12,
  },
  bottomControls: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 6,
  },
  bottomControlsInner: {
    width: "100%",
    maxWidth: 430,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 16,
  },
  bottomTabOffset: {
    bottom: -16,
  },
  ctrlButton: {
    width: 132,
    alignItems: "center",
    gap: 8,
  },
  ctrlCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.38)",
    backgroundColor: "rgba(17, 24, 33, 0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  ctrlLabel: {
    color: "#E6EAF0",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 15,
  },
  ctrlCenterWrap: {
    width: 176,
    alignItems: "center",
    gap: 8,
  },
  ctrlCenterCircleOuter: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "rgba(255, 51, 48, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 51, 48, 0.62)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF3330",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  ctrlCenterCircleInner: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#FF3330",
    alignItems: "center",
    justifyContent: "center",
  },
  ctrlLabelCenter: {
    color: "#E6EAF0",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 17,
  },
});
