import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";

const { width } = Dimensions.get("window");

const STATS = [
  { id: 1, label: "TOPLAM BÖLGE", value: "42.6", unit: "km²", icon: "📍", color: Colors.cyan },
  { id: 2, label: "SAVUNULAN", value: "128", unit: "saldırı", icon: "🛡️", color: Colors.emerald },
  { id: 3, label: "ÇALINAN", value: "86", unit: "bölge", icon: "⚔️", color: Colors.coral },
  { id: 4, label: "GALİBİYET", value: "214W / 18L", unit: "", icon: "🏆", color: Colors.gold },
];

const MEDALS = [
  { id: 1, icon: "👑", label: "Kral", earned: true },
  { id: 2, icon: "⭐", label: "Elite", earned: true },
  { id: 3, icon: "🎖️", label: "Savaşçı", earned: true },
  { id: 4, icon: "🛡️", label: "Savunma", earned: true },
  { id: 5, icon: "⚔️", label: "Saldırı", earned: false },
  { id: 6, icon: "🏃", label: "Koşucu", earned: false },
];

const WEEKLY_DATA = [
  { day: "Pzt", val: 40 },
  { day: "Sal", val: 65 },
  { day: "Çar", val: 45 },
  { day: "Per", val: 80 },
  { day: "Cum", val: 55 },
  { day: "Cmt", val: 90 },
  { day: "Paz", val: 70 },
];

