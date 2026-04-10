import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Shield, Zap, Radar, Shirt } from "lucide-react-native";
import { Colors } from "@/constants/colors";
const IN_GAME_ITEMS = [
  {
    id: 1,
    name: "Kalkan",
    icon: Shield,
    price: 9,
    desc: "5 saniye dokunulmazlık",
  },
  { id: 2, name: "Hız", icon: Zap, price: 9, desc: "2x hız artışı" },
  { id: 3, name: "Radar", icon: Radar, price: 9, desc: "Rakip konumunu gör" },
  { id: 4, name: "Skin", icon: Shirt, price: 19, desc: "Özel görünüm" },
];
const PRODUCTS = [
  {
    id: 1,
    name: "AlanGO T-Shirt",
    price: "₺249",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
  },
  {
    id: 2,
    name: "Suluk Matara",
    price: "₺149",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200",
  },
  {
    id: 3,
    name: "Spor Çanta",
    price: "₺399",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200",
  },
  {
    id: 4,
    name: "Şapka",
    price: "₺129",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200",
  },
];
export default function StoreScreen() {
  const [activeTab, setActiveTab] = useState<"game" | "products">("game");
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mağaza</Text>
        <View style={styles.coinBadge}>
          <Text style={styles.coinAmount}>1,250</Text>
          <Text style={styles.coinIcon}>🪙</Text>
        </View>
      </View>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "game" && styles.activeTab]}
          onPress={() => setActiveTab("game")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "game" && styles.activeTabText,
            ]}
          >
            Oyun İçi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "products" && styles.activeTab]}
          onPress={() => setActiveTab("products")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "products" && styles.activeTabText,
            ]}
          >
            Ürünler
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === "game" ? (
        <ScrollView contentContainerStyle={styles.gameContent}>
          <View style={styles.itemsGrid}>
            {IN_GAME_ITEMS.map((item) => (
              <TouchableOpacity key={item.id} style={styles.itemCard}>
                <View style={styles.itemIconContainer}>
                  <item.icon size={32} color={Colors.primary} />
                </View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>₺{item.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.premiumCard}>
            <Text style={styles.premiumTitle}>Premium Üyelik</Text>
            <Text style={styles.premiumSubtitle}>
              Tüm itemler + reklamsız deneyim
            </Text>
            <TouchableOpacity style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>₺29.99/ay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContent}
        >
          {PRODUCTS.map((product) => (
            <TouchableOpacity key={product.id} style={styles.productCard}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
              </View>
              <TouchableOpacity style={styles.examineButton}>
                <Text style={styles.examineText}>İncele</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
  coinBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  coinAmount: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary },
  coinIcon: { fontSize: 16 },
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
  tabText: { fontSize: 15, fontWeight: "500", color: Colors.textSecondary },
  activeTabText: { color: Colors.background, fontWeight: "600" },
  gameContent: { paddingHorizontal: 20, paddingBottom: 100 },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  itemCard: {
    width: "48%",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: "center",
  },
  itemIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 240, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 12,
  },
  priceBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceText: { fontSize: 14, fontWeight: "bold", color: Colors.background },
  premiumCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: "center",
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 6,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  premiumButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  premiumButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.background,
  },
  productsContent: { paddingHorizontal: 16, gap: 12, paddingBottom: 100 },
  productCard: {
    width: 180,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  productImage: { width: "100%", height: 180, resizeMode: "cover" },
  productInfo: { padding: 12 },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  productPrice: { fontSize: 16, fontWeight: "bold", color: Colors.primary },
  examineButton: {
    margin: 12,
    marginTop: 0,
    backgroundColor: Colors.surfaceBorder,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  examineText: { fontSize: 14, fontWeight: "500", color: Colors.textPrimary },
});
