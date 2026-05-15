import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { ROUTES } from "@/constants/routes";

const PLAYER_COLORS = [
  { id: "cyan", hex: "#5BC8E0" },
  { id: "purple", hex: "#A56BE0" },
  { id: "coral", hex: "#F06A5A" },
  { id: "emerald", hex: "#5BD9A0" },
  { id: "gold", hex: "#E8C46A" },
  { id: "blue", hex: "#5B8CE0" },
  { id: "pink", hex: "#E05BAD" },
  { id: "white", hex: "#F5F4F8" },
];

const RANKS = ["Çavuş", "Teğmen", "Yüzbaşı", "Komutan", "General", "Hükümdar"];

export default function OnboardingStep2() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [selectedColor, setSelectedColor] = useState(PLAYER_COLORS[0].hex);

  const handleContinue = () => {
    if (username.trim()) {
      router.push(ROUTES.onboarding.step3);
    }
  };

  const initials = username ? username.slice(0, 2).toUpperCase() : "?";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.stepLabel}>KOMUTAN PROFİLİ</Text>
          <Text style={styles.title}>Kimliğini Oluştur</Text>
          <Text style={styles.subtitle}>Haritada görünecek komutan adını seç</Text>
        </View>

        {/* Avatar Preview */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarGlow} />
          <View style={[styles.avatarHex, { borderColor: selectedColor }]}>
            <View style={[styles.avatarInner, { backgroundColor: `${selectedColor}22` }]}>
              <Text style={[styles.avatarInitial, { color: selectedColor }]}>{initials}</Text>
            </View>
          </View>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>ÇAVUŞ</Text>
          </View>
        </View>

        {/* Rank preview */}
        <View style={styles.rankRow}>
          {RANKS.map((rank, i) => (
            <View key={rank} style={styles.rankItem}>
              <View style={[styles.rankDot, i === 0 && styles.rankDotActive]} />
              <Text style={[styles.rankName, i === 0 && styles.rankNameActive]}>{rank}</Text>
            </View>
          ))}
        </View>

        {/* Username input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>KOMUTAN ADI</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Kullanıcı adını gir"
              placeholderTextColor={Colors.textMuted}
              value={username}
              onChangeText={setUsername}
              maxLength={20}
              autoCapitalize="none"
            />
          </View>
          {username.length > 0 && (
            <Text style={styles.inputHint}>{20 - username.length} karakter kaldı</Text>
          )}
        </View>

        {/* Color picker */}
        <View style={styles.colorSection}>
          <Text style={styles.inputLabel}>BÖLGE RENGİ</Text>
          <View style={styles.colorsGrid}>
            {PLAYER_COLORS.map((color) => (
              <TouchableOpacity
                key={color.id}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color.hex },
                  selectedColor === color.hex && { borderWidth: 3, borderColor: Colors.textPrimary },
                ]}
                onPress={() => setSelectedColor(color.hex)}
              >
                {selectedColor === color.hex && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !username.trim() && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!username.trim()}
        >
          <Text style={styles.continueButtonText}>Profili Oluştur ›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8 },
  stepLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.cyan,
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: { fontSize: 15, color: Colors.textSecondary },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 32,
    position: "relative",
  },
  avatarGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.cyan,
    opacity: 0.1,
    top: 16,
  },
  avatarHex: {
    width: 110,
    height: 110,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarInner: {
    width: 90,
    height: 90,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: { fontSize: 36, fontWeight: "800" },
  rankBadge: {
    backgroundColor: Colors.surfaceSolid,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  rankText: { fontSize: 12, fontWeight: "700", color: Colors.gold, letterSpacing: 1 },
  rankRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  rankItem: { alignItems: "center", gap: 4 },
  rankDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.surfaceBorder },
  rankDotActive: { backgroundColor: Colors.gold },
  rankName: { fontSize: 9, color: Colors.textMuted },
  rankNameActive: { color: Colors.gold, fontWeight: "600" },
  inputSection: { paddingHorizontal: 24, marginBottom: 28 },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  inputWrapper: {
    backgroundColor: Colors.surfaceSolid,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  input: {
    height: 54,
    paddingHorizontal: 18,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  inputHint: { fontSize: 12, color: Colors.textMuted, marginTop: 6 },
  colorSection: { paddingHorizontal: 24, marginBottom: 8 },
  colorsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: { color: Colors.background, fontSize: 18, fontWeight: "bold" },
  footer: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 12 },
  continueButton: {
    backgroundColor: Colors.cyan,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: { opacity: 0.35 },
  continueButtonText: { fontSize: 16, fontWeight: "700", color: Colors.background },
});
