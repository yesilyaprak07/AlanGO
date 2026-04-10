import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Sayfa Bulunamadı</Text>
        <Text style={styles.subtitle}>Aradığınız sayfa mevcut değil veya taşınmış.</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.replace("/(tabs)/map")}>
        <ArrowLeft size={20} color={Colors.background} />
        <Text style={styles.buttonText}>Haritaya Dön</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: "center", alignItems: "center", padding: 24 },
  content: { alignItems: "center" },
  code: { fontSize: 80, fontWeight: "bold", color: Colors.primary, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "600", color: Colors.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: "center" },
  button: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, marginTop: 40, gap: 8 },
  buttonText: { fontSize: 16, fontWeight: "600", color: Colors.background },
});
