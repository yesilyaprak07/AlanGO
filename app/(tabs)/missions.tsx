import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, Gift, Map as MapIcon, ShoppingBag, Target, Trophy, User } from "lucide-react-native";
import {
  BottomTabBar,
  GlassCard,
  HelperText,
  MissionCard,
  NeonButton,
  ProgressBar,
  SoonBadge,
  StatCard,
} from "@/components/ui";
import { AmbientGlow } from "@/components/fx";
import { theme } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import { getTabContentBottomSpace, isNarrowWidth } from "@/constants/safeArea";

type BottomKey = "map" | "missions" | "feed" | "notifications" | "profile";

type MissionItem = {
  id: string;
  title: string;
  total: number;
  progress: number;
  xp: number;
  coin: number;
  box: number;
  tone?: "cyan" | "gold";
};

const DAILY_BASE: MissionItem[] = [
  { id: "d1", title: "3 alan fethet", total: 3, progress: 1, xp: 180, coin: 90, box: 1, tone: "cyan" },
  { id: "d2", title: "2 km yuru", total: 2, progress: 1, xp: 130, coin: 60, box: 0, tone: "cyan" },
  { id: "d3", title: "1 rakip alani ele gecir", total: 1, progress: 0, xp: 220, coin: 120, box: 1, tone: "gold" },
];

const WEEKLY_BASE: MissionItem[] = [
  { id: "w1", title: "15 km tamamla", total: 15, progress: 7, xp: 450, coin: 260, box: 1, tone: "cyan" },
  { id: "w2", title: "10 bolge fethet", total: 10, progress: 4, xp: 520, coin: 330, box: 2, tone: "gold" },
  { id: "w3", title: "3 gun ust uste giris yap", total: 3, progress: 2, xp: 280, coin: 150, box: 1, tone: "cyan" },
];

