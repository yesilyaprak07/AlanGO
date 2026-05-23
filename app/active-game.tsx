import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Modal, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Crown,
  Footprints,
  Gem,
  Gift,
  Map,
  ShoppingCart,
  Square,
  Timer,
  Trophy,
} from "lucide-react-native";
import MapView, { Circle, Marker, Polygon, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Pedometer } from "expo-sensors";
import { useGameStore, computePolygonArea } from "@/stores/gameStore";
import { darkMapStyle } from "@/constants/mapStyles";
import { theme } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { getSocket, sendConquer } from "@/lib/socket";

const FALLBACK = { latitude: 36.8969, longitude: 30.7133 };
const CLOSE_DISTANCE_THRESHOLD = 20; // TEST: normalde 10, lansmanda geri al
const MIN_TRAIL_POINTS = 3;
const SPEED_LIMIT_KMH = 25;
const MIN_POINT_DISTANCE_METERS = 2;

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
  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const pedometerSubscriptionRef = useRef<any>(null);
  const isRecordingRef = useRef(false);
  const { setLastRun, territories, addTerritory } = useGameStore();

  const [currentPos, setCurrentPos] = useState<{ latitude: number; longitude: number } | null>(null);
  const [startPoint, setStartPoint] = useState<{ latitude: number; longitude: number } | null>(null);
  const [trail, setTrail] = useState<{ latitude: number; longitude: number }[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [speedViolation, setSpeedViolation] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [liveArea, setLiveArea] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [isConquerLoading, setIsConquerLoading] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [resultCapturedArea, setResultCapturedArea] = useState(0);
  const [resultDistanceKm, setResultDistanceKm] = useState("0,00");
  const [resultSteps, setResultSteps] = useState(0);

  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const stopLocationTracking = useCallback(() => {
    locationSubscriptionRef.current?.remove();
    locationSubscriptionRef.current = null;
    pedometerSubscriptionRef.current?.remove();
    pedometerSubscriptionRef.current = null;
  }, []);

  useEffect(() => stopLocationTracking, [stopLocationTracking]);

  const startLocationTracking = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Konum izni gerekli", "Çizim başlatmak için konum izni vermelisin.");
      return false;
    }

    if (locationSubscriptionRef.current) {
      return true;
    }

    locationSubscriptionRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000, distanceInterval: 1 },
      (loc) => {
        if (!isRecordingRef.current) return;

        console.log(
          "[gps] yeni konum:",
          loc.coords.latitude,
          loc.coords.longitude,
          "accuracy:",
          loc.coords.accuracy
        );

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
            if (dist < MIN_POINT_DISTANCE_METERS) {
              console.log(
                "[gps] nokta filtrelendi. mesafe:",
                dist.toFixed(2),
                "esik:",
                MIN_POINT_DISTANCE_METERS
              );
              return prev;
            }
            setTotalDistance((d) => d + dist);
          }

          if (prev.length === 0) {
            setStartPoint(coords);
            mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.0032, longitudeDelta: 0.0032 }, 500);
          }

          const updated = [...prev, coords];
          console.log("[gps] trail uzunlugu:", updated.length);
          if (updated.length >= 3) {
            setLiveArea(computePolygonArea(updated));
          }
          return updated;
        });
      }
    );

    return true;
  }, []);

  const handleStartDrawing = useCallback(async () => {
    if (isRecording || isConquerLoading) return;

    setTrail([]);
    setTotalDistance(0);
    setElapsed(0);
    setLiveArea(0);
    setStartPoint(null);
    setSpeedViolation(false);

    isRecordingRef.current = true;
    const { status } = await Pedometer.requestPermissionsAsync();
    if (status === "granted") {
      pedometerSubscriptionRef.current = Pedometer.watchStepCount((result) => {
        setStepCount(result.steps);
      });
    }
    setIsRecording(true);
    const started = await startLocationTracking();
    if (!started) {
      isRecordingRef.current = false;
      setIsRecording(false);
    }
  }, [isConquerLoading, isRecording, startLocationTracking]);

  const handleCancelExit = useCallback(() => {
    if (isConquerLoading) return;

    const leave = () => {
      isRecordingRef.current = false;
      setIsRecording(false);
      setTrail([]);
      setLiveArea(0);
      setTotalDistance(0);
      setElapsed(0);
      setStartPoint(null);
      pedometerSubscriptionRef.current?.remove();
      pedometerSubscriptionRef.current = null;
      stopLocationTracking();
      router.replace(ROUTES.tabs.map);
    };

    if (!isRecording && trail.length === 0) {
      leave();
      return;
    }

    Alert.alert("Çizim iptal", "Çizimi iptal edip haritaya dönmek istiyor musun?", [
      { text: "Vazgeç", style: "cancel" },
      { text: "Çık", style: "destructive", onPress: leave },
    ]);
  }, [isConquerLoading, isRecording, router, stopLocationTracking, trail.length]);

  const handleFinish = useCallback(async () => {
    const localArea = trail.length >= 3 ? computePolygonArea([...trail, trail[0]]) : 0;
    console.log("[finish] trail uzunlugu:", trail.length);
    console.log("[finish] hesaplanan alan:", localArea);

    if (isConquerLoading) {
      console.log("[finish] erken cikis: conquer zaten yukleniyor");
      return;
    }

    if (!isRecording) {
      console.log("[finish] erken cikis: kayit aktif degil");
      return;
    }

    if (trail.length < MIN_TRAIL_POINTS) {
      console.log("[finish] erken cikis: nokta yetersiz");
      Alert.alert("Henüz kapatılamaz", "Çizimi kapatmak için en az 3 nokta gerekli.");
      return;
    }

    const closedTrail = [...trail, trail[0]];
    const ring: [number, number][] = closedTrail.map((p) => [p.longitude, p.latitude]);

    if (ring.length > 0) {
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        ring.push([first[0], first[1]]);
      }
    }

    const geojsonString = JSON.stringify({
      type: "Polygon",
      coordinates: [ring],
    });

    const mapReasonToMessage = (reason: string) => {
      if (reason === "too_small") {
        return "Alan çok küçük, en az 10 m² gerekli. Devam edebilirsin."; // TEST: normalde 10, lansmanda geri al
      }

      if (reason === "invalid_polygon") {
        return "Geçersiz alan, tekrar dene";
      }

      return "Bağlantı hatası, tekrar dene";
    };

    const socket = getSocket();
    if (!socket) {
      Alert.alert("Hata", "Bağlantı ayarı eksik, lütfen daha sonra tekrar dene.");
      return;
    }
    setIsConquerLoading(true);

    try {
      console.log("[finish] socket connected:", socket.connected, "socket id:", socket.id);
      const conquerResult = await new Promise<any>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          cleanup();
          reject(new Error("timeout"));
        }, 30000);

        const onConquerResult = (payload: any) => {
          cleanup();
          resolve(payload);
        };

        const onConnectError = () => {
          cleanup();
          reject(new Error("connect_error"));
        };

        const cleanup = () => {
          clearTimeout(timeoutId);
          socket.off("conquer_result", onConquerResult);
          socket.off("connect_error", onConnectError);
        };

        socket.on("conquer_result", onConquerResult);
        socket.on("connect_error", onConnectError);

        console.log("[finish] conquer gonderiliyor, alan:", localArea);
        sendConquer(geojsonString, totalDistance, elapsed);
      });

      const result = conquerResult?.result ?? conquerResult;
      const success = result?.success === true || conquerResult?.ok === true;

      if (!success) {
        const reason = result?.reason ?? conquerResult?.reason ?? conquerResult?.error ?? "unknown";
        console.log("[finish] erken cikis: conquer basarisiz, reason:", String(reason));
        Alert.alert("Fetih başarısız", mapReasonToMessage(String(reason)));
        return;
      }

      const capturedArea = Number(result?.captured_area);
      const finalCapturedArea = Number.isFinite(capturedArea) && capturedArea > 0 ? capturedArea : localArea;

      setLastRun({
        polygon: closedTrail,
        area: finalCapturedArea,
        distance: totalDistance,
        duration: elapsed,
      });

      addTerritory({
        polygon: closedTrail,
        area: finalCapturedArea,
        distance: totalDistance,
        duration: elapsed,
      });

      setTrail(closedTrail);
      setLiveArea(finalCapturedArea);
      isRecordingRef.current = false;
      setIsRecording(false);
      pedometerSubscriptionRef.current?.remove();
      pedometerSubscriptionRef.current = null;
      stopLocationTracking();

      setResultCapturedArea(finalCapturedArea);
      setResultDistanceKm((totalDistance / 1000).toFixed(2).replace(".", ","));
      setResultSteps(stepCount);
      setResultModalVisible(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message === "timeout"
          ? "Sunucu yanıtı zaman aşımına uğradı, tekrar deneyebilirsin."
          : "Bağlantı hatası, tekrar deneyebilirsin.";
      Alert.alert("Hata", errorMessage);
    } finally {
      setIsConquerLoading(false);
    }
  }, [addTerritory, elapsed, isConquerLoading, isRecording, setLastRun, stepCount, stopLocationTracking, totalDistance, trail]);

  const initialRegion = {
    ...FALLBACK,
    latitudeDelta: 0.0032,
    longitudeDelta: 0.0032,
  };

  const region = currentPos
    ? { ...currentPos, latitudeDelta: 0.0032, longitudeDelta: 0.0032 }
    : { ...FALLBACK, latitudeDelta: 0.0032, longitudeDelta: 0.0032 };

  const distKm = (totalDistance / 1000).toFixed(2).replace(".", ",");
  const areaM2 = Math.max(0, Math.round(liveArea));
  const distanceToStart = startPoint && currentPos ? getDistanceMeters(currentPos, startPoint) : null;
  const nearStart =
    isRecording &&
    trail.length >= MIN_TRAIL_POINTS &&
    typeof distanceToStart === "number" &&
    distanceToStart <= CLOSE_DISTANCE_THRESHOLD;
  const drawButtonLabel = !isRecording
    ? "ŞİMDİ ÇİZ"
    : isConquerLoading
      ? "GÖNDERİLİYOR..."
      : nearStart
        ? "ŞİMDİ KAPAT"
        : "ÇİZİLİYOR...";
  const isDrawButtonDisabled = isRecording ? !nearStart || isConquerLoading : false;

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
        marker: offset(FALLBACK, 0.00055, 0.00025),
        nodes: [
          offset(FALLBACK, 0.00075, 0.00005),
          offset(FALLBACK, 0.0009, 0.00035),
          offset(FALLBACK, 0.00045, 0.00065),
          offset(FALLBACK, 0.0002, 0.00025),
        ],
      },
      {
        id: "zone-purple",
        fill: "rgba(157, 77, 255, 0.18)",
        stroke: "rgba(157, 77, 255, 0.44)",
        marker: offset(FALLBACK, 0.00035, 0.00075),
        nodes: [
          offset(FALLBACK, 0.00055, 0.00055),
          offset(FALLBACK, 0.0007, 0.00095),
          offset(FALLBACK, 0.0002, 0.00115),
          offset(FALLBACK, 0.00005, 0.0007),
        ],
      },
      {
        id: "zone-gold",
        fill: "rgba(255, 184, 58, 0.17)",
        stroke: "rgba(255, 184, 58, 0.42)",
        marker: offset(FALLBACK, -0.00035, 0.00035),
        nodes: [
          offset(FALLBACK, -0.00005, 0.00015),
          offset(FALLBACK, -0.00015, 0.00065),
          offset(FALLBACK, -0.0006, 0.0007),
          offset(FALLBACK, -0.0008, 0.00025),
        ],
      },
    ],
    []
  );

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

        {startPoint ? (
          <>
            <Circle
              center={startPoint}
              radius={CLOSE_DISTANCE_THRESHOLD}
              strokeColor="rgba(54, 240, 122, 0.42)"
              fillColor="rgba(54, 240, 122, 0.11)"
              strokeWidth={1}
            />
            <Marker coordinate={startPoint} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.startPinOuter}>
                <View style={styles.startPinInner} />
              </View>
            </Marker>
          </>
        ) : null}

        {currentPos ? (
          <Marker coordinate={currentPos} anchor={{ x: 0.5, y: 0.5 }} flat>
            <View style={styles.playerMarker}>
              <View style={styles.playerMarkerInner} />
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

      {isConquerLoading ? (
        <View style={[styles.warningPill, styles.conquerLoadingPill, { transform: [{ scale: contentScale }] }]}>
          <Text style={styles.warningText}>Fetih hesaplanıyor...</Text>
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
          <Pressable
            style={[styles.ctrlCenterWrap, isDrawButtonDisabled ? styles.ctrlCenterWrapDisabled : null]}
            onPress={!isRecording ? handleStartDrawing : handleFinish}
            disabled={isDrawButtonDisabled}
          >
            <View
              style={[
                styles.ctrlCenterCircleOuter,
                !isRecording ? styles.ctrlCenterCircleOuterStart : null,
                nearStart && !isConquerLoading ? styles.ctrlCenterCircleOuterReady : null,
              ]}
            >
              <View
                style={[
                  styles.ctrlCenterCircleInner,
                  !isRecording ? styles.ctrlCenterCircleInnerStart : null,
                  nearStart && !isConquerLoading ? styles.ctrlCenterCircleInnerReady : null,
                ]}
              >
                <Square size={24} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.ctrlLabelCenter}>{drawButtonLabel}</Text>
          </Pressable>

          <Pressable style={styles.exitButton} onPress={handleCancelExit} disabled={isConquerLoading}>
            <Text style={styles.exitButtonText}>Vazgeç / Çık</Text>
          </Pressable>
        </View>
      </View>

      <BottomNav activeTab="map" style={styles.bottomTabOffset} />

      {isRecording && typeof distanceToStart === "number" ? (
        <View style={[styles.distanceBadge, { bottom: 272 * contentScale, transform: [{ scale: contentScale }] }]}>
          <Text style={styles.distanceText}>Başlangıca {Math.round(distanceToStart)} m</Text>
        </View>
      ) : null}

      {nearStart ? (
        <View style={[styles.nearStartBadge, { bottom: 236 * contentScale, transform: [{ scale: contentScale }] }]}>
          <Text style={styles.nearStartText}>Başlangıca döndün, şimdi kapatabilirsin</Text>
        </View>
      ) : null}

      <Modal transparent animationType="fade" visible={resultModalVisible} onRequestClose={() => {}}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Fetih Tamamlandı</Text>

            <View style={styles.modalStatRow}>
              <Text style={styles.modalStatLabel}>Kazanılan Alan</Text>
              <Text style={styles.modalStatValue}>{Math.round(resultCapturedArea).toLocaleString("tr-TR")} m²</Text>
            </View>
            <View style={styles.modalStatRow}>
              <Text style={styles.modalStatLabel}>Mesafe</Text>
              <Text style={styles.modalStatValue}>{resultDistanceKm} km</Text>
            </View>
            <View style={styles.modalStatRow}>
              <Text style={styles.modalStatLabel}>Adım</Text>
              <Text style={styles.modalStatValue}>{resultSteps.toLocaleString("tr-TR")}</Text>
            </View>

            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setResultModalVisible(false);
                router.replace(ROUTES.tabs.map);
              }}
            >
              <Text style={styles.modalButtonText}>Tamam</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  playerMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0, 232, 255, 0.25)",
    borderWidth: 2,
    borderColor: "#00E8FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00E8FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },
  playerMarkerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
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
  conquerLoadingPill: {
    top: 132,
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
  distanceBadge: {
    position: "absolute",
    alignSelf: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(0, 232, 255, 0.35)",
    backgroundColor: "rgba(10, 18, 29, 0.88)",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  distanceText: {
    color: "#82F2FF",
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  bottomTabOffset: {
    bottom: -16,
  },
  ctrlCenterWrap: {
    width: 216,
    alignItems: "center",
    gap: 8,
  },
  ctrlCenterWrapDisabled: {
    opacity: 0.72,
  },
  ctrlCenterCircleOuter: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: "rgba(0, 232, 255, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(0, 232, 255, 0.58)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00E8FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  ctrlCenterCircleOuterStart: {
    backgroundColor: "rgba(0, 232, 255, 0.2)",
  },
  ctrlCenterCircleOuterReady: {
    backgroundColor: "rgba(54, 240, 122, 0.24)",
    borderColor: "rgba(54, 240, 122, 0.72)",
    shadowColor: "#36F07A",
    shadowOpacity: 0.65,
    shadowRadius: 18,
  },
  ctrlCenterCircleInner: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: "#00E8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  ctrlCenterCircleInnerStart: {
    backgroundColor: "#00D7EE",
  },
  ctrlCenterCircleInnerReady: {
    backgroundColor: "#36F07A",
  },
  ctrlLabelCenter: {
    color: "#E6EAF0",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 17,
  },
  exitButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.4)",
    backgroundColor: "rgba(10, 18, 29, 0.82)",
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  exitButtonText: {
    color: "#AAB6C4",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 13,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.52)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 232, 255, 0.4)",
    backgroundColor: "rgba(8, 18, 29, 0.98)",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    gap: 12,
  },
  modalTitle: {
    color: "#EAFBFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 22,
    textAlign: "center",
  },
  modalStatRow: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.25)",
    backgroundColor: "rgba(16, 30, 45, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalStatLabel: {
    color: "#9AB2C8",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 14,
  },
  modalStatValue: {
    color: "#E8F9FF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 16,
  },
  modalButton: {
    marginTop: 4,
    borderRadius: 14,
    backgroundColor: "#00D8F0",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  modalButtonText: {
    color: "#052026",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 16,
  },
});
