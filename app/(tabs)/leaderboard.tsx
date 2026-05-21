import { useState } from "react";
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Building2, ChevronDown, ChevronRight, Clock3, Crown, Globe, Shield, Users } from "lucide-react-native";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { ROUTES } from "@/constants/routes";
import { theme } from "@/constants/theme";
type SekmeKey = "genel" | "sehrim" | "arkadaslarim" | "klanlar";

type PodiumPlayer = {
  rank: 1 | 2 | 3;
  name: string;
  city: string;
  area: string;
  level: number;
  avatar: number;
};

type SiralamaItem = {
  sira: number;
  isim: string;
  sehir: string;
  m2: string;
  sv: number;
  avatar: number;
  ben: boolean;
};

const PODIUM_PLAYERS: PodiumPlayer[] = [
  {
    rank: 2,
    name: "NeonQueen",
    city: "Ankara",
    area: "98.750 m²",
    level: 22,
    avatar: require("../../assets/images/avatars/avatar_pilot.png"),
  },
  {
    rank: 1,
    name: "ShadowWalker",
    city: "İstanbul",
    area: "125.430 m²",
    level: 24,
    avatar: require("../../assets/images/avatars/avatar_rookie.png"),
  },
  {
    rank: 3,
    name: "ZoneMaster",
    city: "İzmir",
    area: "87.160 m²",
    level: 20,
    avatar: require("../../assets/images/avatars/avatar_sniper.png"),
  },
];

const SIRALAMA: SiralamaItem[] = [
  { sira: 4, isim: "CNRman (Sen)", sehir: "Antalya", m2: "72.540", sv: 19, avatar: require("../../assets/images/avatars/avatar_sniper.png"), ben: true },
  { sira: 5, isim: "VioletStorm", sehir: "Bursa", m2: "65.230", sv: 18, avatar: require("../../assets/images/avatars/avatar_rookie.png"), ben: false },
  { sira: 6, isim: "RoadRunner", sehir: "Konya", m2: "61.080", sv: 18, avatar: require("../../assets/images/avatars/avatar_soldier.png"), ben: false },
  { sira: 7, isim: "MetroKing", sehir: "Adana", m2: "58.310", sv: 17, avatar: require("../../assets/images/avatars/avatar_elite.png"), ben: false },
  { sira: 8, isim: "SkyLine", sehir: "Gaziantep", m2: "52.470", sv: 16, avatar: require("../../assets/images/avatars/avatar_pilot.png"), ben: false },
  { sira: 9, isim: "GreenArrow", sehir: "Samsun", m2: "49.860", sv: 16, avatar: require("../../assets/images/avatars/avatar_rookie.png"), ben: false },
  { sira: 10, isim: "NightHawk", sehir: "Trabzon", m2: "47.320", sv: 15, avatar: require("../../assets/images/avatars/avatar_sniper.png"), ben: false },
];

const LEADERBOARD_SEKMELERI: { key: SekmeKey; label: string; icon: typeof Globe }[] = [
  { key: "genel", label: "Genel", icon: Globe },
  { key: "sehrim", label: "Sehrim", icon: Building2 },
  { key: "arkadaslarim", label: "Arkadaslarim", icon: Users },
  { key: "klanlar", label: "Klanlar", icon: Shield },
];

function podiumTone(rank: 1 | 2 | 3) {
  if (rank === 1) {
    return { crown: "#FFD700", area: "#FFD700", ring: "#FFD700" };
  }
  if (rank === 2) {
    return { crown: "#C0C0C0", area: "#4FC3F7", ring: "#4FC3F7" };
  }
  return { crown: "#CD7F32", area: "#FF8A50", ring: "#FF8A50" };
}

