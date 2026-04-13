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
import { Bell, Navigation, MapPin } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useState, useEffect, useRef } from "react";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useGameStore } from "@/stores/gameStore";
import { darkMapStyle } from "@/constants/mapStyles";

const { height } = Dimensions.get("window");

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [isGameActive] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [cityName, setCityName] = useState<string>("...");
  const { territories, totalArea, loadTerritories } = useGameStore();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Load saved territories on mount
  useEffect(() => {
    loadTerritories();
  }, [loadTerritories]);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let isMounted = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted" || !isMounted) return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 2,
        },
        (loc) => {
          if (!isMounted) return;
          const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          setLocation((prev) => {
            if (!prev) {
              if (mapRef.current) {
                mapRef.current.animateToRegion(
                  { ...coords, latitudeDelta: 0.005, longitudeDelta: 0.005 },
                  600
                );
              }
              // Reverse geocode only on first fix
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

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.6,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const handleStartGame = () => {
    router.push("/active-game");
  };

  const handleCenterOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        ...location,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 600);
    }
  };

  const initialRegion = location
    ? { ...location, latitudeDelta: 0.005, longitudeDelta: 0.005 }
    : { latitude: 36.8969, longitude: 30.7133, latitudeDelta: 0.005, longitudeDelta: 0.005 };

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [1, 1.6],
    outputRange: [0.4, 0],
  });

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
        mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        {/* Captured territories */}
        {territories.map((t) => (
          <Polygon
            key={t.id}
            coordinates={t.polygon}
            strokeColor="rgba(0, 240, 255, 0.6)"
            strokeWidth={2}
            fillColor={t.color}
          />
        ))}

        {location && (
          <Marker coordinate={location} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.playerMarkerContainer}>
              <Animated.View
                style={[
                  styles.playerPulse,
                  {
                    transform: [{ scale: pulseAnim }],
                    opacity: pulseOpacity,
                  },
                ]}
              />
              <View style={styles.playerDotOuter}>
                <View style={styles.playerDotInner} />
              </View>
            </View>
          </Marker>
        )}
      </MapView>

      {/* Top Bar */}
      <SafeAreaView style={styles.topBar} edges={["top"]}>
        <TouchableOpacity style={styles.avatar} onPress={() => router.push("/(tabs)/profile")}>
          <Text style={styles.avatarText}>A</Text>
        </TouchableOpacity>
        <View style={styles.locationBadge}>
          <MapPin size={14} color={Colors.primary} />
          <Text style={styles.locationText}>{cityName}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={22} color={Colors.textPrimary} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Right Floating Buttons */}
      <View style={styles.rightButtons}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleCenterOnUser}
        >
          <Navigation size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Bottom Panel */}
      <SafeAreaView style={styles.bottomPanel} edges={["bottom"]}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {`${Math.round(totalArea).toLocaleString()} m²`}
            </Text>
            <Text style={styles.statLabel}>Alan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{territories.length}</Text>
            <Text style={styles.statLabel}>Bölge</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.startButton, isGameActive && styles.activeButton]}
          onPress={handleStartGame}
        >
          <Text style={styles.startButtonText}>
            {isGameActive ? "Devam Et" : "BAŞLA"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "bold", color: Colors.background },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(26, 29, 32, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  locationText: { fontSize: 14, fontWeight: "600", color: Colors.textPrimary },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.danger,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { fontSize: 10, fontWeight: "bold", color: Colors.textPrimary },
  rightButtons: {
    position: "absolute",
    right: 16,
    top: height * 0.35,
    gap: 12,
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  bottomPanel: {
    position: "absolute",
    bottom: 90,
    left: 16,
    right: 16,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "bold", color: Colors.textPrimary },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: Colors.surfaceBorder },
  startButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  activeButton: { backgroundColor: Colors.success },
  startButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.background,
  },
});
