import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { theme } from "@/constants/theme";

export type ClaimStep = {
  id: number;
  label: string;
};

export type ClaimStepperProps = {
  steps: ClaimStep[];
  activeStep: number;
  style?: StyleProp<ViewStyle>;
};

export function ClaimStepper({ steps, activeStep, style }: ClaimStepperProps) {
  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => {
        const isActive = step.id === activeStep;
        const isDone = step.id < activeStep;

        return (
          <View key={step.id} style={styles.stepWrap}>
            <View
              style={[
                styles.bullet,
                isActive && styles.bulletActive,
                isDone && styles.bulletDone,
              ]}
            >
              <Text style={[styles.bulletText, (isActive || isDone) && styles.bulletTextActive]}>
                {step.id}
              </Text>
            </View>

            <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={2}>
              {step.label}
            </Text>

            {index < steps.length - 1 ? (
              <View style={[styles.connector, (isDone || isActive) && styles.connectorActive]} />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
  },
  stepWrap: {
    flex: 1,
    alignItems: "center",
    position: "relative",
    paddingHorizontal: 4,
  },
  bullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  bulletActive: {
    borderColor: theme.colors.primaryCyan,
    backgroundColor: "rgba(0, 229, 204, 0.16)",
  },
  bulletDone: {
    borderColor: theme.colors.success,
    backgroundColor: "rgba(34, 197, 94, 0.18)",
  },
  bulletText: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
  },
  bulletTextActive: {
    color: theme.colors.textPrimary,
  },
  label: {
    marginTop: 6,
    textAlign: "center",
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
    lineHeight: 14,
  },
  labelActive: {
    color: theme.colors.textSecondary,
  },
  connector: {
    position: "absolute",
    top: 13,
    right: -24,
    width: 48,
    height: 2,
    backgroundColor: theme.colors.borderSubtle,
  },
  connectorActive: {
    backgroundColor: theme.colors.primaryCyan,
  },
});