export default function LeaderboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [aktifSekme, setAktifSekme] = useState<SekmeKey>("genel");

  return (
    <ImageBackground source={require("../../assets/images/backbos.png")} style={styles.backgroundImage} resizeMode="cover">
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 128 }]}
          showsVerticalScrollIndicator={false}
        >
          <Header
            style={styles.headerAdjust}
            onAvatarPress={() => router.push(ROUTES.tabs.profile)}
            onBellPress={() => router.push(ROUTES.tabs.notifications)}
          />

          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>LIDERLIK</Text>

            <View style={styles.seasonBlock}>
              <Pressable style={styles.seasonPill}>
                <Text style={styles.seasonPillText}>Sezon 1</Text>
                <ChevronDown size={13} color="#AEB9C6" />
              </Pressable>

              <View style={styles.seasonTimeRow}>
                <Clock3 size={12} color="#7F8FA1" />
                <Text style={styles.seasonTimeText}>Sezon bitimine: 22g 14s 32d</Text>
              </View>
            </View>
          </View>

          <View style={styles.sekmeRow}>
            {LEADERBOARD_SEKMELERI.map((sekme) => {
              const aktif = aktifSekme === sekme.key;
              const Icon = sekme.icon;

              return (
                <Pressable
                  key={sekme.key}
                  onPress={() => setAktifSekme(sekme.key)}
                  style={[styles.sekmeButon, aktif && styles.sekmeButonAktif]}
                >
                  <Icon size={13} color={aktif ? "#10F4E8" : "#8D9AA8"} />
                  <Text style={[styles.sekmeYazi, aktif && styles.sekmeYaziAktif]}>{sekme.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.podiumCard}>
            <View style={styles.playerRow}>
              {PODIUM_PLAYERS.map((player) => {
                const tone = podiumTone(player.rank);
                const isFirst = player.rank === 1;
                return (
                  <View key={player.rank} style={[styles.playerCol, isFirst && styles.playerColFirst]}>
                    <Crown size={14} color={tone.crown} />

                    <View style={[styles.avatarWrapPodium, { width: isFirst ? 64 : 56, height: isFirst ? 64 : 56, borderRadius: isFirst ? 32 : 28, borderColor: tone.ring }]}>
                      <Image source={player.avatar} style={styles.playerAvatarImage} resizeMode="cover" />
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>{player.level}</Text>
                      </View>
                    </View>

                    <Text style={styles.playerName}>{player.name}</Text>
                    <Text style={styles.playerCity}>{player.city}</Text>
                    <Text style={[styles.playerArea, { color: tone.area }]}>{player.area}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.podiumBaseWrap}>
              <Image source={require("../../assets/images/podiums/kursu.png")} style={styles.podiumBaseImage} resizeMode="contain" />
              <Text style={styles.podiumRankLeft}>2</Text>
              <Text style={styles.podiumRankCenter}>1</Text>
              <Text style={styles.podiumRankRight}>3</Text>
            </View>
          </View>

          <View style={styles.siralamaWrap}>
            {SIRALAMA.map((item) => (
              <Pressable key={item.sira} style={[styles.siraSatir, item.ben && styles.siraSatirBen]}>
                <Text style={[styles.siraNo, item.ben && styles.siraNoBen]}>{item.sira}</Text>

                <View style={[styles.siraAvatarWrap, item.ben && styles.siraAvatarWrapBen]}>
                  <Image source={item.avatar} style={styles.siraAvatar} resizeMode="cover" />
                  <View style={styles.siraSeviyeRozet}>
                    <Text style={styles.siraSeviyeText}>{item.sv}</Text>
                  </View>
                </View>

                <View style={styles.siraMeta}>
                  <Text style={[styles.siraIsim, item.ben && styles.siraIsimBen]} numberOfLines={1}>
                    {item.isim}
                  </Text>
                  <Text style={styles.siraSehir}>{item.sehir}</Text>
                </View>

                <Text style={styles.siraAlan}>
                  {item.m2}
                  <Text style={styles.siraAlanBirimi}> m²</Text>
                </Text>

                <ChevronRight size={16} color="#8D9AA8" />
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <BottomNav activeTab="leaderboard" />
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
  headerAdjust: {
    marginHorizontal: -10,
    marginTop: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 2,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 28,
    lineHeight: 32,
  },
  seasonBlock: {
    alignItems: "flex-end",
    gap: 5,
  },
  seasonPill: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.26)",
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  seasonPillText: {
    color: "#ECF2F9",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 12,
  },
  seasonTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seasonTimeText: {
    color: "#7F8FA1",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
  },
  sekmeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 7,
  },
  sekmeButon: {
    flex: 1,
    minHeight: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  sekmeButonAktif: {
    borderColor: "rgba(16, 244, 232, 0.52)",
    backgroundColor: "rgba(16, 244, 232, 0.1)",
  },
  sekmeYazi: {
    color: "#8D9AA8",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 11,
  },
  sekmeYaziAktif: {
    color: "#10F4E8",
  },
  podiumCard: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    position: "relative",
    backgroundColor: "rgba(6, 14, 26, 0.94)",
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.25)",
    overflow: "hidden",
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 10,
    marginBottom: 2,
  },
  playerCol: {
    width: "30%",
    alignItems: "center",
    gap: 3,
  },
  playerColFirst: {
    marginBottom: 18,
  },
  avatarWrapPodium: {
    marginTop: 2,
    borderWidth: 2,
    overflow: "visible",
    alignItems: "center",
    justifyContent: "center",
  },
  playerAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 99,
  },
  levelBadge: {
    position: "absolute",
    right: -3,
    top: -3,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 214, 102, 0.75)",
    backgroundColor: "rgba(8, 18, 28, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  levelBadgeText: {
    color: "#FFD85A",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 10,
  },
  playerName: {
    color: "#F2F6FB",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
    textAlign: "center",
  },
  playerCity: {
    color: "#9FB0C2",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
    textAlign: "center",
  },
  playerArea: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 15,
    textAlign: "center",
  },
  podiumBaseWrap: {
    width: "100%",
    maxWidth: "100%",
    alignSelf: "stretch",
    overflow: "hidden",
    marginTop: -30,
    position: "relative",
  },
  podiumBaseImage: {
    width: "100%",
    maxWidth: "100%",
    aspectRatio: 1000 / 296,
    height: undefined,
  },
  podiumRankLeft: {
    position: "absolute",
    left: "17%",
    bottom: "8%",
    color: "#4FC3F7",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 22,
    textAlign: "center",
  },
  podiumRankCenter: {
    position: "absolute",
    left: "50%",
    bottom: "19%",
    marginLeft: -8,
    color: "#FFD700",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 26,
    textAlign: "center",
  },
  podiumRankRight: {
    position: "absolute",
    right: "17%",
    bottom: "8%",
    color: "#FF8A50",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 22,
    textAlign: "center",
  },
  siralamaWrap: {
    marginTop: 2,
  },
  siraSatir: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "rgba(8, 18, 28, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    padding: 12,
    marginBottom: 8,
    gap: 8,
  },
  siraSatirBen: {
    borderColor: "rgba(16, 244, 232, 0.62)",
    backgroundColor: "rgba(16, 244, 232, 0.09)",
  },
  siraNo: {
    width: 30,
    color: "#AEB9C6",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 18,
    textAlign: "center",
  },
  siraNoBen: {
    color: "#10F4E8",
  },
  siraAvatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: "rgba(120, 160, 180, 0.45)",
    backgroundColor: "rgba(120, 160, 180, 0.12)",
  },
  siraAvatarWrapBen: {
    borderColor: "#10F4E8",
  },
  siraAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
  },
  siraSeviyeRozet: {
    position: "absolute",
    right: -3,
    top: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 214, 102, 0.75)",
    backgroundColor: "rgba(8, 18, 28, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  siraSeviyeText: {
    color: "#FFD85A",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 9,
  },
  siraMeta: {
    flex: 1,
    alignItems: "flex-start",
  },
  siraIsim: {
    color: "#F2F6FB",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 15,
  },
  siraIsimBen: {
    color: "#10F4E8",
  },
  siraSehir: {
    color: "#9FB0C2",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
  },
  siraAlan: {
    color: "#10F4E8",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 15,
  },
  siraAlanBirimi: {
    color: "#10F4E8",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
  },
});
