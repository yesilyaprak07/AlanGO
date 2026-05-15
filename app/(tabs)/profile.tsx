import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Award,
  Bell,
  Crown,
  Flame,
  Map as MapIcon,
  ShoppingBag,
  Target,
  Trophy,
  User,
} from "lucide-react-native";
import { BottomTabBar, GlassCard, IconBadge, NeonButton, StatCard } from "@/components/ui";
import { theme } from "@/constants/theme";
import { useAuth } from "@/lib/auth";
import { useGameStore } from "@/stores/gameStore";
import { ROUTES } from "@/constants/routes";
import { getTabContentBottomSpace, isNarrowWidth } from "@/constants/safeArea";

type BottomKey = "map" | "missions" | "feed" | "notifications" | "profile";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const narrow = isNarrowWidth(width);
  const { profile } = useAuth();
  const { territories, totalArea } = useGameStore();

  const username = profile?.username ?? "Caner";
  const level = profile?.level ?? 12;
  const currentXp = profile?.xp ?? 7800;
  const nextLevelXp = Math.max(level * 1000, 12000);
  const xpPct = Math.min((currentXp / nextLevelXp) * 100, 100);
  const totalAreaM2 = Math.round(totalArea > 0 ? totalArea : 12450);

  const initials = useMemo(() => username.slice(0, 2).toUpperCase(), [username]);

  const stats = [
    {
      title: "Toplam Alan",
      value: `${totalAreaM2.toLocaleString("tr-TR")} m²`,
      icon: <IconBadge tone="cyan" icon={<MapIcon size={16} color={theme.colors.primaryCyan} />} size={34} />,
      subtitle: "Tüm sezon",
    },
    {
      title: "Fethedilen Bölge",
      value: territories.length > 0 ? territories.length : 18,
      icon: <IconBadge tone="purple" icon={<Target size={16} color={theme.colors.purple} />} size={34} />,
      subtitle: "Aktif bölge",
    },
    {
      title: "Kazanılan Ödül",
      value: "₺1.000",
      icon: <IconBadge tone="gold" icon={<Trophy size={16} color={theme.colors.goldReward} />} size={34} />,
      subtitle: "Son keşif",
    },
    {
      title: "Günlük Seri",
      value: "7 gün",
      icon: <IconBadge tone="success" icon={<Flame size={16} color={theme.colors.success} />} size={34} />,
      subtitle: "Kesintisiz",
    },
  ];

  const taskItems = ["3 alan fethet", "2 km yürü", "1 rakip alanı ele geçir"];
  const badges = ["İlk Fetih", "Gizli Ödül Avcısı", "Mahalle Lideri"];
  const recentGains = ["1.000 TL ödül bulundu", "450 m² alan fethedildi", "Radar kullanıldı"];

  const bottomTabs = [
    { key: "map" as const, label: "Harita", icon: <MapIcon size={16} color={theme.colors.textMuted} /> },
    { key: "missions" as const, label: "Görev", icon: <Target size={16} color={theme.colors.textMuted} /> },
    { key: "feed" as const, label: "Feed", icon: <ShoppingBag size={16} color={theme.colors.textMuted} /> },
    { key: "notifications" as const, label: "Bildirim", icon: <Bell size={16} color={theme.colors.textMuted} /> },
    { key: "profile" as const, label: "Ben", icon: <User size={16} color={theme.colors.primaryCyan} /> },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: getTabContentBottomSpace(insets.bottom, 24) }]}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
      >
        <GlassCard style={styles.heroCard} contentStyle={styles.heroContent}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarGlow} />
            <View style={styles.avatarOuter}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            <Pressable style={({ pressed }) => [styles.premiumBadge, pressed && styles.pressed]} onPress={() => router.push(ROUTES.premium)}>
              <Crown size={12} color={theme.colors.backgroundDeep} />
              <Text style={styles.premiumText}>PREMIUM</Text>
            </Pressable>
          </View>

          <Text style={styles.username}>{username}</Text>
          <Text style={styles.level}>Level {level}</Text>

          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>XP</Text>
            <Text style={styles.xpValue}>{currentXp.toLocaleString("tr-TR")} / {nextLevelXp.toLocaleString("tr-TR")}</Text>
          </View>
          <View style={styles.xpTrack}>
            <View style={[styles.xpBar, { width: `${xpPct}%` }]} />
          </View>

          <View style={styles.heroActions}>
            <NeonButton label="Gorevler" size="sm" onPress={() => router.push(ROUTES.tabs.missions)} />
            <NeonButton label="Ayarlar" size="sm" variant="ghost" onPress={() => router.push(ROUTES.tabs.settings)} />
          </View>
        </GlassCard>

        <View style={[styles.statsGrid, narrow && styles.statsGridNarrow]}>
          {stats.map((item) => (
            <StatCard
              key={item.title}
              title={item.title}
              value={item.value}
              subtitle={item.subtitle}
              icon={item.icon}
              style={[styles.statItem, narrow && styles.statItemNarrow]}
            />
          ))}
        </View>

        <GlassCard contentStyle={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Bugünkü Görevler</Text>
          {taskItems.map((task, idx) => (
            <View key={task} style={styles.listRow}>
              <IconBadge tone={idx === 2 ? "gold" : "cyan"} icon={idx === 2 ? "★" : "✓"} size={28} />
              <Text style={styles.listText}>{task}</Text>
            </View>
          ))}
        </GlassCard>

        <GlassCard contentStyle={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Rozetler</Text>
          <View style={styles.badgesRow}>
            {badges.map((badge, idx) => (
              <View key={badge} style={styles.badgeItem}>
                <IconBadge tone={idx === 1 ? "gold" : "cyan"} icon={<Award size={15} color={idx === 1 ? theme.colors.goldReward : theme.colors.primaryCyan} />} size={34} active={idx === 1} />
                <Text style={styles.badgeLabel}>{badge}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        <GlassCard contentStyle={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Son Kazanımlar</Text>
          {recentGains.map((item, idx) => (
            <Pressable
              key={item}
              style={({ pressed }) => [styles.gainRow, pressed && styles.pressed]}
              onPress={() => {
                if (idx === 0) {
                  router.push(ROUTES.hiddenRewardFound);
                  return;
                }
              }}
            >
              <IconBadge tone={idx === 0 ? "gold" : "neutral"} icon={idx === 0 ? "g���" : "•"} size={28} />
              <Text style={styles.listText}>{item}</Text>
            </Pressable>
          ))}
        </GlassCard>

      </ScrollView>

      <BottomTabBar<BottomKey>
        tabs={bottomTabs}
        activeKey="profile"
        onTabPress={(key) => {
          if (key === "map") router.push(ROUTES.tabs.map);
          if (key === "missions") router.push(ROUTES.tabs.missions);
          if (key === "feed") router.push(ROUTES.tabs.feed);
          if (key === "notifications") router.push(ROUTES.tabs.notifications);
          if (key === "profile") return;
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
  glowTop: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(0, 229, 204, 0.08)",
  },
  glowBottom: {
    position: "absolute",
    bottom: -90,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255, 200, 87, 0.07)",
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  heroCard: {
    marginTop: theme.spacing.sm,
  },
  heroContent: {
    alignItems: "center",
  },
  avatarWrap: {
    marginTop: 4,
    marginBottom: theme.spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarGlow: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(0, 229, 204, 0.12)",
  },
  avatarOuter: {
    width: 92,
    height: 92,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "rgba(0, 229, 204, 0.58)",
    backgroundColor: "rgba(0, 229, 204, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: theme.colors.primaryCyan,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 32,
    letterSpacing: 0.6,
  },
  premiumBadge: {
    position: "absolute",
    bottom: -8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 200, 87, 0.42)",
    backgroundColor: "rgba(255, 200, 87, 0.88)",
  },
  premiumText: {
    color: theme.colors.backgroundDeep,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 10,
  },
  username: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 26,
    lineHeight: 32,
  },
  level: {
    marginTop: 2,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.base,
  },
  xpRow: {
    width: "100%",
    marginTop: theme.spacing.md,
    marginBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  xpLabel: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  xpValue: {
    color: theme.colors.primaryCyan,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  xpTrack: {
    width: "100%",
    height: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceLight,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  xpBar: {
    height: "100%",
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primaryCyan,
  },
  heroActions: {
    marginTop: theme.spacing.md,
    width: "100%",
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "space-between",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  statsGridNarrow: {
    flexDirection: "column",
  },
  statItem: {
    width: "48.5%",
  },
  statItemNarrow: {
    width: "100%",
  },
  sectionCard: {
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.base,
    marginBottom: 4,
  },
  listRow: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  listText: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.xs,
  },
  badgeItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  badgeLabel: {
    textAlign: "center",
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
    lineHeight: 14,
  },
  gainRow: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bottomTabs: {
    borderTopColor: theme.colors.borderSubtle,
  },
  pressed: {
    opacity: 0.86,
  },
});

