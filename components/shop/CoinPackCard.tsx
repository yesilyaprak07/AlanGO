import { Image, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";
import { UIImages } from "@/assets/images";
import { theme } from "@/constants/theme";

type CoinPackCardProps = {
  amount: string;
  asset: ImageSourcePropType;
  price: string;
  extraLabel?: string;
  highlightGold?: boolean;
};

export function CoinPackCard({ amount, asset, price, extraLabel, highlightGold }: CoinPackCardProps) {
  const borderColor = highlightGold ? "#FFD700" : "rgba(0, 229, 255, 0.32)";

  return (
    <View style={[styles.card, { borderColor, shadowColor: highlightGold ? "#FFD700" : "#00E5FF", shadowOpacity: highlightGold ? 0.35 : 0.2 }]}> 
      {extraLabel ? (
        <View style={styles.extraBadge}>
          <Text allowFontScaling={false} style={styles.extraText}>{extraLabel}</Text>
        </View>
      ) : null}

      <View style={styles.amountRow}>
        <Image source={UIImages.coin} style={styles.coinIcon} resizeMode="contain" />
        <Text allowFontScaling={false} style={styles.amountText}>{amount}</Text>
      </View>

      <Image source={asset} style={styles.asset} resizeMode="contain" />

      <View style={[styles.pricePill, { borderColor: highlightGold ? "rgba(255, 215, 0, 0.45)" : "rgba(0, 229, 255, 0.4)" }]}>
        <Text allowFontScaling={false} style={styles.priceText}>{price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 96,
    borderRadius: 16,
    borderWidth: 0.6,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 8,
    position: "relative",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 2,
  },
  extraBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#DC2626",
    borderRadius: 999,
    minWidth: 34,
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
    zIndex: 2,
  },
  extraText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 9,
    lineHeight: 10,
    fontFamily: theme.typography.fontFamily.bold,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  coinIcon: {
    width: 13,
    height: 13,
  },
  amountText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  asset: {
    marginTop: 6,
    width: "100%",
    height: 62,
  },
  pricePill: {
    marginTop: 6,
    borderRadius: 10,
    borderWidth: 0.7,
    minHeight: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 229, 255, 0.08)",
  },
  priceText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.semibold,
  },
});
