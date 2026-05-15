import React, { useEffect, useRef } from "react";
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { GlassCard } from "@/components/ui/GlassCard";
import { theme } from "@/constants/theme";

export type LoadingCardProps = {
  lines?: number;
  style?: StyleProp<ViewStyle>;
};

export function LoadingCard({ lines = 3, style }: LoadingCardProps) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 560, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 560, useNativeDriver: true }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  return (
    <GlassCard style={style} contentStyle={styles.content}>
      {Array.from({ length: lines }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.line,
            index === lines - 1 && styles.shortLine,
            {
              opacity: shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.72] }),
            },
          ]}
        />
      ))}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 8,
  },
  line: {
    height: 11,
    borderRadius: 6,
    backgroundColor: "rgba(0, 229, 204, 0.16)",
  },
  shortLine: {
    width: "62%",
  },
});
