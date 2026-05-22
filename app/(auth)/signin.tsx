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
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Lock, Mail } from "lucide-react-native";
import { theme } from "@/constants/theme";
import { CyberTextInput, NeonButton } from "@/components/ui";
import { useFadeIn } from "@/hooks/useFadeIn";
import { getScreenBottomPadding } from "@/constants/safeArea";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/lib/auth";

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formAnim = useFadeIn({ duration: 320, delay: 40, fromY: 14, fromScale: 0.98 });
  const legalAnim = useFadeIn({ duration: 240, delay: 120, fromY: 8 });

  const handleSignIn = async () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      Alert.alert("Eksik bilgi", "Lutfen e-posta ve sifre alanlarini doldurun.");
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await signIn(normalizedEmail, password);

      if (error) {
        Alert.alert("Giris basarisiz", `Giris yapilamadi: ${error}`);
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
                leftIcon={<Mail size={14} color={theme.colors.textSecondary} />}
                placeholder=" E-posta adresin"
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
                placeholder=" Şifren"
                value={password}
                onChangeText={setPassword}
                secureToggle
              />

              <TouchableOpacity
                style={styles.forgotLinkWrap}
                onPress={() => {
                  // TODO: Connect forgot-password flow.
                }}
              >
                <Text style={styles.forgotText}>Şifremi unuttum?</Text>
              </TouchableOpacity>

              <NeonButton
                label="Giriş Yap"
                fullWidth
                style={styles.primaryButton}
                textStyle={styles.primaryButtonText}
                loading={submitting}
                disabled={submitting}
                onPress={handleSignIn}
              />

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>veya</Text>
                <View style={styles.dividerLine} />
              </View>

              <NeonButton
                label="Google ile Devam Et"
                fullWidth
                variant="ghost"
                icon={<Text style={styles.brandIcon}>G</Text>}
                style={styles.socialButton}
                onPress={() => {
                  // TODO: Connect Google sign-in.
                }}
              />
              <NeonButton
                label="Apple ile Devam Et"
                fullWidth
                variant="ghost"
                icon={<Text style={styles.appleIcon}></Text>}
                style={styles.socialButton}
                onPress={() => {
                  // TODO: Connect Apple sign-in.
                }}
              />
              <NeonButton
                label="Üye Ol"
                fullWidth
                variant="ghost"
                style={styles.socialButton}
                onPress={() => router.push(ROUTES.auth.signup)}
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 260,
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
  forgotLinkWrap: {
    alignSelf: "flex-end",
    marginBottom: theme.spacing.sm,
  },
  forgotText: {
    color: "rgba(230, 236, 246, 0.82)",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 15,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.26)",
  },
  dividerText: {
    marginHorizontal: theme.spacing.sm,
    color: "rgba(255, 255, 255, 0.62)",
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 15,
  },
  brandIcon: {
    color: "#FFFFFF",
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 17,
  },
  appleIcon: {
    color: "#FFFFFF",
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 19,
    marginTop: -2,
  },
  primaryButton: {
    marginTop: 6,
    marginBottom: 4,
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
    marginBottom: 4,
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

