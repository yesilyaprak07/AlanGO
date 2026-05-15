import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Clock3, Gift } from "lucide-react-native";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { theme } from "@/constants/theme";

export type EventTone = "gold" | "cyan" | "purple";

export type EventCardProps = {
  title: string;
  description: string;
  duration: string;
  reward: string;
  tone?: EventTone;
  joined?: boolean;
  onJoinPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

function toneColors(tone: EventTone) {
  if (tone === "gold") {
    return {
      border: "rgba(255, 200, 87, 0.32)",
      bg: "rgba(255, 200, 87, 0.06)",
      text: theme.colors.goldReward,
      button: "gold" as const,
    };
  }
  if (tone === "purple") {
    return {
      border: "rgba(139, 92, 246, 0.30)",
      bg: "rgba(139, 92, 246, 0.08)",
      text: theme.colors.purple,
      button: "ghost" as const,
    };
  }
  return {
    border: "rgba(0, 229, 204, 0.30)",
    bg: "rgba(0, 229, 204, 0.07)",
    text: theme.colors.primaryCyan,
    button: "primary" as const,
  };
}

export function EventCard({
  title,
  description,
  duration,
  reward,
  tone = "cyan",
  joined = false,
  onJoinPress,
  style,
}: EventCardProps) {
  const palette = toneColors(tone);

  return (
    <GlassCard style={[styles.card, { borderColor: palette.border, backgroundColor: joined ? palette.bg : theme.colors.surfaceCard }, style]} contentStyle={styles.content}>
      <View style={styles.headRow}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.toneDot, { backgroundColor: palette.text }]} />
      </View>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Clock3 size={12} color={theme.colors.textSecondary} />
          <Text style={styles.metaText}>Sure: {duration}</Text>
        </View>
        <View style={styles.metaItem}>
          <Gift size={12} color={theme.colors.textSecondary} />
          <Text style={styles.metaText}>Odul: {reward}</Text>
        </View>
      </View>

      {joined ? (
        <Pressable style={styles.joinedState}>
          <Text style={[styles.joinedText, { color: palette.text }]}>Katildin</Text>
        </Pressable>
      ) : (
        <NeonButton label="Katil" size="sm" variant={palette.button} onPress={onJoinPress} />
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  content: {
    gap: theme.spacing.xs,
  },
  headRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  title: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.base,
  },
  toneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.82,
  },
  description: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
    lineHeight: 20,
  },
  metaRow: {
    gap: 7,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  joinedState: {
    minHeight: 40,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  joinedText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
  },
});
