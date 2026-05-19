import { useMemo } from "react";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BadgeCheck,
  Bell,
  CircleHelp,
  Clock3,
  Gem,
  Gift,
  Headphones,
  Map,
  Plus,
  Sandwich,
  ShieldCheck,
  ShoppingCart,
  SquarePlus,
  Ticket,
  Trophy,
  Users,
  Watch,
} from "lucide-react-native";
import { BottomTabBar } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { theme } from "@/constants/theme";

type BottomKey = "map" | "leaderboard" | "rewards" | "store";

type Chest = {
  id: string;
  title: string;
  timer: string;
  cost: number;
  tone: "normal" | "rare" | "epic" | "legendary";
};

type RealReward = {
  id: string;
  title: string;
  chance: string;
  icon: React.ReactNode;
};

const CHESTS: Chest[] = [
  { id: "normal", title: "Normal Sandik", timer: "02:15", cost: 12, tone: "normal" },
  { id: "rare", title: "Rare Sandik", timer: "22:30", cost: 28, tone: "rare" },
  { id: "epic", title: "Epic Sandik", timer: "02:45:15", cost: 72, tone: "epic" },
  { id: "legendary", title: "Legendary Sandik", timer: "07:59:40", cost: 120, tone: "legendary" },
];

const REAL_REWARDS: RealReward[] = [
  { id: "coffee", title: "Kahve", chance: "%25", icon: <Gift size={34} color="#F3D4B6" /> },
  { id: "meal", title: "Yemek", chance: "%25", icon: <Sandwich size={34} color="#F1CB86" /> },
  { id: "coupon", title: "Magaza Kuponu", chance: "%20", icon: <Ticket size={34} color="#E8D8B2" /> },
  { id: "earbuds", title: "Kulaklik", chance: "%15", icon: <Headphones size={34} color="#D9E5F4" /> },
  { id: "watch", title: "Saat", chance: "%10", icon: <Watch size={34} color="#D1D8E4" /> },
];

function chestTone(tone: Chest["tone"]) {
  if (tone === "rare") {
    return { border: "rgba(132, 114, 255, 0.65)", glow: "rgba(132, 114, 255, 0.16)", text: "#BAA6FF" };
  }
  if (tone === "epic") {
    return { border: "rgba(197, 135, 255, 0.65)", glow: "rgba(197, 135, 255, 0.16)", text: "#D9A8FF" };
  }
  if (tone === "legendary") {
    return { border: "rgba(255, 200, 90, 0.7)", glow: "rgba(255, 200, 90, 0.17)", text: "#FFD988" };
  }
  return { border: "rgba(120, 160, 180, 0.35)", glow: "rgba(120, 160, 180, 0.12)", text: "#C7D3DF" };
}

