import { Image, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";
import { UIImages } from "@/assets/images";
import { theme } from "@/constants/theme";

type AvatarCardProps = {
  name: string;
  avatar: ImageSourcePropType;
  price: number;
  owned?: boolean;
};

export function AvatarCard({ name, avatar, price, owned = false }: AvatarCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.avatarWrap}>
        <Image source={avatar} style={styles.avatar} resizeMode="cover" />
      </View>
      <Text style={styles.name}>{name}</Text>
      {owned ? (
        <View style={styles.ownedPill}>
          <Text style={styles.ownedText}>Sahip</Text>
        </View>
      ) : (
        <View style={styles.priceRow}>
          <Image source={UIImages.gem} style={styles.gem} resizeMode="contain" />
          <Text style={styles.price}>{price}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 108,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 10,
    alignItems: "center",
    gap: 8,
  },
  avatarWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(0, 229, 255, 0.1)",
    borderWidth: 2,
    borderColor: "#00E5FF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
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
  ownedPill: {
    minWidth: 56,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.45)",
    backgroundColor: "rgba(0, 229, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  ownedText: {
    color: "#A5F3FC",
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.semibold,
  },
});
