import { useCallback, useMemo, useRef, useState } from "react";
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import {
  ChevronDown,
  Crown,
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
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

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
  const mapRef = useRef<MapView>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shieldPopupOpen, setShieldPopupOpen] = useState(false);
  const [dailyMissionPopupOpen, setDailyMissionPopupOpen] = useState(false);
  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const [selectedCityScope, setSelectedCityScope] = useState("Antalya");
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

  const activeShields = useMemo(
    () => [
      { id: "shield-1", zone: "Muratpasa - Isiklar", remaining: "01sa 18dk", appliedAt: "Bugun 13:42" },
      { id: "shield-2", zone: "Konyaalti - Liman", remaining: "00sa 47dk", appliedAt: "Bugun 14:13" },
      { id: "shield-3", zone: "Kepez - Varsak", remaining: "03sa 05dk", appliedAt: "Bugun 11:55" },
      { id: "shield-4", zone: "Dosemealti - Yesilbayir", remaining: "00sa 22dk", appliedAt: "Bugun 14:38" },
    ],
    []
  );

  const shieldInventoryCount = 2;

  const weeklyMissionStatus = useMemo(
    () => [
      { day: "Pzt", status: "completed" as const },
      { day: "Sal", status: "completed" as const },
      { day: "Car", status: "missed" as const },
      { day: "Per", status: "completed" as const },
      { day: "Cum", status: "pending" as const },
      { day: "Cts", status: "pending" as const },
      { day: "Paz", status: "pending" as const },
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

  const centerOnUserLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    mapRef.current?.animateToRegion(
      {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      },
      500
    );
  }, []);

  const handleDrawerMenuPress = useCallback(
    (key: string) => {
      closeMenu();
      if (key === "profile") {
        router.push(ROUTES.tabs.profile);
        return;
      }
      if (key === "missions") {
        router.push(ROUTES.tabs.missions);
        return;
      }
      if (key === "settings") {
        router.push(ROUTES.tabs.settings);
        return;
      }
      if (key === "achievements") {
        router.push(ROUTES.tabs.leaderboard);
        return;
      }
    },
    [closeMenu, router]
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        customMapStyle={darkMapStyle}
        mapType="standard"
        initialRegion={initialRegion}
        showsUserLocation
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
        <Header
          onAvatarPress={openMenu}
          onBellPress={() => router.push(ROUTES.tabs.notifications)}
        />
      </SafeAreaView>

      <View style={[styles.rightRail, { top: insets.top + 70 }]}>
        <Pressable style={styles.railBtn} onPress={centerOnUserLocation}>
          <Image source={require("../../assets/images/ui/konum.png")} style={styles.railImage} resizeMode="contain" />
        </Pressable>
        <Pressable style={styles.railBtn} onPress={() => setShieldPopupOpen(true)}>
          <Image source={require("../../assets/images/ui/kalkanikon.png")} style={styles.railImage} resizeMode="contain" />
        </Pressable>
        <Pressable style={styles.railBtn} onPress={() => setDailyMissionPopupOpen(true)}>
          <Image source={require("../../assets/images/ui/gorev.png")} style={styles.railImage} resizeMode="contain" />
        </Pressable>
      </View>

      <View pointerEvents="box-none" style={[styles.bottomStack, { paddingBottom: insets.bottom + 116 }]}>
        <View style={styles.statsCard}>
          <View style={styles.cityRow}>
            <Pressable style={styles.cityLeft} onPress={() => setCityMenuOpen((prev) => !prev)}>
              <Text style={styles.cityTitle}>{selectedCityScope}</Text>
              <ChevronDown size={10} color="#10F4E8" />
            </Pressable>

            {cityMenuOpen ? (
              <View style={styles.cityDropdown}>
                {[
                  { key: "Genel", label: "Genel" },
                  { key: "Antalya", label: "Antalya" },
                  { key: "Arkadaslarim", label: "Arkadaşlarım" },
                ].map((option) => (
                  <Pressable
                    key={option.key}
                    style={styles.cityDropdownItem}
                    onPress={() => {
                      setSelectedCityScope(option.label);
                      setCityMenuOpen(false);
                    }}
                  >
                    <Text style={[styles.cityDropdownText, selectedCityScope === option.label && styles.cityDropdownTextActive]}>{option.label}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statBlock, styles.statBlockRanking]}>
              <Text style={styles.statLabel}>Sıralama</Text>
              <Text style={styles.statValue}># 3</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={[styles.statBlock, styles.statBlockArea]}>
              <Text style={styles.statLabel}>Alanım</Text>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>12.450 m²</Text>
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

      <BottomNav activeTab="map" />

      {menuOpen ? (
        <View style={styles.drawerRoot} pointerEvents="box-none">
          <Pressable style={styles.drawerBackdrop} onPress={closeMenu} />
          <Animated.View style={[styles.drawerPanel, { width: drawerWidth, transform: [{ translateX: drawerTranslateX }] }]}> 
            <SafeAreaView style={styles.drawerSafe} edges={["top", "left", "bottom"]}>
              <View style={styles.drawerHeaderRow}>
                <Image source={require("../../assets/images/logoyan.png")} style={styles.drawerBrandIcon} resizeMode="contain" />
                <Pressable style={styles.drawerCloseBtn} onPress={closeMenu}>
                  <X size={18} color="#D5DFEA" />
                </Pressable>
              </View>

              <View style={styles.drawerProfileRow}>
                <View style={styles.drawerAvatar}>
                  <Image source={require("../../assets/images/avatars/avatar_pilot.png")} style={styles.drawerAvatarPhoto} resizeMode="cover" />
                  <Image source={require("../../assets/images/frames/frame_cyan.png")} style={styles.drawerAvatarFrame} resizeMode="contain" />
                </View>
                <View style={styles.drawerProfileInfo}>
                  <Text style={styles.drawerName}>CNRman</Text>
                </View>
              </View>

              <View style={styles.drawerXpTrack}>
                <View style={styles.drawerXpFill} />
                <Text style={styles.drawerXpText}>202 / 1200 XP</Text>
              </View>

              <View style={styles.drawerMenuList}>
                {menuItems.map((item) => (
                  <Pressable key={item.key} style={styles.drawerMenuItem} onPress={() => handleDrawerMenuPress(item.key)}>
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

      {shieldPopupOpen ? (
        <View style={styles.shieldPopupRoot} pointerEvents="box-none">
          <Pressable style={styles.shieldPopupBackdrop} onPress={() => setShieldPopupOpen(false)} />

          <View style={styles.shieldPopupCard}>
            <View style={styles.shieldPopupHeaderRow}>
              <View style={styles.shieldPopupTitleWrap}>
                <Shield size={16} color="#7CEEFF" />
                <Text style={styles.shieldPopupTitle}>Kalkan Durumu</Text>
              </View>
              <Pressable style={styles.shieldPopupCloseBtn} onPress={() => setShieldPopupOpen(false)}>
                <X size={16} color="#D5DFEA" />
              </Pressable>
            </View>

            <View style={styles.shieldCountChip}>
              <Text style={styles.shieldCountLabel}>Kalan Kalkan</Text>
              <Text style={styles.shieldCountValue}>{shieldInventoryCount}</Text>
            </View>

            <Text style={styles.shieldSectionTitle}>Uygulanan Kalkanlar</Text>

            <ScrollView style={styles.shieldList} contentContainerStyle={styles.shieldListContent} showsVerticalScrollIndicator>
              {activeShields.map((item) => (
                <View key={item.id} style={styles.shieldRow}>
                  <View style={styles.shieldRowLeft}>
                    <Text style={styles.shieldZone}>{item.zone}</Text>
                    <Text style={styles.shieldApplied}>Uygulama: {item.appliedAt}</Text>
                  </View>
                  <View style={styles.shieldRemainingWrap}>
                    <Text style={styles.shieldRemainingLabel}>Kalan</Text>
                    <Text style={styles.shieldRemainingValue}>{item.remaining}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      ) : null}

      {dailyMissionPopupOpen ? (
        <View style={styles.missionPopupRoot} pointerEvents="box-none">
          <Pressable style={styles.missionPopupBackdrop} onPress={() => setDailyMissionPopupOpen(false)} />

          <View style={styles.missionPopupCard}>
            <View style={styles.missionPopupHeaderRow}>
              <Text style={styles.missionPopupTitle}>Gunluk Gorev</Text>
              <Pressable style={styles.missionPopupCloseBtn} onPress={() => setDailyMissionPopupOpen(false)}>
                <X size={16} color="#D5DFEA" />
              </Pressable>
            </View>

            <View style={styles.missionTodayCard}>
              <Text style={styles.missionTodayLabel}>Bugunun gorevi</Text>
              <Text style={styles.missionTodayText}>5.000 m² alan fethet</Text>
              <Text style={styles.missionTodayMeta}>Ilerleme: 2.350 / 5.000 m²</Text>
            </View>

            <Text style={styles.missionWeekTitle}>Haftalik durum</Text>

            <ScrollView style={styles.missionWeekList} contentContainerStyle={styles.missionWeekListContent} showsVerticalScrollIndicator>
              {weeklyMissionStatus.map((item) => {
                const isCompleted = item.status === "completed";
                const isMissed = item.status === "missed";
                const statusText = isCompleted ? "Tamamlandi" : isMissed ? "Unutuldu" : "Tamamlanacak";
                const statusIcon = isCompleted ? "✓" : isMissed ? "✕" : "○";

                return (
                  <View key={item.day} style={styles.missionDayRow}>
                    <Text style={styles.missionDayName}>{item.day}</Text>
                    <View style={styles.missionDayStatusWrap}>
                      <Text
                        style={[
                          styles.missionDayIcon,
                          isCompleted && styles.missionDayIconCompleted,
                          isMissed && styles.missionDayIconMissed,
                          !isCompleted && !isMissed && styles.missionDayIconPending,
                        ]}
                      >
                        {statusIcon}
                      </Text>
                      <Text style={styles.missionDayStatusText}>{statusText}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
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
    gap: 10,
    zIndex: 4,
  },
  railBtn: {
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  railImage: {
    width: 40,
    height: 40,
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
    marginBottom: 7,
    position: "relative",
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
  cityDropdown: {
    position: "absolute",
    left: 0,
    top: 24,
    zIndex: 8,
    minWidth: 132,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.3)",
    backgroundColor: "rgba(8, 18, 28, 0.98)",
    overflow: "hidden",
  },
  cityDropdownItem: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(120, 160, 180, 0.14)",
  },
  cityDropdownText: {
    color: "#D8E2EF",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 13,
  },
  cityDropdownTextActive: {
    color: "#10F4E8",
    fontFamily: theme.typography.fontFamily.semibold,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  statBlock: {
    flex: 1,
    gap: 3,
  },
  statBlockRanking: {
    flex: 0.7,
  },
  statBlockArea: {
    flex: 1.3,
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
    marginTop: -50,
  },
  drawerTitle: {
    color: "#7CEEFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 15,
    letterSpacing: 0.4,
  },
  drawerBrandIcon: {
    width: 126,
    height: 126,
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
    marginTop: -34,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  drawerAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  drawerAvatarPhoto: {
    position: "absolute",
    width: 57,
    height: 57,
    borderRadius: 29,
    zIndex: 1,
  },
  drawerAvatarFrame: {
    width: 68,
    height: 68,
    zIndex: 2,
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
  shieldPopupRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 28,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  shieldPopupBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(1, 6, 12, 0.52)",
  },
  shieldPopupCard: {
    width: "100%",
    maxWidth: 360,
    maxHeight: 430,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.32)",
    backgroundColor: "rgba(1, 12, 22, 0.96)",
    padding: 12,
    gap: 10,
  },
  shieldPopupHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shieldPopupTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  shieldPopupTitle: {
    color: "#F6FBFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 16,
  },
  shieldPopupCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.26)",
    backgroundColor: "rgba(8, 18, 28, 0.75)",
  },
  shieldCountChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(124, 238, 255, 0.4)",
    backgroundColor: "rgba(24, 54, 78, 0.4)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  shieldCountLabel: {
    color: "#BFD0E0",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
  },
  shieldCountValue: {
    color: "#7CEEFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 20,
  },
  shieldSectionTitle: {
    color: "#E8F3FF",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 14,
  },
  shieldList: {
    maxHeight: 280,
  },
  shieldListContent: {
    gap: 8,
    paddingBottom: 4,
  },
  shieldRow: {
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    backgroundColor: "rgba(8, 18, 28, 0.78)",
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  shieldRowLeft: {
    flex: 1,
    gap: 3,
  },
  shieldZone: {
    color: "#F1F8FF",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 12,
  },
  shieldApplied: {
    color: "#97A8BA",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
  },
  shieldRemainingWrap: {
    alignItems: "flex-end",
    gap: 1,
  },
  shieldRemainingLabel: {
    color: "#97A8BA",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 10,
  },
  shieldRemainingValue: {
    color: "#56F2C8",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
  },
  missionPopupRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 29,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  missionPopupBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(1, 6, 12, 0.52)",
  },
  missionPopupCard: {
    width: "100%",
    maxWidth: 360,
    maxHeight: 430,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.32)",
    backgroundColor: "rgba(1, 12, 22, 0.96)",
    padding: 12,
    gap: 10,
  },
  missionPopupHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  missionPopupTitle: {
    color: "#F6FBFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 16,
  },
  missionPopupCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.26)",
    backgroundColor: "rgba(8, 18, 28, 0.75)",
  },
  missionTodayCard: {
    borderWidth: 1,
    borderColor: "rgba(124, 238, 255, 0.4)",
    backgroundColor: "rgba(24, 54, 78, 0.4)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 4,
  },
  missionTodayLabel: {
    color: "#BFD0E0",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
  },
  missionTodayText: {
    color: "#E8F8FF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
  },
  missionTodayMeta: {
    color: "#82E6F7",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
  },
  missionWeekTitle: {
    color: "#E8F3FF",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 14,
  },
  missionWeekList: {
    maxHeight: 245,
  },
  missionWeekListContent: {
    gap: 8,
    paddingBottom: 4,
  },
  missionDayRow: {
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    backgroundColor: "rgba(8, 18, 28, 0.78)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  missionDayName: {
    color: "#F1F8FF",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 12,
  },
  missionDayStatusWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  missionDayIcon: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
  },
  missionDayIconCompleted: {
    color: "#56F2C8",
  },
  missionDayIconMissed: {
    color: "#FF7C7C",
  },
  missionDayIconPending: {
    color: "#FACC15",
  },
  missionDayStatusText: {
    color: "#C9D6E3",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
  },
});
