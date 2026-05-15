import React, { useEffect, useRef } from "react";
import { Animated, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { theme } from "@/constants/theme";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedGradient } from "@/components/fx";

export type StatTrendDirection = "up" | "down" | "neutral";

export type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode | string;
  trend?: {
    value: string;
    direction?: StatTrendDirection;
  };
  progress?: number;
  style?: StyleProp<ViewStyle>;
};

const trendColor: Record<StatTrendDirection, string> = {
  up: theme.colors.success,
  down: theme.colors.danger,
  neutral: theme.colors.textSecondary,
};

export function StatCard({ title, value, subtitle, icon, trend, progress, style }: StatCardProps) {
  const direction = trend?.direction ?? "neutral";
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (typeof progress !== "number") return;

    Animated.timing(progressAnim, {
      toValue: Math.min(1, Math.max(0, progress)),
      duration: 520,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  return (
    <GlassCard style={style}>
      <View style={styles.inner}>
        <View style={styles.animatedGradientWrap}>
          <AnimatedGradient color="rgba(0, 229, 204, 0.10)" duration={980} />
        </View>

        <View style={styles.topRow}>
          <Text style={styles.title}>{title}</Text>
          {typeof icon === "string" ? <Text style={styles.iconText}>{icon}</Text> : icon}
        </View>

        <Text style={styles.value}>{value}</Text>

        {typeof progress === "number" ? (
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        ) : null}

        <View style={styles.footerRow}>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : <View />}
          {trend ? <Text style={[styles.trend, { color: trendColor[direction] }]}>{trend.value}</Text> : null}
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  inner: {
    overflow: "hidden",
    borderRadius: theme.radius.md,
  },
  animatedGradientWrap: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.26,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
  },
  iconText: {
    color: theme.colors.primaryCyan,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.base,
  },
  value: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xxl,
  },
  progressTrack: {
    marginTop: theme.spacing.xs,
    height: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primaryCyan,
  },
  footerRow: {
    marginTop: theme.spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
  },
  trend: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
  },
});
