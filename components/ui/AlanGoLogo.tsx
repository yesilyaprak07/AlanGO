import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { branding } from "@/constants/branding";
import { theme } from "@/constants/theme";

export type AlanGoLogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  glow?: "none" | "soft" | "medium";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function AlanGoLogo({
  size = "md",
  showTagline = false,
  glow = "soft",
  style,
  textStyle,
}: AlanGoLogoProps) {
  const logoSize = branding.logo.sizes[size];
  const glowOpacity = branding.logo.glow[glow];

  return (
    <View style={[styles.wrap, style]}>
      {glowOpacity > 0 ? <View style={[styles.glow, { opacity: glowOpacity }]} /> : null}
      <View style={styles.row}>
        <Text style={[styles.text, { fontSize: logoSize, letterSpacing: branding.logo.tracking.tight }, textStyle]}>Alan</Text>
        <Text style={[styles.textGo, { fontSize: logoSize, letterSpacing: branding.logo.tracking.tight }, textStyle]}>GO</Text>
      </View>
      {showTagline ? <Text style={styles.tagline}>{branding.tagline}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "flex-start",
  },
  glow: {
    position: "absolute",
    top: -6,
    left: -8,
    right: -8,
    bottom: -6,
    borderRadius: 14,
    backgroundColor: "rgba(0, 229, 204, 0.26)",
  },
  row: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  text: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    lineHeight: 54,
  },
  textGo: {
    marginLeft: 1,
    color: theme.colors.primaryCyan,
    fontFamily: theme.typography.fontFamily.bold,
    lineHeight: 54,
  },
  tagline: {
    marginTop: 2,
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 10,
    letterSpacing: 0.4,
  },
});
