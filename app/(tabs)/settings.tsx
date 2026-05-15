import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bell,
  Crown,
  Eye,
  LogOut,
  Map as MapIcon,
  Navigation,
  Shield,
  Smartphone,
  User,
  Vibrate,
  Waypoints,
} from "lucide-react-native";
import {
  AlanGoLogo,
  AvatarPlaceholder,
  BottomTabBar,
  GlassCard,
  HelperText,
  IntensitySliderPlaceholder,
  SegmentedSelector,
  SettingRow,
  SoonBadge,
} from "@/components/ui";
import { AmbientGlow } from "@/components/fx";
import { theme } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import { getTabContentBottomSpace } from "@/constants/safeArea";

type BottomKey = "map" | "missions" | "feed" | "notifications" | "profile";
type ThemeMode = "system" | "dark";
type NeonIntensity = "low" | "high";
type PrivacyVisibility = "Herkes" | "Sadece Takip" | "Gizli";

const THEME_OPTIONS = [
  { key: "system" as const, label: "Sistem Temasi" },
  { key: "dark" as const, label: "Koyu Tema" },
];

const NEON_OPTIONS = [
  { key: "low" as const, label: "Dusuk" },
  { key: "high" as const, label: "Yuksek" },
];

const VISIBILITY_STEPS: PrivacyVisibility[] = ["Herkes", "Sadece Takip", "Gizli"];

function Divider() {
  return <View style={styles.divider} />;
}

function PremiumSwitch({ value, onChange }: { value: boolean; onChange: (next: boolean) => void }) {
  return (
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: "rgba(255,255,255,0.15)", true: "rgba(0, 229, 204, 0.40)" }}
      thumbColor={value ? "#DDFCF8" : "#D2D8DF"}
      ios_backgroundColor="rgba(255,255,255,0.10)"
    />
  );
}