export default function RewardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const bottomTabs = useMemo(
    () => [
      { key: "map" as const, label: "Harita", icon: <Map size={12} color="#A9B4C0" /> },
      { key: "leaderboard" as const, label: "Liderlik", icon: <Trophy size={12} color="#A9B4C0" /> },
      { key: "rewards" as const, label: "Oduller", icon: <Gift size={12} color="#10F4E8" />, badgeCount: 1 },
      { key: "store" as const, label: "Dukkan", icon: <ShoppingCart size={12} color="#A9B4C0" /> },
    ],
    []
  );

  return (
    <ImageBackground source={require("../../assets/images/backbos.png")} style={styles.backgroundImage} resizeMode="cover">
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 126 }]} showsVerticalScrollIndicator={false}>
          <View style={styles.topHudRow}>
            <Pressable style={styles.avatarWrap} onPress={() => router.push(ROUTES.tabs.profile)}>
              <View style={styles.avatarCore}>
                <Text style={styles.avatarText}>AL</Text>
              </View>
              <View style={styles.levelChip}>
                <Text style={styles.levelText}>24</Text>
              </View>
            </Pressable>

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

          <Text style={styles.pageTitle}>ODULLER</Text>

          <View style={styles.segmentedRow}>
            <Pressable style={[styles.segmentBtn, styles.segmentBtnActive]}>
              <Gift size={14} color="#6CEFFF" />
              <Text style={[styles.segmentText, styles.segmentTextActive]}>Sandiklar</Text>
            </Pressable>
            <Pressable style={styles.segmentBtn}>
              <ShieldCheck size={14} color="#8B98A8" />
              <Text style={styles.segmentText}>Gunluk Gorevler</Text>
            </Pressable>
            <Pressable style={styles.segmentBtn}>
              <BadgeCheck size={14} color="#8B98A8" />
              <Text style={styles.segmentText}>Basarimlar</Text>
            </Pressable>
          </View>

          <View style={styles.chestsRow}>
            {CHESTS.map((chest) => {
              const tone = chestTone(chest.tone);
              return (
                <View key={chest.id} style={[styles.chestCard, { borderColor: tone.border, backgroundColor: tone.glow }]}>
                  <Text style={styles.chestTitle}>{chest.title}</Text>
                  <View style={[styles.chestArt, { borderColor: tone.border }]}>
                    <Gift size={34} color={tone.text} />
                  </View>
                  <View style={styles.timerPill}>
                    <Clock3 size={12} color="#66EFFF" />
                    <Text style={styles.timerText}>{chest.timer}</Text>
                  </View>
                  <Pressable style={styles.openBtn}>
                    <Text style={styles.openBtnText}>HEMEN AC</Text>
                    <View style={styles.gemCostRow}>
                      <Gem size={11} color="#7CEB73" fill="#7CEB73" />
                      <Text style={styles.gemCostText}>{chest.cost}</Text>
                    </View>
                  </Pressable>
                </View>
              );
            })}
          </View>

          <View style={styles.slotNotice}>
            <View style={styles.slotNoticeLeft}>
              <Gift size={18} color="#88D9FF" />
              <Text style={styles.slotNoticeText}>Sandik slotu bekleme suresini ortadan kaldir. Ek slot acarak daha fazla sandigi ayni anda acabilirsin.</Text>
            </View>
            <Pressable style={styles.slotBtn}>
              <SquarePlus size={14} color="#66F2FF" />
              <View>
                <Text style={styles.slotBtnTitle}>EK SLOT AC</Text>
                <View style={styles.gemCostRow}>
                  <Gem size={11} color="#7CEB73" fill="#7CEB73" />
                  <Text style={styles.gemCostText}>250</Text>
                </View>
              </View>
            </Pressable>
          </View>

          <View style={styles.sectionHeadRow}>
            <Text style={styles.sectionTitle}>SANDIK ICERIKLERI</Text>
            <CircleHelp size={14} color="#7D8998" />
          </View>

          <View style={styles.contentsRow}>
            {CHESTS.map((chest) => {
              const tone = chestTone(chest.tone);
              return (
                <View key={`${chest.id}-content`} style={[styles.contentCard, { borderColor: tone.border }]}>
                  <Text style={styles.contentCardTitle}>{chest.title}</Text>
                  <Text style={[styles.contentCardSubtitle, { color: tone.text }]}>
                    {chest.tone === "normal" ? "Yaygin" : chest.tone === "rare" ? "Nadir" : chest.tone === "epic" ? "Destansi" : "Efsanevi"}
                  </Text>
                  <View style={styles.contentChestIconWrap}>
                    <Gift size={30} color={tone.text} />
                  </View>
                  <Text style={styles.contentLine}>Coin 200 - 20.000</Text>
                  <Text style={styles.contentLine}>XP 50 - 3.000</Text>
                  <Text style={styles.contentLine}>Gem %5 - %40</Text>
                  <Text style={styles.contentLine}>Kart 1 - 10</Text>
                </View>
              );
            })}
          </View>

          <Text style={styles.smallInfoText}>Kesin oranlar sandik acilimi aninda belirlenir. Daha fazla bilgi icin dokunun.</Text>

          <View style={styles.sectionHeadRow}>
            <Text style={styles.sectionTitle}>GERCEK DUNYA ODULLERI</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.realRewardsRow}>
            {REAL_REWARDS.map((reward) => (
              <View key={reward.id} style={styles.realRewardCard}>
                <View style={styles.realRewardIconWrap}>{reward.icon}</View>
                <Text style={styles.realRewardTitle}>{reward.title}</Text>
                <Text style={styles.realRewardChance}>{reward.chance}</Text>
              </View>
            ))}
          </ScrollView>
        </ScrollView>

        <BottomTabBar<BottomKey>
          tabs={bottomTabs}
          activeKey="rewards"
          onTabPress={(key) => {
            if (key === "map") router.push(ROUTES.tabs.map);
            if (key === "leaderboard") router.push(ROUTES.tabs.leaderboard);
            if (key === "rewards") return;
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
    backgroundColor: "rgba(2, 9, 16, 0.35)",
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
  pageTitle: {
    color: "#F4F7FB",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 43,
    letterSpacing: 0.4,
    marginTop: 4,
  },
  segmentedRow: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  segmentBtnActive: {
    borderWidth: 1,
    borderColor: "rgba(16, 244, 232, 0.52)",
    backgroundColor: "rgba(16, 244, 232, 0.12)",
  },
  segmentText: {
    color: "#8B98A8",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 17,
  },
  segmentTextActive: {
    color: "#6CEFFF",
  },
  chestsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 7,
  },
  chestCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
    gap: 7,
  },
  chestTitle: {
    color: "#F2F6FB",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 12,
  },
  chestArt: {
    height: 84,
    borderRadius: 11,
    borderWidth: 1,
    backgroundColor: "rgba(4, 11, 20, 0.84)",
    alignItems: "center",
    justifyContent: "center",
  },
  timerPill: {
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    backgroundColor: "rgba(8, 18, 28, 0.8)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  timerText: {
    color: "#C9D4E0",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
  },
  openBtn: {
    height: 46,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "rgba(16, 244, 232, 0.42)",
    backgroundColor: "rgba(16, 244, 232, 0.11)",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  openBtnText: {
    color: "#6CEFFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 11,
  },
  gemCostRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  gemCostText: {
    color: "#8EF38E",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 15,
  },
  slotNotice: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  slotNoticeLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  slotNoticeText: {
    flex: 1,
    color: "#B5C2D0",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
    lineHeight: 14,
  },
  slotBtn: {
    width: 96,
    height: 54,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(16, 244, 232, 0.55)",
    backgroundColor: "rgba(16, 244, 232, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    flexDirection: "row",
  },
  slotBtnTitle: {
    color: "#89F5FF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 10,
  },
  sectionHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    color: "#ECF2F9",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 31,
  },
  contentsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 6,
  },
  contentCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "rgba(8, 18, 28, 0.82)",
    paddingVertical: 8,
    paddingHorizontal: 7,
    alignItems: "center",
    gap: 2,
  },
  contentCardTitle: {
    color: "#F2F6FB",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 10,
  },
  contentCardSubtitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 10,
    marginBottom: 3,
  },
  contentChestIconWrap: {
    width: "100%",
    height: 66,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    backgroundColor: "rgba(4, 11, 20, 0.84)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  contentLine: {
    width: "100%",
    color: "#B9C5D1",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
    lineHeight: 13,
  },
  smallInfoText: {
    color: "#6F7C8B",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 10,
    textAlign: "center",
    marginTop: 2,
  },
  realRewardsRow: {
    gap: 7,
    paddingRight: 6,
  },
  realRewardCard: {
    width: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 4,
  },
  realRewardIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  realRewardTitle: {
    color: "#ECF2F9",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 12,
    textAlign: "center",
  },
  realRewardChance: {
    color: "#8FD6FF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 16,
  },
});
