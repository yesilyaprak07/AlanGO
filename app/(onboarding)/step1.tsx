import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin } from "lucide-react-native";
import { Colors } from "@/constants/colors";

export default function OnboardingStep1() {
  const router = useRouter();

  const handleAllow = () => {
    router.push("/(onboarding)/step2");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MapPin size={48} color={Colors.primary} />
        </View>
        <Text style={styles.title}>GPS Gerekli</Text>
        <Text style={styles.subtitle}>
          Alan kapmak için konum erişimine izin vermeniz gerekiyor. Oyun sırasında
          konumunuz diğer oyuncularla paylaşılacak.
        </Text>
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Gerçek zamanlı konum takibi</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Alan hesaplama ve sınır kontrolü</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Rakip yakınlık uyarıları</Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.allowButton} onPress={handleAllow}>
          <Text style={styles.allowButtonText}>İzin Ver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Daha Sonra</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  features: {
    width: "100%",
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  featureText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  allowButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  allowButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.background,
  },
  skipButton: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  skipButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});