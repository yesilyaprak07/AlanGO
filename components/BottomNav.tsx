import React from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ROUTES } from "@/constants/routes";

type BottomNavTab = "map" | "leaderboard" | "rewards" | "store";

type BottomNavProps = {
  activeTab: BottomNavTab;
  style?: StyleProp<ViewStyle>;
};

const tabs: Array<{ key: BottomNavTab; label: string; icon: (color: string) => React.ReactNode; showDot?: boolean }> = [
  { key: "map", label: "Harita", icon: (color) => <Feather name="map" size={24} color={color} /> },
  { key: "leaderboard", label: "Liderlik", icon: (color) => <MaterialCommunityIcons name="podium" size={24} color={color} /> },
  { key: "rewards", label: "Oduller", icon: (color) => <Feather name="gift" size={24} color={color} />, showDot: true },
  { key: "store", label: "Dukkan", icon: (color) => <Feather name="shopping-cart" size={24} color={color} /> },
];

function routeForTab(tab: BottomNavTab) {
  if (tab === "map") return ROUTES.tabs.map;
  if (tab === "leaderboard") return ROUTES.tabs.leaderboard;
  if (tab === "rewards") return ROUTES.tabs.missions;
  return ROUTES.tabs.store;
}

export function BottomNav({ activeTab, style }: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom + 6 }, style]}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          const color = active ? "#22d3ee" : "#6b7a8d";

          return (
            <Pressable key={tab.key} onPress={() => router.push(routeForTab(tab.key))} style={({ pressed }) => [styles.item, active && styles.itemActive, pressed && styles.itemPressed]}>
              {active ? <View style={styles.activeGlow} /> : null}

              <View style={styles.iconWrap}>
                {tab.icon(color)}
                {tab.showDot ? <View style={styles.dot} /> : null}
              </View>

              <Text style={[styles.label, { color }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "rgba(8, 18, 28, 0.88)",
    borderWidth: 1,
    borderColor: "rgba(86, 120, 150, 0.32)",
  },
  item: {
    flex: 1,
    minHeight: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  itemActive: {
    backgroundColor: "rgba(34, 211, 238, 0.08)",
  },
  itemPressed: {
    opacity: 0.85,
  },
  activeGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(34, 211, 238, 0.38)",
    backgroundColor: "rgba(34, 211, 238, 0.05)",
  },
  iconWrap: {
    position: "relative",
  },
  dot: {
    position: "absolute",
    right: -3,
    top: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff3040",
  },
  label: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "600",
  },
});