export default function ProfileScreen() {
  const router = useRouter();
  const level = 24;
  const xpCurrent = 2340;
  const xpNext = 3000;
  const xpPct = (xpCurrent / xpNext) * 100;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero section */}
        <View style={styles.hero}>
          {/* Rank badge */}
          <View style={styles.rankBadge}>
            <Text style={styles.rankEmoji}>👑</Text>
            <Text style={styles.rankText}>ELİTE KOMUTAN</Text>
          </View>

          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarGlow} />
            <View style={styles.avatarHex}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarInitials}>AY</Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>LV {level}</Text>
              </View>
            </View>
          </View>

          {/* Name */}
          <Text style={styles.fullName}>Ahmet "Komutan" Yılmaz</Text>
          <Text style={styles.location}>Karşıyaka, İzmir</Text>

          {/* Ranking */}
          <TouchableOpacity style={styles.rankRow} onPress={() => router.push("/(tabs)/leaderboard")}>
            <Text style={styles.rankingText}>Sıralama</Text>
            <Text style={styles.rankingValue}>#142</Text>
            <Text style={styles.rankingArrow}>›</Text>
          </TouchableOpacity>

          {/* XP bar */}
          <View style={styles.xpSection}>
            <View style={styles.xpRow}>
              <Text style={styles.xpLabel}>SONRAKI RÜTBE · GENERAL</Text>
              <Text style={styles.xpValue}>{xpCurrent.toLocaleString()} / {xpNext.toLocaleString()} XP</Text>
            </View>
            <View style={styles.xpTrack}>
              <View style={[styles.xpBar, { width: `${xpPct}%` }]} />
            </View>
          </View>
        </View>

        {/* War record stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SAVAŞ KAYDI</Text>
          <View style={styles.statsGrid}>
            {STATS.map((stat) => (
              <View key={stat.id} style={styles.statCard}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {stat.value}
                  {stat.unit ? <Text style={styles.statUnit}> {stat.unit}</Text> : null}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly chart */}
        <View style={styles.section}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>BU HAFTA</Text>
            <Text style={styles.chartSub}>km² fethedilen alan</Text>
          </View>
          <View style={styles.chartCard}>
            {WEEKLY_DATA.map((item, i) => (
              <View key={i} style={styles.barCol}>
                <View style={styles.barWrapper}>
                  <View style={[styles.bar, { height: `${item.val}%`, backgroundColor: i === 5 ? Colors.purple : Colors.cyan }]} />
                </View>
                <Text style={styles.barLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Medals */}
        <View style={styles.section}>
          <View style={styles.medalsHeader}>
            <Text style={styles.sectionTitle}>MADALYALAR</Text>
            <Text style={styles.medalsCount}>4 / 6</Text>
          </View>
          <View style={styles.medalsRow}>
            {MEDALS.map((medal) => (
              <View key={medal.id} style={[styles.medalItem, !medal.earned && styles.medalLocked]}>
                <Text style={[styles.medalEmoji, !medal.earned && styles.medalEmojiLocked]}>
                  {medal.icon}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>Paylaş</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push("/(tabs)/leaderboard")}>
            <Text style={styles.actionIcon}>🏆</Text>
            <Text style={styles.actionText}>Liderlik</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push("/(tabs)/settings")}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Ayarlar</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Hero
  hero: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: `${Colors.gold}18`,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${Colors.gold}40`,
    marginBottom: 20,
  },
  rankEmoji: { fontSize: 14 },
  rankText: { fontSize: 11, fontWeight: "800", color: Colors.gold, letterSpacing: 1.5 },
  avatarWrapper: { position: "relative", marginBottom: 16 },
  avatarGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.cyan,
    opacity: 0.1,
    top: -20,
    left: -20,
  },
  avatarHex: {
    width: 120,
    height: 120,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: Colors.cyan,
    backgroundColor: `${Colors.cyan}12`,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarInner: {
    width: 96,
    height: 96,
    borderRadius: 18,
    backgroundColor: `${Colors.cyan}18`,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: { fontSize: 38, fontWeight: "800", color: Colors.cyan },
  levelBadge: {
    position: "absolute",
    bottom: -10,
    backgroundColor: Colors.purple,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  levelText: { fontSize: 11, fontWeight: "800", color: Colors.textPrimary },
  fullName: { fontSize: 22, fontWeight: "800", color: Colors.textPrimary, marginBottom: 4, textAlign: "center" },
  location: { fontSize: 14, color: Colors.textSecondary, marginBottom: 12 },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  rankingText: { fontSize: 13, color: Colors.textSecondary },
  rankingValue: { fontSize: 14, fontWeight: "700", color: Colors.cyan },
  rankingArrow: { fontSize: 14, color: Colors.cyan },
  xpSection: { width: "100%" },
  xpRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  xpLabel: { fontSize: 10, fontWeight: "700", color: Colors.textMuted, letterSpacing: 0.5 },
  xpValue: { fontSize: 11, color: Colors.cyan, fontWeight: "600" },
  xpTrack: {
    height: 5,
    backgroundColor: Colors.surfaceBorder,
    borderRadius: 3,
    overflow: "hidden",
  },
  xpBar: { height: "100%", backgroundColor: Colors.purple, borderRadius: 3 },

  // Sections
  section: { paddingHorizontal: 20, paddingTop: 24, marginBottom: 4 },
  sectionTitle: { fontSize: 11, fontWeight: "700", color: Colors.textSecondary, letterSpacing: 1.5, marginBottom: 14 },

  // Stats grid
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: {
    width: (width - 50) / 2,
    backgroundColor: Colors.surfaceSolid,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: 4,
  },
  statIcon: { fontSize: 20 },
  statValue: { fontSize: 18, fontWeight: "800" },
  statUnit: { fontSize: 12, fontWeight: "500", color: Colors.textSecondary },
  statLabel: { fontSize: 10, color: Colors.textMuted, letterSpacing: 0.5, fontWeight: "600" },

  // Chart
  chartHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  chartSub: { fontSize: 11, color: Colors.textMuted },
  chartCard: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceSolid,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    height: 130,
    alignItems: "flex-end",
  },
  barCol: { flex: 1, alignItems: "center" },
  barWrapper: {
    width: 18,
    height: 90,
    backgroundColor: Colors.surfaceBorder,
    borderRadius: 4,
    overflow: "hidden",
    justifyContent: "flex-end",
    marginBottom: 6,
  },
  bar: { width: "100%", borderRadius: 4 },
  barLabel: { fontSize: 9, color: Colors.textMuted },

  // Medals
  medalsHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  medalsCount: { fontSize: 12, color: Colors.cyan, fontWeight: "600" },
  medalsRow: { flexDirection: "row", gap: 12 },
  medalItem: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.surfaceSolid,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: `${Colors.gold}40`,
  },
  medalLocked: { opacity: 0.3, borderColor: Colors.surfaceBorder },
  medalEmoji: { fontSize: 22 },
  medalEmojiLocked: { opacity: 0.5 },

  // Actions
  actionsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 24,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceSolid,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  actionIcon: { fontSize: 20 },
  actionText: { fontSize: 11, fontWeight: "600", color: Colors.textSecondary },
});
