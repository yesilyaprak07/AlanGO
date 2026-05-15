import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Gift } from "lucide-react-native";
import { theme } from "@/constants/theme";

export type RewardCratePlaceholderProps = {
  variant?: "reward" | "mystery";
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function RewardCratePlaceholder({ variant = "reward", size = 144, style }: RewardCratePlaceholderProps) {
  const isGold = variant === "reward";
  const accent = isGold ? theme.colors.goldReward : theme.colors.primaryCyan;

  return (
    <View style={[styles.wrap, { width: size, height: size }, style]}>
      <View style={[styles.ring, { borderColor: `${accent}55` }]} />
      <View style={[styles.card, { borderColor: `${accent}4A`, backgroundColor: `${accent}16` }]}>
        <Gift size={Math.max(22, size * 0.22)} color={accent} />
        <Text style={[styles.mark, { color: accent }]}>{isGold ? "REWARD" : "BOX"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 999,
    borderWidth: 1,
    opacity: 0.66,
  },
  card: {
    width: "74%",
    height: "74%",
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  mark: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 11,
    letterSpacing: 0.6,
  },
});
