import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bell,
  Coins,
  Gem,
  MessageCircle,
  Radar,
  Settings2,
  Target,
  Trophy,
  User,
  Shield,
  Map as MapIcon,
  Sparkles,
} from "lucide-react-native";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { BottomTabBar, GlassCard, NeonButton, TopModeSwitcher } from "@/components/ui";
import { theme } from "@/constants/theme";
import { useGameStore } from "@/stores/gameStore";
import { darkMapStyle } from "@/constants/mapStyles";
import { useAuth } from "@/lib/auth";
import { GlowPulseView, ShimmerBadge } from "@/components/motion";
import { useFadeIn } from "@/hooks/useFadeIn";
import { AmbientGlow, AnimatedGradient, RadarPulse } from "@/components/fx";
import { ROUTES } from "@/constants/routes";
import { getBottomCtaPadding, isCompactHeight, isNarrowWidth } from "@/constants/safeArea";

const FALLBACK_CENTER = { latitude: 36.8969, longitude: 30.7133 };

type ModeKey = "private" | "solo" | "squad";
type BottomKey = "map" | "missions" | "feed" | "notifications" | "profile";

const MODE_OPTIONS: { key: ModeKey; label: string }[] = [
  { key: "private", label: "Ã–zel Lobi" },
  { key: "solo", label: "Tek KiÅŸi" },
  { key: "squad", label: "Grubum" },
];

function offset(center: { latitude: number; longitude: number }, lat: number, lng: number) {
  return {
    latitude: center.latitude + lat,
    longitude: center.longitude + lng,
  };
}

function createRivalPolygons(center: { latitude: number; longitude: number }) {
  return [
    {
      id: "rival-purple",
      stroke: "#8B5CF6",
      fill: "rgba(139, 92, 246, 0.22)",
      points: [
        offset(center, 0.0018, 0.0015),
        offset(center, 0.0028, 0.0024),
        offset(center, 0.0016, 0.0031),
        offset(center, 0.0007, 0.0022),
      ],
    },
    {
      id: "rival-red",
      stroke: "#FF4D4D",
      fill: "rgba(255, 77, 77, 0.18)",
      points: [
        offset(center, -0.0011, 0.0019),
        offset(center, -0.0001, 0.0028),
        offset(center, -0.0013, 0.0035),
        offset(center, -0.0022, 0.0028),
      ],
    },
    {
      id: "rival-gold",
      stroke: "#FFC857",
      fill: "rgba(255, 200, 87, 0.2)",
      points: [
        offset(center, 0.0011, -0.0024),
        offset(center, 0.0022, -0.0015),
        offset(center, 0.001, -0.0007),
        offset(center, 0.0002, -0.0017),
      ],
    },
    {
      id: "rival-green",
      stroke: "#22C55E",
      fill: "rgba(34, 197, 94, 0.18)",
      points: [
        offset(center, -0.0025, -0.0019),
        offset(center, -0.0016, -0.0009),
        offset(center, -0.0026, -0.0001),
        offset(center, -0.0034, -0.0011),
      ],
    },
  ];
}

function rivalIdleFill(id: string) {
  if (id.includes("purple")) return "rgba(139, 92, 246, 0.10)";
  if (id.includes("red")) return "rgba(255, 77, 77, 0.10)";
  if (id.includes("gold")) return "rgba(255, 200, 87, 0.10)";
  return "rgba(34, 197, 94, 0.10)";
}

