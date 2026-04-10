import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
  const router = useRouter();
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.5, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    Animated.timing(progressAnim, { toValue: 1, duration: 2500, useNativeDriver: false }).start();

    const timer = setTimeout(() => { router.replace("/(onboarding)/step1"); }, 3000);
    return () => clearTimeout(timer);
  }, [router, glowAnim, progressAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.logoCircle, { opacity: glowAnim, shadowOpacity: glowAnim }]}>
          <View style={styles.innerCircle}>
            <Text style={styles.logoText}>A</Text>
          </View>
        </Animated.View>
        <Text style={styles.title}>AlanGO</Text>
        <Text style={styles.tagline}>Mahallenin sahibi ol</Text>
      </View>
      <View style={styles.loadingContainer}>
        <View style={styles.loadingTrack}>
          <Animated.View style={[styles.loadingBar, { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }]} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  logoCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(0, 240, 255, 0.2)", justifyContent: "center", alignItems: "center", shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 }, shadowRadius: 30, elevation: 20 },
  innerCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, justifyContent: "center", alignItems: "center" },
  logoText: { fontSize: 40, fontWeight: "bold", color: Colors.background },
  title: { fontSize: 32, fontWeight: "bold", color: Colors.textPrimary, marginTop: 24 },
  tagline: { fontSize: 16, color: Colors.textSecondary, marginTop: 8 },
  loadingContainer: { paddingHorizontal: 60, paddingBottom: 60 },
  loadingTrack: { height: 2, backgroundColor: Colors.surfaceBorder, borderRadius: 1, overflow: "hidden" },
  loadingBar: { height: "100%", backgroundColor: Colors.primary },
});
