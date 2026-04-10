import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, TrendingUp, Users, Map, Flame } from "lucide-react-native";
import { Colors } from "@/constants/colors";
const CATEGORIES = [
  { id: "trending", name: "Trend", icon: TrendingUp },
  { id: "popular", name: "Popüler", icon: Flame },
  { id: "nearby", name: "Yakınında", icon: Map },
  { id: "social", name: "Sosyal", icon: Users },
];
const TERRITORIES = [
  {
    id: 1,
    name: "Kaleiçi Meydanı",
    owner: "KaraKurt",
    area: "5.420 m²",
    players: 12,
  },
  {
    id: 2,
    name: "Lara Sahili",
    owner: "SahilKral",
    area: "8.120 m²",
    players: 24,
  },
  { id: 3, name: "Konyaaltı", owner: "Plajcı", area: "6.800 m²", players: 18 },
  {
    id: 4,
    name: "MarkAntalya",
    owner: "AVMKral",
    area: "3.200 m²",
    players: 8,
  },
  {
    id: 5,
    name: "Dedeman Park",
    owner: "Parkcı",
    area: "4.500 m²",
    players: 6,
  },
];
export default function DiscoverScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Keşfet</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity key={cat.id} style={styles.categoryButton}>
            <cat.icon size={18} color={Colors.primary} />
            <Text style={styles.categoryText}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Popüler Bölgeler</Text>
        {TERRITORIES.map((territory) => (
          <TouchableOpacity key={territory.id} style={styles.territoryCard}>
            <View style={styles.territoryInfo}>
              <Text style={styles.territoryName}>{territory.name}</Text>
              <View style={styles.territoryMeta}>
                <View style={styles.ownerBadge}>
                  <Text style={styles.ownerText}>@{territory.owner}</Text>
                </View>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>{territory.area}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>
                  {territory.players} oyuncu
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinText}>Katıl</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        <View style={styles.eventCard}>
          <View style={styles.eventBadge}>
            <Text style={styles.eventBadgeText}>YAKINDA</Text>
          </View>
          <Text style={styles.eventTitle}>Antalya Tur Turnuvası</Text>
          <Text style={styles.eventSubtitle}>
            100+ oyuncu • 50.000 m² ödül havuzu
          </Text>
          <TouchableOpacity style={styles.eventButton}>
            <Text style={styles.eventButtonText}>Kayıt Ol</Text>
          </TouchableOpacity>
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
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: "bold", color: Colors.textPrimary },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  categoriesContainer: { maxHeight: 56, marginBottom: 8 },
  categoriesContent: { paddingHorizontal: 16, gap: 8 },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: 8,
  },
  categoryText: { fontSize: 14, fontWeight: "500", color: Colors.textPrimary },
  content: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  territoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  territoryInfo: { flex: 1 },
  territoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  territoryMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  ownerBadge: {
    backgroundColor: "rgba(0, 240, 255, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ownerText: { fontSize: 12, color: Colors.primary, fontWeight: "500" },
  metaDot: { fontSize: 12, color: Colors.textSecondary, marginHorizontal: 6 },
  metaText: { fontSize: 12, color: Colors.textSecondary },
  joinButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinText: { fontSize: 14, fontWeight: "600", color: Colors.background },
  eventCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  eventBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  eventBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.background,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  eventSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  eventButton: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  eventButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.background,
  },
});
