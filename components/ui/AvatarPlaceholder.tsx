import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { theme } from "@/constants/theme";

export type AvatarPlaceholderProps = {
  initials?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function AvatarPlaceholder({ initials = "AG", size = 56, style }: AvatarPlaceholderProps) {
  return (
    <View style={[styles.outer, { width: size, height: size, borderRadius: size * 0.28 }, style]}>
      <View style={[styles.inner, { borderRadius: size * 0.2 }]}>
        <Text style={[styles.text, { fontSize: Math.max(12, size * 0.34) }]}>{initials}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderWidth: 1,
    borderColor: "rgba(0, 229, 204, 0.28)",
    backgroundColor: "rgba(0, 229, 204, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    width: "74%",
    height: "74%",
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: theme.colors.primaryCyan,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
