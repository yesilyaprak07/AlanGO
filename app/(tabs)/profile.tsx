import React, { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Mail, MapPin, Phone, ShieldCheck, User } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { CyberTextInput, GlassCard, NeonButton } from "@/components/ui";
import { BottomNav } from "@/components/BottomNav";
import { theme } from "@/constants/theme";
import { getTabContentBottomSpace, isNarrowWidth } from "@/constants/safeArea";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("Caner");
  const [surname, setSurname] = useState("Yilmaz");
  const [nickname, setNickname] = useState("CNRman");
  const [phone, setPhone] = useState("+90 555 123 45 67");
  const [city, setCity] = useState("Antalya");
  const [email, setEmail] = useState("caner@example.com");
  const [password, setPassword] = useState("12345678");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const pickProfilePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Izin gerekli", "Profil fotografi secmek icin galeri izni vermelisin.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: getTabContentBottomSpace(insets.bottom, 24) }]}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
      >
        <GlassCard contentStyle={styles.headerCardContent}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrap}>
              <Image source={avatarUri ? { uri: avatarUri } : require("../../assets/images/avatars/avatar_pilot.png")} style={styles.avatarPhoto} resizeMode="cover" />
              <Image source={require("../../assets/images/frames/frame_cyan.png")} style={styles.avatarFrame} resizeMode="contain" />
            </View>
            <View style={styles.avatarInfo}>
              <Text style={styles.screenTitle}>Profil Bilgileri</Text>
              <Text style={styles.screenSubtitle}>Bilgilerini bu ekrandan duzenleyebilirsin.</Text>
              <Pressable
                style={styles.changePhotoBtn}
                onPress={pickProfilePhoto}
              >
                <Text style={styles.changePhotoText}>Profil Fotografini Degistir</Text>
              </Pressable>
            </View>
          </View>
        </GlassCard>

        <GlassCard contentStyle={styles.formCardContent}>
          <CyberTextInput
            label="Isim"
            value={name}
            onChangeText={setName}
            leftIcon={<User size={16} color={theme.colors.primaryCyan} />}
          />
          <CyberTextInput
            label="Soyisim"
            value={surname}
            onChangeText={setSurname}
            leftIcon={<User size={16} color={theme.colors.primaryCyan} />}
          />
          <CyberTextInput
            label="Nick"
            value={nickname}
            onChangeText={setNickname}
            leftIcon="@"
            autoCapitalize="none"
          />
          <CyberTextInput
            label="Telefon"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Phone size={16} color={theme.colors.primaryCyan} />}
          />
          <CyberTextInput
            label="Sehir"
            value={city}
            onChangeText={setCity}
            leftIcon={<MapPin size={16} color={theme.colors.primaryCyan} />}
          />
          <CyberTextInput
            label="Mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={16} color={theme.colors.primaryCyan} />}
          />
          <CyberTextInput
            label="Sifre"
            value={password}
            onChangeText={setPassword}
            secureToggle
            leftIcon={<ShieldCheck size={16} color={theme.colors.primaryCyan} />}
          />

          <NeonButton
            label="Kaydet"
            onPress={() => Alert.alert("Kaydedildi", "Profil bilgilerin guncellendi.")}
          />
        </GlassCard>
      </ScrollView>

      <BottomNav activeTab="store" style={styles.bottomTabs} />
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
    gap: theme.spacing.md,
  },
  headerCardContent: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  avatarWrap: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPhoto: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarFrame: {
    width: 88,
    height: 88,
  },
  avatarInfo: {
    flex: 1,
    gap: 5,
  },
  screenTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 23,
  },
  screenSubtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 12,
  },
  changePhotoBtn: {
    marginTop: 4,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(0, 229, 204, 0.42)",
    backgroundColor: "rgba(0, 229, 204, 0.11)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  changePhotoText: {
    color: theme.colors.primaryCyan,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 11,
  },
  formCardContent: {
    gap: theme.spacing.sm,
  },
  bottomTabs: {
    borderTopColor: theme.colors.borderSubtle,
  },
});

