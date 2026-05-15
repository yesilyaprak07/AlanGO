import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { theme } from "@/constants/theme";

export type HelperTextTone = "neutral" | "success" | "warning" | "danger";

export type HelperTextProps = {
  text: string;
  tone?: HelperTextTone;
  style?: StyleProp<TextStyle>;
};

const toneColor: Record<HelperTextTone, string> = {
  neutral: theme.colors.textMuted,
  success: theme.colors.success,
  warning: theme.colors.goldReward,
  danger: theme.colors.danger,
};

export function HelperText({ text, tone = "neutral", style }: HelperTextProps) {
  return <Text style={[styles.text, { color: toneColor[tone] }, style]}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
    lineHeight: 17,
    letterSpacing: 0.2,
  },
});
