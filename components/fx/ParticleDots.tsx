import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, StyleSheet, ViewStyle } from "react-native";

type ParticleDotsProps = {
  count?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function ParticleDots({ count = 14, color = "rgba(255,255,255,0.36)", style }: ParticleDotsProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 820,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 820,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View pointerEvents="none" style={[styles.layer, style]}>
      {Array.from({ length: count }).map((_, idx) => (
        <Animated.View
          key={idx}
          style={[
            styles.dot,
            {
              backgroundColor: color,
              left: `${6 + ((idx * 17) % 86)}%`,
              top: `${10 + ((idx * 9) % 78)}%`,
              opacity: pulse.interpolate({
                inputRange: [0, 1],
                outputRange: [0.12 + (idx % 4) * 0.05, 0.52],
              }),
              transform: [
                {
                  translateY: pulse.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -(2 + (idx % 3))],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
  dot: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 2,
  },
});
