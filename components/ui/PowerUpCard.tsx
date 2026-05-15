import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { theme } from "@/constants/theme";
import { GlassCard } from "@/components/ui/GlassCard";

export type PowerUpCardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode | string;
  level?: number;
  price?: string;
  cooldownText?: string;
  active?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function PowerUpCard({
  title,
  description,
  icon,
  level,
  price,
  cooldownText,
  active = false,
  disabled = false,
  onPress,
  style,
}: PowerUpCardProps) {
  const clickable = Boolean(onPress) && !disabled;

  return (
    <Pressable disabled={!clickable} onPress={onPress} style={({ pressed }) => [pressed && styles.pressed, disabled && styles.disabled]}>
      <GlassCard style={style} active={active}>
        <View style={styles.row}>
          <View style={styles.left}>
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              {typeof icon === "string" ? <Text style={styles.iconText}>{icon}</Text> : icon}
            </View>
            <View style={styles.content}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{title}</Text>
                {typeof level === "number" ? <Text style={styles.level}>Lv.{level}</Text> : null}
              </View>
              <Text style={styles.description} numberOfLines={2}>
                {description}
              </Text>
              <View style={styles.metaRow}>
                {price ? <Text style={styles.price}>{price}</Text> : null}
                {cooldownText ? <Text style={styles.cooldown}>{cooldownText}</Text> : null}
              </View>
            </View>
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    flex: 1,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    borderColor: theme.colors.primaryCyan,
    backgroundColor: "rgba(0, 229, 204, 0.14)",
  },
  iconText: {
    color: theme.colors.primaryCyan,
    fontSize: theme.typography.size.lg,
  },
  content: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.base,
  },
  level: {
    color: theme.colors.primaryCyan,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
  },
  description: {
    marginTop: 3,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
    lineHeight: 19,
  },
  metaRow: {
    marginTop: theme.spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    color: theme.colors.goldReward,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.sm,
  },
  cooldown: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
});
