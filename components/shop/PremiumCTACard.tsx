import { ChevronRight, Crown } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";

export function PremiumCTACard() {
  return (
    <View style={styles.card}>
      <View style={styles.leftIconWrap}>
        <View style={styles.leftIconInner}>
          <Crown size={22} color="#C084FC" />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          AlanGO Premium
        </Text>
        <Text style={styles.description}>Özel avantajlar, günlük ödüller</Text>
        <Text style={styles.description}>ve reklamsız deneyim!</Text>
      </View>

      <Pressable style={styles.button}>
        <Text style={styles.buttonLabel}>HEMEN KEŞFET</Text>
        <ChevronRight size={16} color="#D8B4FE" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.3)",
    backgroundColor: "rgba(168, 85, 247, 0.05)",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  leftIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "rgba(91, 33, 182, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.45)",
    transform: [{ rotate: "45deg" }],
  },
  leftIconInner: {
    transform: [{ rotate: "-45deg" }],
  },
  content: {
    flex: 1,
  },
  title: {
    color: "#A855F7",
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  description: {
    color: "#9CA3AF",
    fontSize: 12,
    lineHeight: 16,
    fontFamily: theme.typography.fontFamily.regular,
  },
  button: {
    minWidth: 132,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  buttonLabel: {
    color: "#D8B4FE",
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.semibold,
  },
});
