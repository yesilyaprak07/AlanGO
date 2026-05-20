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
        <Text allowFontScaling={false} style={styles.title} numberOfLines={1}>
          AlanGO Premium
        </Text>
        <Text allowFontScaling={false} style={styles.description}>Özel avantajlar, günlük ödüller</Text>
        <Text allowFontScaling={false} style={styles.description}>ve reklamsız deneyim!</Text>
      </View>

      <Pressable style={styles.button}>
        <Text allowFontScaling={false} style={styles.buttonLabel}>HEMEN KEŞFET</Text>
        <ChevronRight size={16} color="#D8B4FE" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 0.6,
    borderColor: "rgba(168, 85, 247, 0.3)",
    backgroundColor: "rgba(168, 85, 247, 0.05)",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  leftIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "rgba(91, 33, 182, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.7,
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
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  description: {
    color: "#9CA3AF",
    fontSize: 10,
    lineHeight: 13,
    fontFamily: theme.typography.fontFamily.regular,
  },
  button: {
    minWidth: 158,
    height: 42,
    borderRadius: 12,
    borderWidth: 0.7,
    borderColor: "rgba(168, 85, 247, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  buttonLabel: {
    color: "#D8B4FE",
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.semibold,
  },
});
