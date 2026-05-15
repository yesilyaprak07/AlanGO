import { useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CalendarDays,
  Camera,
  ChevronDown,
  ChevronRight,
  Crosshair,
  Gem,
  Hexagon,
  History,
  Layers,
  LocateFixed,
  Search,
  Trophy,
  Users,
} from "lucide-react-native";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import { darkMapStyle } from "@/constants/mapStyles";
import { theme } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";

const FALLBACK_CENTER = { latitude: 36.8969, longitude: 30.7133 };

type ModeKey = "private" | "solo" | "group";
type BottomKey = "leaderboard" | "events" | "zones" | "history";

const modeOptions: { key: ModeKey; label: string }[] = [
  { key: "private", label: "Özel Lobi" },
  { key: "solo", label: "Tek Kişi" },
  { key: "group", label: "Grubum" },
];

const bottomItems: { key: BottomKey; label: string; icon: React.ReactNode }[] = [
  { key: "leaderboard", label: "Liderlik", icon: <Trophy size={20} color={theme.colors.primaryCyan} /> },
  { key: "events", label: "Etkinlikler", icon: <CalendarDays size={20} color={theme.colors.textMuted} /> },
  { key: "zones", label: "Bölgeler", icon: <Hexagon size={20} color={theme.colors.textMuted} /> },
  { key: "history", label: "Geçmiş", icon: <History size={20} color={theme.colors.textMuted} /> },
];

