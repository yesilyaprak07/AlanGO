import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";

const EVENTS = [
  {
    id: 1,
    type: "attack",
    icon: "⚔️",
    title: "Alanına saldırı!",
    body: "Kaan_42 Karşıyaka sınırını ihlal ediyor",
    time: "2 dk",
    color: Colors.coral,
    urgent: true,
  },
  {
    id: 2,
    type: "level",
    icon: "⬆️",
    title: "Seviye atladın!",
    body: "Tebrikler! Seviye 24'e ulaştın → GENERAL yakın",
    time: "15 dk",
    color: Colors.cyan,
    urgent: false,
  },
  {
    id: 3,
    type: "mission",
    icon: "🎯",
    title: "Görev tamamlandı",
    body: "Günlük 5 km yürüme hedefi +80 XP kazandırdı",
    time: "1 sa",
    color: Colors.emerald,
    urgent: false,
  },
  {
    id: 4,
    type: "nearby",
    icon: "📡",
    title: "Rakip yakında",
    body: "KaraKurt sadece 90m uzakta",
    time: "2 sa",
    color: Colors.warning,
    urgent: false,
  },
  {
    id: 5,
    type: "attack",
    icon: "💀",
    title: "Çizgin kesildi!",
    body: "Savaşçı seni avladı · -50 XP",
    time: "Dün",
    color: Colors.coral,
    urgent: false,
  },
  {
    id: 6,
    type: "reward",
    icon: "🎁",
    title: "Sezon ödülü yaklaşıyor",
    body: "12 gün içinde Top 100'e gir → Hükümdar rozeti kazan",
    time: "Dün",
    color: Colors.gold,
    urgent: false,
  },
  {
    id: 7,
    type: "achievement",
    icon: "🏅",
    title: "Yeni başarım!",
    body: "SAVUNMA Ustası rozeti açıldı",
    time: "2 gün",
    color: Colors.purple,
    urgent: false,
  },
];

function EventCard({ event }: { event: typeof EVENTS[0] }) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        event.urgent && styles.cardUrgent,
        { borderLeftColor: event.color },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: `${event.color}18` }]}>
        <Text style={styles.iconEmoji}>{event.icon}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, event.urgent && { color: event.color }]}>{event.title}</Text>
        <Text style={styles.cardBody}>{event.body}</Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.timeText}>{event.time}</Text>
        {event.urgent && (
          <View style={[styles.urgentDot, { backgroundColor: event.color }]} />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const urgentCount = EVENTS.filter((e) => e.urgent).length;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>OYUN OLAYLARI</Text>
          <Text style={styles.title}>Olay Merkezi</Text>
        </View>
        {urgentCount > 0 && (
          <View style={styles.urgentBadge}>
            <View style={styles.urgentDotBig} />
            <Text style={styles.urgentText}>{urgentCount} acil</Text>
          </View>
        )}
      </View>

      {/* Urgent section */}
      {EVENTS.some((e) => e.urgent) && (
        <View style={styles.urgentSection}>
          <Text style={styles.sectionLabel}>🔴  ACİL</Text>
          {EVENTS.filter((e) => e.urgent).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </View>
      )}

      {/* All events */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>TÜM OLAYLAR</Text>
        {EVENTS.filter((e) => !e.urgent).map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerLabel: { fontSize: 10, fontWeight: "700", color: Colors.textMuted, letterSpacing: 1.5, marginBottom: 2 },
  title: { fontSize: 24, fontWeight: "800", color: Colors.textPrimary },
  urgentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: `${Colors.coral}15`,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${Colors.coral}40`,
  },
  urgentDotBig: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.coral },
  urgentText: { fontSize: 12, fontWeight: "700", color: Colors.coral },
  urgentSection: { paddingHorizontal: 20, marginBottom: 8 },
  scroll: { flex: 1, paddingHorizontal: 20 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceSolid,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: Colors.surfaceBorder,
    borderRightColor: Colors.surfaceBorder,
    borderBottomColor: Colors.surfaceBorder,
    gap: 12,
  },
  cardUrgent: { backgroundColor: "rgba(240, 106, 90, 0.06)" },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconEmoji: { fontSize: 20 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: Colors.textPrimary, marginBottom: 3 },
  cardBody: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },
  cardRight: { alignItems: "flex-end", gap: 6 },
  timeText: { fontSize: 11, color: Colors.textMuted },
  urgentDot: { width: 8, height: 8, borderRadius: 4 },
});
