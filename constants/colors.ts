export const Colors = {
  background: "#0F1214",
  surface: "#1A1D20",
  surfaceBorder: "#242830",
  primary: "#00F0FF",
  danger: "#FF3B3B",
  success: "#00E676",
  warning: "#FFB300",
  textPrimary: "#FFFFFF",
  textSecondary: "#8A8F9A",
  tabInactive: "#4A4F5A",
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
} as const;

export type ColorType = keyof typeof Colors;
