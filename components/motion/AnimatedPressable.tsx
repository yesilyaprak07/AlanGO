import React, { PropsWithChildren, useRef } from "react";
import { Animated, Easing, GestureResponderEvent, Insets, Pressable, StyleProp, ViewStyle } from "react-native";
import { theme } from "@/constants/theme";

type AnimatedPressableProps = PropsWithChildren<{
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  scaleTo?: number;
  idlePulse?: boolean;
  hitSlop?: number | Insets;
}>;

export function AnimatedPressable({
  children,
  onPress,
  disabled = false,
  style,
  pressedStyle,
  scaleTo = 0.97,
  idlePulse = false,
  hitSlop = theme.ux.hitSlop,
}: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const idle = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!idlePulse || disabled) {
      idle.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(idle, {
          toValue: 1,
          duration: 860,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(idle, {
          toValue: 0,
          duration: 860,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [disabled, idle, idlePulse]);

  const animateTo = (value: number, duration: number) => {
    Animated.timing(scale, {
      toValue: value,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [
          { scale },
          {
            scale: idle.interpolate({ inputRange: [0, 1], outputRange: [1, 1.012] }),
          },
        ],
      }}
    >
      <Pressable
        disabled={disabled}
        onPress={onPress}
        hitSlop={hitSlop}
        pressRetentionOffset={{ top: 14, bottom: 14, left: 14, right: 14 }}
        android_ripple={{ color: "rgba(255,255,255,0.08)", borderless: false }}
        onPressIn={() => animateTo(scaleTo, 120)}
        onPressOut={() => animateTo(1, 180)}
        style={({ pressed }) => [style, pressed && pressedStyle]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
