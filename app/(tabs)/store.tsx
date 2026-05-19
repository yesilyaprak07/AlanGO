import { useMemo } from "react";
import { FlatList, Image, ImageBackground, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Bell, Gift, Map, Plus, ShoppingCart, Trophy } from "lucide-react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AvatarImages, BoostImages, ChestImages, CoinImages, UIImages } from "@/assets/images";
import {
  BoostCard,
  ChestCard,
  CoinPackCard,
  ExtraSlotCard,
  PremiumCTACard,
  SectionHeader,
} from "@/components/shop";
import { BottomTabBar } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { theme } from "@/constants/theme";

type BottomKey = "map" | "leaderboard" | "rewards" | "store";

type PowerItem = {
  id: string;
  title: string;
  description: string;
  asset: ReturnType<typeof require>;
  price: number;
  accentColor: string;
};

type ChestItem = {
  id: string;
  title: string;
  rarity: string;
  rarityColor: string;
  asset: ReturnType<typeof require>;
  duration: string;
  price: number;
};

type CoinPackItem = {
  id: string;
  amount: string;
  asset: ReturnType<typeof require>;
  price: string;
  extraLabel?: string;
  highlightGold?: boolean;
};

const POWER_ITEMS: PowerItem[] = [
  {
    id: "speed",
    title: "Hız Boost x2",
    description: "5 dakika boyunca hat çizim hızını 2 katına çıkarır.",
    asset: BoostImages.speed,
    price: 80,
    accentColor: "#00E5FF",
  },
  {
    id: "shield",
    title: "Kalkan",
    description: "3 dakika boyunca hat kesilmeye karşı koruma sağlar.",
    asset: BoostImages.shield,
    price: 120,
    accentColor: "#00FF88",
  },
  {
    id: "radar",
    title: "Radar",
    description: "800m çevredeki aktif oyuncuları gösterir.",
    asset: BoostImages.radar,
    price: 60,
    accentColor: "#A855F7",
  },
];

const CHEST_ITEMS: ChestItem[] = [
  {
    id: "normal",
    title: "Normal Sandık",
    rarity: "Yaygın",
    rarityColor: "#00E5FF",
    asset: ChestImages.normal,
    duration: "02:15",
    price: 12,
  },
  {
    id: "rare",
    title: "Rare Sandık",
    rarity: "Nadir",
    rarityColor: "#3B82F6",
    asset: ChestImages.rare,
    duration: "22:30",
    price: 28,
  },
  {
    id: "epic",
    title: "Epic Sandık",
    rarity: "Destansı",
    rarityColor: "#A855F7",
    asset: ChestImages.epic,
    duration: "02:45:15",
    price: 72,
  },
  {
    id: "legendary",
    title: "Legendary Sandık",
    rarity: "Efsanevi",
    rarityColor: "#FFD700",
    asset: ChestImages.legendary,
    duration: "07:59:40",
    price: 120,
  },
];

const COIN_PACKS: CoinPackItem[] = [
  { id: "2500", amount: "2.500", asset: CoinImages.pack_2500, price: "₺29,99" },
  { id: "6500", amount: "6.500", asset: CoinImages.pack_6500, price: "₺69,99", extraLabel: "%10\nEKSTRA" },
  { id: "15000", amount: "15.000", asset: CoinImages.pack_15000, price: "₺139,99", extraLabel: "%20\nEKSTRA" },
  { id: "35000", amount: "35.000", asset: CoinImages.pack_35000, price: "₺249,99", extraLabel: "%30\nEKSTRA" },
  { id: "75000", amount: "75.000", asset: CoinImages.pack_75000, price: "₺499,99", extraLabel: "%50\nEKSTRA", highlightGold: true },
];