function offset(center: { latitude: number; longitude: number }, lat: number, lng: number) {
  return {
    latitude: center.latitude + lat,
    longitude: center.longitude + lng,
  };
}

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeMode, setActiveMode] = useState<ModeKey>("solo");

  const center = FALLBACK_CENTER;
  const initialRegion = {
    ...center,
    latitudeDelta: 0.013,
    longitudeDelta: 0.013,
  };

  const territories = useMemo(
    () => [
      {
        id: "cyan",
        stroke: "#66F6FF",
        fill: "rgba(102, 246, 255, 0.22)",
        nodes: [
          offset(center, 0.0020, -0.0046),
          offset(center, 0.0039, -0.0029),
          offset(center, 0.0030, -0.0004),
          offset(center, 0.0012, 0.0010),
          offset(center, -0.0013, -0.0006),
          offset(center, -0.0010, -0.0033),
        ],
      },
      {
        id: "red",
        stroke: "#FF5656",
        fill: "rgba(255, 86, 86, 0.18)",
        nodes: [
          offset(center, 0.0016, -0.0083),
          offset(center, 0.0000, -0.0068),
          offset(center, -0.0017, -0.0079),
          offset(center, -0.0010, -0.0106),
          offset(center, 0.0010, -0.0109),
        ],
      },
      {
        id: "purple",
        stroke: "#D06BFF",
        fill: "rgba(186, 72, 255, 0.20)",
        nodes: [
          offset(center, -0.0012, 0.0012),
          offset(center, 0.0002, 0.0037),
          offset(center, -0.0013, 0.0068),
          offset(center, -0.0038, 0.0055),
          offset(center, -0.0045, 0.0020),
        ],
      },
      {
        id: "gold",
        stroke: "#FFD15C",
        fill: "rgba(255, 209, 92, 0.20)",
        nodes: [
          offset(center, -0.0060, -0.0038),
          offset(center, -0.0047, -0.0014),
          offset(center, -0.0058, 0.0009),
          offset(center, -0.0082, -0.0004),
          offset(center, -0.0080, -0.0030),
        ],
      },
    ],
    [center]
  );

  const nodePoints = useMemo(
    () => territories.flatMap((t) => t.nodes.map((n) => ({ ...n, id: `${t.id}-${n.latitude}-${n.longitude}`, color: t.stroke }))),
    [territories]
  );

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        customMapStyle={darkMapStyle}
        mapType="standard"
        initialRegion={initialRegion}
        showsCompass={false}
        showsScale={false}
        toolbarEnabled={false}
      >
        {territories.map((area) => (
          <Polygon key={area.id} coordinates={area.nodes} strokeColor={area.stroke} fillColor={area.fill} strokeWidth={2} />
        ))}

        {nodePoints.map((node) => (
          <Marker key={node.id} coordinate={node} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={[styles.nodeDot, { borderColor: node.color, shadowColor: node.color }]} />
          </Marker>
        ))}

        <Marker coordinate={offset(center, -0.0065, -0.0091)} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles.mysteryBadge}>
            <Text style={styles.mysteryText}>?</Text>
          </View>
        </Marker>
      </MapView>

      <SafeAreaView style={styles.topOverlay} edges={["top"]}>
        <View style={styles.topHudRow}>
          <View style={styles.logoButton}>
            <Hexagon size={30} color={theme.colors.primaryCyan} />
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AL</Text>
          </View>

          <View style={styles.currencyChip}>
            <View style={styles.coinIcon} />
            <Text style={styles.currencyText}>2.450</Text>
          </View>

          <View style={styles.currencyChip}>
            <Gem size={16} color="#8B5CF6" fill="#8B5CF6" />
            <Text style={styles.currencyText}>128</Text>
            <ChevronDown size={14} color={theme.colors.textMuted} />
          </View>

          <Pressable style={styles.searchButton} onPress={() => router.push(ROUTES.tabs.discover)}>
            <Search size={18} color={theme.colors.textPrimary} />
          </Pressable>
        </View>

        <View style={styles.modeRow}>
          {modeOptions.map((mode) => {
            const active = mode.key === activeMode;
            return (
              <Pressable key={mode.key} style={[styles.modeButton, active && styles.modeButtonActive]} onPress={() => setActiveMode(mode.key)}>
                <Text style={[styles.modeText, active && styles.modeTextActive]}>{mode.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>

      <View style={styles.rightRail}>
        <Pressable style={styles.railBtn} onPress={() => router.push(ROUTES.tabs.missions)}>
          <LocateFixed size={20} color={theme.colors.goldReward} />
        </Pressable>
        <Pressable style={styles.railBtn} onPress={() => router.push(ROUTES.tabs.settings)}>
          <Crosshair size={20} color={theme.colors.textPrimary} />
        </Pressable>
        <Pressable style={styles.railBtn} onPress={() => router.push(ROUTES.tabs.feed)}>
          <Camera size={20} color={theme.colors.textPrimary} />
        </Pressable>
        <Pressable style={styles.railBtn} onPress={() => router.push(ROUTES.tabs.store)}>
          <Layers size={20} color={theme.colors.textPrimary} />
        </Pressable>
        <Pressable style={styles.railBtn} onPress={() => router.push(ROUTES.tabs.profile)}>
          <Users size={20} color={theme.colors.textPrimary} />
        </Pressable>
      </View>

      <SafeAreaView style={[styles.bottomWrap, { paddingBottom: insets.bottom + 8 }]} edges={["bottom"]}>
        <View style={styles.bottomCard}>
          <View style={styles.bottomHeader}>
            <View style={styles.bottomTitleRow}>
              <Text style={styles.bottomTitle}>Mahallem</Text>
              <ChevronDown size={18} color={theme.colors.textSecondary} />
            </View>
            <Pressable onPress={() => router.push(ROUTES.tabs.leaderboard)}>
              <ChevronRight size={22} color={theme.colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Sıralama</Text>
              <Text style={styles.statValue}># 3</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Alanım</Text>
              <Text style={styles.statValue}>12.450 m²</Text>
            </View>
          </View>

          <View style={styles.bottomTabs}>
            {bottomItems.map((item) => {
              const active = item.key === "leaderboard";
              return (
                <Pressable
                  key={item.key}
                  style={[styles.bottomTab, active && styles.bottomTabActive]}
                  onPress={() => {
                    if (item.key === "leaderboard") router.push(ROUTES.tabs.leaderboard);
                    if (item.key === "events") router.push(ROUTES.events);
                    if (item.key === "zones") router.push(ROUTES.tabs.map);
                    if (item.key === "history") router.push(ROUTES.tabs.feed);
                  }}
                >
                  {item.icon}
                  <Text style={[styles.bottomTabText, active && styles.bottomTabTextActive]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </SafeAreaView>

      <SafeAreaView style={styles.topFade} pointerEvents="none" edges={["top"]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#02060C",
  },
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 2,
  },
  topHudRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  logoButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(7, 18, 31, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(110, 232, 255, 0.34)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 16,
  },
  currencyChip: {
    minWidth: 112,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(6, 16, 28, 0.86)",
    borderWidth: 1,
    borderColor: "rgba(146, 168, 194, 0.25)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 12,
  },
  coinIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FFCF4D",
  },
  currencyText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 16,
  },
  searchButton: {
    marginLeft: "auto",
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "rgba(174, 190, 210, 0.34)",
    backgroundColor: "rgba(6, 16, 28, 0.86)",
    alignItems: "center",
    justifyContent: "center",
  },
  modeRow: {
    marginTop: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(174, 190, 210, 0.24)",
    backgroundColor: "rgba(7, 17, 30, 0.84)",
    flexDirection: "row",
    padding: 3,
  },
  modeButton: {
    flex: 1,
    height: 45,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  modeButtonActive: {
    backgroundColor: "rgba(84, 248, 255, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(84, 248, 255, 0.62)",
  },
  modeText: {
    color: "rgba(226, 235, 245, 0.86)",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 17,
  },
  modeTextActive: {
    color: "#A9FAFF",
  },
  rightRail: {
    position: "absolute",
    right: 14,
    top: "28%",
    gap: 14,
    zIndex: 2,
  },
  railBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(174, 190, 210, 0.34)",
    backgroundColor: "rgba(7, 18, 31, 0.86)",
  },
  nodeDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#DBF7FF",
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 3,
  },
  mysteryBadge: {
    width: 66,
    height: 74,
    borderRadius: 16,
    backgroundColor: "rgba(19, 29, 42, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255, 199, 87, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  mysteryText: {
    color: "#FFD15C",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 46,
    lineHeight: 50,
  },
  bottomWrap: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 0,
    zIndex: 3,
  },
  bottomCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(148, 168, 190, 0.24)",
    backgroundColor: "rgba(5, 16, 30, 0.92)",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  bottomHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  bottomTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bottomTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 32,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: 14,
  },
  statCol: {
    flex: 1,
    gap: 6,
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 14,
  },
  statValue: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 41,
  },
  statDivider: {
    width: 1,
    marginHorizontal: 16,
    backgroundColor: "rgba(148, 168, 190, 0.24)",
  },
  bottomTabs: {
    borderTopWidth: 1,
    borderTopColor: "rgba(148, 168, 190, 0.24)",
    paddingTop: 10,
    flexDirection: "row",
    gap: 8,
  },
  bottomTab: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  bottomTabActive: {
    backgroundColor: "rgba(84, 248, 255, 0.08)",
  },
  bottomTabText: {
    color: "rgba(210, 221, 234, 0.72)",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 13,
  },
  bottomTabTextActive: {
    color: theme.colors.primaryCyan,
  },
  topFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 170,
    backgroundColor: "rgba(4, 12, 22, 0.28)",
  },
});