function HexAvatar({ initials, size = 44 }: { initials: string; size?: number }) {
  return (
    <View
      style={[
        styles.hexAvatar,
        {
          width: size,
          height: size,
          borderRadius: size * 0.24,
        },
      ]}
    >
      <Text style={[styles.hexAvatarText, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

function MapFloatingButton({
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
    <Pressable style={({ pressed }) => [styles.floatAction, compact && styles.floatActionCompact, pressed && styles.floatActionPressed]} onPress={onPress}>
      <View style={styles.floatActionIcon}>{icon}</View>
      {!compact ? <Text style={styles.floatActionLabel}>{label}</Text> : null}
    </Pressable>
  );
}

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const compact = isCompactHeight(height);
  const narrow = isNarrowWidth(width);
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [cityName, setCityName] = useState<string>("Konum bekleniyor...");
  const [activeMode, setActiveMode] = useState<ModeKey>("solo");
  const [activeInfoTab, setActiveInfoTab] = useState("Liderlik");
  const [territoryGlowOn, setTerritoryGlowOn] = useState(true);
  const [rivalGlowOn, setRivalGlowOn] = useState(false);
  const { territories, totalArea, loadTerritories } = useGameStore();
  const { profile } = useAuth();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const bottomSheetReveal = useFadeIn({ duration: 420, delay: 70, fromY: 22, fromScale: 0.985 });

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
        { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 2 },
        (loc) => {
          if (!isMounted) return;
          const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          setLocation((prev) => {
            if (!prev) {
              mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.005, longitudeDelta: 0.005 }, 600);
              Location.reverseGeocodeAsync(coords)
                .then((results) => {
                  if (results.length > 0) {
                    const r = results[0];
                    setCityName(r.district ?? r.city ?? r.region ?? "");
                  }
                })
                .catch(() => {});
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
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.8, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ])
    );
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.5, duration: 2000, useNativeDriver: true }),
      ])
    );

    pulseLoop.start();
    glowLoop.start();

    return () => {
      pulseLoop.stop();
      glowLoop.stop();
    };
  }, [pulseAnim, glowAnim]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTerritoryGlowOn((prev) => !prev);
      setRivalGlowOn((prev) => !prev);
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  const center = location ?? FALLBACK_CENTER;
  const rivalPolygons = useMemo(() => createRivalPolygons(center), [center.latitude, center.longitude]);

  const handleCenterOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({ ...location, latitudeDelta: 0.005, longitudeDelta: 0.005 }, 600);
    }
  };

  const initialRegion = {
    ...center,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  };

  const pulseOpacity = pulseAnim.interpolate({ inputRange: [1, 1.8], outputRange: [0.5, 0] });
  const scoreArea = totalArea > 0 ? Math.round(totalArea) : 12450;
  const mahalleValue = cityName.trim().length > 0 ? cityName : "Mahallem";

  const bottomTabs = [
    {
      key: "map" as const,
      label: "Harita",
      icon: <MapIcon size={16} color={theme.colors.primaryCyan} />,
    },
    {
      key: "missions" as const,
      label: "GÃ¶rev",
      icon: <Target size={16} color={theme.colors.textMuted} />,
    },
    {
      key: "feed" as const,
      label: "Feed",
      icon: <MessageCircle size={16} color={theme.colors.textMuted} />,
    },
    {
      key: "notifications" as const,
      label: "Bildirim",
      icon: <Bell size={16} color={theme.colors.textMuted} />,
    },
    {
      key: "profile" as const,
      label: "Profil",
      icon: <User size={16} color={theme.colors.textMuted} />,
    },
  ];

  return (
    <View style={styles.container}>
      <AmbientGlow cyanOpacity={0.04} purpleOpacity={0.03} />
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
            strokeColor="rgba(0, 229, 204, 0.82)"
            strokeWidth={2}
            fillColor={t.color ?? (territoryGlowOn ? "rgba(0, 229, 204, 0.17)" : "rgba(0, 229, 204, 0.10)")}
          />
        ))}

        {territories.length === 0 && (
          <Polygon
            coordinates={[
              offset(center, 0.0004, 0.0004),
              offset(center, 0.0012, 0.0011),
              offset(center, 0.0006, 0.0018),
              offset(center, -0.0002, 0.001),
            ]}
            strokeColor="rgba(0, 229, 204, 0.82)"
            strokeWidth={2}
            fillColor={territoryGlowOn ? "rgba(0, 229, 204, 0.17)" : "rgba(0, 229, 204, 0.10)"}
          />
        )}

        {rivalPolygons.map((rival) => (
          <Polygon
            key={rival.id}
            coordinates={rival.points}
            strokeColor={rival.stroke}
            strokeWidth={1.6}
            fillColor={rivalGlowOn ? rival.fill : rivalIdleFill(rival.id)}
          />
        ))}

        <Marker coordinate={offset(center, 0.0008, -0.0028)} anchor={{ x: 0.5, y: 0.5 }}>
          <Pressable style={styles.rewardPinWrap} onPress={() => router.push(ROUTES.hiddenRewardFound)}>
            <RadarPulse size={38} color="rgba(255, 200, 87, 0.42)" />
            <ShimmerBadge style={styles.hiddenRewardPin} shimmerColor="rgba(255, 200, 87, 0.24)">
              <Text style={styles.hiddenRewardMark}>?</Text>
            </ShimmerBadge>
          </Pressable>
        </Marker>

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

      <SafeAreaView style={styles.topOverlay} edges={["top"]}>
        <View style={styles.topRow}>
          <Pressable style={({ pressed }) => [styles.userCard, pressed && styles.pressed]} onPress={() => router.push(ROUTES.tabs.profile)}>
            <HexAvatar initials={profile?.username?.slice(0, 2).toUpperCase() ?? "?"} />
            <View style={styles.userInfo}>
              <Text style={styles.usernameText}>{profile?.username ?? "Oyuncu"}</Text>
              <Text style={styles.levelText}>Seviye {profile?.level ?? 1}</Text>
            </View>

            <GlowPulseView duration={600} minOpacity={0.86} maxOpacity={1} minScale={1} maxScale={1.02}>
              <Pressable style={({ pressed }) => [styles.currencyInline, pressed && styles.pressed]} onPress={() => router.push(ROUTES.premium)}>
                <View style={styles.currencyChip}>
                  <Coins size={12} color={theme.colors.goldReward} />
                  <Text style={styles.currencyText}>{profile?.gold?.toLocaleString("tr-TR") ?? "0"}</Text>
                </View>
                <View style={styles.currencyChip}>
                  <Gem size={12} color={theme.colors.primaryCyan} />
                  <Text style={styles.currencyText}>{profile?.energy ?? 0}</Text>
                </View>
              </Pressable>
            </GlowPulseView>
          </Pressable>

          <View style={styles.actionIcons}>
            <Pressable style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]} onPress={() => router.push(ROUTES.tabs.notifications)}>
              <Bell size={18} color={theme.colors.textPrimary} />
            </Pressable>
            <Pressable style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]} onPress={() => router.push(ROUTES.tabs.settings)}>
              <Settings2 size={18} color={theme.colors.textPrimary} />
            </Pressable>
          </View>
        </View>

        <TopModeSwitcher
          options={MODE_OPTIONS}
          value={activeMode}
          onChange={(next) => setActiveMode(next)}
          style={styles.modeSwitcher}
        />
      </SafeAreaView>

      <View
        style={[
          styles.floatingActions,
          {
            top: compact ? insets.top + 126 : height * 0.33,
          },
        ]}
      >
        <GlowPulseView duration={780} minOpacity={0.92} maxOpacity={1} minScale={1} maxScale={1.02}>
          <MapFloatingButton
            icon={<Radar size={17} color={theme.colors.primaryCyan} />}
            label="Radar"
            compact={narrow}
            onPress={() => {
              // TODO: Toggle advanced radar overlays.
            }}
          />
        </GlowPulseView>
        <GlowPulseView duration={860} minOpacity={0.92} maxOpacity={1} minScale={1} maxScale={1.02}>
          <MapFloatingButton
            icon={<Target size={17} color={theme.colors.primaryCyan} />}
            label="GÃ¶revler"
            compact={narrow}
            onPress={() => router.push(ROUTES.tabs.missions)}
          />
        </GlowPulseView>
        <GlowPulseView duration={940} minOpacity={0.93} maxOpacity={1} minScale={1} maxScale={1.015}>
          <MapFloatingButton
            icon={<Sparkles size={17} color={theme.colors.goldReward} />}
            label="Etkinlik"
            compact={narrow}
            onPress={() => router.push(ROUTES.events)}
          />
        </GlowPulseView>
      </View>

      <Animated.View style={[styles.bottomSheetAnimWrap, bottomSheetReveal.style]}>
        <SafeAreaView style={[styles.bottomSheetWrap, { paddingBottom: getBottomCtaPadding(insets.bottom, 0) }]} edges={["bottom"]}>
          <GlassCard style={styles.bottomSheet} contentStyle={styles.bottomSheetContent}>
          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitleGroup}>
              <Text style={styles.sheetLabel}>Mahallem</Text>
              <Text style={styles.sheetValue}>{mahalleValue}</Text>
            </View>
            <View style={styles.sheetMiniStat}>
              <Trophy size={14} color={theme.colors.goldReward} />
              <Text style={styles.sheetMiniStatText}>SÄ±ralama #3</Text>
            </View>
          </View>

          <View style={styles.areaCard}>
            <AnimatedGradient color="rgba(0, 229, 204, 0.14)" duration={980} />
            <Text style={styles.areaLabel}>AlanÄ±m</Text>
            <Text style={styles.areaValue}>{scoreArea.toLocaleString("tr-TR")} mÂ²</Text>
            <Text style={styles.areaHint}>YakÄ±nda gizli Ã¶dÃ¼l sinyali algÄ±landÄ±</Text>
          </View>

          <View style={[styles.sheetTabs, narrow && styles.sheetTabsWrap]}>
            {["Liderlik", "Etkinlikler", "BÃ¶lgeler", "GeÃ§miÅŸ"].map((tab) => {
              const active = activeInfoTab === tab;
              return (
                <Pressable
                  key={tab}
                  style={[styles.sheetTab, narrow && styles.sheetTabNarrow, active && styles.sheetTabActive]}
                  onPress={() => setActiveInfoTab(tab)}
                >
                  <Text style={[styles.sheetTabText, active && styles.sheetTabTextActive]}>{tab}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={[styles.sheetFooterRow, narrow && styles.sheetFooterRowWrap]}>
            <View style={styles.sheetSignalChip}>
              <Shield size={13} color={theme.colors.primaryCyan} />
              <Text style={styles.sheetSignalText}>BÃ¶lge gÃ¼venli ama Ã¶dÃ¼l izi var</Text>
            </View>
            <NeonButton label="Oyna" size="sm" onPress={() => router.push(ROUTES.activeGame)} />
          </View>

          <BottomTabBar<BottomKey>
            tabs={bottomTabs}
            activeKey="map"
            onTabPress={(key) => {
              if (key === "map") return;
              if (key === "missions") router.push(ROUTES.tabs.missions);
              if (key === "feed") router.push(ROUTES.tabs.feed);
              if (key === "notifications") router.push(ROUTES.tabs.notifications);
              if (key === "profile") router.push(ROUTES.tabs.profile);
            }}
            style={styles.bottomTabOverride}
          />
          </GlassCard>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDeep,
  },

  hexAvatar: {
    backgroundColor: "rgba(0, 229, 204, 0.16)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(0, 229, 204, 0.48)",
  },
  hexAvatarText: {
    color: theme.colors.primaryCyan,
    fontFamily: theme.typography.fontFamily.bold,
  },

  playerMarkerContainer: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  playerPulse: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(0, 229, 204, 0.38)",
  },
  playerPulse2: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryCyan,
    opacity: 0.2,
  },
  playerDotOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0, 229, 204, 0.30)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.primaryCyan,
  },
  playerDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primaryCyan,
  },

  hiddenRewardPin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255, 200, 87, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(255, 200, 87, 0.42)",
    alignItems: "center",
    justifyContent: "center",
  },
  rewardPinWrap: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  hiddenRewardMark: {
    color: theme.colors.goldReward,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 12,
    includeFontPadding: false,
  },

  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.md,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    gap: theme.spacing.sm,
  },
  userCard: {
    flex: 1,
    minHeight: 58,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceCard,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  userInfo: {
    flex: 1,
  },
  usernameText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.base,
  },
  levelText: {
    marginTop: 2,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  currencyInline: {
    gap: 6,
  },
  currencyChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  currencyText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.xs,
  },
  actionIcons: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceCard,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  modeSwitcher: {
    marginTop: theme.spacing.sm,
  },

  floatingActions: {
    position: "absolute",
    right: theme.spacing.md,
    top: "33%",
    gap: theme.spacing.xs,
  },
  floatAction: {
    width: 72,
    minHeight: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceCard,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    paddingVertical: theme.spacing.xs,
  },
  floatActionCompact: {
    width: 46,
    minHeight: 46,
    borderRadius: 12,
  },
  floatActionPressed: {
    opacity: 0.85,
  },
  floatActionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0, 229, 204, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  floatActionLabel: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 10,
  },

  bottomSheetWrap: {
    width: "100%",
  },
  bottomSheetAnimWrap: {
    position: "absolute",
    left: theme.spacing.md,
    right: theme.spacing.md,
    bottom: 70,
  },
  bottomSheet: {
    borderRadius: theme.radius.xl,
  },
  bottomSheetContent: {
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  sheetTitleGroup: {
    flex: 1,
  },
  sheetLabel: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  sheetValue: {
    marginTop: 2,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.lg,
  },
  sheetMiniStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: "rgba(255, 200, 87, 0.34)",
    backgroundColor: "rgba(255, 200, 87, 0.14)",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  sheetMiniStatText: {
    color: theme.colors.goldReward,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
  },
  areaCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    padding: theme.spacing.md,
  },
  areaLabel: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
  },
  areaValue: {
    marginTop: 2,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xxl,
  },
  areaHint: {
    marginTop: 6,
    color: "rgba(255, 200, 87, 0.86)",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  sheetTabs: {
    flexDirection: "row",
    gap: 8,
  },
  sheetTabsWrap: {
    flexWrap: "wrap",
  },
  sheetTab: {
    flex: 1,
    minHeight: 34,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTabNarrow: {
    minWidth: "48%",
  },
  sheetTabActive: {
    borderColor: theme.colors.primaryCyan,
    backgroundColor: "rgba(0, 229, 204, 0.16)",
  },
  sheetTabText: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
  },
  sheetTabTextActive: {
    color: theme.colors.primaryCyan,
  },
  sheetFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  sheetFooterRowWrap: {
    flexWrap: "wrap",
  },
  sheetSignalChip: {
    flex: 1,
    minHeight: 40,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sheetSignalText: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
  },
  bottomTabOverride: {
    marginTop: theme.spacing.xs,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    backgroundColor: "rgba(6, 16, 24, 0.92)",
  },
  pressed: {
    opacity: 0.86,
  },
});

