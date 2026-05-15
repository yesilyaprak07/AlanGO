import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";

export type BottomTabItem<T extends string = string> = {
  key: T;
  label: string;
  icon?: React.ReactNode | string;
  badgeCount?: number;
  disabled?: boolean;
};

export type BottomTabBarProps<T extends string = string> = {
  tabs: BottomTabItem<T>[];
  activeKey: T;
  onTabPress: (key: T) => void;
  style?: StyleProp<ViewStyle>;
  safeBottomInset?: number;
};

export function BottomTabBar<T extends string>({
  tabs,
  activeKey,
  onTabPress,
  style,
  safeBottomInset = 0,
}: BottomTabBarProps<T>) {
  const insets = useSafeAreaInsets();
  const bottomInset = safeBottomInset || insets.bottom;

  return (
    <View style={[styles.container, { paddingBottom: theme.spacing.xs + bottomInset }, style]}>
      {tabs.map((tab) => {
        const active = tab.key === activeKey;

        return (
          <Pressable
            key={tab.key}
            disabled={tab.disabled}
            hitSlop={theme.ux.hitSlop}
            pressRetentionOffset={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() => onTabPress(tab.key)}
            style={({ pressed }) => [styles.item, active && styles.itemActive, pressed && styles.itemPressed, tab.disabled && styles.itemDisabled]}
          >
            <View style={styles.iconWrap}>
              {typeof tab.icon === "string" ? <Text style={[styles.iconText, active && styles.iconTextActive]}>{tab.icon}</Text> : tab.icon}
              {typeof tab.badgeCount === "number" && tab.badgeCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badgeCount > 99 ? "99+" : tab.badgeCount}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: "rgba(6, 16, 24, 0.96)",
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  item: {
    minWidth: 64,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  itemActive: {
    backgroundColor: "rgba(0, 229, 204, 0.14)",
  },
  itemPressed: {
    opacity: 0.85,
  },
  itemDisabled: {
    opacity: 0.4,
  },
  iconWrap: {
    position: "relative",
  },
  iconText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.base,
    fontFamily: theme.typography.fontFamily.bold,
  },
  iconTextActive: {
    color: theme.colors.primaryCyan,
  },
  label: {
    marginTop: 4,
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  labelActive: {
    color: theme.colors.primaryCyan,
  },
  badge: {
    position: "absolute",
    right: -10,
    top: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: {
    color: theme.colors.textPrimary,
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.semibold,
    includeFontPadding: false,
  },
});
