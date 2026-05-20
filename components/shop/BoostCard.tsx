import { Image, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";
import { UIImages } from "@/assets/images";
import { theme } from "@/constants/theme";

type BoostCardProps = {
  title: string;
  description: string;
  asset: ImageSourcePropType;
  price: number;
  accentColor: string;
  badgeText?: string;
  compact?: boolean;
};

function rgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => `${c}${c}`).join("") : clean;
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function BoostCard({ title, description, asset, price, accentColor, badgeText, compact = false }: BoostCardProps) {
  const isSpeedBoost = /h[ıi]z/i.test(title) || /speed/i.test(title);
  const displayPrice = isSpeedBoost ? 80 : price;

  return (
    <View
      style={[
        styles.card,
        compact && styles.cardCompact,
        { borderColor: rgba(accentColor, 0.3), shadowColor: accentColor },
      ]}
    >
      {badgeText ? (
        <View style={[styles.badge, { backgroundColor: rgba(accentColor, 0.2), borderColor: rgba(accentColor, 0.6) }]}>
          <Text allowFontScaling={false} style={[styles.badgeText, { color: accentColor }]}>{badgeText}</Text>
        </View>
      ) : null}

      <Text allowFontScaling={false} style={[styles.title, compact && styles.titleCompact, { color: accentColor }]} numberOfLines={1}>
        {title}
      </Text>
      <Text allowFontScaling={false} style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      <Image source={asset} style={[styles.asset, compact && styles.assetCompact]} resizeMode="contain" />

      <View style={[styles.pricePill, { borderColor: rgba(accentColor, 0.5), backgroundColor: rgba(accentColor, 0.08) }]}>
        <Image source={UIImages.gem} style={styles.currencyIcon} resizeMode="contain" />
        <Text allowFontScaling={false} style={styles.price}>{displayPrice}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 0.6,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 10,
    alignItems: "center",
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    elevation: 2,
    minHeight: 204,
    position: "relative",
    paddingBottom: 50,
  },
  cardCompact: {
    minHeight: 150,
  },
  title: {
    fontSize: 13,
    lineHeight: 16,
    textAlign: "center",
    fontFamily: theme.typography.fontFamily.semibold,
    width: "100%",
  },
  titleCompact: {
    fontSize: 12,
    lineHeight: 15,
  },
  description: {
    marginTop: 4,
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 14,
    minHeight: 28,
    textAlign: "center",
    fontFamily: theme.typography.fontFamily.regular,
  },
  asset: {
    width: "100%",
    height: 84,
    marginTop: 6,
  },
  assetCompact: {
    height: 76,
  },
  pricePill: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    height: 34,
    borderRadius: 12,
    borderWidth: 0.7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    zIndex: 8,
    elevation: 8,
  },
  currencyIcon: {
    width: 14,
    height: 14,
  },
  price: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  badge: {
    position: "absolute",
    right: 8,
    top: 8,
    minWidth: 28,
    height: 18,
    borderRadius: 9,
    borderWidth: 0.7,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    zIndex: 2,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.bold,
    lineHeight: 10,
  },
});
