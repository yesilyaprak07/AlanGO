import { Image, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";
import { UIImages } from "@/assets/images";
import { theme } from "@/constants/theme";

type FrameCardProps = {
  frame: ImageSourcePropType;
  price: number;
};

export function FrameCard({ frame, price }: FrameCardProps) {
  return (
    <View style={styles.card}>
      <Image source={frame} style={styles.image} resizeMode="contain" />
      <View style={styles.priceRow}>
        <Image source={UIImages.gem} style={styles.gem} resizeMode="contain" />
        <Text style={styles.price}>{price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 100,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 10,
    alignItems: "center",
    gap: 8,
  },
  image: {
    width: 66,
    height: 66,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  gem: {
    width: 14,
    height: 14,
  },
  price: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.semibold,
  },
});
