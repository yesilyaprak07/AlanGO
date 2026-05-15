import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";

type Category = "all" | "defense" | "attack" | "style";

const DEFENSE_ITEMS = [
  { id: 1, name: "Kalkan", icon: "🛡️", desc: "2 saat dokunulmaz", price: 120, unit: "🔗", popular: true, color: Colors.emerald },
  { id: 2, name: "Radar+", icon: "📡", desc: "500m tarama", price: 80, unit: "🔗", color: Colors.cyan },
];

const ATTACK_ITEMS = [
  { id: 3, name: "Kılıç+", icon: "⚔️", desc: "Güçlü kesim modu", price: 160, unit: "🔗", popular: true, color: Colors.coral },
  { id: 4, name: "Hız Boost", icon: "⚡", desc: "2x hız · 30dk", price: 90, unit: "🔗", color: Colors.gold },
];

const STYLE_ITEMS = [
  { id: 5, name: "Cyan Skin", icon: "🎨", desc: "Bölge görünümü", price: 300, unit: "🔗", color: Colors.cyan },
  { id: 6, name: "Komutan", icon: "👑", desc: "VIP çerçeve", price: 500, unit: "🔗", color: Colors.gold },
];

function ItemCard({ item }: { item: typeof DEFENSE_ITEMS[0] }) {
  return (
    <TouchableOpacity style={styles.itemCard}>
      {item.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>EN ÇOK</Text>
        </View>
      )}
      <View style={[styles.itemIconBg, { backgroundColor: `${item.color}18` }]}>
        <Text style={styles.itemIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDesc}>{item.desc}</Text>
      <View style={styles.itemPriceRow}>
        <Text style={styles.itemPriceIcon}>{item.unit}</Text>
        <Text style={[styles.itemPrice, { color: item.color }]}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "defense", label: "Savunma" },
  { key: "attack", label: "Saldırı" },
  { key: "style", label: "Stil" },
];

