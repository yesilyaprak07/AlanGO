import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { theme } from "@/constants/theme";

export type SwitchOption<T extends string = string> = {
  key: T;
  label: string;
  icon?: React.ReactNode | string;
  disabled?: boolean;
};

export type TopModeSwitcherProps<T extends string = string> = {
  options: SwitchOption<T>[];
  value: T;
  onChange: (next: T) => void;
  style?: StyleProp<ViewStyle>;
};

export function TopModeSwitcher<T extends string>({ options, value, onChange, style }: TopModeSwitcherProps<T>) {
  return (
    <View style={[styles.wrapper, style]}>
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable
            key={option.key}
            disabled={option.disabled}
            onPress={() => onChange(option.key)}
            style={({ pressed }) => [
              styles.item,
              active && styles.itemActive,
              option.disabled && styles.itemDisabled,
              pressed && !option.disabled && styles.itemPressed,
            ]}
          >
            <View style={styles.itemRow}>
              {typeof option.icon === "string" ? <Text style={styles.icon}>{option.icon}</Text> : option.icon}
              <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    padding: theme.spacing.xs,
  },
  item: {
    flex: 1,
    minHeight: 40,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  itemActive: {
    backgroundColor: "rgba(0, 229, 204, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(0, 229, 204, 0.58)",
  },
  itemDisabled: {
    opacity: 0.4,
  },
  itemPressed: {
    opacity: 0.85,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: theme.spacing.xs,
    color: theme.colors.primaryCyan,
    fontSize: theme.typography.size.base,
  },
  label: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
  },
  labelActive: {
    color: theme.colors.primaryCyan,
  },
});
