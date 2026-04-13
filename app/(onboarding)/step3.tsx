import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OnboardingStep3() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(async () => {
      await AsyncStorage.setItem("alango_onboarding_done", "true");
      router.replace("/(auth)/signin");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router, scaleAnim, opacityAnim, textAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.checkContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.checkCircle}>
            <Check size={64} color={Colors.background} strokeWidth={3} />
          </View>
        </Animated.View>
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textAnim,
              transform: [
                {
                  translateY: textAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.title}>Hazırsın!</Text>
          <Text style={styles.subtitle}>
            Profilin oluşturuldu. Şimdi giriş yaparak oynamaya başlayabilirsin.
          </Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.progressContainer,
            {
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: opacityAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>Yönlendiriliyorsun...</Text>
        </Animated.View>
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
  checkContainer: {
    marginBottom: 40,
  },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.success,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30,
    shadowOpacity: 0.5,
    elevation: 20,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
  },
  progressTrack: {
    width: "60%",
    height: 3,
    backgroundColor: Colors.surfaceBorder,
    borderRadius: 1.5,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});