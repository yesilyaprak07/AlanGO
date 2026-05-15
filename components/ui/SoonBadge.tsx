import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { theme } from "@/constants/theme";

export type SoonBadgeProps = {
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export function SoonBadge({ label = "YAKINDA", style }: SoonBadgeProps) {
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: "rgba(255, 200, 87, 0.42)",
    backgroundColor: "rgba(255, 200, 87, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    color: theme.colors.goldReward,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 10,
    letterSpacing: 0.9,
  },
});
