import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { theme } from "@/constants/theme";

export type MapZonePlaceholderProps = {
  style?: StyleProp<ViewStyle>;
};

export function MapZonePlaceholder({ style }: MapZonePlaceholderProps) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.grid} />
      <View style={styles.zone} />
      <View style={styles.path} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 94,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: "rgba(2, 8, 14, 0.62)",
    overflow: "hidden",
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  zone: {
    position: "absolute",
    top: 18,
    left: 28,
    width: 92,
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 204, 0.30)",
    backgroundColor: "rgba(0, 229, 204, 0.14)",
  },
  path: {
    position: "absolute",
    right: 24,
    top: 48,
    width: 130,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(0, 229, 204, 0.56)",
  },
});
