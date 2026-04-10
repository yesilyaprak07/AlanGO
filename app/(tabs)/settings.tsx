import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronRight,
  Bell,
  Navigation,
  Eye,
  Crown,
  Globe,
  LogOut,
  User,
} from "lucide-react-native";
import { Colors } from "@/constants/colors";
export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [gpsPrecision, setGpsPrecision] = useState(true);
  const [visibleOnMap, setVisibleOnMap] = useState(true);
  const handleLogout = () => {
    router.replace("/(auth)/signin");
  };
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Ayarlar</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil</Text>
          <TouchableOpacity style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>AlanTitan</Text>
              <Text style={styles.profileEmail}>alantitan@email.com</Text>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        {/* Toggles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tercihler</Text>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <View style={styles.toggleIcon}>
                <Bell size={18} color={Colors.primary} />
              </View>
              <Text style={styles.toggleText}>Bildirimler</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.surfaceBorder, true: Colors.primary }}
              thumbColor={
                notifications ? Colors.background : Colors.textSecondary
              }
            />
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <View style={styles.toggleIcon}>
                <Navigation size={18} color={Colors.primary} />
              </View>
              <Text style={styles.toggleText}>GPS Hassasiyeti</Text>
            </View>
            <Switch
              value={gpsPrecision}
              onValueChange={setGpsPrecision}
              trackColor={{ false: Colors.surfaceBorder, true: Colors.primary }}
              thumbColor={
                gpsPrecision ? Colors.background : Colors.textSecondary
              }
            />
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <View style={styles.toggleIcon}>
                <Eye size={18} color={Colors.primary} />
              </View>
              <Text style={styles.toggleText}>Haritada Görün</Text>
            </View>
            <Switch
              value={visibleOnMap}
              onValueChange={setVisibleOnMap}
              trackColor={{ false: Colors.surfaceBorder, true: Colors.primary }}
              thumbColor={
                visibleOnMap ? Colors.background : Colors.textSecondary
              }
            />
          </View>
        </View>
        {/* Premium */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium</Text>
          <TouchableOpacity style={styles.menuRow}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <Crown size={18} color={Colors.gold} />
              </View>
              <Text style={styles.menuText}>Premium Yönet</Text>
            </View>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>AKTİF</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destek</Text>
          <TouchableOpacity style={styles.menuRow}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <Globe size={18} color={Colors.primary} />
              </View>
              <Text style={styles.menuText}>Türkçe Destek</Text>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuRow}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <User size={18} color={Colors.primary} />
              </View>
              <Text style={styles.menuText}>Yardım Merkezi</Text>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>AlanGO v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: { fontSize: 24, color: Colors.textPrimary, width: 40 },
  title: { fontSize: 20, fontWeight: "bold", color: Colors.textPrimary },
  section: { marginBottom: 24, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: { fontSize: 24, fontWeight: "bold", color: Colors.background },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  profileEmail: { fontSize: 14, color: Colors.textSecondary },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  toggleLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  toggleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(0, 240, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleText: { fontSize: 16, color: Colors.textPrimary },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(0, 240, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: { fontSize: 16, color: Colors.textPrimary },
  premiumBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.background,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  logoutText: { fontSize: 16, fontWeight: "600", color: Colors.danger },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 24,
    marginBottom: 40,
  },
});
