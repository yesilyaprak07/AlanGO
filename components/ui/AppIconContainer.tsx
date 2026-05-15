import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { branding } from "@/constants/branding";
import { theme } from "@/constants/theme";

export type AppIconContainerTone = "neutral" | "cyan" | "gold" | "purple" | "danger";

export type AppIconContainerProps = {
  icon: React.ReactNode;
  tone?: AppIconContainerTone;
  size?: "sm" | "md" | "lg";
  active?: boolean;
  style?: StyleProp<ViewStyle>;
};

function tonePalette(tone: AppIconContainerTone) {
  if (tone === "cyan") return { bg: "rgba(0, 229, 204, 0.12)", border: "rgba(0, 229, 204, 0.30)" };
  if (tone === "gold") return { bg: "rgba(255, 200, 87, 0.12)", border: "rgba(255, 200, 87, 0.30)" };
  if (tone === "purple") return { bg: "rgba(139, 92, 246, 0.12)", border: "rgba(139, 92, 246, 0.30)" };
  if (tone === "danger") return { bg: "rgba(255, 77, 77, 0.10)", border: "rgba(255, 77, 77, 0.30)" };
  return { bg: theme.colors.surfaceLight, border: theme.colors.borderSubtle };
}

function sizeMap(size: "sm" | "md" | "lg") {
  if (size === "sm") return { box: 32, radius: branding.icon.containerRadius.sm };
  if (size === "lg") return { box: 44, radius: branding.icon.containerRadius.lg };
  return { box: 38, radius: branding.icon.containerRadius.md };
}

export function AppIconContainer({ icon, tone = "neutral", size = "md", active = false, style }: AppIconContainerProps) {
  const palette = tonePalette(tone);
  const metrics = sizeMap(size);

  return (
    <View
      style={[
        styles.wrap,
        {
          width: metrics.box,
          height: metrics.box,
          borderRadius: metrics.radius,
          backgroundColor: palette.bg,
          borderColor: palette.border,
        },
        active && styles.active,
        style,
      ]}
    >
      {icon}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    shadowColor: "#00E5CC",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 3,
  },
});
