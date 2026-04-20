import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { useState } from "react";

type Tab = "mahalle" | "sehir" | "ulke";

const TABS: { key: Tab; label: string }[] = [
  { key: "mahalle", label: "Mahalle" },
  { key: "sehir", label: "Şehir" },
  { key: "ulke", label: "Ülke" },
];

const PODIUM = [
  { rank: 2, initials: "ZT", name: "Zehra.T", title: "GENERAL", area: "76.8 km²", color: Colors.silver },
  { rank: 1, initials: "MK", name: "Mert_K", title: "HÜKÜMDAR", area: "84.2 km²", color: Colors.gold },
  { rank: 3, initials: "B6", name: "Burak61", title: "GENERAL", area: "71.4 km²", color: Colors.bronze },
];

const LIST = [
  { rank: 4, initials: "EO", name: "Eylül_06", area: "68.1 km²", trend: "+2", isUser: false },
  { rank: 5, initials: "AY", name: "Sen", area: "62.4 km²", trend: "+3", isUser: true },
  { rank: 6, initials: "K9", name: "Koray99", area: "58.7 km²", trend: "-1", isUser: false },
  { rank: 7, initials: "GP", name: "GPSMaster", area: "54.2 km²", trend: "0", isUser: false },
  { rank: 8, initials: "TK", name: "TurkKral", area: "49.8 km²", trend: "+4", isUser: false },
];

