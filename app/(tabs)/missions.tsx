import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";

const STREAK_DAYS = [
  { label: "P", done: true },
  { label: "S", done: true },
  { label: "Ç", done: true },
  { label: "P", done: true },
  { label: "C", done: true },
  { label: "C", done: false, isGift: true },
  { label: "P", done: false, isTrophy: true },
];

const DAILY_MISSIONS = [
  {
    id: 1,
    icon: "📍",
    title: "2 km² alan ele geçir",
    progress: 1.36,
    total: 2,
    unit: "km²",
    xp: 120,
    color: Colors.cyan,
  },
  {
    id: 2,
    icon: "🏆",
    title: "3 rakip bölge fethet",
    progress: 1,
    total: 3,
    unit: "",
    xp: 200,
    color: Colors.coral,
  },
  {
    id: 3,
    icon: "👑",
    title: "5 km yürü",
    progress: 5.2,
    total: 5,
    unit: "km",
    xp: 80,
    color: Colors.emerald,
    completed: true,
  },
];

function StreakDot({ label, done, isGift, isTrophy }: { label: string; done: boolean; isGift?: boolean; isTrophy?: boolean }) {
  return (
    <View style={styles.streakItem}>
      <View style={[
        styles.streakDot,
        done && styles.streakDotDone,
        isGift && styles.streakDotGift,
        isTrophy && styles.streakDotTrophy,
      ]}>
        {isTrophy && <Text style={styles.streakEmoji}>🏆</Text>}
        {isGift && <Text style={styles.streakEmoji}>🎁</Text>}
        {done && !isGift && !isTrophy && <Text style={styles.streakCheck}>✓</Text>}
        {!done && !isGift && !isTrophy && <Text style={styles.streakLetter}>{label}</Text>}
      </View>
      {!isGift && !isTrophy && <Text style={styles.streakLabel}>{label}</Text>}
    </View>
  );
}

