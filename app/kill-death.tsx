import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Unlink, ArrowRight } from "lucide-react-native";
import { Colors } from "@/constants/colors";
export default function KillDeathScreen() {
  const router = useRouter();
  const handleReturn = () => {
    router.replace("/(tabs)/map");
  };
  const handleRevenge = () => {
    router.push("/active-game");
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.redOverlay} />
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconGlow} />
          <Unlink size={64} color={Colors.textPrimary} strokeWidth={2} />
        </View>
        {/* Title */} <Text style={styles.title}>Çizgin Kesildi!</Text>
        <Text style={styles.subtitle}>KaraKurt seni öldürdü</Text>
        {/* Warning */}
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>Aktif çizgin sıfırlandı</Text>
        </View>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0 m²</Text>
            <Text style={styles.statLabel}>Kaybedilen Alan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>-50</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
        </View>
      </View>
      {/* Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.returnButton} onPress={handleReturn}>
          <Text style={styles.returnText}>Haritaya Dön</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.revengeButton} onPress={handleRevenge}>
          <Text style={styles.revengeText}>İntikam Al</Text>
          <ArrowRight size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  redOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 59, 59, 0.08)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconContainer: { position: "relative", marginBottom: 40 },
  iconGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.danger,
    opacity: 0.2,
    top: -10,
    left: -10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  subtitle: { fontSize: 18, color: Colors.textSecondary, marginBottom: 24 },
  warningBox: {
    backgroundColor: "rgba(255, 59, 59, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 40,
  },
  warningText: { fontSize: 14, color: Colors.danger, fontWeight: "500" },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  statItem: { alignItems: "center", paddingHorizontal: 24 },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.danger,
    marginBottom: 4,
  },
  statLabel: { fontSize: 13, color: Colors.textSecondary },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.surfaceBorder },
  footer: { paddingHorizontal: 24, paddingBottom: 40, gap: 12 },
  returnButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  returnText: { fontSize: 16, fontWeight: "600", color: Colors.background },
  revengeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 8,
  },
  revengeText: { fontSize: 16, fontWeight: "600", color: Colors.primary },
});
