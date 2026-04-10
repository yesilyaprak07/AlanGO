import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Settings, Share2, Award, Crown } from "lucide-react-native";
import { Colors } from "@/constants/colors";
const { width } = Dimensions.get("window");
const STATS = [
  { id: 1, label: "Toplam Alan", value: "24.580", unit: "m²" },
  { id: 2, label: "Kill", value: "156" },
  { id: 3, label: "Ölüm", value: "43" },
  { id: 4, label: "En Büyük", value: "8.240", unit: "m²" },
];
const WEEKLY_DATA = [
  { day: "Pzt", value: 40 },
  { day: "Sal", value: 65 },
  { day: "Çar", value: 45 },
  { day: "Per", value: 80 },
  { day: "Cum", value: 55 },
  { day: "Cmt", value: 90 },
  { day: "Paz", value: 70 },
];
const ACHIEVEMENTS = [
  { id: 1, icon: "👑", name: "Kral", desc: "100+ alan" },
  { id: 2, icon: "⚔️", name: "Savaşçı", desc: "50+ kill" },
  { id: 3, icon: "🎯", name: "Nişancı", desc: "100m mesafe" },
  { id: 4, icon: "🏃", name: "Koşucu", desc: "10km gün" },
];
export default function ProfileScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/(tabs)/settings")}
        >
          <Settings size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGlow} />
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
          </View>
          <Text style={styles.username}>AlanTitan</Text>
          <View style={styles.levelBadge}>
            <Crown size={12} color={Colors.gold} />
            <Text style={styles.levelText}>Seviye 12</Text>
          </View>
        </View>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <Text style={styles.statValue}>
                {stat.value}
                {stat.unit && (
                  <Text style={styles.statUnit}> {stat.unit}</Text>
                )}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
        {/* Weekly Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Bu Hafta</Text>
          <View style={styles.chart}>
            {WEEKLY_DATA.map((item, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[styles.bar, { height: `${item.value}%` }]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Başarımlar</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementsContent}
          >
            {ACHIEVEMENTS.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>
                  {achievement.icon}
                </Text>
                <Text style={styles.achievementName}>{achievement.name}</Text>
                <Text style={styles.achievementDesc}>
                  {achievement.desc}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* Mini Map Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sahip Olduğun Bölgeler</Text>
          <View style={styles.miniMap}>
            <View style={styles.territoryDot}>
              <View style={styles.territoryMarker} />
            </View>
            <View style={[styles.territoryDot, { top: 40, left: 80 }]}>
              <View style={styles.territoryMarker} />
            </View>
            <View style={[styles.territoryDot, { top: 80, left: 40 }]}>
              <View style={styles.territoryMarker} />
            </View>
            <View style={[styles.territoryDot, { top: 100, left: 120 }]}>
              <View style={styles.territoryMarker} />
            </View>
          </View>
        </View>
        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Profili Paylaş</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Award size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Liderlik Tablosu</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
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
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: "bold", color: Colors.textPrimary },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  avatarSection: { alignItems: "center", paddingVertical: 20 },
  avatarContainer: { position: "relative", marginBottom: 16 },
  avatarGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    opacity: 0.3,
    top: -10,
    left: -10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarText: { fontSize: 32, fontWeight: "bold", color: Colors.background },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 240, 255, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  levelText: { fontSize: 14, fontWeight: "600", color: Colors.primary },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  statValue: { fontSize: 20, fontWeight: "bold", color: Colors.textPrimary },
  statUnit: { fontSize: 14, color: Colors.textSecondary },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
  },
  barContainer: { alignItems: "center", flex: 1 },
  barWrapper: {
    width: 24,
    height: 100,
    backgroundColor: Colors.surfaceBorder,
    borderRadius: 4,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  bar: { width: "100%", backgroundColor: Colors.primary, borderRadius: 4 },
  barLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 8 },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  achievementsContent: { paddingHorizontal: 16, gap: 12 },
  achievementCard: {
    width: 100,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  achievementIcon: { fontSize: 28, marginBottom: 8 },
  achievementName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  achievementDesc: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  miniMap: {
    height: 160,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: "hidden",
    position: "relative",
  },
  territoryDot: { position: "absolute", top: 30, left: 50 },
  territoryMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  actionText: { fontSize: 14, fontWeight: "500", color: Colors.textPrimary },
});
