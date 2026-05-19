import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
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
    <View style={[styles.wrap, { paddingBottom: bottomInset + 10 }, style]}>
      <BlurView intensity={24} tint="dark" style={styles.container}>
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
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 6,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 92,
    borderRadius: 32,
    paddingHorizontal: 14,
    backgroundColor: "rgba(10, 14, 39, 0.95)",
    borderTopWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.24)",
    overflow: "hidden",
  },
  item: {
    flex: 1,
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  itemActive: {
    backgroundColor: "rgba(16, 244, 232, 0.08)",
    shadowColor: "#10F4E8",
    shadowOpacity: 0.32,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 5,
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
    color: "#6F7A86",
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
  },
  iconTextActive: {
    color: "#10F4E8",
  },
  label: {
    marginTop: 6,
    color: "#A9B4C0",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 14,
  },
  labelActive: {
    color: "#10F4E8",
  },
  badge: {
    position: "absolute",
    right: -8,
    top: -7,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.semibold,
    includeFontPadding: false,
  },
});
