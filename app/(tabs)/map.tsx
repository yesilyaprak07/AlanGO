import { useCallback, useMemo, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChevronDown,
  ChevronRight,
  Crown,
  Crosshair,
  ClipboardCheck,
  FlagTriangleRight,
  Footprints,
  Gift,
  HelpCircle,
  LogOut,
  Map,
  Medal,
  Settings,
  Shield,
  ShoppingCart,
  Skull,
  Star,
  Trophy,
  User,
  X,
} from "lucide-react-native";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import { darkMapStyle } from "@/constants/mapStyles";
import { theme } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import { BottomTabBar, TopHudBar } from "@/components/ui";

const FALLBACK_CENTER = { latitude: 36.8969, longitude: 30.7133 };
const HUD_SIDE_GAP = 7;

type BottomKey = "map" | "leaderboard" | "rewards" | "store";

function offset(center: { latitude: number; longitude: number }, lat: number, lng: number) {
  return {
    latitude: center.latitude + lat,
    longitude: center.longitude + lng,
  };
}

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnim = useRef(new Animated.Value(0)).current;

  const center = FALLBACK_CENTER;
  const initialRegion = {
    ...center,
    latitudeDelta: 0.014,
    longitudeDelta: 0.014,
  };

  const territories = useMemo(
    () => [
      {
        id: "cyan",
        stroke: "#10F4E8",
        fill: "rgba(16, 244, 232, 0.16)",
        icon: <Shield size={8} color="#B9FFF8" />,
        badge: offset(center, 0.0002, -0.0002),
        nodes: [
          offset(center, 0.0022, -0.0045),
          offset(center, 0.0038, -0.0025),
          offset(center, 0.0030, -0.0001),
          offset(center, 0.0011, 0.0011),
          offset(center, -0.0014, -0.0007),
          offset(center, -0.0011, -0.0033),
        ],
      },
      {
        id: "red",
        stroke: "#FF3B4F",
        fill: "rgba(255, 59, 79, 0.17)",
        icon: <Skull size={8} color="#FF8D97" />,
        badge: offset(center, 0.0006, -0.0084),
        nodes: [
          offset(center, 0.0017, -0.0082),
          offset(center, -0.0001, -0.0068),
          offset(center, -0.0016, -0.0078),
          offset(center, -0.0010, -0.0106),
          offset(center, 0.0011, -0.0108),
        ],
      },
      {
        id: "purple",
        stroke: "#9B5CFF",
        fill: "rgba(155, 92, 255, 0.18)",
        icon: <Crown size={8} color="#D0B0FF" />,
        badge: offset(center, -0.0024, 0.0037),
        nodes: [
          offset(center, -0.0012, 0.0012),
          offset(center, 0.0003, 0.0037),
          offset(center, -0.0014, 0.0069),
          offset(center, -0.0038, 0.0054),
          offset(center, -0.0045, 0.0021),
        ],
      },
      {
        id: "gold",
        stroke: "#FFC83D",
        fill: "rgba(255, 200, 61, 0.18)",
        icon: <Star size={8} color="#FFE6A3" />,
        badge: offset(center, -0.0058, -0.0021),
        nodes: [
          offset(center, -0.0060, -0.0039),
          offset(center, -0.0046, -0.0015),
          offset(center, -0.0058, 0.0008),
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

  const tabs = [
    { key: "map" as const, label: "Harita", icon: <Map size={12} color="#10F4E8" /> },
    { key: "leaderboard" as const, label: "Liderlik", icon: <Trophy size={12} color="#A9B4C0" /> },
    { key: "rewards" as const, label: "Ödüller", icon: <Gift size={12} color="#A9B4C0" /> },
    { key: "store" as const, label: "Dükkan", icon: <ShoppingCart size={12} color="#A9B4C0" /> },
  ];

  const drawerWidth = Math.max(220, Math.floor(width * 0.5));

  const menuItems = useMemo(
    () => [
      { key: "profile", title: "Profilim", subtitle: "Kişisel bilgilerin", icon: <User size={18} color="#7CEEFF" /> },
      { key: "achievements", title: "Başarımlar", subtitle: "Kazandığın rozetler", icon: <Medal size={18} color="#FFCD69" /> },
      { key: "missions", title: "Görevlerim", subtitle: "Aktif görevlerini yönet", icon: <Shield size={18} color="#7CEEFF" />, badge: 2 },
      { key: "settings", title: "Ayarlar", subtitle: "Uygulama ayarları", icon: <Settings size={18} color="#E3E8EF" /> },
      { key: "support", title: "Yardım ve Destek", subtitle: "Yardım al", icon: <HelpCircle size={18} color="#E3E8EF" /> },
    ],
    []
  );

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    Animated.timing(menuAnim, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [menuAnim]);

  const closeMenu = useCallback(() => {
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setMenuOpen(false);
      }
    });
  }, [menuAnim]);

  const drawerTranslateX = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-drawerWidth, 0],
  });

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
          <Polygon key={area.id} coordinates={area.nodes} strokeColor={area.stroke} fillColor={area.fill} strokeWidth={1} />
        ))}

        {nodePoints.map((node) => (
          <Marker key={node.id} coordinate={node} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={[styles.nodeDot, { borderColor: node.color, shadowColor: node.color }]} />
          </Marker>
        ))}

        {territories.map((area) => (
          <Marker key={`${area.id}-badge`} coordinate={area.badge} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={[styles.zoneBadge, { borderColor: `${area.stroke}AA`, shadowColor: area.stroke }]}>{area.icon}</View>
          </Marker>
        ))}
      </MapView>

      <SafeAreaView style={styles.topOverlay} edges={["top"]}>
        <TopHudBar
          onAvatarPress={openMenu}
          onBellPress={() => router.push(ROUTES.tabs.notifications)}
          avatarInitials="AL"
          levelText="24"
          coinText="2.450"
          gemText="128"
          bellCount={3}
        />
      </SafeAreaView>

      <View style={[styles.rightRail, { top: insets.top + 72 }]}>
        <Pressable style={styles.railBtn} onPress={() => router.push(ROUTES.tabs.map)}>
          <Crosshair size={25} color="#CCFFF9" />
        </Pressable>
        <Pressable style={styles.railBtn} onPress={() => router.push(ROUTES.tabs.missions)}>
          <Shield size={25} color="#CCFFF9" />
        </Pressable>
        <Pressable style={styles.railBtn} onPress={() => router.push(ROUTES.tabs.missions)}>
          <ClipboardCheck size={24} color="#CCFFF9" />
        </Pressable>
      </View>

      <View pointerEvents="box-none" style={[styles.bottomStack, { paddingBottom: insets.bottom + 116 }]}>
        <View style={styles.statsCard}>
          <View style={styles.cityRow}>
            <View style={styles.cityLeft}>
              <Text style={styles.cityTitle}>Antalya</Text>
              <ChevronDown size={10} color="#10F4E8" />
            </View>
            <Pressable onPress={() => router.push(ROUTES.tabs.leaderboard)}>
              <ChevronRight size={12} color="#A9B4C0" />
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Sıralama</Text>
              <Text style={styles.statValue}># 3</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Alanım</Text>
              <Text style={styles.statValue}>12.450 m²</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Mesafe</Text>
              <Text style={styles.statValue}>8,70 km</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Adım</Text>
              <View style={styles.stepRow}>
                <Footprints size={8} color="#10F4E8" />
                <Text style={styles.statValue}>45.210</Text>
              </View>
            </View>
          </View>
        </View>

        <Pressable style={styles.captureButton} onPress={() => router.push(ROUTES.activeGame)}>
          <View style={styles.captureInner}>
            <FlagTriangleRight size={17} color="#ECFCFF" />
            <Text style={styles.captureButtonText}>ŞİMDİ FETHET</Text>
          </View>
        </Pressable>
      </View>

      <BottomTabBar<BottomKey>
        tabs={tabs}
        activeKey="map"
        onTabPress={(key) => {
          if (key === "map") router.push(ROUTES.tabs.map);
          if (key === "leaderboard") router.push(ROUTES.tabs.leaderboard);
          if (key === "rewards") router.push(ROUTES.tabs.missions);
          if (key === "store") router.push(ROUTES.tabs.store);
        }}
      />

      {menuOpen ? (
        <View style={styles.drawerRoot} pointerEvents="box-none">
          <Pressable style={styles.drawerBackdrop} onPress={closeMenu} />
          <Animated.View style={[styles.drawerPanel, { width: drawerWidth, transform: [{ translateX: drawerTranslateX }] }]}> 
            <SafeAreaView style={styles.drawerSafe} edges={["top", "left", "bottom"]}>
              <View style={styles.drawerHeaderRow}>
                <Text style={styles.drawerTitle}>ALANGO</Text>
                <Pressable style={styles.drawerCloseBtn} onPress={closeMenu}>
                  <X size={18} color="#D5DFEA" />
                </Pressable>
              </View>

              <View style={styles.drawerProfileRow}>
                <View style={styles.drawerAvatar}>
                  <Text style={styles.drawerAvatarText}>AL</Text>
                </View>
                <View style={styles.drawerProfileInfo}>
                  <Text style={styles.drawerName}>CNRman</Text>
                  <Text style={styles.drawerHandle}>ALANGO</Text>
                </View>
              </View>

              <View style={styles.drawerXpTrack}>
                <View style={styles.drawerXpFill} />
                <Text style={styles.drawerXpText}>202 / 1200 XP</Text>
              </View>

              <View style={styles.drawerMenuList}>
                {menuItems.map((item) => (
                  <Pressable key={item.key} style={styles.drawerMenuItem}>
                    <View style={styles.drawerMenuIconWrap}>{item.icon}</View>
                    <View style={styles.drawerMenuTextWrap}>
                      <Text style={styles.drawerMenuTitle}>{item.title}</Text>
                      <Text style={styles.drawerMenuSubtitle}>{item.subtitle}</Text>
                    </View>
                    {item.badge ? (
                      <View style={styles.drawerBadge}>
                        <Text style={styles.drawerBadgeText}>{item.badge}</Text>
                      </View>
                    ) : null}
                  </Pressable>
                ))}
              </View>

              <Pressable style={styles.drawerLogoutRow}>
                <LogOut size={18} color="#FF5A5A" />
                <Text style={styles.drawerLogoutText}>Çıkış Yap</Text>
              </Pressable>
            </SafeAreaView>
          </Animated.View>
        </View>
      ) : null}

      <SafeAreaView style={styles.topFade} pointerEvents="none" edges={["top"]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#02070D",
  },
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: HUD_SIDE_GAP,
    zIndex: 4,
  },
  topHudRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 1,
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
    shadowOpacity: 0.42,
    shadowOffset: { width: 0, height: 0 },
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
  levelChip: {
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
  currencyChip: {
    width: 109,
    height: 42,
    borderRadius: 22,
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  coinIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFC83D",
    borderWidth: 1,
    borderColor: "#FFE08E",
  },
  currencyText: {
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
  rightRail: {
    position: "absolute",
    right: HUD_SIDE_GAP + 6,
    gap: 16,
    zIndex: 4,
  },
  railBtn: {
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    shadowColor: "#10F4E8",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 4,
  },
  nodeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E9FCFF",
    borderWidth: 0.7,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 2,
  },
  zoneBadge: {
    width: 23,
    height: 27,
    borderRadius: 7,
    borderWidth: 1,
    backgroundColor: "rgba(8, 18, 28, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.42,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 4,
  },
  bottomStack: {
    position: "absolute",
    left: 6,
    right: 6,
    bottom: 0,
    zIndex: 5,
    gap: 5,
  },
  statsCard: {
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    paddingHorizontal: 9,
    paddingVertical: 8,
    minHeight: 79,
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  cityLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cityTitle: {
    color: "#FFFFFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 17,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  statBlock: {
    flex: 1,
    gap: 3,
  },
  statDivider: {
    width: 1,
    marginHorizontal: 7,
    backgroundColor: "rgba(120, 160, 180, 0.22)",
  },
  statLabel: {
    color: "#A9B4C0",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 8,
  },
  statValue: {
    color: "#6EEFF7",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 17,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  captureButton: {
    height: 36,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(161, 255, 249, 0.7)",
    backgroundColor: "rgba(84, 209, 216, 0.72)",
    shadowColor: "#10F4E8",
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 4,
  },
  captureInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  captureButtonText: {
    color: "#FFFFFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 15,
    letterSpacing: 0.35,
  },
  topFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: "rgba(3, 10, 17, 0.24)",
  },
  drawerRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
  },
  drawerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(1, 6, 12, 0.44)",
  },
  drawerPanel: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRightWidth: 1,
    borderRightColor: "rgba(120, 160, 180, 0.32)",
    backgroundColor: "rgba(1, 12, 22, 0.96)",
    shadowColor: "#000000",
    shadowOpacity: 0.45,
    shadowOffset: { width: 8, height: 0 },
    shadowRadius: 20,
    elevation: 14,
  },
  drawerSafe: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  drawerHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  drawerTitle: {
    color: "#7CEEFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 15,
    letterSpacing: 0.4,
  },
  drawerCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.26)",
    backgroundColor: "rgba(8, 18, 28, 0.75)",
  },
  drawerProfileRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  drawerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(16, 244, 232, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(11, 24, 36, 0.82)",
  },
  drawerAvatarText: {
    color: "#FFFFFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 18,
  },
  drawerProfileInfo: {
    flex: 1,
    gap: 2,
  },
  drawerName: {
    color: "#F6FBFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 20,
  },
  drawerHandle: {
    color: "#5FDDE8",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 14,
  },
  drawerXpTrack: {
    marginTop: 16,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.26)",
    backgroundColor: "rgba(8, 18, 28, 0.84)",
    overflow: "hidden",
    justifyContent: "center",
  },
  drawerXpFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "33%",
    backgroundColor: "rgba(124, 238, 255, 0.7)",
  },
  drawerXpText: {
    color: "#EAF4FF",
    textAlign: "center",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 14,
  },
  drawerMenuList: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(120, 160, 180, 0.18)",
  },
  drawerMenuItem: {
    minHeight: 66,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(120, 160, 180, 0.18)",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  drawerMenuIconWrap: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  drawerMenuTextWrap: {
    flex: 1,
    gap: 2,
  },
  drawerMenuTitle: {
    color: "#F1F5FB",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 18,
  },
  drawerMenuSubtitle: {
    color: "#9EABB9",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 13,
  },
  drawerBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    backgroundColor: "#FF5F5A",
  },
  drawerBadgeText: {
    color: "#FFFFFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 12,
  },
  drawerLogoutRow: {
    marginTop: "auto",
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 90, 90, 0.35)",
    backgroundColor: "rgba(255, 60, 60, 0.08)",
    paddingHorizontal: 12,
  },
  drawerLogoutText: {
    color: "#FF6D6D",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 16,
  },
});
