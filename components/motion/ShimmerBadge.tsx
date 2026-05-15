import React, { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type ShimmerBadgeProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  shimmerColor?: string;
  duration?: number;
}>;

export function ShimmerBadge({
  children,
  style,
  shimmerColor = "rgba(255,255,255,0.24)",
  duration = 560,
}: ShimmerBadgeProps) {
  const shimmer = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: -1,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [duration, shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-120, 120],
  });

  return (
    <View style={[styles.wrap, style]}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shimmer,
          {
            backgroundColor: shimmerColor,
            transform: [{ translateX }, { rotate: "16deg" }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
  },
  shimmer: {
    position: "absolute",
    top: -20,
    bottom: -20,
    width: 46,
    opacity: 0.36,
  },
});
