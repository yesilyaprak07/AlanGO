import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";

const PLAYER_COLORS = [
  { id: "cyan", hex: "#00F0FF" },
  { id: "red", hex: "#FF3B3B" },
  { id: "purple", hex: "#9C27B0" },
  { id: "green", hex: "#00E676" },
  { id: "orange", hex: "#FF6D00" },
  { id: "pink", hex: "#FF4081" },
  { id: "yellow", hex: "#FFD600" },
  { id: "white", hex: "#FFFFFF" },
];

export default function OnboardingStep2() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [selectedColor, setSelectedColor] = useState(PLAYER_COLORS[0].hex);

  const handleContinue = () => {
    if (username.trim()) {
      router.push("/(onboarding)/step3");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Profilini Oluştur</Text>
          <Text style={styles.subtitle}>
            Oyun içinde görünecek kullanıcı adını seç
          </Text>
          <View style={styles.avatarPreview}>
            <View style={[styles.avatarCircle, { backgroundColor: selectedColor }]}>
              <Text style={styles.avatarInitial}>
                {username ? username[0].toUpperCase() : "?"}
              </Text>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Kullanıcı Adı</Text>
            <TextInput
              style={styles.input}
              placeholder="Kullanıcı adını gir"
              placeholderTextColor={Colors.textSecondary}
              value={username}
              onChangeText={setUsername}
              maxLength={20}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.colorsContainer}>
            <Text style={styles.inputLabel}>Oyuncu Rengi</Text>
            <View style={styles.colorsGrid}>
              {PLAYER_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color.hex },
                    selectedColor === color.hex && styles.selectedColor,
                  ]}
                  onPress={() => setSelectedColor(color.hex)}
                >
                  {selectedColor === color.hex && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !username.trim() && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!username.trim()}
        >
          <Text style={styles.continueButtonText}>Devam Et</Text>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 40,
  },
  avatarPreview: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    shadowOpacity: 0.3,
    elevation: 10,
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.background,
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  colorsContainer: {
    marginBottom: 24,
  },
  colorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: Colors.textPrimary,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: "bold",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.background,
  },
});