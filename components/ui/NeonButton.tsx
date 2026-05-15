import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { theme } from "@/constants/theme";
import { AnimatedPressable } from "@/components/motion";

export type NeonButtonVariant = "primary" | "gold" | "ghost";
export type NeonButtonSize = "sm" | "md" | "lg";

export type NeonButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: React.ReactNode;
  variant?: NeonButtonVariant;
  size?: NeonButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const variantStyles: Record<NeonButtonVariant, { bg: string; border: string; text: string; shadow?: ViewStyle }> = {
  primary: {
    bg: "rgba(0, 229, 204, 0.14)",
    border: theme.colors.primaryCyan,
    text: theme.colors.primaryCyan,
    shadow: {
      shadowColor: "#00E5CC",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.16,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  gold: {
    bg: "rgba(255, 200, 87, 0.14)",
    border: theme.colors.goldReward,
    text: theme.colors.goldReward,
    shadow: {
      shadowColor: "#FFC857",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.14,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  ghost: {
    bg: "rgba(255, 255, 255, 0.04)",
    border: theme.colors.borderSubtle,
    text: theme.colors.textPrimary,
  },
};

const sizeStyles: Record<NeonButtonSize, { minHeight: number; horizontalPadding: number; fontSize: number }> = {
  sm: { minHeight: 40, horizontalPadding: 14, fontSize: theme.typography.size.sm },
  md: { minHeight: 48, horizontalPadding: 18, fontSize: theme.typography.size.base },
  lg: { minHeight: 56, horizontalPadding: 22, fontSize: theme.typography.size.lg },
};

export function NeonButton({
  label,
  onPress,
  icon,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
  textStyle,
}: NeonButtonProps) {
  const palette = variantStyles[variant];
  const metrics = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      scaleTo={0.97}
      idlePulse={!isDisabled && variant !== "ghost"}
      pressedStyle={styles.pressed}
      style={[
        styles.button,
        {
          minHeight: metrics.minHeight,
          paddingHorizontal: metrics.horizontalPadding,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: isDisabled ? theme.ux.disabledOpacity : 1,
        },
        variant !== "ghost" && !isDisabled && palette.shadow,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} size="small" />
      ) : (
        <View style={styles.content}>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <Text style={[styles.label, { color: palette.text, fontSize: metrics.fontSize }, textStyle]}>{label}</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: theme.spacing.xs,
  },
  label: {
    fontFamily: theme.typography.fontFamily.semibold,
    letterSpacing: 0.4,
  },
  pressed: {
    opacity: 0.88,
  },
});
