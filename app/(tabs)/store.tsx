import { useMemo, useState } from "react";
import { Image, ImageBackground, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Crown, Gift, Map, Plus, ShoppingCart, Trophy } from "lucide-react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AvatarImages, UIImages } from "@/assets/images";
import {
  PremiumCTACard,
} from "@/components/shop";
import { BottomTabBar, TopHudBar } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { theme } from "@/constants/theme";

type BottomKey = "map" | "leaderboard" | "rewards" | "store" | "premium";
type StoreMode = "dukkan" | "premium";

const powerUps = [
  { img: require("@/assets/images/boosts/boots_card.png"), fiyat: 80 },
  { img: require("@/assets/images/boosts/kalkan_card.png"), fiyat: 120 },
  { img: require("@/assets/images/boosts/radar_card.png"), fiyat: 60 },
] as const;

const sandiklar = [
  { img: require("@/assets/images/boosts/sandik_normal.png"), ratio: 433 / 689, fiyat: 12 },
  { img: require("@/assets/images/boosts/sandik_rare.png"), ratio: 435 / 689, fiyat: 28 },
  { img: require("@/assets/images/boosts/sandik_epik.png"), ratio: 434 / 689, fiyat: 72 },
  { img: require("@/assets/images/boosts/sandik_legend.png"), ratio: 445 / 689, fiyat: 120 },
] as const;

const coinPaketleri = [
  { img: require("@/assets/images/boosts/coin_2500.png"), fiyat: "₺29,99" },
  { img: require("@/assets/images/boosts/coin_6500.png"), fiyat: "₺69,99" },
  { img: require("@/assets/images/boosts/coin_15000.png"), fiyat: "₺139,99" },
  { img: require("@/assets/images/boosts/coin_35000.png"), fiyat: "₺249,99" },
  { img: require("@/assets/images/boosts/coin_75000.png"), fiyat: "₺499,99" },
] as const;

const elmasPaketleri = [
  { img: require("@/assets/images/boosts/gem200.png"), fiyat: "₺29,99" },
  { img: require("@/assets/images/boosts/gem600.png"), fiyat: "₺69,99" },
  { img: require("@/assets/images/boosts/gem1500.png"), fiyat: "₺139,99" },
  { img: require("@/assets/images/boosts/gem3200.png"), fiyat: "₺249,99" },
  { img: require("@/assets/images/boosts/gem7500.png"), fiyat: "₺499,99" },
] as const;

const premiumPaketler = [
  { img: require("@/assets/images/boosts/biraylik.png"), ratio: 654 / 1000 },
  { img: require("@/assets/images/boosts/ucaylik.png"), ratio: 616 / 1000 },
  { img: require("@/assets/images/boosts/onikiaylik.png"), ratio: 629 / 1000 },
] as const;