function HexAvatar({ initials, color, size = 52 }: { initials: string; color: string; size?: number }) {
  return (
    <View style={[styles.hexAvatar, { width: size, height: size, borderRadius: size * 0.22, borderColor: color }]}>
      <Text style={[styles.hexAvatarText, { color, fontSize: size * 0.32 }]}>{initials}</Text>
    </View>
  );
}

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("sehir");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.seasonRow}>
            <Text style={styles.seasonLabel}>SEZON 4</Text>
            <View style={styles.seasonTimer}>
              <View style={styles.timerDot} />
              <Text style={styles.timerText}>12 GÜN</Text>
            </View>
          </View>
          <Text style={styles.title}>Liderlik</Text>
        </View>
        <View style={styles.trophyBadge}>
          <Text style={styles.trophyEmoji}>🏆</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Podium */}
        <View style={styles.podiumWrapper}>
          {/* Left (rank 2) */}
          <View style={[styles.podiumItem, styles.podiumSide]}>
            <HexAvatar initials={PODIUM[0].initials} color={PODIUM[0].color} size={56} />
            <Text style={styles.podiumName}>{PODIUM[0].name}</Text>
            <Text style={[styles.podiumTitle, { color: PODIUM[0].color }]}>{PODIUM[0].title}</Text>
            <Text style={styles.podiumArea}>{PODIUM[0].area}</Text>
            <View style={[styles.podiumBar, { height: 60, backgroundColor: PODIUM[0].color }]}>
              <Text style={styles.podiumRankNum}>2</Text>
            </View>
          </View>

          {/* Center (rank 1) */}
          <View style={[styles.podiumItem, styles.podiumCenter]}>
            <View style={styles.crownAbove}>
              <Text style={styles.crownEmoji}>👑</Text>
            </View>
            <HexAvatar initials={PODIUM[1].initials} color={PODIUM[1].color} size={72} />
            <Text style={[styles.podiumName, { fontSize: 15 }]}>{PODIUM[1].name}</Text>
            <Text style={[styles.podiumTitle, { color: PODIUM[1].color }]}>{PODIUM[1].title}</Text>
            <Text style={[styles.podiumArea, { color: PODIUM[1].color }]}>{PODIUM[1].area}</Text>
            <View style={[styles.podiumBar, { height: 80, backgroundColor: PODIUM[1].color }]}>
              <Text style={styles.podiumRankNum}>1</Text>
            </View>
          </View>

          {/* Right (rank 3) */}
          <View style={[styles.podiumItem, styles.podiumSide]}>
            <HexAvatar initials={PODIUM[2].initials} color={PODIUM[2].color} size={56} />
            <Text style={styles.podiumName}>{PODIUM[2].name}</Text>
            <Text style={[styles.podiumTitle, { color: PODIUM[2].color }]}>{PODIUM[2].title}</Text>
            <Text style={styles.podiumArea}>{PODIUM[2].area}</Text>
            <View style={[styles.podiumBar, { height: 50, backgroundColor: PODIUM[2].color }]}>
              <Text style={styles.podiumRankNum}>3</Text>
            </View>
          </View>
        </View>

        {/* Season reward */}
        <View style={styles.rewardCard}>
          <Text style={styles.rewardIcon}>🏆</Text>
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardTitle}>SEZON ÖDÜLÜ</Text>
            <Text style={styles.rewardDesc}>Top 100 → Altın "Hükümdar" rozeti + 5.000 altın</Text>
          </View>
          <View style={styles.rewardRank}>
            <Text style={styles.rewardRankLabel}>SIRAN</Text>
            <Text style={styles.rewardRankValue}>#5</Text>
          </View>
        </View>

        {/* List */}
        <View style={styles.listContainer}>
          {LIST.map((player) => {
            const trendColor = player.trend.startsWith("+")
              ? Colors.emerald
              : player.trend === "0" ? Colors.textSecondary : Colors.coral;
            return (
              <View key={player.rank} style={[styles.listItem, player.isUser && styles.listItemUser]}>
                <Text style={styles.listRank}>#{player.rank}</Text>
                <HexAvatar
                  initials={player.initials}
                  color={player.isUser ? Colors.cyan : Colors.textSecondary}
                  size={40}
                />
                <View style={styles.listInfo}>
                  <Text style={[styles.listName, player.isUser && styles.listNameUser]}>
                    {player.name}
                    {player.isUser && <Text style={styles.youTag}> SEN</Text>}
                  </Text>
                  <Text style={styles.listArea}>{player.area}</Text>
                </View>
                <Text style={[styles.listTrend, { color: trendColor }]}>
                  {player.trend !== "0" ? (player.trend.startsWith("+") ? "↑" : "↓") + player.trend.slice(1) : "—"}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  seasonRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  seasonLabel: { fontSize: 11, fontWeight: "700", color: Colors.textSecondary, letterSpacing: 1 },
  seasonTimer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${Colors.coral}18`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${Colors.coral}40`,
  },
  timerDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.coral },
  timerText: { fontSize: 10, fontWeight: "700", color: Colors.coral },
  title: { fontSize: 28, fontWeight: "800", color: Colors.textPrimary },
  trophyBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: `${Colors.gold}18`,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: `${Colors.gold}40`,
  },
  trophyEmoji: { fontSize: 24 },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.surfaceSolid,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  tabActive: { backgroundColor: Colors.cyan, borderColor: Colors.cyan },
  tabText: { fontSize: 13, fontWeight: "600", color: Colors.textSecondary },
  tabTextActive: { color: Colors.background, fontWeight: "700" },

  // Podium
  podiumWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  podiumItem: { alignItems: "center", flex: 1 },
  podiumSide: { marginBottom: 0 },
  podiumCenter: { marginHorizontal: 8 },
  crownAbove: { marginBottom: 4 },
  crownEmoji: { fontSize: 28 },
  hexAvatar: {
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    marginBottom: 8,
  },
  hexAvatarText: { fontWeight: "800" },
  podiumName: { fontSize: 12, fontWeight: "700", color: Colors.textPrimary, marginBottom: 2 },
  podiumTitle: { fontSize: 9, fontWeight: "700", letterSpacing: 0.5, marginBottom: 2 },
  podiumArea: { fontSize: 11, color: Colors.textSecondary, marginBottom: 8 },
  podiumBar: {
    width: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 8,
  },
  podiumRankNum: { fontSize: 14, fontWeight: "800", color: Colors.background },

  // Season reward
  rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.gold}10`,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: `${Colors.gold}30`,
    marginBottom: 20,
    gap: 10,
  },
  rewardIcon: { fontSize: 24 },
  rewardInfo: { flex: 1 },
  rewardTitle: { fontSize: 10, fontWeight: "700", color: Colors.gold, letterSpacing: 1, marginBottom: 2 },
  rewardDesc: { fontSize: 12, color: Colors.textSecondary },
  rewardRank: { alignItems: "center" },
  rewardRankLabel: { fontSize: 9, color: Colors.textMuted, letterSpacing: 1 },
  rewardRankValue: { fontSize: 18, fontWeight: "800", color: Colors.gold },

  // List
  listContainer: { paddingHorizontal: 20 },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceSolid,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: 10,
  },
  listItemUser: { borderColor: `${Colors.cyan}50`, backgroundColor: `${Colors.cyan}08` },
  listRank: { fontSize: 14, fontWeight: "800", color: Colors.textSecondary, width: 28 },
  listInfo: { flex: 1 },
  listName: { fontSize: 14, fontWeight: "600", color: Colors.textPrimary },
  listNameUser: { color: Colors.cyan, fontWeight: "700" },
  youTag: { fontSize: 10, color: Colors.cyan, fontWeight: "800" },
  listArea: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  listTrend: { fontSize: 13, fontWeight: "700" },
});
