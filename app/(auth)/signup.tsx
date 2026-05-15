import { useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Lock, Mail, Shield, User } from "lucide-react-native";
import { theme } from "@/constants/theme";
import { CyberTextInput, GlassCard, NeonButton } from "@/components/ui";
import { useFadeIn } from "@/hooks/useFadeIn";
import { getScreenBottomPadding } from "@/constants/safeArea";
import { ROUTES } from "@/constants/routes";

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const headerAnim = useFadeIn({ duration: 300, delay: 20, fromY: 14 });
  const formAnim = useFadeIn({ duration: 360, delay: 110, fromY: 20, fromScale: 0.98 });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.glowOne} />

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
            <View style={styles.logoBadge}>
              <Shield size={18} color={theme.colors.primaryCyan} />
              <Text style={styles.logoText}>AlanGO</Text>
            </View>
            <Text style={styles.title}>Hesap OluÅŸtur</Text>
          </Animated.View>

          <Animated.View style={formAnim.style}>
            <GlassCard style={styles.formCard} contentStyle={styles.formCardContent}>
            <CyberTextInput
              label="Komutan adÄ±"
              leftIcon={<User size={18} color={theme.colors.textSecondary} />}
              placeholder="Oyuncu adÄ±nÄ±z"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
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
            <CyberTextInput
              label="Åifre tekrar"
              leftIcon={<Lock size={18} color={theme.colors.textSecondary} />}
              placeholder="Åifrenizi tekrar girin"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureToggle
            />

            <NeonButton
              label="Hesap OluÅŸtur"
              fullWidth
              onPress={() => {
                // TODO: Connect sign-up submit action.
              }}
            />
            <NeonButton
              label="GiriÅŸ ekranÄ±na dÃ¶n"
              fullWidth
              variant="ghost"
              onPress={() => router.push(ROUTES.auth.signin)}
            />
            </GlassCard>
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
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(0, 229, 204, 0.12)",
    top: -90,
    left: -70,
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
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 7,
    marginBottom: theme.spacing.md,
  },
  logoText: {
    marginLeft: 8,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 30,
  },
  formCard: {
    borderRadius: theme.radius.xl,
  },
  formCardContent: {
    gap: theme.spacing.sm,
  },
});

