import { Info } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";

type SectionHeaderProps = {
  title: string;
};

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text allowFontScaling={false} style={styles.title}>{title}</Text>
      <Info size={14} color="#6B7280" strokeWidth={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
    letterSpacing: 1,
    fontFamily: theme.typography.fontFamily.semibold,
  },
});
