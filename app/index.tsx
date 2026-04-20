import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Pentagon shape as a View composition
function PentagonIcon({ size = 80 }: { size?: number }) {
  return (
    <View style={[styles.pentagonOuter, { width: size, height: size }]}>
      <View style={styles.pentagonInner}>
        <View style={styles.pentagonDot} />
      </View>
    </View>
  );
}

export default function SplashScreen() {
  const router = useRouter();
  const glowAnim = useRef(new Animated.Value(0.6)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.6, duration: 1800, useNativeDriver: true }),
      ])
    ).start();

    Animated.timing(progressAnim, { toValue: 1, duration: 2600, useNativeDriver: false }).start();

    const timer = setTimeout(async () => {
      const done = await AsyncStorage.getItem("alango_onboarding_done");
      if (done === "true") {
        router.replace("/(tabs)/map");
      } else {
        router.replace("/(onboarding)/step1");
      }
    }, 3200);
    return () => clearTimeout(timer);
  }, [router, glowAnim, progressAnim, fadeAnim]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Background glow blobs */}
      <Animated.View style={[styles.glowBlob1, { opacity: glowAnim }]} />
      <Animated.View style={[styles.glowBlob2, { opacity: glowAnim }]} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* App icon */}
        <View style={styles.iconWrapper}>
          <Animated.View style={[styles.iconGlow, { opacity: glowAnim }]} />
          <View style={styles.iconContainer}>
            <View style={styles.iconBg}>
              <PentagonIcon size={52} />
            </View>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={styles.titleAlan}>Alan</Text>
          <Text style={styles.titleGO}>GO</Text>
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>ELE GEÇİR · SAVUN · HÜKMET</Text>
      </Animated.View>

      {/* Bottom loading section */}
      <View style={styles.loadingSection}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.loadingText}>BAĞLANIYOR</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  glowBlob1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.cyan,
    opacity: 0.06,
    top: "15%",
    left: "-20%",
  },
  glowBlob2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.purple,
    opacity: 0.08,
    bottom: "20%",
    right: "-15%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    position: "relative",
    marginBottom: 32,
  },
  iconGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.cyan,
    opacity: 0.15,
    top: -20,
    left: -20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: "rgba(91, 200, 224, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(91, 200, 224, 0.3)",
  },
  iconBg: {
    width: 88,
    height: 88,
    borderRadius: 20,
    backgroundColor: "rgba(91, 200, 224, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Pentagon approximation
  pentagonOuter: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.cyan,
    borderRadius: 8,
    transform: [{ rotate: "0deg" }],
  },
  pentagonInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.cyan,
    justifyContent: "center",
    alignItems: "center",
  },
  pentagonDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.cyan,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 16,
  },
  titleAlan: {
    fontSize: 52,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  titleGO: {
    fontSize: 52,
    fontWeight: "800",
    color: Colors.cyan,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
    letterSpacing: 3,
  },
  loadingSection: {
    width: "60%",
    alignItems: "center",
    paddingBottom: 56,
  },
  progressTrack: {
    width: "100%",
    height: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 1,
    overflow: "hidden",
    marginBottom: 14,
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.cyan,
    borderRadius: 1,
  },
  loadingText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textMuted,
    letterSpacing: 3,
  },
});