function cycleVisibility(value: PrivacyVisibility) {
  const idx = VISIBILITY_STEPS.indexOf(value);
  return VISIBILITY_STEPS[(idx + 1) % VISIBILITY_STEPS.length];
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [rewardNotifications, setRewardNotifications] = useState(true);
  const [rivalAlerts, setRivalAlerts] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [mapFxIntensity, setMapFxIntensity] = useState(45);

  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [neonIntensity, setNeonIntensity] = useState<NeonIntensity>("low");

  const [profileVisibility, setProfileVisibility] = useState<PrivacyVisibility>("Herkes");
  const [territoryVisibility, setTerritoryVisibility] = useState<PrivacyVisibility>("Sadece Takip");
  const [locationSharing, setLocationSharing] = useState<PrivacyVisibility>("Sadece Takip");

  const bottomTabs = [
    { key: "map" as const, label: "Harita", icon: <MapIcon size={16} color={theme.colors.textMuted} /> },
    { key: "missions" as const, label: "Gorev", icon: <Waypoints size={16} color={theme.colors.textMuted} /> },
    { key: "feed" as const, label: "Feed", icon: <Crown size={16} color={theme.colors.textMuted} /> },
    { key: "notifications" as const, label: "Bildirim", icon: <Bell size={16} color={theme.colors.textMuted} /> },
    { key: "profile" as const, label: "Profil", icon: <User size={16} color={theme.colors.primaryCyan} /> },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AmbientGlow cyanOpacity={0.04} purpleOpacity={0.03} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: getTabContentBottomSpace(insets.bottom, 30) }]}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.headerWrap}>
          <View style={styles.headerRow}>
            <View>
              <AlanGoLogo size="sm" glow="none" />
              <Text style={styles.title}>Ayarlar</Text>
            </View>
            <AvatarPlaceholder initials="AG" size={42} />
          </View>
          <HelperText text="Hesabini, deneyimini ve bildirimlerini yonet." />
        </View>

        <GlassCard contentStyle={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Hesap</Text>
          <SettingRow
            title="Profil Duzenle"
            subtitle="Kullanici bilgilerini guncelle"
            icon={<User size={15} color={theme.colors.primaryCyan} />}
            onPress={() => {
              // TODO: Open profile editing screen.
            }}
          />
          <Divider />
          <SettingRow
            title="Premium Yonetimi"
            subtitle="Paketini ve odeme durumunu gor"
            icon={<Crown size={15} color={theme.colors.goldReward} />}
            onPress={() => router.push(ROUTES.premium)}
          />
          <Divider />
          <SettingRow
            title="Sifre Degistir"
            subtitle="Guvenlik ayarlarini guncelle"
            icon={<Shield size={15} color={theme.colors.textSecondary} />}
            onPress={() => {
              // TODO: Open password change flow.
            }}
          />
          <Divider />
          <SettingRow
            title="Cikis Yap"
            subtitle="Bu cihazdaki oturumu sonlandir"
            icon={<LogOut size={15} color={theme.colors.danger} />}
            danger
            onPress={() => {
              // TODO: Trigger secure logout flow.
            }}
          />
        </GlassCard>

        <GlassCard contentStyle={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Oyun Ayarlari</Text>
          <SettingRow
            title="Gizli odul bildirimleri"
            subtitle="Yeni drop geldiginde aninda uyar"
            icon={<Bell size={15} color={theme.colors.goldReward} />}
            right={<PremiumSwitch value={rewardNotifications} onChange={setRewardNotifications} />}
          />
          <Divider />
          <SettingRow
            title="Yakindaki rakip uyarilari"
            subtitle="Rakip hareketlerini anlik izle"
            icon={<Navigation size={15} color={theme.colors.primaryCyan} />}
            right={<PremiumSwitch value={rivalAlerts} onChange={setRivalAlerts} />}
          />
          <Divider />
          <View style={styles.sliderWrap}>
            <SettingRow
              title="Harita efekt yogunlugu"
              subtitle="Okunabilirlik icin gorunumu dengele"
              icon={<MapIcon size={15} color={theme.colors.textSecondary} />}
              right={null}
            />
            <IntensitySliderPlaceholder value={mapFxIntensity} onChange={setMapFxIntensity} />
          </View>
          <Divider />
          <SettingRow
            title="Haptic feedback"
            subtitle="Dokunus geri bildirimi"
            icon={<Vibrate size={15} color={theme.colors.primaryCyan} />}
            right={<PremiumSwitch value={hapticFeedback} onChange={setHapticFeedback} />}
          />
        </GlassCard>

        <GlassCard contentStyle={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Gorunum</Text>
          <View style={styles.selectorBlock}>
            <Text style={styles.selectorLabel}>Tema</Text>
            <SegmentedSelector options={THEME_OPTIONS} value={themeMode} onChange={setThemeMode} />
          </View>
          <View style={styles.selectorBlock}>
            <Text style={styles.selectorLabel}>Neon yogunlugu</Text>
            <SegmentedSelector options={NEON_OPTIONS} value={neonIntensity} onChange={setNeonIntensity} />
          </View>
        </GlassCard>

        <GlassCard contentStyle={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Gizlilik</Text>
          <SettingRow
            title="Profil gorunurlugu"
            icon={<Eye size={15} color={theme.colors.textSecondary} />}
            right={<Text style={styles.valueText}>{profileVisibility}</Text>}
            onPress={() => setProfileVisibility((prev) => cycleVisibility(prev))}
          />
          <Divider />
          <SettingRow
            title="Bolge gorunurlugu"
            icon={<MapIcon size={15} color={theme.colors.textSecondary} />}
            right={<Text style={styles.valueText}>{territoryVisibility}</Text>}
            onPress={() => setTerritoryVisibility((prev) => cycleVisibility(prev))}
          />
          <Divider />
          <SettingRow
            title="Konum paylasimi"
            icon={<Navigation size={15} color={theme.colors.textSecondary} />}
            right={<Text style={styles.valueText}>{locationSharing}</Text>}
            onPress={() => setLocationSharing((prev) => cycleVisibility(prev))}
          />
        </GlassCard>

        <GlassCard contentStyle={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Planlanan Ozellikler</Text>
          <SettingRow
            title="Clan sistemi"
            icon={<Shield size={15} color={theme.colors.textSecondary} />}
            right={<SoonBadge />}
          />
          <Divider />
          <SettingRow
            title="Arkadas davet sistemi"
            icon={<User size={15} color={theme.colors.textSecondary} />}
            right={<SoonBadge />}
          />
          <Divider />
          <SettingRow
            title="Smartwatch senkronizasyonu"
            icon={<Smartphone size={15} color={theme.colors.textSecondary} />}
            right={<SoonBadge />}
          />
        </GlassCard>

      </ScrollView>

      <BottomTabBar<BottomKey>
        tabs={bottomTabs}
        activeKey="profile"
        onTabPress={(key) => {
          if (key === "map") router.push(ROUTES.tabs.map);
          if (key === "missions") router.push(ROUTES.tabs.missions);
          if (key === "feed") router.push(ROUTES.tabs.feed);
          if (key === "notifications") router.push(ROUTES.tabs.notifications);
          if (key === "profile") router.push(ROUTES.tabs.profile);
        }}
        style={styles.bottomTabs}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDeep,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  headerWrap: {
    gap: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 28,
  },
  sectionContent: {
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.base,
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderSubtle,
    opacity: 0.45,
  },
  sliderWrap: {
    gap: 8,
  },
  selectorBlock: {
    gap: 7,
    marginTop: 2,
  },
  selectorLabel: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  valueText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
  },
  bottomTabs: {
    borderTopColor: theme.colors.borderSubtle,
  },
});

