import React from "react";
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";
import { Bell, Gem, Plus } from "lucide-react-native";
import { theme } from "@/constants/theme";

type TopHudBarProps = {
  onAvatarPress?: () => void;
  onBellPress?: () => void;
  avatarInitials?: string;
  avatarImageSource?: ImageSourcePropType;
  avatarFrameSource?: ImageSourcePropType;
  levelText?: string;
  coinText: string;
  gemText: string;
  bellCount?: number;
};

export function TopHudBar({
  onAvatarPress,
  onBellPress,
  avatarInitials = "AL",
  avatarImageSource,
  avatarFrameSource,
  levelText = "24",
  coinText,
  gemText,
  bellCount = 0,
}: TopHudBarProps) {
  return (
    <View style={styles.topHudRow}>
      <Pressable style={styles.avatarWrap} onPress={onAvatarPress}>
        {avatarImageSource ? (
          <Image source={avatarImageSource} style={styles.avatarImage} resizeMode="cover" />
        ) : (
          <View style={styles.avatarCore}>
            <Text allowFontScaling={false} style={styles.avatarText}>{avatarInitials}</Text>
          </View>
        )}

        {avatarFrameSource ? <Image source={avatarFrameSource} style={styles.avatarFrame} resizeMode="contain" /> : null}

        <View style={styles.levelChip}>
          <Text allowFontScaling={false} style={styles.levelText}>{levelText}</Text>
        </View>
      </Pressable>

      <View style={styles.currencyChip}>
        <View style={styles.coinIcon} />
        <Text allowFontScaling={false} style={styles.currencyText}>{coinText}</Text>
        <Plus size={22} color="#10F4E8" strokeWidth={1.5} />
      </View>

      <View style={styles.currencyChip}>
        <Gem size={20} color="#7F9CFF" fill="#7F9CFF" />
        <Text allowFontScaling={false} style={styles.currencyText}>{gemText}</Text>
        <Plus size={22} color="#10F4E8" strokeWidth={1.5} />
      </View>

      <Pressable style={styles.bellButton} onPress={onBellPress}>
        <Bell size={25} color="#FFFFFF" />
        {bellCount > 0 ? (
          <View style={styles.bellBadge}>
            <Text allowFontScaling={false} style={styles.bellBadgeText}>{bellCount}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topHudRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 1,
  },
  avatarWrap: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1.5,
    borderColor: "rgba(16, 244, 232, 0.85)",
    backgroundColor: "rgba(8, 18, 28, 0.65)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    shadowColor: "#10F4E8",
    shadowOpacity: 0.42,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    elevation: 4,
  },
  avatarCore: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 19,
  },
  avatarImage: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
    left: 7,
    top: 7,
    zIndex: 1,
  },
  avatarFrame: {
    width: 66,
    height: 66,
    zIndex: 2,
  },
  levelChip: {
    position: "absolute",
    right: -6,
    bottom: -5,
    minWidth: 28,
    height: 28,
    borderRadius: 11,
    backgroundColor: "rgba(8, 18, 28, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.42)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    zIndex: 3,
  },
  levelText: {
    color: "#FFFFFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 16,
  },
  currencyChip: {
    width: 109,
    height: 42,
    borderRadius: 22,
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  coinIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFC83D",
    borderWidth: 1,
    borderColor: "#FFE08E",
  },
  currencyText: {
    color: "#FFFFFF",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 16,
  },
  bellButton: {
    width: 55,
    height: 55,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.22)",
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    alignItems: "center",
    justifyContent: "center",
  },
  bellBadge: {
    position: "absolute",
    right: -4,
    top: -4,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#10F4E8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  bellBadgeText: {
    color: "#043038",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 12,
  },
});
