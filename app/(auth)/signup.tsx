import { useState } from "react";
import {
  Alert,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Lock, Mail, User } from "lucide-react-native";
import { theme } from "@/constants/theme";
import { CyberTextInput, NeonButton } from "@/components/ui";
import { useFadeIn } from "@/hooks/useFadeIn";
import { getScreenBottomPadding } from "@/constants/safeArea";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/lib/auth";

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formAnim = useFadeIn({ duration: 320, delay: 40, fromY: 14, fromScale: 0.98 });
  const legalAnim = useFadeIn({ duration: 240, delay: 120, fromY: 8 });

  const handleSignUp = async () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password || !confirmPassword) {
      Alert.alert("Eksik bilgi", "Lutfen tum gerekli alanlari doldurun.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Sifre hatasi", "Sifreler birbiriyle eslesmiyor.");
      return;
    }

    try {
      setSubmitting(true);
      const { error, needsEmailConfirmation } = await signUp(
        normalizedEmail,
        password,
        username.trim() || undefined
      );

      if (error) {
        Alert.alert("Kayit basarisiz", `Hesap olusturulamadi: ${error}`);
        return;
      }

      if (needsEmailConfirmation) {
        Alert.alert("E-postani kontrol et", "Kaydini tamamlamak icin e-posta kutunu kontrol et.");
        router.replace(ROUTES.auth.signin);
        return;
      }

      router.replace(ROUTES.tabs.map);
    } catch {
      Alert.alert("Hata", "Beklenmeyen bir hata olustu. Lutfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/registerback.png")}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 12 }]}
          onPress={() => router.push(ROUTES.auth.signin)}
          activeOpacity={0.85}
        >
          <ChevronLeft size={18} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: getScreenBottomPadding(insets.bottom, theme.spacing.xl) }]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={[styles.formArea, formAnim.style]}>
              <CyberTextInput
                containerStyle={styles.inputGroup}
                inputWrapStyle={styles.compactInputWrap}
                inputTextStyle={styles.compactInputText}
                leftIcon={<User size={14} color={theme.colors.textSecondary} />}
                placeholder="  Komutan adın"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <CyberTextInput
                containerStyle={styles.inputGroup}
                inputWrapStyle={styles.compactInputWrap}
                inputTextStyle={styles.compactInputText}
                leftIcon={<Mail size={14} color={theme.colors.textSecondary} />}
                placeholder="  E-posta adresin"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <CyberTextInput
                containerStyle={styles.inputGroup}
                inputWrapStyle={styles.compactInputWrap}
                inputTextStyle={styles.compactInputText}
                leftIcon={<Lock size={14} color={theme.colors.textSecondary} />}
                placeholder="  Şifren"
                value={password}
                onChangeText={setPassword}
                secureToggle
              />
              <CyberTextInput
                containerStyle={styles.inputGroup}
                inputWrapStyle={styles.compactInputWrap}
                inputTextStyle={styles.compactInputText}
                leftIcon={<Lock size={14} color={theme.colors.textSecondary} />}
                placeholder="  Şifren tekrar"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureToggle
              />

              <NeonButton
                label="Hesap Oluştur"
                fullWidth
                style={styles.primaryButton}
                textStyle={styles.primaryButtonText}
                loading={submitting}
                disabled={submitting}
                onPress={handleSignUp}
              />
              <NeonButton
                label="Giriş ekranına dön"
                fullWidth
                variant="ghost"
                style={styles.socialButton}
                onPress={() => router.push(ROUTES.auth.signin)}
              />
            </Animated.View>

            <Animated.View style={[styles.legalWrap, legalAnim.style]}>
              <Text style={styles.legalText}>
                Devam ederek, <Text style={styles.legalLink}>Kullanım Koşulları</Text> ve <Text style={styles.legalLink}>Gizlilik Politikası</Text>&apos;nı kabul etmiş olursunuz.
              </Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDeep,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  flex: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    left: theme.spacing.lg,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(9, 20, 38, 0.56)",
    borderWidth: 1,
    borderColor: "rgba(140, 154, 178, 0.36)",
    zIndex: 3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 300,
  },
  formArea: {
    gap: theme.spacing.xs,
  },
  compactInputWrap: {
    minHeight: 42,
    borderRadius: theme.radius.sm,
  },
  compactInputText: {
    fontSize: 12,
    paddingVertical: 9,
  },
  inputGroup: {
    marginBottom: 4,
  },
  primaryButton: {
    marginTop: 6,
    borderRadius: theme.radius.lg,
    backgroundColor: "rgba(104, 244, 255, 0.9)",
    borderColor: "rgba(146, 247, 255, 0.95)",
    shadowOpacity: 0,
    elevation: 0,
    minHeight: 47,
  },
  primaryButtonText: {
    color: "#051120",
    fontSize: theme.typography.size.base,
    letterSpacing: 0,
    fontFamily: theme.typography.fontFamily.bold,
  },
  socialButton: {
    borderRadius: theme.radius.lg,
    minHeight: 45,
    backgroundColor: "rgba(10, 20, 38, 0.46)",
    borderColor: "rgba(140, 154, 178, 0.34)",
    marginTop: 4,
  },
  legalWrap: {
    marginTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  legalText: {
    textAlign: "center",
    color: "rgba(221, 230, 242, 0.7)",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
    lineHeight: 22,
  },
  legalLink: {
    color: theme.colors.primaryCyan,
  },
});

