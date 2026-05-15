import { TextStyle, ViewStyle } from "react-native";

export const theme = {
  colors: {
    primaryCyan: "#00E5CC",
    primaryCyanDark: "#00AFA0",
    backgroundDark: "#061018",
    backgroundDeep: "#03070D",
    surfaceCard: "rgba(10, 20, 30, 0.92)",
    surfaceLight: "rgba(255, 255, 255, 0.06)",
    borderSubtle: "rgba(255, 255, 255, 0.12)",
    textPrimary: "#FFFFFF",
    textSecondary: "#AAB7C4",
    textMuted: "#657080",
    goldReward: "#FFC857",
    purple: "#8B5CF6",
    danger: "#FF4D4D",
    success: "#22C55E",
    black: "#000000",
  },
  typography: {
    fontFamily: {
      regular: "Inter_400Regular",
      medium: "Inter_500Medium",
      semibold: "Inter_600SemiBold",
      bold: "Inter_700Bold",
    },
    size: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 28,
    },
    lineHeight: {
      tight: 18,
      normal: 22,
      relaxed: 26,
    },
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  layout: {
    screenHorizontal: 16,
    screenTop: 12,
    screenBottom: 20,
    tabBarHeight: 72,
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    full: 999,
  },
  ux: {
    hitSlop: 10,
    disabledOpacity: 0.52,
  },
  shadows: {
    neonCyan: {
      shadowColor: "#00E5CC",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 5,
    } as ViewStyle,
    soft: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 18,
      elevation: 10,
    } as ViewStyle,
  },
} as const;

export type Theme = typeof theme;
export type ThemeColors = Theme["colors"];
export type ThemeTypography = Theme["typography"];

export const textPresets = {
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xl,
    color: theme.colors.textPrimary,
  } as TextStyle,
  body: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.base,
    color: theme.colors.textSecondary,
  } as TextStyle,
  caption: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
    color: theme.colors.textMuted,
  } as TextStyle,
};