export default function MissionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const narrow = isNarrowWidth(width);
  const [dailyMissions, setDailyMissions] = useState(DAILY_BASE);
  const [weeklyMissions, setWeeklyMissions] = useState(WEEKLY_BASE);

  const totalDailyProgress = useMemo(() => {
    const total = dailyMissions.reduce((acc, item) => acc + item.total, 0);
    const current = dailyMissions.reduce((acc, item) => acc + Math.min(item.progress, item.total), 0);
    return total > 0 ? (current / total) * 100 : 0;
  }, [dailyMissions]);

  const dailyRewards = useMemo(() => {
    return dailyMissions.reduce(
      (acc, item) => {
        acc.xp += item.xp;
        acc.coin += item.coin;
        acc.box += item.box;
        return acc;
      },
      { xp: 0, coin: 0, box: 0 }
    );
  }, [dailyMissions]);

  const progressMission = (targetId: string, group: "daily" | "weekly") => {
    const updater = (items: MissionItem[]) =>
      items.map((item) =>
        item.id === targetId ? { ...item, progress: Math.min(item.total, item.progress + 1) } : item
      );

    if (group === "daily") {
      setDailyMissions((prev) => updater(prev));
    } else {
      setWeeklyMissions((prev) => updater(prev));
    }
  };

  const bottomTabs = [
    { key: "map" as const, label: "Harita", icon: <MapIcon size={16} color={theme.colors.textMuted} /> },
    { key: "missions" as const, label: "Gorev", icon: <Target size={16} color={theme.colors.primaryCyan} /> },
    { key: "feed" as const, label: "Feed", icon: <ShoppingBag size={16} color={theme.colors.textMuted} /> },
    { key: "notifications" as const, label: "Bildirim", icon: <Bell size={16} color={theme.colors.textMuted} /> },
    { key: "profile" as const, label: "Profil", icon: <User size={16} color={theme.colors.textMuted} /> },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AmbientGlow cyanOpacity={0.04} purpleOpacity={0.03} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: getTabContentBottomSpace(insets.bottom, 30) }]}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
      >
        <View style={styles.headerWrap}>
          <Text style={styles.title}>Gorevler</Text>
          <HelperText text="Bugunku hedeflerini tamamla, XP ve coin kazan." />
        </View>

        <View style={[styles.statRow, narrow && styles.statRowWrap]}>
          <StatCard title="Gunluk XP" value={dailyRewards.xp} subtitle="Toplam" icon="XP" style={[styles.statItem, narrow && styles.statItemNarrow]} />
          <StatCard title="Coin" value={dailyRewards.coin} subtitle="Toplam" icon="C" style={[styles.statItem, narrow && styles.statItemNarrow]} />
        </View>

        <GlassCard contentStyle={styles.progressBlock}>
          <View style={styles.progressHead}>
            <Text style={styles.sectionTitle}>Gunluk Ilerleme</Text>
            <SoonBadge label="MYSTERY +1" />
          </View>
          <ProgressBar value={totalDailyProgress} />
          <View style={styles.rewardMetaRow}>
            <Text style={styles.rewardMetaText}>XP: +{dailyRewards.xp}</Text>
            <Text style={styles.rewardMetaText}>Coin: +{dailyRewards.coin}</Text>
            <Text style={styles.rewardMetaText}>Mystery Box: +{dailyRewards.box}</Text>
          </View>
        </GlassCard>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Gunluk Gorevler</Text>
          {dailyMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              title={mission.title}
              current={mission.progress}
              total={mission.total}
              xp={mission.xp}
              coin={mission.coin}
              mysteryBox={mission.box}
              tone={mission.tone}
              onProgressPress={() => progressMission(mission.id, "daily")}
            />
          ))}
        </View>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Haftalik Gorevler</Text>
          {weeklyMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              title={mission.title}
              current={mission.progress}
              total={mission.total}
              xp={mission.xp}
              coin={mission.coin}
              mysteryBox={mission.box}
              tone={mission.tone}
              onProgressPress={() => progressMission(mission.id, "weekly")}
            />
          ))}
        </View>

        <GlassCard contentStyle={styles.ctaCardContent}>
          <View style={styles.ctaTextWrap}>
            <Trophy size={16} color={theme.colors.goldReward} />
            <Text style={styles.ctaTitle}>Etkinlik ve Mystery Box firsatlarini kacirma</Text>
          </View>
          <View style={styles.ctaBtnsRow}>
            <NeonButton label="Etkinlikler" size="sm" variant="ghost" onPress={() => router.push(ROUTES.events)} style={styles.ctaBtn} />
            <NeonButton
              label="Mystery Box"
              size="sm"
              variant="gold"
              onPress={() => router.push(ROUTES.mysteryBox)}
              style={styles.ctaBtn}
              icon={<Gift size={14} color={theme.colors.goldReward} />}
            />
          </View>
        </GlassCard>

      </ScrollView>

      <BottomTabBar<BottomKey>
        tabs={bottomTabs}
        activeKey="missions"
        onTabPress={(key) => {
          if (key === "map") router.push(ROUTES.tabs.map);
          if (key === "missions") return;
          if (key === "feed") router.push(ROUTES.tabs.feed);
          if (key === "notifications") router.push(ROUTES.tabs.notifications);
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
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 28,
  },
  statRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  statRowWrap: {
    flexWrap: "wrap",
  },
  statItem: {
    flex: 1,
  },
  statItemNarrow: {
    minWidth: "100%",
  },
  progressBlock: {
    gap: theme.spacing.xs,
  },
  progressHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.xs,
  },
  rewardMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  rewardMetaText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
  },
  sectionWrap: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.base,
  },
  ctaCardContent: {
    gap: theme.spacing.sm,
  },
  ctaTextWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ctaTitle: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
  },
  ctaBtnsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  ctaBtn: {
    flex: 1,
  },
  bottomTabs: {
    borderTopColor: theme.colors.borderSubtle,
  },
});

