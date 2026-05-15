import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { LockKeyhole, Package } from "lucide-react-native";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { SoonBadge } from "@/components/ui/SoonBadge";
import { theme } from "@/constants/theme";

export type MysteryBoxCardProps = {
  title: string;
  subtitle: string;
  tone?: "cyan" | "gold";
  locked?: boolean;
  premium?: boolean;
  opened?: boolean;
  onOpenPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function MysteryBoxCard({
  title,
  subtitle,
  tone = "cyan",
  locked = false,
  premium = false,
  opened = false,
  onOpenPress,
  style,
}: MysteryBoxCardProps) {
  const accent = tone === "gold" ? theme.colors.goldReward : theme.colors.primaryCyan;

  return (
    <GlassCard style={[styles.card, style]} contentStyle={styles.content}>
      <View style={styles.headerRow}>
        <View style={[styles.iconWrap, { borderColor: `${accent}66`, backgroundColor: `${accent}14` }]}>
          {locked ? <LockKeyhole size={16} color={accent} /> : <Package size={16} color={accent} />}
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {premium ? <SoonBadge label="PREMIUM" /> : null}
      </View>

      {locked ? (
        <View style={styles.lockedRow}>
          <Text style={styles.lockedText}>Kilitli</Text>
        </View>
      ) : (
        <NeonButton
          label={opened ? "Yarin tekrar gel" : "Ac"}
          size="sm"
          variant={tone === "gold" ? "gold" : "primary"}
          disabled={opened}
          onPress={onOpenPress}
        />
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  content: {
    gap: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
  },
  subtitle: {
    marginTop: 2,
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  lockedRow: {
    minHeight: 40,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  lockedText: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
  },
});
