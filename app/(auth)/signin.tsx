import { useState } from "react";
import {
  Animated,
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
import { Lock, Mail, Sparkles } from "lucide-react-native";
import { theme } from "@/constants/theme";
import { AlanGoLogo, CyberTextInput, GlassCard, HelperText, NeonButton } from "@/components/ui";
import { useFadeIn } from "@/hooks/useFadeIn";
import { getScreenBottomPadding } from "@/constants/safeArea";
import { ROUTES } from "@/constants/routes";

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const headerAnim = useFadeIn({ duration: 300, delay: 20, fromY: 14 });
  const formAnim = useFadeIn({ duration: 360, delay: 120, fromY: 20, fromScale: 0.98 });
  const legalAnim = useFadeIn({ duration: 280, delay: 220, fromY: 10 });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

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
          <Animated.View style={[styles.header, headerAnim.style]}>
            <AlanGoLogo size="lg" showTagline glow="soft" style={styles.logoBadge} />
            <Text style={styles.title}>Tek hesabÄ±nla oyuna katÄ±l!</Text>
          </Animated.View>

          <Animated.View style={formAnim.style}>
            <GlassCard style={styles.formCard} contentStyle={styles.formCardContent}>
            <CyberTextInput
              label="E-posta"
              leftIcon={<Mail size={18} color={theme.colors.textSecondary} />}
              placeholder="mail@ornek.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CyberTextInput
              label="Åifre"
              leftIcon={<Lock size={18} color={theme.colors.textSecondary} />}
              placeholder="Åifrenizi girin"
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
              <Text style={styles.forgotText}>Åifremi unuttum?</Text>
            </TouchableOpacity>

            <NeonButton
              label="GiriÅŸ Yap"
              fullWidth
              onPress={() => {
                // TODO: Connect sign-in submit action.
              }}
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
              onPress={() => {
                // TODO: Connect Google sign-in.
              }}
            />
            <NeonButton
              label="Apple ile Devam Et"
              fullWidth
              variant="ghost"
              icon={<Sparkles size={16} color={theme.colors.textPrimary} />}
              onPress={() => {
                // TODO: Connect Apple sign-in.
              }}
            />
            <NeonButton
              label="Ãœye Ol"
              fullWidth
              variant="ghost"
              onPress={() => router.push(ROUTES.auth.signup)}
            />
            </GlassCard>
          </Animated.View>

          <Animated.View style={legalAnim.style}>
            <HelperText
              text="Devam ederek KullanÄ±m KoÅŸullarÄ± ve Gizlilik PolitikasÄ±'nÄ± kabul etmiÅŸ olursunuz."
              style={styles.legalText}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDeep,
  },
  flex: {
    flex: 1,
  },
  glowOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(0, 229, 204, 0.15)",
    top: -70,
    right: -60,
  },
  glowTwo: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(139, 92, 246, 0.14)",
    bottom: -60,
    left: -50,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  logoBadge: {
    alignSelf: "flex-start",
    marginBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 30,
    lineHeight: 36,
  },
  formCard: {
    borderRadius: theme.radius.xl,
  },
  formCardContent: {
    gap: theme.spacing.sm,
  },
  forgotLinkWrap: {
    alignSelf: "flex-end",
    marginBottom: theme.spacing.xs,
  },
  forgotText: {
    color: theme.colors.primaryCyan,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing.xs,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.borderSubtle,
  },
  dividerText: {
    marginHorizontal: theme.spacing.sm,
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
  },
  brandIcon: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.base,
  },
  legalText: {
    marginTop: theme.spacing.md,
    textAlign: "center",
  },
});

