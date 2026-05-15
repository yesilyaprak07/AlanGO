import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

type RadarPulseProps = {
  size?: number;
  color?: string;
};

export function RadarPulse({ size = 42, color = "rgba(255, 200, 87, 0.65)" }: RadarPulseProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 620,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 620,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View pointerEvents="none" style={[styles.wrap, { width: size, height: size }]}> 
      <Animated.View
        style={[
          styles.ring,
          {
            borderColor: color,
            transform: [
              {
                scale: pulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.82, 1.26],
                }),
              },
            ],
            opacity: pulse.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 0.06],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            borderColor: color,
            transform: [
              {
                scale: pulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1.4],
                }),
              },
            ],
            opacity: pulse.interpolate({
              inputRange: [0, 1],
              outputRange: [0.34, 0],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderRadius: 999,
  },
});
