import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AlertTriangle,
  Trophy,
  Target,
  UserPlus,
  Settings,
} from "lucide-react-native";
import { Colors } from "@/constants/colors";
const NOTIFICATIONS = [
  {
    id: 1,
    type: "danger",
    icon: AlertTriangle,
    title: "Alanına saldırı var!",
    subtitle: "KaraKurt senin bölgenize girdi",
    time: "2 dk önce",
    borderColor: Colors.danger,
  },
  {
    id: 2,
    type: "success",
    icon: Trophy,
    title: "Seviye atladın!",
    subtitle: "Tebrikler! Seviye 12 oldun",
    time: "1 saat önce",
    borderColor: Colors.primary,
  },
  {
    id: 3,
    type: "success",
    icon: Target,
    title: "Hedefini tamamladın",
    subtitle: "Günlük 5000m² hedefi",
    time: "3 saat önce",
    borderColor: Colors.success,
  },
  {
    id: 4,
    type: "info",
    icon: UserPlus,
    title: "Yeni oyuncu yakında",
    subtitle: "YeniBie sadece 200m uzakta",
    time: "5 saat önce",
    borderColor: Colors.textSecondary,
  },
  {
    id: 5,
    type: "danger",
    icon: AlertTriangle,
    title: "Çizgin kesildi!",
    subtitle: "Savaşçı seni avladı",
    time: "Dün",
    borderColor: Colors.danger,
  },
  {
    id: 6,
    type: "success",
    icon: Trophy,
    title: "Yeni başarım kazandın",
    subtitle: "Koşucu rozeti açıldı",
    time: "Dün",
    borderColor: Colors.success,
  },
];
export default function NotificationsScreen() {
  const getIconColor = (type: string) => {
    switch (type) {
      case "danger":
        return Colors.danger;
      case "success":
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Bildirimler</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Settings size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationCard,
              { borderLeftColor: notification.borderColor },
            ]}
          >
            <View style={styles.iconContainer}>
              <notification.icon
                size={22}
                color={getIconColor(notification.type)}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.notificationTitle}>
                {notification.title}
              </Text>
              <Text style={styles.notificationSubtitle}>
                {notification.subtitle}
              </Text>
            </View>
            <Text style={styles.timeText}>{notification.time}</Text>
          </TouchableOpacity>
        ))}
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
  title: { fontSize: 28, fontWeight: "bold", color: Colors.textPrimary },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  content: { flex: 1, paddingHorizontal: 20 },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: Colors.surfaceBorder,
    borderRightColor: Colors.surfaceBorder,
    borderBottomColor: Colors.surfaceBorder,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  textContainer: { flex: 1 },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  notificationSubtitle: { fontSize: 13, color: Colors.textSecondary },
  timeText: { fontSize: 12, color: Colors.textSecondary },
});
