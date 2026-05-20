import { Clock3 } from "lucide-react-native";
import { Image, StyleSheet, Text, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from "react-native";
import { UIImages } from "@/assets/images";
import { theme } from "@/constants/theme";

type ChestCardProps = {
  title: string;
  rarity: string;
  rarityColor: string;
  asset: ImageSourcePropType;
  duration: string;
  price: number;
  style?: StyleProp<ViewStyle>;
};

export function ChestCard({ title, rarity, rarityColor, asset, duration, price, style }: ChestCardProps) {
  return (
    <View style={[styles.card, style, { borderColor: `${rarityColor}55`, shadowColor: rarityColor }]}>
      <Text allowFontScaling={false} style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {title}
      </Text>
      <Text allowFontScaling={false} style={[styles.rarity, { color: rarityColor }]}>{rarity}</Text>
      <Image source={asset} style={styles.asset} resizeMode="contain" />
      <Text allowFontScaling={false} style={styles.durationLabel} numberOfLines={1}>
        Açılma Süresi
      </Text>
      <View style={styles.durationRow}>
        <Clock3 size={13} color="#22D3EE" />
        <Text allowFontScaling={false} style={styles.durationText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {duration}
        </Text>
      </View>
      <View style={[styles.pricePill, { borderColor: `${rarityColor}66` }]}>
        <Image source={UIImages.gem} style={styles.gem} resizeMode="contain" />
        <Text allowFontScaling={false} style={styles.priceText}>{price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 0.6,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 10,
    alignItems: "center",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 12,
    lineHeight: 15,
    textAlign: "center",
    fontFamily: theme.typography.fontFamily.semibold,
    minHeight: 30,
  },
  rarity: {
    marginTop: 1,
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.regular,
  },
  asset: {
    width: "100%",
    height: 82,
    marginTop: 6,
  },
  durationLabel: {
    marginTop: 1,
    fontSize: 10,
    lineHeight: 12,
    color: "#9CA3AF",
    fontFamily: theme.typography.fontFamily.regular,
  },
  durationRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  durationText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.semibold,
  },
  pricePill: {
    marginTop: 8,
    width: "100%",
    height: 32,
    borderRadius: 11,
    borderWidth: 0.7,
    backgroundColor: "rgba(0, 229, 255, 0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  gem: {
    width: 14,
    height: 14,
  },
  priceText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.semibold,
  },
});
