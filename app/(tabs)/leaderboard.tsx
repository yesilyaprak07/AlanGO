import { useMemo } from "react";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Crown,
  Gift,
  Globe,
  Map,
  Shield,
  ShoppingCart,
  Trophy,
  Users,
  Building2,
  Gem,
  Plus,
} from "lucide-react-native";
import { BottomTabBar } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { theme } from "@/constants/theme";

type BottomKey = "map" | "leaderboard" | "rewards" | "store";

type RankItem = {
  rank: number;
  name: string;
  city: string;
  area: string;
  level: number;
  highlight?: boolean;
};

const ranking: RankItem[] = [
  { rank: 4, name: "CNRman (Sen)", city: "Antalya", area: "72.540 m2", level: 19, highlight: true },
  { rank: 5, name: "VioletStorm", city: "Bursa", area: "65.230 m2", level: 18 },
  { rank: 6, name: "RoadRunner", city: "Konya", area: "61.080 m2", level: 18 },
  { rank: 7, name: "MetroKing", city: "Adana", area: "58.310 m2", level: 17 },
  { rank: 8, name: "SkyLine", city: "Gaziantep", area: "52.470 m2", level: 16 },
  { rank: 9, name: "GreenArrow", city: "Samsun", area: "49.860 m2", level: 16 },
  { rank: 10, name: "NightHawk", city: "Trabzon", area: "47.320 m2", level: 15 },
];

function avatarColors(rank: number) {
  if (rank === 4) return { ring: "#4DDCFF", fill: "rgba(77, 220, 255, 0.2)" };
  if (rank % 3 === 0) return { ring: "#FFB83A", fill: "rgba(255, 184, 58, 0.2)" };
  if (rank % 2 === 0) return { ring: "#A98BFF", fill: "rgba(169, 139, 255, 0.22)" };
  return { ring: "#8EF3A1", fill: "rgba(142, 243, 161, 0.2)" };
}

