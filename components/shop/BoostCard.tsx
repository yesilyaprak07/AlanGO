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
          <Text style={[styles.badgeText, { color: accentColor }]}>{badgeText}</Text>
        </View>
      ) : null}
      <Text style={[styles.title, compact && styles.titleCompact, { color: accentColor }]} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>
      <Image source={asset} style={[styles.asset, compact && styles.assetCompact]} resizeMode="contain" />
      <View style={[styles.pricePill, { borderColor: rgba(accentColor, 0.5), backgroundColor: rgba(accentColor, 0.08) }]}>
        <Image source={UIImages.gem} style={styles.currencyIcon} resizeMode="contain" />
        <Text style={styles.price}>{price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 12,
    alignItems: "center",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 4,
    minHeight: 220,
    position: "relative",
  },
  cardCompact: {
    minHeight: 220,
  },
  title: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",
    fontFamily: theme.typography.fontFamily.semibold,
    width: "100%",
  },
  titleCompact: {
    fontSize: 13,
    lineHeight: 16,
  },
  description: {
    marginTop: 5,
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 14,
    minHeight: 28,
    textAlign: "center",
    fontFamily: theme.typography.fontFamily.regular,
  },
  asset: {
    width: "100%",
    height: 120,
    marginTop: 8,
  },
  assetCompact: {
    height: 90,
  },
  pricePill: {
    marginTop: "auto",
    width: "100%",
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  currencyIcon: {
    width: 18,
    height: 18,
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
    borderWidth: 1,
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
