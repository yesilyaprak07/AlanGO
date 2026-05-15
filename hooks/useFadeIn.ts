import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

type UseFadeInOptions = {
  duration?: number;
  delay?: number;
  fromY?: number;
  fromScale?: number;
};

export function useFadeIn(options: UseFadeInOptions = {}) {
  const { duration = 320, delay = 0, fromY = 12, fromScale = 1 } = options;

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(fromY)).current;
  const scale = useRef(new Animated.Value(fromScale)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, duration, opacity, scale, translateY]);

  return {
    opacity,
    translateY,
    scale,
    style: {
      opacity,
      transform: [{ translateY }, { scale }],
    },
  };
}
