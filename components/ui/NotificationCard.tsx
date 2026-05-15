import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { theme } from "@/constants/theme";

export type NotificationAccent = "default" | "cyan" | "gold" | "danger";

export type NotificationCardProps = {
  icon: React.ReactNode;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
  accent?: NotificationAccent;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

function accentPalette(accent: NotificationAccent) {
  if (accent === "cyan") {
    return {
      border: "rgba(0, 229, 204, 0.34)",
      bg: "rgba(0, 229, 204, 0.06)",
      dot: theme.colors.primaryCyan,
    };
  }
  if (accent === "gold") {
    return {
      border: "rgba(255, 200, 87, 0.32)",
      bg: "rgba(255, 200, 87, 0.06)",
      dot: theme.colors.goldReward,
    };
  }
  if (accent === "danger") {
    return {
      border: "rgba(255, 77, 77, 0.34)",
      bg: "rgba(255, 77, 77, 0.05)",
      dot: theme.colors.danger,
    };
  }
  return {
    border: theme.colors.borderSubtle,
    bg: theme.colors.surfaceCard,
    dot: theme.colors.primaryCyan,
  };
}

export function NotificationCard({
  icon,
  title,
  body,
  time,
  unread = false,
  accent = "default",
  onPress,
  style,
}: NotificationCardProps) {
  const palette = accentPalette(accent);

  return (
    <Pressable
      onPress={onPress}
      hitSlop={theme.ux.hitSlop}
      style={({ pressed }) => [
        styles.card,
        {
          borderColor: palette.border,
          backgroundColor: unread ? palette.bg : theme.colors.surfaceCard,
          opacity: unread ? 1 : 0.86,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.leftIcon}>{icon}</View>

      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>

      <View style={styles.metaWrap}>
        <Text style={styles.time}>{time}</Text>
        {unread ? <View style={[styles.unreadDot, { backgroundColor: palette.dot }]} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 86,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  leftIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
  },
  body: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.xs,
    lineHeight: 18,
  },
  metaWrap: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    minHeight: 44,
  },
  time: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pressed: {
    opacity: 0.84,
  },
});
