export const branding = {
  name: "AlanGO",
  tagline: "Real World Capture Game",
  logo: {
    sizes: {
      sm: 18,
      md: 24,
      lg: 34,
      xl: 48,
    },
    tracking: {
      tight: -0.6,
      normal: -0.3,
    },
    glow: {
      none: 0,
      soft: 0.08,
      medium: 0.14,
    },
  },
  spacing: {
    sectionGap: 16,
    cardGap: 10,
    rowGap: 8,
  },
  glow: {
    subtle: 0.06,
    soft: 0.1,
    medium: 0.14,
  },
  icon: {
    strokeWidth: 1.9,
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
    },
    containerRadius: {
      sm: 10,
      md: 12,
      lg: 14,
    },
  },
  radius: {
    chip: 999,
    card: 18,
    panel: 24,
  },
  gradient: {
    flatCyan: ["rgba(0, 229, 204, 0.12)", "rgba(0, 229, 204, 0.04)"],
    flatGold: ["rgba(255, 200, 87, 0.12)", "rgba(255, 200, 87, 0.04)"],
    flatPurple: ["rgba(139, 92, 246, 0.12)", "rgba(139, 92, 246, 0.04)"],
  },
} as const;

export type Branding = typeof branding;
