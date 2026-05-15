import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { GlassCard } from "@/components/ui/GlassCard";
import { theme } from "@/constants/theme";
import { HelperText } from "@/components/ui/HelperText";

export type ErrorStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ErrorState({ title, message, actionLabel, onActionPress, style }: ErrorStateProps) {
  return (
    <GlassCard style={style} contentStyle={styles.content}>
      <AlertTriangle size={18} color={theme.colors.danger} />
      <Text style={styles.title}>{title}</Text>
      <HelperText text={message} tone="danger" style={styles.message} />
      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress} style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    gap: 8,
    paddingVertical: theme.spacing.lg,
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
  action: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 77, 77, 0.45)",
    backgroundColor: "rgba(255, 77, 77, 0.12)",
    borderRadius: theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  actionPressed: {
    opacity: 0.82,
  },
  actionText: {
    color: theme.colors.danger,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.xs,
  },
});
