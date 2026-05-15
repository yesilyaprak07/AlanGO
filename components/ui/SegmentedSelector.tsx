import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { theme } from "@/constants/theme";

export type SegmentedOption<T extends string = string> = {
  key: T;
  label: string;
};

export type SegmentedSelectorProps<T extends string = string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (next: T) => void;
  style?: StyleProp<ViewStyle>;
};

export function SegmentedSelector<T extends string>({ options, value, onChange, style }: SegmentedSelectorProps<T>) {
  return (
    <View style={[styles.wrapper, style]}>
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            hitSlop={theme.ux.hitSlop}
            style={({ pressed }) => [styles.segment, active && styles.segmentActive, pressed && styles.pressed]}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{option.label}</Text>
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
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.xs,
  },
  segment: {
    flex: 1,
    minHeight: 36,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.sm,
  },
  segmentActive: {
    borderWidth: 1,
    borderColor: "rgba(0, 229, 204, 0.46)",
    backgroundColor: "rgba(0, 229, 204, 0.10)",
  },
  segmentText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  segmentTextActive: {
    color: theme.colors.primaryCyan,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  pressed: {
    opacity: 0.86,
  },
});
