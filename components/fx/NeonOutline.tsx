import React, { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, StyleSheet, ViewStyle } from "react-native";

type NeonOutlineProps = PropsWithChildren<{
  color?: string;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}>;

export function NeonOutline({
  children,
  color = "rgba(0, 229, 204, 0.9)",
  borderRadius = 16,
  style,
}: NeonOutlineProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 580,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 580,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View style={style}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.outline,
          {
            borderRadius,
            borderColor: color,
            opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.95] }),
            transform: [
              {
                scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.012] }),
              },
            ],
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outline: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
  },
});
