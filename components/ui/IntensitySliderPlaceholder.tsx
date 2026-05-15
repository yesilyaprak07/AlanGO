import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { theme } from "@/constants/theme";

export type IntensitySliderPlaceholderProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export function IntensitySliderPlaceholder({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 10,
}: IntensitySliderPlaceholderProps) {
  const clamped = Math.max(min, Math.min(max, value));
  const pct = ((clamped - min) / (max - min || 1)) * 100;

  const adjust = (delta: number) => {
    onChange(Math.max(min, Math.min(max, clamped + delta)));
  };

  return (
    <View style={styles.wrap}>
      <Pressable style={({ pressed }) => [styles.adjustBtn, pressed && styles.pressed]} onPress={() => adjust(-step)}>
        <Minus size={14} color={theme.colors.textSecondary} />
      </Pressable>

      <View style={styles.trackWrap}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct}%` }]} />
          <View style={[styles.thumb, { left: `${pct}%` }]} />
        </View>
        <Text style={styles.valueText}>%{Math.round(clamped)}</Text>
      </View>

      <Pressable style={({ pressed }) => [styles.adjustBtn, pressed && styles.pressed]} onPress={() => adjust(step)}>
        <Plus size={14} color={theme.colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  adjustBtn: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  trackWrap: {
    flex: 1,
    gap: 4,
  },
  track: {
    height: 8,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
    justifyContent: "center",
  },
  fill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 229, 204, 0.26)",
  },
  thumb: {
    position: "absolute",
    width: 12,
    height: 12,
    marginLeft: -6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 204, 0.54)",
    backgroundColor: "rgba(0, 229, 204, 0.20)",
  },
  valueText: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
    textAlign: "right",
  },
  pressed: {
    opacity: 0.84,
  },
});
