export const Colors = {
  // Core backgrounds
  background: "#1A1428",
  surface: "rgba(46, 38, 64, 0.85)",
  surface2: "rgba(58, 48, 78, 0.9)",
  surfaceBorder: "rgba(255, 255, 255, 0.08)",
  surfaceSolid: "#2E2640",

  // Brand colors
  cyan: "#5BC8E0",
  purple: "#A56BE0",
  coral: "#F06A5A",
  emerald: "#5BD9A0",
  gold: "#E8C46A",

  // Semantic aliases (keep for backward compatibility)
  primary: "#5BC8E0",
  danger: "#F06A5A",
  success: "#5BD9A0",
  warning: "#E8C46A",

  // Text
  textPrimary: "#F5F4F8",
  textSecondary: "#A8A2B5",
  textMuted: "#6B6480",

  // Legacy
  tabInactive: "#6B6480",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
} as const;

export type ColorType = keyof typeof Colors;

export const Gradients = {
  primary: [Colors.cyan, Colors.purple] as const,
  danger: [Colors.coral, "#C94A3E"] as const,
  safe: [Colors.emerald, "#3FA776"] as const,
  gold: [Colors.gold, "#D4A843"] as const,
  purple: [Colors.purple, "#7B4DB0"] as const,
};
