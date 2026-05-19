import { Plus } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ChestImages, UIImages } from "@/assets/images";
import { theme } from "@/constants/theme";

export function ExtraSlotCard() {
  return (
    <View style={styles.card}>
      <View style={styles.leftIconWrap}>
        <Image source={ChestImages.normal} style={styles.chest} resizeMode="contain" />
        <View style={styles.plusBubble}>
          <Plus size={14} color="#00E5FF" strokeWidth={2.2} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Ek Sandık Slotu</Text>
        <Text style={styles.description} numberOfLines={2}>
          Bekleme süresini ortadan kaldırır. Daha fazla sandığı aynı anda açabilirsin.
        </Text>
      </View>

      <Pressable style={styles.button}>
        <Text style={styles.buttonLabel}>EK SLOT AÇ</Text>
        <View style={styles.priceRow}>
          <Image source={UIImages.gem} style={styles.gem} resizeMode="contain" />
          <Text style={styles.price}>250</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.2)",
    backgroundColor: "rgba(0, 229, 255, 0.05)",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  leftIconWrap: {
    width: 62,
    height: 62,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  chest: {
    width: 54,
    height: 54,
  },
  plusBubble: {
    position: "absolute",
    right: -8,
    bottom: -6,
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.5)",
    backgroundColor: "rgba(6, 22, 36, 0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  description: {
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 15,
    fontFamily: theme.typography.fontFamily.regular,
  },
  button: {
    minWidth: 128,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    gap: 2,
  },
  buttonLabel: {
    color: "#67E8F9",
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  gem: {
    width: 16,
    height: 16,
  },
  price: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 24,
    fontFamily: theme.typography.fontFamily.semibold,
  },
});
