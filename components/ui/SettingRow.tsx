import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { theme } from "@/constants/theme";

export type SettingRowProps = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SettingRow({ title, subtitle, icon, onPress, right, danger = false, style }: SettingRowProps) {
  const content = (
    <View style={[styles.row, style]}>
      <View style={styles.leftWrap}>
        {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
        <View style={styles.textWrap}>
          <Text style={[styles.title, danger && styles.titleDanger]}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={styles.rightWrap}>{right ?? (onPress ? <ChevronRight size={16} color={theme.colors.textMuted} /> : null)}</View>
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      hitSlop={theme.ux.hitSlop}
      pressRetentionOffset={{ top: 10, bottom: 10, left: 10, right: 10 }}
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  leftWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
  },
  titleDanger: {
    color: theme.colors.danger,
  },
  subtitle: {
    marginTop: 2,
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  rightWrap: {
    marginLeft: theme.spacing.xs,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.84,
  },
});
