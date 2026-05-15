import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { theme } from "@/constants/theme";

export type ProgressBarProps = {
  value: number;
  trackStyle?: StyleProp<ViewStyle>;
  fillStyle?: StyleProp<ViewStyle>;
};

export function ProgressBar({ value, trackStyle, fillStyle }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <View style={[styles.track, trackStyle]}>
      <View style={[styles.fill, { width: `${pct}%` }, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primaryCyan,
  },
});