export default function LeaderboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const bottomTabs = useMemo(
    () => [
      { key: "map" as const, label: "Harita", icon: <Map size={12} color="#A9B4C0" /> },
      { key: "leaderboard" as const, label: "Liderlik", icon: <Trophy size={12} color="#10F4E8" /> },
      { key: "rewards" as const, label: "Oduller", icon: <Gift size={12} color="#A9B4C0" />, badgeCount: 1 },
      { key: "store" as const, label: "Dukkan", icon: <ShoppingCart size={12} color="#A9B4C0" /> },
    ],
    []
  );

  return (
    <ImageBackground source={require("../../assets/images/backbos.png")} style={styles.backgroundImage} resizeMode="cover">
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 128 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topHudRow}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCore}>
              <Text style={styles.avatarText}>AL</Text>
            </View>
            <View style={styles.levelChip}>
              <Text style={styles.levelText}>24</Text>
            </View>
          </View>

          <View style={styles.balancePill}>
            <View style={styles.coinIcon} />
            <Text style={styles.balanceText}>2.450</Text>
            <Plus size={22} color="#10F4E8" strokeWidth={1.5} />
          </View>

          <View style={styles.balancePill}>
            <Gem size={20} color="#7F9CFF" fill="#7F9CFF" />
            <Text style={styles.balanceText}>128</Text>
            <Plus size={22} color="#10F4E8" strokeWidth={1.5} />
          </View>

          <Pressable style={styles.bellButton} onPress={() => router.push(ROUTES.tabs.notifications)}>
            <Bell size={25} color="#FFFFFF" />
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>3</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.scaledContentWrap}>
          <View style={styles.scaledContent}>
            <Text style={styles.title}>LIDERLIK</Text>

            <View style={styles.seasonRow}>
              <Pressable style={styles.seasonPill}>
                <Text style={styles.seasonPillText}>Sezon 1</Text>
                <ChevronDown size={14} color="#A9B4C0" />
              </Pressable>
              <Text style={styles.seasonTime}>Sezon bitimine: 22g 14s 32d</Text>
            </View>

            <View style={styles.scopeTabs}>
              <Pressable style={[styles.scopeTab, styles.scopeTabActive]}>
                <Globe size={15} color="#10F4E8" />
                <Text style={[styles.scopeTabText, styles.scopeTabTextActive]}>Genel</Text>
              </Pressable>
              <Pressable style={styles.scopeTab}>
                <Building2 size={15} color="#7E8C9B" />
                <Text style={styles.scopeTabText}>Sehrim</Text>
              </Pressable>
              <Pressable style={styles.scopeTab}>
                <Users size={15} color="#7E8C9B" />
                <Text style={styles.scopeTabText}>Arkadaslar</Text>
              </Pressable>
              <Pressable style={styles.scopeTab}>
                <Shield size={15} color="#7E8C9B" />
                <Text style={styles.scopeTabText}>Klanlar</Text>
              </Pressable>
            </View>

            <View style={styles.podiumCard}>
              <View style={styles.podiumInner}>
                <View style={styles.podiumSideCol}>
                  <View style={[styles.podiumAvatar, styles.podiumAvatarSilver]}>
                    <Crown size={14} color="#BBD4FF" />
                  </View>
                  <Text style={styles.podiumName}>NeonQueen</Text>
                  <Text style={styles.podiumCity}>Ankara</Text>
                  <Text style={[styles.podiumArea, styles.podiumAreaBlue]}>98.750 m2</Text>
                  <View style={[styles.podiumBase, styles.podiumBaseBlue]}>
                    <Text style={styles.podiumRank}>2</Text>
                  </View>
                </View>

                <View style={styles.podiumCenterCol}>
                  <View style={[styles.podiumAvatar, styles.podiumAvatarGold]}>
                    <Crown size={16} color="#FFD25B" />
                  </View>
                  <Text style={styles.podiumName}>ShadowWalker</Text>
                  <Text style={styles.podiumCity}>Istanbul</Text>
                  <Text style={[styles.podiumArea, styles.podiumAreaGold]}>125.430 m2</Text>
                  <View style={[styles.podiumBase, styles.podiumBaseGold]}>
                    <Text style={styles.podiumRank}>1</Text>
                  </View>
                </View>

                <View style={styles.podiumSideCol}>
                  <View style={[styles.podiumAvatar, styles.podiumAvatarBronze]}>
                    <Crown size={14} color="#FFBE75" />
                  </View>
                  <Text style={styles.podiumName}>ZoneMaster</Text>
                  <Text style={styles.podiumCity}>Izmir</Text>
                  <Text style={[styles.podiumArea, styles.podiumAreaBronze]}>87.160 m2</Text>
                  <View style={[styles.podiumBase, styles.podiumBaseBronze]}>
                    <Text style={styles.podiumRank}>3</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.listWrap}>
              {ranking.map((item) => {
                const colors = avatarColors(item.rank);
                return (
                  <Pressable key={item.rank} style={[styles.rankRow, item.highlight && styles.rankRowHighlight]}>
                    <Text style={[styles.rankIndex, item.highlight && styles.rankIndexHighlight]}>{item.rank}</Text>

                    <View style={[styles.rowAvatar, { borderColor: colors.ring, backgroundColor: colors.fill }]}>
                      <Text style={styles.rowAvatarText}>{item.name.slice(0, 2).toUpperCase()}</Text>
                      <View style={styles.rowLevelBadge}>
                        <Text style={styles.rowLevelText}>{item.level}</Text>
                      </View>
                    </View>

                    <View style={styles.rowMeta}>
                      <Text style={[styles.rowName, item.highlight && styles.rowNameHighlight]}>{item.name}</Text>
                      <Text style={styles.rowCity}>{item.city}</Text>
                    </View>

                    <Text style={styles.rowArea}>{item.area}</Text>
                    <ChevronRight size={18} color="#8D9AA8" />
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomTabBar<BottomKey>
        tabs={bottomTabs}
        activeKey="leaderboard"
        onTabPress={(key) => {
          if (key === "map") router.push(ROUTES.tabs.map);
          if (key === "leaderboard") router.push(ROUTES.tabs.leaderboard);
          if (key === "rewards") router.push(ROUTES.tabs.missions);
          if (key === "store") router.push(ROUTES.tabs.store);
        }}
      />
    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 10,
    paddingTop: 8,
    gap: 10,
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
  balancePill: {
    width: 109,
    height: 42,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    backgroundColor: "rgba(8, 18, 28, 0.88)",
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
  balanceText: {
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
  scaledContentWrap: {
    marginTop: -150,
    paddingHorizontal: 12,
    alignSelf: "stretch",
  },
  scaledContent: {
    width: "142.857%",
    transform: [{ scale: 0.7 }],
    alignSelf: "center",
  },
  title: {
    color: "#FFFFFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 46,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  seasonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seasonPill: {
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.24)",
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    gap: 8,
  },
  seasonPillText: {
    color: "#E3EAF3",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 28,
    lineHeight: 28,
  },
  seasonTime: {
    color: "#7EEBFF",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 17,
  },
  scopeTabs: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.24)",
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    gap: 3,
  },
  scopeTab: {
    height: 50,
    flex: 1,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  scopeTabActive: {
    backgroundColor: "rgba(16, 244, 232, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(16, 244, 232, 0.45)",
  },
  scopeTabText: {
    color: "#7E8C9B",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 24,
    lineHeight: 24,
  },
  scopeTabTextActive: {
    color: "#10F4E8",
  },
  podiumCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(80, 120, 190, 0.35)",
    backgroundColor: "rgba(10, 19, 39, 0.92)",
    overflow: "hidden",
    minHeight: 330,
    justifyContent: "flex-end",
  },
  podiumInner: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  podiumSideCol: {
    width: "31%",
    alignItems: "center",
  },
  podiumCenterCol: {
    width: "36%",
    alignItems: "center",
  },
  podiumAvatar: {
    width: 98,
    height: 98,
    borderRadius: 49,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  podiumAvatarSilver: {
    borderColor: "#9FD0FF",
    backgroundColor: "rgba(159, 208, 255, 0.11)",
  },
  podiumAvatarGold: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderColor: "#FFD25B",
    backgroundColor: "rgba(255, 210, 91, 0.12)",
  },
  podiumAvatarBronze: {
    borderColor: "#FFAD64",
    backgroundColor: "rgba(255, 173, 100, 0.12)",
  },
  podiumName: {
    color: "#F2F6FB",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 16,
  },
  podiumCity: {
    color: "#A7B3C2",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
  },
  podiumArea: {
    marginTop: 2,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 33,
    lineHeight: 33,
  },
  podiumAreaBlue: {
    color: "#6CEFFF",
  },
  podiumAreaGold: {
    color: "#FFD25B",
  },
  podiumAreaBronze: {
    color: "#FFAD64",
  },
  podiumBase: {
    marginTop: 8,
    width: "100%",
    borderRadius: 99,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  podiumBaseBlue: {
    height: 56,
    borderColor: "rgba(108, 239, 255, 0.55)",
    backgroundColor: "rgba(108, 239, 255, 0.12)",
  },
  podiumBaseGold: {
    height: 74,
    borderColor: "rgba(255, 210, 91, 0.6)",
    backgroundColor: "rgba(255, 210, 91, 0.15)",
  },
  podiumBaseBronze: {
    height: 50,
    borderColor: "rgba(255, 173, 100, 0.58)",
    backgroundColor: "rgba(255, 173, 100, 0.15)",
  },
  podiumRank: {
    color: "#F2F6FB",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 26,
  },
  listWrap: {
    gap: 6,
  },
  rankRow: {
    minHeight: 78,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 10,
  },
  rankRowHighlight: {
    borderColor: "rgba(16, 244, 232, 0.56)",
    backgroundColor: "rgba(16, 244, 232, 0.08)",
  },
  rankIndex: {
    width: 28,
    color: "#AEB9C6",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 38,
    lineHeight: 38,
    textAlign: "center",
  },
  rankIndexHighlight: {
    color: "#6CEFFF",
  },
  rowAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.3,
    alignItems: "center",
    justifyContent: "center",
  },
  rowAvatarText: {
    color: "#FFFFFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 15,
  },
  rowLevelBadge: {
    position: "absolute",
    right: -2,
    top: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 187, 82, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  rowLevelText: {
    color: "#1C232B",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 10,
  },
  rowMeta: {
    flex: 1,
    gap: 1,
  },
  rowName: {
    color: "#F1F5FB",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 17,
  },
  rowNameHighlight: {
    color: "#6CEFFF",
  },
  rowCity: {
    color: "#A6B2C0",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
  },
  rowArea: {
    color: "#62EEFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 18,
  },
});
