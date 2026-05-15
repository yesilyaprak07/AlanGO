import { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { ROUTES } from "@/constants/routes";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: 1,
    label: "GÖREV 01 / 04",
    title: "Yürüdüğün her sokak",
    titleAccent: "senin toprağın olur",
    body: "Gerçek dünyada hareket et, çiz, kapat. Çizdiğin alan haritada senin bayrağını taşır.",
    icons: [
      { icon: "🏴", label: "Ele Geçir" },
      { icon: "🛡️", label: "Koru" },
      { icon: "⚔️", label: "Saldır" },
      { icon: "🏆", label: "Kazan" },
    ],
    accentColor: Colors.cyan,
  },
  {
    id: 2,
    label: "GÖREV 02 / 04",
    title: "Bölgeni",
    titleAccent: "büyüt ve savun",
    body: "Her gün yeni alanlar fethet. Rakipler sınırına girdiğinde kalkan kullan ya da karşı saldır.",
    icons: [
      { icon: "📍", label: "Konumla" },
      { icon: "📡", label: "Radar" },
      { icon: "⚡", label: "Hız" },
      { icon: "🎯", label: "Hedef" },
    ],
    accentColor: Colors.purple,
  },
  {
    id: 3,
    label: "GÖREV 03 / 04",
    title: "Liderlik tablosunda",
    titleAccent: "zirveye çık",
    body: "Mahalle, şehir ve ülke genelinde rakiplerini geç. Sezon ödülleri en iyi komutanlara verilir.",
    icons: [
      { icon: "🥇", label: "1. Sıra" },
      { icon: "🌍", label: "Global" },
      { icon: "🔥", label: "Streak" },
      { icon: "👑", label: "Hükümdar" },
    ],
    accentColor: Colors.gold,
  },
  {
    id: 4,
    label: "GÖREV 04 / 04",
    title: "GPS izni",
    titleAccent: "gereklidir",
    body: "Alan hesaplama ve rakip uyarıları için sürekli konum takibi kullanılır. Pil dostu moddur.",
    icons: [
      { icon: "📡", label: "Gerçek zamanlı" },
      { icon: "🗺️", label: "Alan hesap" },
      { icon: "⚠️", label: "Rakip uyarı" },
      { icon: "🔋", label: "Düşük pil" },
    ],
    accentColor: Colors.emerald,
  },
];

// Territory map preview visual
function TerritoryVisual({ accentColor }: { accentColor: string }) {
  return (
    <View style={styles.mapVisual}>
      <View style={[styles.territory1, { borderColor: accentColor, backgroundColor: `${accentColor}18` }]} />
      <View style={[styles.territory2, { borderColor: Colors.coral, backgroundColor: `${Colors.coral}12` }]} />
      <View style={[styles.territory3, { borderColor: Colors.purple, backgroundColor: `${Colors.purple}12` }]} />
      <View style={[styles.playerDot, { backgroundColor: accentColor, shadowColor: accentColor }]} />
      <View style={styles.gridLine1} />
      <View style={styles.gridLine2} />
      <View style={styles.gridLine3} />
      <View style={styles.gridLine4} />
    </View>
  );
}

export default function OnboardingStep1() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const slide = SLIDES[currentSlide];

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: -20, duration: 150, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
      setCurrentSlide((s) => s + 1);
    } else {
      router.push(ROUTES.onboarding.step2);
    }
  };

  const handleSkip = () => {
    router.push(ROUTES.onboarding.step2);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background glow */}
      <View style={[styles.bgGlow, { backgroundColor: slide.accentColor }]} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.slideLabel}>
          <Text style={[styles.slideLabelText, { color: slide.accentColor }]}>{slide.label}</Text>
        </View>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Atla</Text>
        </TouchableOpacity>
      </View>

      {/* Map visual */}
      <TerritoryVisual accentColor={slide.accentColor} />

      {/* Content card */}
      <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }] }]}>
        {/* Progress dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentSlide
                  ? [styles.dotActive, { backgroundColor: slide.accentColor }]
                  : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <Text style={styles.title}>{slide.title}</Text>
        <Text style={[styles.titleAccent, { color: slide.accentColor }]}>{slide.titleAccent}</Text>
        <Text style={styles.body}>{slide.body}</Text>

        {/* Icon row */}
        <View style={styles.iconRow}>
          {slide.icons.map((item, i) => (
            <View key={i} style={styles.iconItem}>
              <View style={[styles.iconCircle, { borderColor: `${slide.accentColor}40` }]}>
                <Text style={styles.iconEmoji}>{item.icon}</Text>
              </View>
              <Text style={styles.iconLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: slide.accentColor }]}
          onPress={handleNext}
        >
          <Text style={styles.ctaText}>
            {currentSlide < SLIDES.length - 1 ? "Devam Et ›" : "Komutan Olarak Başla ›"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  bgGlow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.06,
    top: "5%",
    right: "-20%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
  },
  slideLabel: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  slideLabelText: { fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  skipText: { fontSize: 14, color: Colors.textSecondary },

  // Map visual
  mapVisual: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 0,
    backgroundColor: "#0F0D1A",
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  territory1: {
    position: "absolute",
    width: 130,
    height: 110,
    borderRadius: 12,
    borderWidth: 2,
    top: 40,
    left: 30,
    transform: [{ rotate: "-8deg" }],
  },
  territory2: {
    position: "absolute",
    width: 110,
    height: 90,
    borderRadius: 10,
    borderWidth: 2,
    top: 30,
    right: 20,
    transform: [{ rotate: "5deg" }],
  },
  territory3: {
    position: "absolute",
    width: 90,
    height: 75,
    borderRadius: 8,
    borderWidth: 2,
    bottom: 30,
    left: "30%",
    transform: [{ rotate: "-3deg" }],
  },
  playerDot: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: Colors.background,
    top: "50%",
    left: "45%",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.8,
    elevation: 10,
  },
  gridLine1: { position: "absolute", top: "25%", left: 0, right: 0, height: 1, backgroundColor: "rgba(255,255,255,0.03)" },
  gridLine2: { position: "absolute", top: "50%", left: 0, right: 0, height: 1, backgroundColor: "rgba(255,255,255,0.03)" },
  gridLine3: { position: "absolute", top: 0, bottom: 0, left: "25%", width: 1, backgroundColor: "rgba(255,255,255,0.03)" },
  gridLine4: { position: "absolute", top: 0, bottom: 0, left: "75%", width: 1, backgroundColor: "rgba(255,255,255,0.03)" },

  // Content card
  card: {
    backgroundColor: Colors.surfaceSolid,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 20,
  },
  dot: { height: 3, borderRadius: 2 },
  dotActive: { width: 24 },
  dotInactive: { width: 8, backgroundColor: Colors.surfaceBorder },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.textPrimary,
    lineHeight: 32,
  },
  titleAccent: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 32,
    marginBottom: 14,
  },
  body: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  iconItem: { alignItems: "center", gap: 6 },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconEmoji: { fontSize: 24 },
  iconLabel: { fontSize: 11, color: Colors.textSecondary, textAlign: "center" },
  ctaButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaText: { fontSize: 16, fontWeight: "700", color: Colors.background },
});
