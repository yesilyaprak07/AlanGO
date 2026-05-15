import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { theme } from "@/constants/theme";

export type CyberTextInputProps = TextInputProps & {
  label?: string;
  leftIcon?: React.ReactNode | string;
  secureToggle?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export function CyberTextInput({
  label,
  leftIcon,
  secureToggle = false,
  containerStyle,
  secureTextEntry,
  ...inputProps
}: CyberTextInputProps) {
  const [showSecure, setShowSecure] = useState(false);
  const [focused, setFocused] = useState(false);
  const glowAnim = useRef(new Animated.Value(0)).current;
  const isSecure = secureToggle ? !showSecure : secureTextEntry;

  const animateFocus = (toValue: number) => {
    Animated.timing(glowAnim, {
      toValue,
      duration: 220,
      useNativeDriver: false,
    }).start();
  };

  const animatedBorderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.borderSubtle, "rgba(0, 229, 204, 0.72)"],
  });

  const animatedBg = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.surfaceCard, "rgba(0, 229, 204, 0.08)"],
  });

  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Animated.View style={[styles.inputWrap, { borderColor: animatedBorderColor, backgroundColor: animatedBg }]}>
        {typeof leftIcon === "string" ? <Text style={styles.leftIconText}>{leftIcon}</Text> : leftIcon}

        <TextInput
          {...inputProps}
          secureTextEntry={isSecure}
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
          onFocus={(event) => {
            setFocused(true);
            animateFocus(1);
            inputProps.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            animateFocus(0);
            inputProps.onBlur?.(event);
          }}
        />

        {secureToggle ? (
          <Pressable onPress={() => setShowSecure((prev) => !prev)} style={[styles.toggleBtn, focused && styles.toggleBtnFocused]}>
            {showSecure ? (
              <EyeOff size={18} color={theme.colors.textSecondary} />
            ) : (
              <Eye size={18} color={theme.colors.textSecondary} />
            )}
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
    marginBottom: theme.spacing.xs,
  },
  inputWrap: {
    minHeight: 54,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
  },
  leftIconText: {
    color: theme.colors.primaryCyan,
    fontSize: theme.typography.size.base,
    marginRight: theme.spacing.xs,
  },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.base,
    paddingVertical: theme.spacing.sm,
  },
  toggleBtn: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
  },
  toggleBtnFocused: {
    opacity: 0.95,
  },
});
