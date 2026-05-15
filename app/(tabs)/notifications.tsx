import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bell,
  Crosshair,
  Gift,
  Map as MapIcon,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Target,
  Trophy,
  User,
  Waypoints,
} from "lucide-react-native";
import {
  AlanGoLogo,
  BottomTabBar,
  EmptyRadarState,
  GlassCard,
  HelperText,
  NotificationCard,
  SegmentedSelector,
} from "@/components/ui";
import { AmbientGlow } from "@/components/fx";
import { theme } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import { getTabContentBottomSpace } from "@/constants/safeArea";

type BottomKey = "map" | "missions" | "feed" | "notifications" | "profile";
type NotificationFilter = "all" | "reward" | "pvp" | "event";

type NotificationItem = {
  id: string;
  type: Exclude<NotificationFilter, "all"> | "mission" | "signal";
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

const FILTERS = [
  { key: "all" as const, label: "Tumu" },
  { key: "reward" as const, label: "Oduller" },
  { key: "pvp" as const, label: "PvP" },
  { key: "event" as const, label: "Etkinlikler" },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    type: "reward",
    title: "Gizli odul kesfedildi!",
    body: "1000 TL odul kazandin.",
    time: "2 dk once",
    unread: true,
  },
  {
    id: "n2",
    type: "pvp",
    title: "Bolgen saldiri altinda!",
    body: "Mahallendeki bir rakip bolgeni ele geciriyor.",
    time: "7 dk once",
    unread: true,
  },
  {
    id: "n3",
    type: "event",
    title: "Gold Rush etkinligi basladi.",
    body: "Antalya merkezde odullu alanlar aktif.",
    time: "18 dk once",
    unread: true,
  },
  {
    id: "n4",
    type: "mission",
    title: "Yeni gorev acildi.",
    body: "Bugunku fetih bonusunu kacirma.",
    time: "43 dk once",
    unread: false,
  },
  {
    id: "n5",
    type: "signal",
    title: "Premium radar sinyali algilandi.",
    body: "Yakininda yuksek degerli bir iz var.",
    time: "1 sa once",
    unread: false,
  },
];

function accentByType(type: NotificationItem["type"]) {
  if (type === "reward") return "gold" as const;
  if (type === "pvp") return "danger" as const;
  if (type === "event") return "cyan" as const;
  if (type === "signal") return "cyan" as const;
  return "default" as const;
}

function iconByType(type: NotificationItem["type"]) {
  if (type === "reward") return <Gift size={16} color={theme.colors.goldReward} />;
  if (type === "pvp") return <ShieldAlert size={16} color={theme.colors.danger} />;
  if (type === "event") return <Trophy size={16} color={theme.colors.primaryCyan} />;
  if (type === "signal") return <Crosshair size={16} color={theme.colors.primaryCyan} />;
  return <Target size={16} color={theme.colors.textSecondary} />;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");
  const [items, setItems] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return items;
    return items.filter((item) => item.type === activeFilter);
  }, [activeFilter, items]);

  const unreadCount = useMemo(() => items.filter((item) => item.unread).length, [items]);

  const bottomTabs = [
    { key: "map" as const, label: "Harita", icon: <MapIcon size={16} color={theme.colors.textMuted} /> },
    { key: "missions" as const, label: "Gorev", icon: <Waypoints size={16} color={theme.colors.textMuted} /> },
    { key: "feed" as const, label: "Feed", icon: <ShoppingBag size={16} color={theme.colors.textMuted} /> },
    { key: "notifications" as const, label: "Bildirim", icon: <Bell size={16} color={theme.colors.primaryCyan} /> },
    { key: "profile" as const, label: "Profil", icon: <User size={16} color={theme.colors.textMuted} /> },
  ];

  const markAsRead = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, unread: false } : item)));
  };

  const navigateByNotificationType = (type: NotificationItem["type"]) => {
    if (type === "reward") {
      router.push(ROUTES.hiddenRewardFound);
      return;
    }
    if (type === "event") {
      router.push(ROUTES.events);
      return;
    }
    if (type === "mission") {
      router.push(ROUTES.tabs.missions);
      return;
    }
    if (type === "signal") {
      router.push(ROUTES.premium);
      return;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AmbientGlow cyanOpacity={0.04} purpleOpacity={0.03} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: getTabContentBottomSpace(insets.bottom, 30) }]}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
      >
        <View style={styles.headerWrap}>
          <View style={styles.titleRow}>
            <View>
              <AlanGoLogo size="sm" glow="none" />
              <Text style={styles.title}>Bildirimler</Text>
            </View>
            <View style={styles.unreadBadge}>
              <Sparkles size={11} color={theme.colors.primaryCyan} />
              <Text style={styles.unreadBadgeText}>{unreadCount} yeni</Text>
            </View>
          </View>
          <HelperText text="Oyun, odul ve PvP hareketleri burada toplanir." />
        </View>

        <GlassCard contentStyle={styles.filterCardContent}>
          <SegmentedSelector options={FILTERS} value={activeFilter} onChange={setActiveFilter} />
        </GlassCard>

        {filteredItems.length === 0 ? (
          <EmptyRadarState
            title="Radar sinyali bekleniyor..."
            message="Sehrinde aktif odul bulunamadi. Yeni bildirim geldiginde burada gorulecek."
          />
        ) : (
          <View style={styles.listWrap}>
            {filteredItems.map((item) => (
              <NotificationCard
                key={item.id}
                icon={iconByType(item.type)}
                title={item.title}
                body={item.body}
                time={item.time}
                unread={item.unread}
                accent={accentByType(item.type)}
                onPress={() => {
                  markAsRead(item.id);
                  navigateByNotificationType(item.type);
                }}
              />
            ))}
          </View>
        )}

      </ScrollView>

      <BottomTabBar<BottomKey>
        tabs={bottomTabs}
        activeKey="notifications"
        onTabPress={(key) => {
          if (key === "map") router.push(ROUTES.tabs.map);
          if (key === "missions") router.push(ROUTES.tabs.missions);
          if (key === "feed") router.push(ROUTES.tabs.feed);
          if (key === "notifications") return;
          if (key === "profile") router.push(ROUTES.tabs.profile);
        }}
        style={styles.bottomTabs}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDeep,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  headerWrap: {
    gap: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 28,
  },
  unreadBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 204, 0.34)",
    backgroundColor: "rgba(0, 229, 204, 0.08)",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  unreadBadgeText: {
    color: theme.colors.primaryCyan,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 11,
  },
  filterCardContent: {
    gap: 0,
  },
  listWrap: {
    gap: theme.spacing.sm,
  },
  bottomTabs: {
    borderTopColor: theme.colors.borderSubtle,
  },
});

