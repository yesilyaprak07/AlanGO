import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";

export type RewardPoolItemProps = {
  label: string;
};

export function RewardPoolItem({ label }: RewardPoolItemProps) {
  return (
    <View style={styles.item}>
      <View style={styles.dot} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0, 229, 204, 0.54)",
  },
  label: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
});
