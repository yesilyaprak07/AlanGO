import React, { useMemo, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Image, Modal, Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

type HeaderProps = {
  onAvatarPress?: () => void;
  onBellPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  date: string;
  time: string;
  read: boolean;
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    title: "Gizli odul bulundu",
    message: "Muratpasa bolgesinde yeni bir odul isaretlendi.",
    date: "21.05.2026",
    time: "14:32",
    read: false,
  },
  {
    id: "n-2",
    title: "Rakip hareketi",
    message: "Yakinindaki bir rakip yeni alan ele gecirdi.",
    date: "21.05.2026",
    time: "12:08",
    read: false,
  },
  {
    id: "n-3",
    title: "Gunluk gorev guncellendi",
    message: "Yeni gorevler eklendi. Odul ekranindan kontrol et.",
    date: "20.05.2026",
    time: "20:15",
    read: true,
  },
];

export function Header({ onAvatarPress, style }: HeaderProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleReadNotification = (id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <View style={[styles.row, style]}>
        <Pressable style={styles.avatarContainer} onPress={onAvatarPress}>
          <Image source={require("../assets/images/avatars/avatar_pilot.png")} style={styles.avatarPhoto} resizeMode="cover" />
          <Image source={require("../assets/images/frames/frame_cyan.png")} style={styles.avatarFrame} resizeMode="contain" />
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>19</Text>
          </View>
        </Pressable>

        <View style={styles.currencyRow}>
          <View style={styles.currencyBox}>
            <Image source={require("../assets/images/ui/icon_gem.png")} style={styles.currencyIcon} resizeMode="contain" />
            <Text style={styles.currencyText}>38</Text>
            <Pressable style={styles.plusButton}>
              <Feather name="plus" size={24} color="#35F0A8" />
            </Pressable>
          </View>

          <View style={styles.currencyBox}>
            <Image source={require("../assets/images/ui/icon_coin.png")} style={styles.currencyIcon} resizeMode="contain" />
            <Text style={styles.currencyText}>133.141</Text>
            <Pressable style={styles.plusButton}>
              <Feather name="plus" size={24} color="#35F0A8" />
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.bellButton} onPress={handleOpenPopup}>
          <Image source={require("../assets/images/ui/bildirim.png")} style={styles.bellImage} resizeMode="contain" />
          <View style={styles.bellBadge}>
            <Text style={styles.bellBadgeText}>{unreadCount}</Text>
          </View>
        </Pressable>
      </View>

      <Modal visible={isPopupOpen} transparent animationType="fade" onRequestClose={handleClosePopup}>
        <View style={styles.popupRoot}>
          <Pressable style={styles.popupBackdrop} onPress={handleClosePopup} />

          <View style={styles.popupCard}>
            <View style={styles.popupHeaderRow}>
              <Text style={styles.popupTitle}>Bildirimler</Text>
              <Pressable style={styles.popupCloseBtn} onPress={handleClosePopup}>
                <Feather name="x" size={18} color="#D9E7F7" />
              </Pressable>
            </View>

            <ScrollView style={styles.popupList} contentContainerStyle={styles.popupListContent} showsVerticalScrollIndicator>
              {notifications.length === 0 ? (
                <Text style={styles.emptyText}>Bildirim bulunmuyor.</Text>
              ) : (
                notifications.map((item) => (
                  <Pressable
                    key={item.id}
                    style={[styles.notificationRow, item.read && styles.notificationRowRead]}
                    onPress={() => handleReadNotification(item.id)}
                  >
                    <View style={styles.notificationTextBlock}>
                      <Text style={styles.notificationTitle}>{item.title}</Text>
                      <Text style={styles.notificationMessage}>{item.message}</Text>
                      <Text style={styles.notificationMeta}>{item.date} - {item.time}</Text>
                    </View>

                    <Pressable style={styles.deleteBtn} onPress={() => handleDeleteNotification(item.id)}>
                      <Feather name="trash-2" size={16} color="#FF6B6B" />
                    </Pressable>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight: 13,
    paddingVertical: 8,
    gap: 8,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    marginLeft: -27,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPhoto: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    zIndex: 1,
  },
  avatarFrame: {
    width: 100,
    height: 100,
    zIndex: 2,
  },
  levelBadge: {
    position: "absolute",
    right: 16,
    top: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#22d3ee",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    zIndex: 3,
  },
  levelBadgeText: {
    color: "#04232B",
    fontSize: 10,
    fontWeight: "700",
  },
  currencyRow: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    marginLeft: -15,
    gap: 8,
  },
  currencyBox: {
    width: "100%",
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(82, 114, 144, 0.42)",
    backgroundColor: "rgba(9, 22, 39, 0.9)",
    paddingLeft: 0,
    paddingRight: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  currencyIcon: {
    width: 44,
    height: 44,
    marginLeft: -3,
  },
  currencyText: {
    flex: 1,
    color: "#ECF4FF",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  plusButton: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  bellButton: {
    width: 40,
    height: 40,
    marginTop: -40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bellImage: {
    width: 40,
    height: 40,
  },
  bellBadge: {
    position: "absolute",
    right: -2,
    top: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ff3040",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  bellBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  popupRoot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  popupBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2, 9, 16, 0.52)",
  },
  popupCard: {
    width: "100%",
    maxWidth: 390,
    maxHeight: 440,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(120, 160, 180, 0.3)",
    backgroundColor: "rgba(8, 18, 28, 0.96)",
    padding: 12,
    gap: 10,
  },
  popupHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  popupTitle: {
    color: "#ECF4FF",
    fontSize: 18,
    fontWeight: "700",
  },
  popupCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(120, 160, 180, 0.18)",
  },
  popupList: {
    maxHeight: 370,
  },
  popupListContent: {
    gap: 8,
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 244, 232, 0.2)",
    backgroundColor: "rgba(12, 28, 42, 0.88)",
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  notificationRowRead: {
    opacity: 0.72,
  },
  notificationTextBlock: {
    flex: 1,
    gap: 3,
  },
  notificationTitle: {
    color: "#F5FAFF",
    fontSize: 13,
    fontWeight: "700",
  },
  notificationMessage: {
    color: "#C2D1E1",
    fontSize: 12,
    lineHeight: 16,
  },
  notificationMeta: {
    color: "#8EA4BD",
    fontSize: 11,
    marginTop: 1,
  },
  deleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
  },
  emptyText: {
    color: "#AFC2D7",
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 20,
  },
});