export default function StoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const bottomTabs = useMemo(
    () => [
      { key: "map" as const, label: "Harita", icon: <Map size={14} color="#A9B4C0" /> },
      { key: "leaderboard" as const, label: "Liderlik", icon: <Trophy size={14} color="#A9B4C0" /> },
      { key: "rewards" as const, label: "Ödüller", icon: <Gift size={14} color="#A9B4C0" />, badgeCount: 1 },
      { key: "store" as const, label: "Dükkan", icon: <ShoppingCart size={14} color="#00E5FF" /> },
    ],
    []
  );

  return (
    <ImageBackground source={require("../../assets/images/backbos.png")} style={styles.backgroundImage} resizeMode="cover">
      <SafeAreaView style={[styles.container, { paddingTop: insets.top + 10 }]} edges={["top"]}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
        <View style={styles.topBar}>
          <View style={styles.profileBlock}>
            <View style={styles.avatarWrap}>
              <Image source={AvatarImages.pilot} style={styles.avatarImage} resizeMode="cover" />
              <View style={styles.levelBadgeSmall}>
                <Text style={styles.levelBadgeSmallText}>19</Text>
              </View>
            </View>

            <View style={styles.levelBarWrap}>
              <View style={styles.levelHex}>
                <Text style={styles.levelHexText}>19</Text>
              </View>
              <View style={styles.xpWrap}>
                <View style={styles.xpBar}>
                  <View style={styles.xpFill} />
                </View>
                <View style={styles.xpMeta}>
                  <Text style={styles.xpValue}>202/1200</Text>
                  <Text style={styles.xpLabel}>XP</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.counterGroup}>
            <View style={styles.counterPill}>
              <Image source={UIImages.coin} style={styles.counterIcon} resizeMode="contain" />
              <Text style={styles.counterText}>133.141</Text>
              <Pressable style={styles.plusButton}>
                <Plus size={12} color="#00E5FF" strokeWidth={2.2} />
              </Pressable>
            </View>

            <View style={styles.counterPill}>
              <Image source={UIImages.gem} style={styles.counterIcon} resizeMode="contain" />
              <Text style={styles.counterText}>38</Text>
              <Pressable style={styles.plusButton}>
                <Plus size={12} color="#00E5FF" strokeWidth={2.2} />
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.bellButton} onPress={() => router.push(ROUTES.tabs.notifications)}>
            <Bell size={18} color="#FFFFFF" />
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>1</Text>
            </View>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
          <Text style={styles.pageTitle}>DÜKKAN</Text>

          <View style={styles.section}>
            <SectionHeader title="GÜÇ-UP'LAR" />
            <View style={styles.powerGrid}>
              {POWER_ITEMS.map((item) => (
                <BoostCard
                  key={item.id}
                  title={item.id === "speed" ? "Hız Boost" : item.title}
                  description={item.description}
                  asset={item.asset}
                  price={item.price}
                  accentColor={item.accentColor}
                  badgeText={item.id === "speed" ? "x2" : undefined}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <SectionHeader title="SANDIKLAR" />
            <View style={styles.chestGrid}>
              {CHEST_ITEMS.map((item) => (
                <ChestCard
                  key={item.id}
                  style={styles.chestCard}
                  title={item.title}
                  rarity={item.rarity}
                  rarityColor={item.rarityColor}
                  asset={item.asset}
                  duration={item.duration}
                  price={item.price}
                />
              ))}
            </View>
            <View style={styles.extraSlotWrap}>
              <ExtraSlotCard />
            </View>
          </View>

          <View style={styles.section}>
            <SectionHeader title="COIN PAKETLERİ" />
            <FlatList
              data={COIN_PACKS}
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CoinPackCard
                  amount={item.amount}
                  asset={item.asset}
                  price={item.price}
                  extraLabel={item.extraLabel}
                  highlightGold={item.highlightGold}
                />
              )}
              showsHorizontalScrollIndicator={false}
              snapToInterval={140}
              decelerationRate="fast"
              contentContainerStyle={styles.coinList}
            />
          </View>

          <View style={styles.section}>
            <PremiumCTACard />
          </View>
        </ScrollView>

        <BottomTabBar<BottomKey>
          tabs={bottomTabs}
          activeKey="store"
          onTabPress={(key) => {
            if (key === "map") router.push(ROUTES.tabs.map);
            if (key === "leaderboard") router.push(ROUTES.tabs.leaderboard);
            if (key === "rewards") router.push(ROUTES.tabs.missions);
            if (key === "store") return;
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    gap: 8,
  },
  profileBlock: {
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  avatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.45)",
    overflow: "visible",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 27,
  },
  levelBadgeSmall: {
    position: "absolute",
    right: -3,
    top: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#00E5FF",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  levelBadgeSmallText: {
    color: "#052638",
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.bold,
  },
  levelBarWrap: {
    width: 130,
    minHeight: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.28)",
    backgroundColor: "rgba(10, 14, 39, 0.9)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    gap: 6,
  },
  levelHex: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "rgba(147, 197, 253, 0.8)",
    backgroundColor: "rgba(96, 165, 250, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  levelHexText: {
    color: "#E0F2FE",
    fontSize: 12,
    lineHeight: 12,
    fontFamily: theme.typography.fontFamily.bold,
  },
  xpWrap: {
    flex: 1,
    gap: 3,
  },
  xpBar: {
    width: "100%",
    height: 8,
    borderRadius: 6,
    backgroundColor: "rgba(148, 163, 184, 0.25)",
    overflow: "hidden",
  },
  xpFill: {
    width: "17%",
    height: "100%",
    backgroundColor: "#22D3EE",
  },
  xpMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  xpValue: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  xpLabel: {
    color: "#94A3B8",
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.medium,
  },
  counterGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  counterPill: {
    minWidth: 84,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.3)",
    backgroundColor: "rgba(10, 14, 39, 0.9)",
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  counterIcon: {
    width: 18,
    height: 18,
  },
  counterText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  plusButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.3)",
    backgroundColor: "rgba(10, 14, 39, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bellBadge: {
    position: "absolute",
    right: -3,
    top: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  bellBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.bold,
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: 16,
    gap: 24,
  },
  pageTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontFamily: theme.typography.fontFamily.bold,
  },
  section: {
    gap: 0,
  },
  powerGrid: {
    flexDirection: "row",
    gap: 10,
  },
  chestGrid: {
    flexDirection: "row",
    gap: 10,
  },
  chestCard: {
    flex: 1,
  },
  extraSlotWrap: {
    marginTop: 12,
  },
  horizontalList: {
    gap: 10,
    paddingRight: 4,
  },
  coinList: {
    paddingHorizontal: 16,
    gap: 10,
    marginHorizontal: -16,
  },
});
