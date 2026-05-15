import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { CheckCircle2, Coins, Gift, Sparkles } from "lucide-react-native";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { theme } from "@/constants/theme";

export type MissionCardProps = {
  title: string;
  current: number;
  total: number;
  xp: number;
  coin: number;
  mysteryBox: number;
  tone?: "cyan" | "gold";
  onProgressPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function MissionCard({
  title,
  current,
  total,
  xp,
  coin,
  mysteryBox,
  tone = "cyan",
  onProgressPress,
  style,
}: MissionCardProps) {
  const progress = total > 0 ? (Math.min(current, total) / total) * 100 : 0;
  const done = current >= total;
  const accent = tone === "gold" ? theme.colors.goldReward : theme.colors.primaryCyan;

  return (
    <GlassCard style={style} contentStyle={styles.content}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.statusBadge, done ? styles.statusDone : styles.statusLive]}>
          <Text style={[styles.statusText, { color: done ? theme.colors.success : accent }]}>{done ? "Tamamlandi" : "Devam Ediyor"}</Text>
        </View>
      </View>

      <Text style={styles.progressMeta}>{current} / {total}</Text>
      <ProgressBar value={progress} fillStyle={{ backgroundColor: accent }} />

      <View style={styles.rewardRow}>
        <View style={styles.rewardItem}>
          <Sparkles size={13} color={theme.colors.primaryCyan} />
          <Text style={styles.rewardText}>+{xp} XP</Text>
        </View>
        <View style={styles.rewardItem}>
          <Coins size={13} color={theme.colors.goldReward} />
          <Text style={styles.rewardText}>+{coin} Coin</Text>
        </View>
        <View style={styles.rewardItem}>
          <Gift size={13} color={theme.colors.textSecondary} />
          <Text style={styles.rewardText}>+{mysteryBox} Box</Text>
        </View>
      </View>

      <Pressable
        onPress={onProgressPress}
        disabled={done || !onProgressPress}
        style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed, done && styles.actionBtnDone]}
      >
        <CheckCircle2 size={14} color={done ? theme.colors.textMuted : theme.colors.primaryCyan} />
        <Text style={[styles.actionText, done && styles.actionTextDone]}>{done ? "Tamamlandi" : "Ilerleme Ekle"}</Text>
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.xs,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.xs,
  },
  title: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
  },
  statusBadge: {
    borderRadius: theme.radius.full,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusDone: {
    borderColor: "rgba(34, 197, 94, 0.36)",
    backgroundColor: "rgba(34, 197, 94, 0.10)",
  },
  statusLive: {
    borderColor: "rgba(0, 229, 204, 0.36)",
    backgroundColor: "rgba(0, 229, 204, 0.08)",
  },
  statusText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 10,
  },
  progressMeta: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
  },
  rewardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
  },
  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rewardText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
  },
  actionBtn: {
    minHeight: 38,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 204, 0.34)",
    backgroundColor: "rgba(0, 229, 204, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  actionBtnDone: {
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
  },
  actionText: {
    color: theme.colors.primaryCyan,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 12,
  },
  actionTextDone: {
    color: theme.colors.textMuted,
  },
  pressed: {
    opacity: 0.84,
  },
});