export default function StoreScreen() {
  const [category, setCategory] = useState<Category>("all");

  const showDefense = category === "all" || category === "defense";
  const showAttack = category === "all" || category === "attack";
  const showStyle = category === "all" || category === "style";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.sectionLabel}>MAĞAZA</Text>
          <Text style={styles.title}>Komuta Merkezi</Text>
        </View>
        <View style={styles.coinBadge}>
          <Text style={styles.coinIcon}>🔗</Text>
          <Text style={styles.coinAmount}>2,840</Text>
        </View>
      </View>

      {/* Category tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryTabs}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.catTab, category === cat.key && styles.catTabActive]}
            onPress={() => setCategory(cat.key)}
          >
            <Text style={[styles.catTabText, category === cat.key && styles.catTabTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Limited offer */}
        {(category === "all") && (
          <View style={styles.limitedCard}>
            <View style={styles.limitedTimer}>
              <View style={styles.timerDot} />
              <Text style={styles.timerText}>02:14:08</Text>
              <Text style={styles.limitedLabel}>LİMİTLİ SEFER</Text>
            </View>
            <View style={styles.limitedContent}>
              <View style={styles.limitedIcon}>
                <Text style={styles.limitedEmoji}>👑</Text>
              </View>
              <View style={styles.limitedInfo}>
                <Text style={styles.limitedTitle}>Komutan Paketi</Text>
                <View style={styles.limitedItems}>
                  <Text style={styles.limitedItemIcon}>🛡️</Text>
                  <Text style={styles.limitedItemIcon}>📡</Text>
                  <View style={styles.limitedCoins}>
                    <Text style={styles.limitedCoinIcon}>🔗</Text>
                    <Text style={styles.limitedCoinAmount}>500</Text>
                  </View>
                </View>
              </View>
              <View style={styles.limitedPriceCol}>
                <Text style={styles.limitedPrice}>₺49.99</Text>
                <Text style={styles.limitedOriginal}>₺89.99</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-40%</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Defense section */}
        {showDefense && (
          <>
            <Text style={styles.sectionHeader}>🛡️  SAVUNMA CEPHANESİ</Text>
            <View style={styles.itemsGrid}>
              {DEFENSE_ITEMS.map((item) => <ItemCard key={item.id} item={item} />)}
            </View>
          </>
        )}

        {/* Attack section */}
        {showAttack && (
          <>
            <Text style={styles.sectionHeader}>⚔️  SALDIRI CEPHANESİ</Text>
            <View style={styles.itemsGrid}>
              {ATTACK_ITEMS.map((item) => <ItemCard key={item.id} item={item} />)}
            </View>
          </>
        )}

        {/* Style section */}
        {showStyle && (
          <>
            <Text style={styles.sectionHeader}>🎨  STİL KOLEKSIYONU</Text>
            <View style={styles.itemsGrid}>
              {STYLE_ITEMS.map((item) => <ItemCard key={item.id} item={item} />)}
            </View>
          </>
        )}

        {/* Premium */}
        <View style={styles.premiumCard}>
          <View style={styles.premiumLeft}>
            <Text style={styles.premiumIcon}>👑</Text>
            <View>
              <Text style={styles.premiumTitle}>Komutan Premium</Text>
              <Text style={styles.premiumDesc}>Tüm itemler · Reklamsız · VIP rozet</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.premiumBtn}>
            <Text style={styles.premiumBtnText}>₺29.99/ay</Text>
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
    paddingTop: 8,
    paddingBottom: 12,
  },
  sectionLabel: { fontSize: 10, fontWeight: "700", color: Colors.purple, letterSpacing: 2, marginBottom: 2 },
  title: { fontSize: 24, fontWeight: "800", color: Colors.textPrimary },
  coinBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: `${Colors.gold}18`,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${Colors.gold}40`,
  },
  coinIcon: { fontSize: 16 },
  coinAmount: { fontSize: 15, fontWeight: "700", color: Colors.gold },
  categoryTabs: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  catTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSolid,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  catTabActive: { backgroundColor: Colors.purple, borderColor: Colors.purple },
  catTabText: { fontSize: 13, fontWeight: "600", color: Colors.textSecondary },
  catTabTextActive: { color: Colors.textPrimary },
  content: { paddingHorizontal: 20, paddingBottom: 40 },

  // Limited offer card
  limitedCard: {
    backgroundColor: `${Colors.purple}18`,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: `${Colors.purple}40`,
    marginBottom: 24,
  },
  limitedTimer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  timerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.coral },
  timerText: { fontSize: 13, fontWeight: "700", color: Colors.textPrimary },
  limitedLabel: { fontSize: 10, fontWeight: "700", color: Colors.textSecondary, letterSpacing: 1, marginLeft: 4 },
  limitedContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  limitedIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: `${Colors.gold}20`,
    justifyContent: "center",
    alignItems: "center",
  },
  limitedEmoji: { fontSize: 28 },
  limitedInfo: { flex: 1 },
  limitedTitle: { fontSize: 17, fontWeight: "700", color: Colors.textPrimary, marginBottom: 8 },
  limitedItems: { flexDirection: "row", alignItems: "center", gap: 6 },
  limitedItemIcon: { fontSize: 18 },
  limitedCoins: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: `${Colors.cyan}18`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  limitedCoinIcon: { fontSize: 12 },
  limitedCoinAmount: { fontSize: 12, fontWeight: "700", color: Colors.cyan },
  limitedPriceCol: { alignItems: "flex-end", gap: 4 },
  limitedPrice: { fontSize: 18, fontWeight: "800", color: Colors.textPrimary },
  limitedOriginal: { fontSize: 12, color: Colors.textMuted, textDecorationLine: "line-through" },
  discountBadge: {
    backgroundColor: Colors.emerald,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: { fontSize: 11, fontWeight: "800", color: Colors.background },

  // Section header
  sectionHeader: { fontSize: 11, fontWeight: "700", color: Colors.textSecondary, letterSpacing: 1, marginBottom: 12 },
  itemsGrid: { flexDirection: "row", gap: 12, marginBottom: 24 },
  itemCard: {
    flex: 1,
    backgroundColor: Colors.surfaceSolid,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: "center",
    gap: 6,
    position: "relative",
    overflow: "hidden",
  },
  popularBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.coral,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  popularText: { fontSize: 8, fontWeight: "800", color: Colors.textPrimary },
  itemIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  itemIcon: { fontSize: 26 },
  itemName: { fontSize: 14, fontWeight: "700", color: Colors.textPrimary },
  itemDesc: { fontSize: 11, color: Colors.textSecondary, textAlign: "center" },
  itemPriceRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 },
  itemPriceIcon: { fontSize: 13 },
  itemPrice: { fontSize: 16, fontWeight: "800" },

  // Premium card
  premiumCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: `${Colors.gold}12`,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: `${Colors.gold}30`,
    marginTop: 8,
  },
  premiumLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  premiumIcon: { fontSize: 28 },
  premiumTitle: { fontSize: 15, fontWeight: "700", color: Colors.textPrimary },
  premiumDesc: { fontSize: 11, color: Colors.textSecondary },
  premiumBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  premiumBtnText: { fontSize: 13, fontWeight: "800", color: Colors.background },
});