function MissionCard({ mission }: { mission: typeof DAILY_MISSIONS[0] }) {
  const pct = Math.min(100, (mission.progress / mission.total) * 100);
  const isCompleted = mission.completed || mission.progress >= mission.total;
  const progressText = mission.unit
    ? `${mission.progress} ${mission.unit} / ${mission.total} ${mission.unit}`
    : `${mission.progress} / ${mission.total}`;

  return (
    <View style={[styles.missionCard, isCompleted && styles.missionCardDone]}>
      <View style={[styles.missionIcon, { backgroundColor: `${mission.color}18` }]}>
        <Text style={styles.missionEmoji}>{mission.icon}</Text>
      </View>
      <View style={styles.missionContent}>
        <View style={styles.missionTop}>
          <Text style={styles.missionTitle} numberOfLines={1}>{mission.title}</Text>
          <View style={[styles.xpBadge, { backgroundColor: `${mission.color}20`, borderColor: `${mission.color}40` }]}>
            <Text style={[styles.xpText, { color: mission.color }]}>🔗 +{mission.xp}</Text>
          </View>
        </View>
        <Text style={styles.missionProgress}>{progressText}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${pct}%`, backgroundColor: mission.color }]} />
        </View>
      </View>
    </View>
  );
}

export default function MissionsScreen() {
  const streakCount = 7;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.dayLabel}>BUGÜN</Text>
          <Text style={styles.title}>Görevler</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={styles.streakCount}>{streakCount} gün streak</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Weekly streak */}
        <View style={styles.section}>
          <View style={styles.streakHeader}>
            <Text style={styles.sectionTitle}>Haftalık Streak</Text>
            <Text style={styles.streakFraction}>{STREAK_DAYS.filter(d => d.done).length}/7</Text>
          </View>
          <View style={styles.streakRow}>
            {STREAK_DAYS.map((day, i) => (
              <StreakDot key={i} {...day} />
            ))}
          </View>
        </View>

        {/* Daily missions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GÜNLÜK GÖREVLER</Text>
          {DAILY_MISSIONS.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </View>

        {/* Weekly reward */}
        <View style={styles.weeklyReward}>
          <View style={styles.weeklyLeft}>
            <Text style={styles.weeklyIcon}>🎁</Text>
            <View>
              <Text style={styles.weeklyTitle}>Haftalık Ödül</Text>
              <Text style={styles.weeklySubtitle}>Sezon Sandığı</Text>
            </View>
          </View>
          <View style={styles.weeklyRight}>
            <Text style={styles.weeklyTimer}>3 gün 14 saat kaldı</Text>
            <View style={styles.weeklyTrack}>
              <View style={[styles.weeklyBar, { width: "72%" }]} />
            </View>
          </View>
        </View>

        {/* Season missions header */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SEZON GÖREVLERİ</Text>
          <View style={styles.seasonCard}>
            <View style={styles.seasonIcon}>
              <Text style={styles.seasonEmoji}>🗺️</Text>
            </View>
            <View style={styles.seasonContent}>
              <Text style={styles.seasonTitle}>Sezon Şampiyonu</Text>
              <Text style={styles.seasonDesc}>100 km² toplam alan ele geçir</Text>
              <View style={styles.seasonProgressTrack}>
                <View style={[styles.seasonProgressBar, { width: "42%" }]} />
              </View>
              <Text style={styles.seasonProgressText}>42 / 100 km²</Text>
            </View>
            <View style={styles.seasonXp}>
              <Text style={styles.seasonXpText}>🔗 2,000</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  dayLabel: { fontSize: 10, fontWeight: "700", color: Colors.textMuted, letterSpacing: 1.5, marginBottom: 2 },
  title: { fontSize: 28, fontWeight: "800", color: Colors.textPrimary },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: `${Colors.coral}18`,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${Colors.coral}40`,
  },
  streakFire: { fontSize: 16 },
  streakCount: { fontSize: 13, fontWeight: "700", color: Colors.coral },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  streakHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  streakFraction: { fontSize: 12, fontWeight: "700", color: Colors.cyan },
  streakRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.surfaceSolid,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  streakItem: { alignItems: "center", gap: 4 },
  streakDot: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceBorder,
    justifyContent: "center",
    alignItems: "center",
  },
  streakDotDone: { backgroundColor: Colors.cyan },
  streakDotGift: { backgroundColor: `${Colors.gold}30`, borderWidth: 1, borderColor: `${Colors.gold}60` },
  streakDotTrophy: { backgroundColor: `${Colors.gold}20`, borderWidth: 1, borderColor: `${Colors.gold}50` },
  streakEmoji: { fontSize: 16 },
  streakCheck: { fontSize: 16, color: Colors.background, fontWeight: "700" },
  streakLetter: { fontSize: 11, fontWeight: "700", color: Colors.textSecondary },
  streakLabel: { fontSize: 9, color: Colors.textMuted },

  // Mission cards
  missionCard: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceSolid,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: 12,
  },
  missionCardDone: { borderColor: `${Colors.emerald}40` },
  missionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  missionEmoji: { fontSize: 22 },
  missionContent: { flex: 1 },
  missionTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  missionTitle: { flex: 1, fontSize: 14, fontWeight: "600", color: Colors.textPrimary, marginRight: 8 },
  xpBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  xpText: { fontSize: 11, fontWeight: "700" },
  missionProgress: { fontSize: 11, color: Colors.textSecondary, marginBottom: 6 },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.surfaceBorder,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: { height: "100%", borderRadius: 2 },

  // Weekly reward
  weeklyReward: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceSolid,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: `${Colors.gold}30`,
    marginBottom: 28,
    gap: 14,
  },
  weeklyLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  weeklyIcon: { fontSize: 28 },
  weeklyTitle: { fontSize: 14, fontWeight: "700", color: Colors.textPrimary },
  weeklySubtitle: { fontSize: 12, color: Colors.gold },
  weeklyRight: { flex: 1 },
  weeklyTimer: { fontSize: 11, color: Colors.textSecondary, marginBottom: 6 },
  weeklyTrack: {
    height: 4,
    backgroundColor: Colors.surfaceBorder,
    borderRadius: 2,
    overflow: "hidden",
  },
  weeklyBar: { height: "100%", backgroundColor: Colors.gold, borderRadius: 2 },

  // Season card
  seasonCard: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceSolid,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: 12,
    alignItems: "center",
  },
  seasonIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: `${Colors.purple}20`,
    justifyContent: "center",
    alignItems: "center",
  },
  seasonEmoji: { fontSize: 22 },
  seasonContent: { flex: 1 },
  seasonTitle: { fontSize: 14, fontWeight: "700", color: Colors.textPrimary, marginBottom: 2 },
  seasonDesc: { fontSize: 11, color: Colors.textSecondary, marginBottom: 6 },
  seasonProgressTrack: {
    height: 4,
    backgroundColor: Colors.surfaceBorder,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  seasonProgressBar: { height: "100%", backgroundColor: Colors.purple, borderRadius: 2 },
  seasonProgressText: { fontSize: 10, color: Colors.textSecondary },
  seasonXp: {
    backgroundColor: `${Colors.cyan}15`,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${Colors.cyan}30`,
  },
  seasonXpText: { fontSize: 12, fontWeight: "700", color: Colors.cyan },
});
