import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { branding } from "@/constants/branding";
import { theme } from "@/constants/theme";

export type IconBadgeTone = "cyan" | "gold" | "purple" | "danger" | "success" | "neutral";

export type IconBadgeProps = {
  icon: React.ReactNode | string;
  tone?: IconBadgeTone;
  size?: number;
  active?: boolean;
  style?: StyleProp<ViewStyle>;
};

const toneMap: Record<IconBadgeTone, { bg: string; fg: string; border: string }> = {
  cyan: {
    bg: "rgba(0, 229, 204, 0.15)",
    fg: theme.colors.primaryCyan,
    border: "rgba(0, 229, 204, 0.35)",
  },
  gold: {
    bg: "rgba(255, 200, 87, 0.16)",
    fg: theme.colors.goldReward,
    border: "rgba(255, 200, 87, 0.35)",
  },
  purple: {
    bg: "rgba(139, 92, 246, 0.16)",
    fg: theme.colors.purple,
    border: "rgba(139, 92, 246, 0.35)",
  },
  danger: {
    bg: "rgba(255, 77, 77, 0.14)",
    fg: theme.colors.danger,
    border: "rgba(255, 77, 77, 0.30)",
  },
  success: {
    bg: "rgba(34, 197, 94, 0.14)",
    fg: theme.colors.success,
    border: "rgba(34, 197, 94, 0.30)",
  },
  neutral: {
    bg: theme.colors.surfaceLight,
    fg: theme.colors.textPrimary,
    border: theme.colors.borderSubtle,
  },
};

export function IconBadge({ icon, tone = "cyan", size = 42, active = false, style }: IconBadgeProps) {
  const palette = toneMap[tone];
  const renderedIcon =
    typeof icon === "string"
      ? icon
      : React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<Record<string, unknown>>, {
            strokeWidth:
              ((icon.props as Record<string, unknown> | undefined)?.strokeWidth as number | undefined) ??
              branding.icon.strokeWidth,
          })
        : icon;

  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: branding.icon.containerRadius.md,
          backgroundColor: palette.bg,
          borderColor: palette.border,
        },
        active && styles.active,
        style,
      ]}
    >
      {typeof renderedIcon === "string" ? (
        <Text style={[styles.iconText, { color: palette.fg, fontSize: size * 0.42 }]}>{renderedIcon}</Text>
      ) : (
        renderedIcon
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  active: {
    shadowColor: theme.colors.primaryCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  iconText: {
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});
