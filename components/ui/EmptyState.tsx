import React from "react";
import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { Sparkles } from "lucide-react-native";
import { AppIconContainer } from "@/components/ui/AppIconContainer";
import { GlassCard } from "@/components/ui/GlassCard";
import { theme } from "@/constants/theme";
import { HelperText } from "@/components/ui/HelperText";

export type EmptyStateProps = {
  title: string;
  message: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function EmptyState({ title, message, icon, style }: EmptyStateProps) {
  return (
    <GlassCard style={style} contentStyle={styles.content}>
      <AppIconContainer tone="neutral" size="md" icon={icon ?? <Sparkles size={16} color={theme.colors.textSecondary} />} style={styles.iconWrap} />
      <Text style={styles.title}>{title}</Text>
      <HelperText text={message} style={styles.message} />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    gap: 8,
    paddingVertical: theme.spacing.lg,
  },
  iconWrap: {
    marginBottom: 2,
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.base,
  },
  message: {
    textAlign: "center",
    maxWidth: 260,
  },
});
