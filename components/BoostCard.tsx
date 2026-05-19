import { Image } from "react-native";
import { StyleSheet, Text, View, type ImageSourcePropType } from "react-native";
import { UIImages } from "@/assets/images";
import { theme } from "@/constants/theme";

type BoostCardProps = {
  title: string;
  description: string;
  asset: ImageSourcePropType;
  price: number;
  accentColor: string;
};

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;

  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function BoostCard({ title, description, asset, price, accentColor }: BoostCardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          borderColor: hexToRgba(accentColor, 0.3),
          shadowColor: accentColor,
        },
      ]}
    >
      <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      <Image source={asset} style={styles.asset} resizeMode="contain" />

      <View style={[styles.pricePill, { borderColor: hexToRgba(accentColor, 0.55), backgroundColor: hexToRgba(accentColor, 0.08) }]}>
        <Image source={UIImages.gem} style={styles.gemIcon} resizeMode="contain" />
        <Text style={styles.priceText}>{price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 14,
    alignItems: "center",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: theme.typography.fontFamily.semibold,
    textAlign: "center",
  },
  description: {
    marginTop: 6,
    minHeight: 30,
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 15,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: "center",
  },
  asset: {
    marginTop: 10,
    width: "100%",
    height: 120,
  },
  pricePill: {
    marginTop: 8,
    width: "100%",
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  gemIcon: {
    width: 18,
    height: 18,
  },
  priceText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.semibold,
  },
});
