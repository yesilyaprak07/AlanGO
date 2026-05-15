import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, StyleSheet, ViewStyle } from "react-native";

type AnimatedGradientProps = {
  style?: StyleProp<ViewStyle>;
  color?: string;
  duration?: number;
};

export function AnimatedGradient({ style, color = "rgba(255,255,255,0.08)", duration = 900 }: AnimatedGradientProps) {
  const slide = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(slide, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slide, {
          toValue: -1,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [duration, slide]);

  const translateX = slide.interpolate({
    inputRange: [-1, 1],
    outputRange: [-120, 120],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.base,
        style,
        {
          backgroundColor: color,
          transform: [{ translateX }, { rotate: "14deg" }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    position: "absolute",
    top: -20,
    bottom: -20,
    width: 70,
    opacity: 0.32,
  },
});
