import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Crown, ChevronRight } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useState } from "react";
const TABS = [
  { id: "local", label: "Antalya" },
  { id: "country", label: "Türkiye" },
  { id: "global", label: "Global" },
];
const PODIUM_DATA = [
  { rank: 2, name: "Viking", area: "45.2K m²", color: Colors.silver },
  { rank: 1, name: "KaraKurt", area: "78.5K m²", color: Colors.gold },
  { rank: 3, name: "Savaşçı", area: "38.9K m²", color: Colors.bronze },
];
const LEADERBOARD_DATA = [
  { rank: 4, name: "PlajKralı", area: "32.1K m²", isUser: false },
  { rank: 5, name: "Koşucu42", area: "28.7K m²", isUser: false },
  { rank: 6, name: "AlanTitan", area: "24.5K m²", isUser: true },
  { rank: 7, name: "YeniBie", area: "21.3K m²", isUser: false },
  { rank: 8, name: "GPSMaster", area: "19.8K m²", isUser: false },
  { rank: 9, name: "TerritoryX", area: "17.2K m²", isUser: false },
  { rank: 10, name: "Walker99", area: "15.6K m²", isUser: false },
];
export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState("local");
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return Colors.gold;
      case 2:
        return Colors.silver;
      case 3:
        return Colors.bronze;
      default:
        return Colors.textSecondary;
    }
  };
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Liderlik</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Bu Hafta</Text>
          <ChevronRight size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Podium */}
        <View style={styles.podiumContainer}>
          {PODIUM_DATA.map((player, index) => (
            <View
              key={player.rank}
              style={[
                styles.podiumItem,
                index === 1 && styles.podiumCenter,
                index === 0 && styles.podiumLeft,
                index === 2 && styles.podiumRight,
              ]}
            >
              <View
                style={[
                  styles.podiumAvatar,
                  { borderColor: player.color },
                  index === 1 && styles.podiumAvatarCenter,
                ]}
              >
                <Text style={styles.podiumInitial}>
                  {player.name[0]}
                </Text>
                {index === 1 && (
                  <View style={styles.crownBadge}>
                    <Crown
                      size={14}
                      color={Colors.gold}
                      fill={Colors.gold}
                    />
                  </View>
                )}
              </View>
              <Text style={styles.podiumName}>{player.name}</Text>
              <Text style={[styles.podiumArea, { color: player.color }]}>
                {player.area}
              </Text>
              <View
                style={[
                  styles.podiumBar,
                  {
                    backgroundColor: player.color,
                    height: index === 1 ? 80 : index === 0 ? 60 : 50,
                  },
                ]}
              >
                <Text style={styles.podiumRank}>#{player.rank}</Text>
              </View>
            </View>
          ))}
        </View>
        {/* List */}
        <View style={styles.listContainer}>
          {LEADERBOARD_DATA.map((player) => (
            <View
              key={player.rank}
              style={[styles.listItem, player.isUser && styles.userListItem]}
            >
              <Text
                style={[styles.listRank, { color: getRankColor(player.rank) }]}
              >
                {player.rank}
              </Text>
              <View style={styles.listAvatar}>
                <Text style={styles.listInitial}> {player.name[0]} </Text>
              </View>
              <View style={styles.listInfo}>
                <Text
                  style={[
                    styles.listName,
                    player.isUser && styles.userListName,
                  ]}
                >
                  {player.name}
                  {player.isUser && (
                    <Text style={styles.youBadge}> (Sen)</Text>
                  )}
                </Text>
              </View>
              <Text style={styles.listArea}>{player.area}</Text>
            </View>
          ))}
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
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  filterText: { fontSize: 14, color: Colors.textSecondary },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  activeTab: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: 14, fontWeight: "500", color: Colors.textSecondary },
  activeTabText: { color: Colors.background, fontWeight: "600" },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 32,
    height: 240,
  },
  podiumItem: { alignItems: "center", width: 100 },
  podiumCenter: { zIndex: 1 },
  podiumLeft: { marginRight: -10 },
  podiumRight: { marginLeft: -10 },
  podiumAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    marginBottom: 8,
  },
  podiumAvatarCenter: { width: 80, height: 80, borderRadius: 40 },
  podiumInitial: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  crownBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  podiumArea: { fontSize: 12, fontWeight: "500", marginBottom: 12 },
  podiumBar: {
    width: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 8,
  },
  podiumRank: { fontSize: 14, fontWeight: "bold", color: Colors.background },
  listContainer: { paddingHorizontal: 20 },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  userListItem: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(0, 240, 255, 0.05)",
  },
  listRank: { fontSize: 16, fontWeight: "bold", width: 32 },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  listInitial: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary },
  listInfo: { flex: 1 },
  listName: { fontSize: 15, fontWeight: "500", color: Colors.textPrimary },
  userListName: { color: Colors.primary, fontWeight: "600" },
  youBadge: { fontSize: 12, color: Colors.textSecondary },
  listArea: { fontSize: 14, fontWeight: "600", color: Colors.textSecondary },
});
