import React, { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { theme } from "@/constants/theme";

export type GlassCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  padding?: number;
  active?: boolean;
}>;

export function GlassCard({ children, style, contentStyle, padding = theme.spacing.md, active = false }: GlassCardProps) {
  return (
    <View style={[styles.card, active && styles.cardActive, style]}>
      <View style={[styles.content, { padding }, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceCard,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    overflow: "hidden",
    ...theme.shadows.soft,
  },
  cardActive: {
    borderColor: "rgba(0, 229, 204, 0.55)",
  },
  content: {
    width: "100%",
  },
});
