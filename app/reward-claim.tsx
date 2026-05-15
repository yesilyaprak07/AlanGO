import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Check, Lock, UploadCloud } from "lucide-react-native";
import { ClaimStepper, CyberTextInput, GlassCard, NeonButton, RewardCard } from "@/components/ui";
import { theme } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import { getScreenBottomPadding } from "@/constants/safeArea";

const CLAIM_STEPS = [
  { id: 1, label: "Instagram Takip" },
  { id: 2, label: "Selfie Video" },
  { id: 3, label: "Yayın İzni" },
  { id: 4, label: "Ödeme Bilgisi" },
] as const;

export default function RewardClaimScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [publishAllowed, setPublishAllowed] = useState(false);
  const [iban, setIban] = useState("");
  const [fullName, setFullName] = useState("");

  const activeStep = useMemo(() => {
    if (!step1Done) return 1;
    if (!step2Done) return 2;
    if (!publishAllowed) return 3;
    return 4;
  }, [step1Done, step2Done, publishAllowed]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bgGlowTop} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: getScreenBottomPadding(insets.bottom, theme.spacing.xl) }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <Pressable style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]} onPress={() => router.back()}>
              <ArrowLeft size={16} color={theme.colors.textPrimary} />
            </Pressable>
            <Text style={styles.headerTitle}>Ödül Talep Adımları</Text>
            <View style={styles.headerGhost} />
          </View>

          <ClaimStepper steps={CLAIM_STEPS as unknown as { id: number; label: string }[]} activeStep={activeStep} />

          <RewardCard
            title="Keşif Ödülü"
            description="Doğrulama tamamlandığında ödülün aktifleşir"
            rewardText="1.000 TL Nakit Ödül"
            icon="g���"
            variant="gold"
            onPress={() => {
              // TODO: Open reward summary details.
            }}
          />

          <GlassCard contentStyle={styles.stepCardContent}>
            <Text style={styles.stepTitle}>Instagram’da AlanGO’yu takip et</Text>
            <Text style={styles.stepDesc}>
              Ödül doğrulaması için resmi sayfamızı takip etmen gerekiyor.
            </Text>
            <NeonButton
              label={step1Done ? "Takip Doğrulandı" : "Takip Ettim"}
              fullWidth
              variant={step1Done ? "gold" : "primary"}
              onPress={() => {
                setStep1Done(true);
              }}
            />
          </GlassCard>

          <GlassCard contentStyle={styles.stepCardContent}>
            <Text style={styles.stepTitle}>Selfie videosu gönder</Text>
            <Text style={styles.stepDesc}>
              10 saniyelik kısa bir video ile ödülü nasıl bulduğunu anlat.
            </Text>
            <NeonButton
              label={step2Done ? "Video Yüklendi" : "Video Yükle"}
              fullWidth
              variant={step2Done ? "gold" : "ghost"}
              icon={<UploadCloud size={16} color={step2Done ? theme.colors.goldReward : theme.colors.textPrimary} />}
              onPress={() => {
                setStep2Done(true);
              }}
            />
          </GlassCard>

          <GlassCard contentStyle={styles.stepCardContent}>
            <Text style={styles.stepTitle}>Yayın izni</Text>
            <Text style={styles.stepDesc}>
              Videonun AlanGO sosyal medya hesaplarında paylaşılmasına izin veriyorum.
            </Text>

            <Pressable
              style={({ pressed }) => [styles.toggleRow, publishAllowed && styles.toggleRowActive, pressed && styles.pressed]}
              onPress={() => setPublishAllowed((prev) => !prev)}
            >
              <View style={[styles.checkbox, publishAllowed && styles.checkboxActive]}>
                {publishAllowed ? <Check size={13} color={theme.colors.backgroundDeep} /> : null}
              </View>
              <Text style={styles.toggleText}>Yayın iznini onaylıyorum.</Text>
            </Pressable>

            <NeonButton
              label="İzin Veriyorum"
              fullWidth
              disabled={!publishAllowed}
              onPress={() => {
                // TODO: Persist publish permission approval.
              }}
            />
          </GlassCard>

          <GlassCard contentStyle={styles.stepCardContent}>
            <Text style={styles.stepTitle}>Ödeme bilgisi</Text>
            <Text style={styles.stepDesc}>
              Ödülün onaylandıktan sonra hesabına yatırılacak.
            </Text>

            <CyberTextInput label="IBAN" placeholder="TR00 0000 0000 0000 0000 0000 00" value={iban} onChangeText={setIban} />
            <CyberTextInput label="Ad Soyad" placeholder="Ad Soyad" value={fullName} onChangeText={setFullName} />

            <NeonButton
              label="Talebi Gönder"
              fullWidth
              variant="gold"
              disabled={!iban.trim() || !fullName.trim()}
              onPress={() => {
                Alert.alert("Basarili", "Talebin alindi. Inceleme sonrasi bilgilendirileceksin.");
              }}
            />
          </GlassCard>

          <View style={styles.securityRow}>
            <Lock size={14} color={theme.colors.textMuted} />
            <Text style={styles.securityText}>Bilgilerin sadece ödül doğrulaması için kullanılır.</Text>
          </View>
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
  bgGlowTop: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(0, 229, 204, 0.10)",
    top: -100,
    right: -80,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xs,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceCard,
    alignItems: "center",
    justifyContent: "center",
  },
  headerGhost: {
    width: 38,
    height: 38,
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.base,
  },
  stepCardContent: {
    gap: theme.spacing.sm,
  },
  stepTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.base,
  },
  stepDesc: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
    lineHeight: 20,
  },
  toggleRow: {
    minHeight: 50,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  toggleRowActive: {
    borderColor: theme.colors.primaryCyan,
    backgroundColor: "rgba(0, 229, 204, 0.12)",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.backgroundDeep,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    borderColor: theme.colors.primaryCyan,
    backgroundColor: theme.colors.primaryCyan,
  },
  toggleText: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.sm,
  },
  securityRow: {
    marginTop: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  securityText: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.xs,
  },
  pressed: {
    opacity: 0.86,
  },
});

