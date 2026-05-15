import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { theme } from "@/constants/theme";
import { GlassCard } from "@/components/ui/GlassCard";

export type RewardCardVariant = "gold" | "cyan";

export type RewardCardProps = {
  title: string;
  description: string;
  rewardText: string;
  icon?: React.ReactNode | string;
  variant?: RewardCardVariant;
  claimed?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const variantMap: Record<RewardCardVariant, { accent: string; bg: string }> = {
  gold: {
    accent: theme.colors.goldReward,
    bg: "rgba(255, 200, 87, 0.12)",
  },
  cyan: {
    accent: theme.colors.primaryCyan,
    bg: "rgba(0, 229, 204, 0.12)",
  },
};

export function RewardCard({
  title,
  description,
  rewardText,
  icon,
  variant = "gold",
  claimed = false,
  disabled = false,
  onPress,
  style,
}: RewardCardProps) {
  const palette = variantMap[variant];

  return (
    <GlassCard style={style}>
      <View style={styles.row}>
        <View style={[styles.iconBadge, { borderColor: palette.accent, backgroundColor: palette.bg }]}> 
          {typeof icon === "string" ? <Text style={[styles.iconText, { color: palette.accent }]}>{icon}</Text> : icon}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={[styles.rewardText, { color: palette.accent }]}>{rewardText}</Text>
        </View>
      </View>

      <Pressable
        disabled={disabled || claimed || !onPress}
        onPress={onPress}
        style={({ pressed }) => [
          styles.action,
          {
            borderColor: palette.accent,
            backgroundColor: claimed ? "rgba(255, 255, 255, 0.04)" : palette.bg,
            opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text style={[styles.actionText, { color: claimed ? theme.colors.textMuted : palette.accent }]}>
          {claimed ? "Alindi" : "Odulu Al"}
        </Text>
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.bold,
  },
  content: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.base,
  },
  description: {
    marginTop: 2,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
  },
  rewardText: {
    marginTop: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.sm,
  },
  action: {
    marginTop: theme.spacing.sm,
    minHeight: 40,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
    letterSpacing: 0.3,
  },
});