function PremiumContent({ bottomPadding }: { bottomPadding: number }) {
  return (
    <View style={styles.premiumBackground}>
      <ScrollView contentContainerStyle={[styles.premiumContent, { paddingBottom: bottomPadding }]} style={styles.premiumScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.premiumPaketGrid}>
          {premiumPaketler.map((paket, index) => (
            <TouchableOpacity key={`premium-paket-${index}`} activeOpacity={0.9} style={styles.premiumPaketTouch}>
              <View style={[styles.premiumPaketCard, { aspectRatio: paket.ratio }]}>
                <Image source={paket.img} style={styles.premiumPaketImage} resizeMode="contain" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.premiumSection}>
          <Text allowFontScaling={false} style={styles.premiumSectionTitle}>PREMIUM AYRICALIKLARI</Text>
          <View style={styles.privilegeCardWrap}>
            <Image source={require("@/assets/images/boosts/ayricalik.png")} style={styles.privilegeImage} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.premiumInfoBand}>
          <Text allowFontScaling={false} style={styles.premiumInfoText}>Premium tüm cihazlarda geçerlidir. Abonelik süresi boyunca tüm avantajlar aktiftir.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default function StoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [aktifSekme, setAktifSekme] = useState<StoreMode>("dukkan");

  const bottomTabs = useMemo(
    () => [
      { key: "map" as const, label: "Harita", icon: <Map size={14} color="#A9B4C0" /> },
      { key: "leaderboard" as const, label: "Liderlik", icon: <Trophy size={14} color="#A9B4C0" /> },
      { key: "rewards" as const, label: "Ödüller", icon: <Gift size={14} color="#A9B4C0" />, badgeCount: 1 },
      { key: "store" as const, label: "Dükkan", icon: <ShoppingCart size={14} color="#00E5FF" /> },
      { key: "premium" as const, label: "Premium", icon: <Crown size={14} color="#A9B4C0" />, disabled: true },
    ],
    []
  );

  return (
    <View style={styles.backgroundImage}>
      {aktifSekme !== "premium" ? (
        <ImageBackground source={require("../../assets/images/backbos.png")} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      ) : (
        <ImageBackground source={require("../../assets/images/preback.png")} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      )}
      <SafeAreaView style={[styles.container, { paddingTop: insets.top + 10 }]} edges={["top"]}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
        <View style={styles.topBarRow}>
          <TopHudBar
            onAvatarPress={() => router.push(ROUTES.tabs.profile)}
            onBellPress={() => router.push(ROUTES.tabs.notifications)}
            avatarImageSource={AvatarImages.pilot}
            avatarFrameSource={require("@/assets/images/frames/frame_cyan.png")}
            levelText="19"
            coinText="133.141"
            gemText="38"
            bellCount={1}
          />
        </View>

        <View style={[styles.segmentOuter, aktifSekme === "dukkan" ? styles.segmentOuterDukkan : styles.segmentOuterPremium]}>
          <View style={styles.segmentPill}>
            <Pressable
              onPress={() => setAktifSekme("dukkan")}
              style={[styles.segmentBtn, aktifSekme === "dukkan" && styles.segmentBtnActive]}
            >
              <Text allowFontScaling={false} style={[styles.segmentLabel, aktifSekme === "dukkan" && styles.segmentLabelActive]}>Dükkan</Text>
            </Pressable>
            <Pressable
              onPress={() => setAktifSekme("premium")}
              style={[styles.segmentBtn, aktifSekme === "premium" && styles.segmentBtnActive]}
            >
              <Text allowFontScaling={false} style={[styles.segmentLabel, aktifSekme === "premium" && styles.segmentLabelActive]}>Premium</Text>
            </Pressable>
          </View>
        </View>

        {aktifSekme === "dukkan" ? (
          <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
          <View style={[styles.section, styles.powerSection]}>
            <View style={styles.sectionTitleRow}>
              <Text allowFontScaling={false} style={[styles.sectionTitle, styles.powerTitleOffset]}>GÜÇ-UP'LAR</Text>
            </View>
            <View style={styles.powerGrid}>
              {powerUps.map((item, index) => (
                <TouchableOpacity key={`${item.fiyat}-${index}`} activeOpacity={0.9} style={styles.powerCardTouch}>
                  <View style={styles.powerCardContainer}>
                    <Image source={item.img} style={styles.powerCardImage} resizeMode="contain" />
                    <View style={styles.powerPriceTag}>
                      <Image source={UIImages.gem} style={styles.powerPriceGemIcon} resizeMode="contain" />
                      <Text allowFontScaling={false} style={styles.powerPriceText}>{item.fiyat}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text allowFontScaling={false} style={[styles.sectionTitle, styles.chestTitleOffset]}>SANDIKLAR</Text>
            </View>
            <View style={styles.chestGrid}>
              {sandiklar.map((item, index) => (
                <TouchableOpacity key={`${item.fiyat}-${index}`} activeOpacity={0.9} style={styles.chestCardTouch}>
                  <View style={[styles.chestCardContainer, { aspectRatio: item.ratio }]}>
                    <Image source={item.img} style={styles.chestCardImage} resizeMode="contain" />
                    <View style={styles.chestPriceTag}>
                      <Image source={UIImages.gem} style={styles.chestGemIcon} resizeMode="contain" />
                      <Text allowFontScaling={false} style={styles.chestPriceText}>{item.fiyat}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text allowFontScaling={false} style={[styles.sectionTitle, styles.gemTitleOffset]}>ELMAS PAKETLERİ</Text>
            </View>
            <View style={styles.gemGrid}>
              {elmasPaketleri.map((item, index) => (
                <TouchableOpacity key={`${item.fiyat}-${index}`} activeOpacity={0.9} style={styles.gemCardTouch}>
                  <View style={styles.gemCardContainer}>
                    <Image source={item.img} style={styles.gemCardImage} resizeMode="contain" />
                    <View style={styles.gemPriceTag}>
                      <Text allowFontScaling={false} style={styles.gemPriceText}>{item.fiyat}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text allowFontScaling={false} style={[styles.sectionTitle, styles.coinTitleOffset]}>COIN PAKETLERİ</Text>
            </View>
            <View style={styles.coinGrid}>
              {coinPaketleri.map((item, index) => (
                <TouchableOpacity key={`${item.fiyat}-${index}`} activeOpacity={0.9} style={styles.coinCardTouch}>
                  <View style={styles.coinCardContainer}>
                    <Image source={item.img} style={styles.coinCardImage} resizeMode="contain" />
                    <View style={styles.coinPriceTag}>
                      <Text allowFontScaling={false} style={styles.coinPriceText}>{item.fiyat}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

            <View style={styles.section}>
              <PremiumCTACard />
            </View>
          </ScrollView>
        ) : (
          <View style={styles.premiumContentWrap}>
            <PremiumContent bottomPadding={insets.bottom + 110} />
          </View>
        )}

        <BottomTabBar<BottomKey>
          tabs={bottomTabs}
          activeKey={aktifSekme === "premium" ? "premium" : "store"}
          onTabPress={(key) => {
            if (key === "map") router.push(ROUTES.tabs.map);
            if (key === "leaderboard") router.push(ROUTES.tabs.leaderboard);
            if (key === "rewards") router.push(ROUTES.tabs.missions);
            if (key === "store") setAktifSekme("dukkan");
            if (key === "premium") setAktifSekme("premium");
          }}
        />
      </SafeAreaView>
    </View>
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
    paddingHorizontal: 7,
    gap: 10,
    marginTop: 1,
  },
  topBarRow: {
    paddingHorizontal: 7,
    marginTop: -30,
  },
  segmentOuter: {
    paddingHorizontal: 12,
    marginTop: 8,
  },
  segmentOuterDukkan: {
    marginBottom: 30,
  },
  segmentOuterPremium: {
    marginBottom: 150,
  },
  segmentPill: {
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    borderRadius: 14,
    padding: 2,
    flexDirection: "row",
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    minHeight: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  segmentBtnActive: {
    borderColor: "#10F4E8",
    backgroundColor: "rgba(16, 244, 232, 0.1)",
  },
  segmentLabel: {
    color: "#A9B4C0",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 13,
  },
  segmentLabelActive: {
    color: "#D9FFFF",
  },
  avatarWrap: {
    width: 66,
    height: 66,
    borderRadius: 33,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    borderWidth: 1.5,
    borderColor: "rgba(16, 244, 232, 0.85)",
    backgroundColor: "rgba(8, 18, 28, 0.65)",
    shadowColor: "#10F4E8",
    shadowOpacity: 0.42,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    elevation: 4,
  },
  avatarImage: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
    left: 7,
    top: 7,
    zIndex: 1,
  },
  avatarFrame: {
    width: 66,
    height: 66,
    zIndex: 2,
  },
  levelBadgeSmall: {
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
    zIndex: 3,
  },
  levelBadgeSmallText: {
    color: "#FFFFFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 16,
  },
  counterPill: {
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
  counterIcon: {
    width: 22,
    height: 22,
  },
  counterText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  plusButton: {
    alignItems: "center",
    justifyContent: "center",
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
    position: "relative",
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
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.bold,
  },
  content: {
    paddingTop: 12,
    paddingHorizontal: 12,
    gap: 12,
  },
  premiumContentWrap: {
    flex: 1,
  },
  premiumBackground: {
    flex: 1,
  },
  premiumScroll: {
    flex: 1,
    backgroundColor: "transparent",
  },
  premiumContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 14,
  },
  premiumSection: {
    gap: 10,
  },
  premiumSectionTitle: {
    color: "#58F5B4",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginTop: 15,
  },
  privilegeCardWrap: {
    width: "100%",
    aspectRatio: 1341 / 982,
  },
  privilegeImage: {
    width: "100%",
    height: "100%",
  },
  premiumPaketGrid: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  premiumPaketTouch: {
    flex: 1,
  },
  premiumPaketCard: {
    width: "100%",
    position: "relative",
  },
  premiumPaketImage: {
    width: "100%",
    height: "100%",
  },
  premiumInfoBand: {
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    backgroundColor: "rgba(8, 18, 28, 0.68)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  premiumInfoText: {
    color: "#C6D4DF",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
  },
  pageTitle: {
    color: "#FFFFFF",
    fontSize: 46,
    lineHeight: 50,
    fontFamily: theme.typography.fontFamily.bold,
  },
  section: {
    gap: 0,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e8f4ff",
    letterSpacing: 0.5,
  },
  powerTitleOffset: {
    transform: [{ translateY: 20 }],
  },
  chestTitleOffset: {
    transform: [{ translateY: 20 }],
  },
  coinTitleOffset: {
    transform: [{ translateY: 20 }],
  },
  gemTitleOffset: {
    transform: [{ translateY: 20 }],
  },
  powerInfoOffset: {
    marginTop: 10,
  },
  chestInfoOffset: {
    marginTop: 10,
  },
  sectionInfoIcon: {
    marginLeft: 6,
  },
  powerSection: {
    marginBottom: 8,
  },
  powerGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
  },
  powerCardTouch: {
    flex: 1,
  },
  powerCardContainer: {
    width: "100%",
    aspectRatio: 540 / 824,
    position: "relative",
  },
  powerCardImage: {
    width: "100%",
    height: "100%",
  },
  powerPriceTag: {
    position: "absolute",
    bottom: "5%",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  powerPriceGemIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
  },
  powerPriceText: {
    color: "#cfe9f2",
    fontWeight: "700",
    fontSize: 18,
  },
  chestGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
  },
  chestCardTouch: {
    flex: 1,
  },
  chestCardContainer: {
    width: "100%",
    position: "relative",
  },
  chestCardImage: {
    width: "100%",
    height: "100%",
  },
  chestPriceTag: {
    position: "absolute",
    bottom: "5%",
    left: 0,
    right: 0,
    paddingRight: "12%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  chestGemIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
  },
  chestPriceText: {
    color: "#cfe9f2",
    fontWeight: "700",
    fontSize: 16,
  },
  coinGrid: {
    flexDirection: "row",
    gap: 6,
    marginTop: 20,
  },
  gemGrid: {
    flexDirection: "row",
    gap: 6,
    marginTop: 20,
  },
  coinCardTouch: {
    flex: 1,
  },
  gemCardTouch: {
    flex: 1,
  },
  coinCardContainer: {
    width: "100%",
    aspectRatio: 350 / 594,
    position: "relative",
  },
  gemCardContainer: {
    width: "100%",
    aspectRatio: 311 / 615,
    position: "relative",
  },
  coinCardImage: {
    width: "100%",
    height: "100%",
  },
  gemCardImage: {
    width: "100%",
    height: "100%",
  },
  coinPriceTag: {
    position: "absolute",
    bottom: "4%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  gemPriceTag: {
    position: "absolute",
    bottom: "4%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  coinPriceText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
  gemPriceText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
});
