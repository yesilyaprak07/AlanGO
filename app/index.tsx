import { useEffect } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/lib/auth";
import { ROUTES } from "@/constants/routes";

export default function SplashScreen() {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(async () => {
      if (session) {
        router.replace(ROUTES.tabs.map);
      } else {
        const done = await AsyncStorage.getItem("alango_onboarding_done");
        if (done === "true") {
          router.replace(ROUTES.auth.signin);
        } else {
          router.replace(ROUTES.onboarding.step1);
        }
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [loading, session, router]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/splash-icon.png")}
        resizeMode="cover"
        style={styles.fullscreenImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullscreenImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

