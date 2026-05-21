import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { CalendarDays, ChevronRight, Gift } from "lucide-react-native";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { ROUTES } from "@/constants/routes";
import { theme } from "@/constants/theme";

type RealReward = {
  id: string;
  img: number;
  ratio: number;
};

const GERCEK_ODULLER: RealReward[] = [
  { id: "kahve", img: require("../../assets/images/oduller/kahve.png"), ratio: 475 / 1000 },
  { id: "burger", img: require("../../assets/images/oduller/burger.png"), ratio: 479 / 1000 },
  { id: "indirim", img: require("../../assets/images/oduller/indirim.png"), ratio: 479 / 1000 },
  { id: "pods", img: require("../../assets/images/oduller/pods.png"), ratio: 481 / 1000 },
  { id: "saat", img: require("../../assets/images/oduller/saat.png"), ratio: 472 / 1000 },
  { id: "iphone", img: require("../../assets/images/oduller/iphone.png"), ratio: 475 / 1000 },
];

const OYUN_ICI_ODULLER = [
  require("../../assets/images/oduller/1aylik_odul.png"),
  require("../../assets/images/oduller/3aylik_odul.png"),
  require("../../assets/images/oduller/legendary_odul.png"),
  require("../../assets/images/oduller/epic_odul.png"),
  require("../../assets/images/oduller/10_odul.png"),
  require("../../assets/images/oduller/5_odul.png"),
  require("../../assets/images/oduller/500elmas_odul.png"),
  require("../../assets/images/oduller/100elmas_odul.png"),
];

const NASIL_KAZANILIR = [
  require("../../assets/images/oduller/alanfethet.png"),
  require("../../assets/images/oduller/gunlukgorev.png"),
  require("../../assets/images/oduller/etkinlik.png"),
];

const SON_KAZANANLAR = [
  require("../../assets/images/oduller/ahmety.png"),
  require("../../assets/images/oduller/mervek.png"),
  require("../../assets/images/oduller/cand.png"),
  require("../../assets/images/oduller/buset.png"),
];

export default function RewardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground source={require("../../assets/images/backbos.png")} style={styles.backgroundImage} resizeMode="cover">
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 126 }]} showsVerticalScrollIndicator={false}>
          <Header
            style={styles.headerAdjust}
            onAvatarPress={() => router.push(ROUTES.tabs.profile)}
            onBellPress={() => router.push(ROUTES.tabs.notifications)}
          />

          <View style={styles.heroBlock}>
            <View style={styles.heroLeft}>
              <View style={styles.heroTitleRow}>
                <Gift size={22} color="#10F4E8" />
                <Text style={styles.heroTitle}>ODUL MERKEZI</Text>
              </View>
              <Text style={styles.heroSubtitle}>Her hareketin odule donusur.</Text>
            </View>

            <View style={styles.monthCard}>
              <CalendarDays size={16} color="#9DF6FF" />
              <Text style={styles.monthText}>Mayis 2025</Text>
              <Text style={styles.monthMeta}>31 gun kaldi</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>BU AY DAGITILACAK GERCEK ODULLER</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rewardsScroll} contentContainerStyle={styles.rewardsRow}>
            {GERCEK_ODULLER.map((odul) => (
              <TouchableOpacity key={odul.id} activeOpacity={0.88} style={styles.rewardCard}>
                <Image source={odul.img} style={[styles.rewardImage, { aspectRatio: odul.ratio }]} resizeMode="contain" />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>BU AY DAGITILACAK OYUN ICI ODULLER</Text>

          <View style={styles.gameRewardsGrid}>
            {OYUN_ICI_ODULLER.map((odul, index) => (
              <TouchableOpacity key={`oyun-ici-odul-${index}`} activeOpacity={0.88} style={styles.gameRewardCard}>
                <Image source={odul} style={styles.gameRewardImage} resizeMode="contain" />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>NASIL KAZANILIR?</Text>

          <View style={styles.howToWinRow}>
            {NASIL_KAZANILIR.map((kart, index) => (
              <TouchableOpacity key={`nasil-kazanilir-${index}`} activeOpacity={0.88} style={styles.howToWinCard}>
                <Image source={kart} style={styles.howToWinImage} resizeMode="contain" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.winnersHeadRow}>
            <Text style={styles.sectionTitle}>SON KAZANANLAR</Text>
            <TouchableOpacity activeOpacity={0.88} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Tumunu Gor {'>'}</Text>
              <ChevronRight size={12} color="#10F4E8" />
            </TouchableOpacity>
          </View>

          <View style={styles.winnersGrid}>
            {SON_KAZANANLAR.map((kazanan, index) => (
              <TouchableOpacity
                key={`son-kazanan-${index}`}
                activeOpacity={0.88}
                style={[styles.winnerCard, index === 0 && styles.winnerCardAhmet]}
              >
                <Image source={kazanan} style={styles.winnerImage} resizeMode="contain" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <BottomNav activeTab="rewards" />
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
  headerAdjust: {
    marginHorizontal: -10,
    marginTop: 2,
  },
  heroBlock: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: 10,
  },
  heroLeft: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(16, 244, 232, 0.25)",
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
    gap: 5,
  },
  heroTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  heroTitle: {
    color: "#F4F7FB",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 23,
    letterSpacing: 0.2,
  },
  heroSubtitle: {
    color: "#B9C7D5",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 14,
  },
  monthCard: {
    width: 122,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.3)",
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    gap: 4,
  },
  monthText: {
    color: "#ECF2F9",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 14,
  },
  monthMeta: {
    color: "#8EDCC4",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
  },
  sectionTitle: {
    marginTop: 8,
    color: "#55E784",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 12,
    lineHeight: 15,
  },
  rewardsScroll: {
    height: 210,
  },
  rewardsRow: {
    height: 210,
    paddingTop: 4,
    paddingRight: 8,
    alignItems: "center",
  },
  rewardCard: {
    height: 200,
    marginRight: 10,
  },
  rewardImage: {
    width: "100%",
    height: "100%",
  },
  gameRewardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gameRewardCard: {
    width: "23%",
    aspectRatio: 660 / 1000,
  },
  gameRewardImage: {
    width: "100%",
    height: "100%",
  },
  howToWinRow: {
    flexDirection: "row",
    gap: 8,
  },
  howToWinCard: {
    flex: 1,
    aspectRatio: 1,
  },
  howToWinImage: {
    width: "100%",
    height: "100%",
  },
  winnersHeadRow: {
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 2,
  },
  seeAllText: {
    color: "#10F4E8",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 12,
  },
  winnersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  winnerCard: {
    width: "48%",
    aspectRatio: 1000 / 380,
  },
  winnerCardAhmet: {
    transform: [{ scale: 1.02 }],
  },
  winnerImage: {
    width: "100%",
    height: "100%",
  },
});
