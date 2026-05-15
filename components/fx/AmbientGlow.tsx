import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, StyleSheet, ViewStyle } from "react-native";

type AmbientGlowProps = {
  style?: StyleProp<ViewStyle>;
  cyanOpacity?: number;
  purpleOpacity?: number;
};

export function AmbientGlow({ style, cyanOpacity = 0.1, purpleOpacity = 0.09 }: AmbientGlowProps) {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 3600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 3600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [drift]);

  const cyanX = drift.interpolate({ inputRange: [0, 1], outputRange: [-14, 12] });
  const cyanY = drift.interpolate({ inputRange: [0, 1], outputRange: [-10, 8] });
  const purpleX = drift.interpolate({ inputRange: [0, 1], outputRange: [12, -14] });
  const purpleY = drift.interpolate({ inputRange: [0, 1], outputRange: [9, -10] });

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, style]}>
      <Animated.View
        style={[
          styles.cyanBlob,
          {
            opacity: cyanOpacity,
            transform: [{ translateX: cyanX }, { translateY: cyanY }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.purpleBlob,
          {
            opacity: purpleOpacity,
            transform: [{ translateX: purpleX }, { translateY: purpleY }],
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
  },
  cyanBlob: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    top: -80,
    right: -70,
    backgroundColor: "#00E5CC",
  },
  purpleBlob: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    left: -80,
    bottom: -70,
    backgroundColor: "#8B5CF6",
  },
});
