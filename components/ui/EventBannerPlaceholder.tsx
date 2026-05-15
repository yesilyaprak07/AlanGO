import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { theme } from "@/constants/theme";

export type EventBannerPlaceholderProps = {
  title: string;
  subtitle: string;
  tone?: "cyan" | "gold" | "purple";
  style?: StyleProp<ViewStyle>;
};

export function EventBannerPlaceholder({ title, subtitle, tone = "cyan", style }: EventBannerPlaceholderProps) {
  const accent = tone === "gold" ? theme.colors.goldReward : tone === "purple" ? theme.colors.purple : theme.colors.primaryCyan;

  return (
    <View style={[styles.banner, { borderColor: `${accent}52`, backgroundColor: `${accent}12` }, style]}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    minHeight: 92,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.85,
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.base,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
    lineHeight: 18,
  },
});
