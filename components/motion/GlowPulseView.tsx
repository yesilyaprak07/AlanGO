import React, { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, ViewStyle } from "react-native";

type GlowPulseViewProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  minOpacity?: number;
  maxOpacity?: number;
  minScale?: number;
  maxScale?: number;
  duration?: number;
}>;

export function GlowPulseView({
  children,
  style,
  minOpacity = 0.6,
  maxOpacity = 1,
  minScale = 1,
  maxScale = 1.04,
  duration = 520,
}: GlowPulseViewProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [duration, progress]);

  const opacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [minOpacity, maxOpacity],
  });

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [minScale, maxScale],
  });

  return <Animated.View style={[style, { opacity, transform: [{ scale }] }]}>{children}</Animated.View>;
}
