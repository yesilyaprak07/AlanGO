import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Map, ShoppingBag, Bell, Settings, Trophy } from "lucide-react-native";
import { Colors } from "@/constants/colors";

function TabIcon({ Icon, focused }: { Icon: typeof Map; focused: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <Icon size={24} color={focused ? Colors.primary : Colors.tabInactive} strokeWidth={focused ? 2.5 : 2} />
      {focused && <View style={styles.indicator} />}
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.surfaceBorder, height: 64 + insets.bottom, paddingBottom: insets.bottom, paddingTop: 8 }, tabBarShowLabel: true, tabBarLabelStyle: { fontSize: 11, fontWeight: "500", marginTop: 4 }, tabBarActiveTintColor: Colors.primary, tabBarInactiveTintColor: Colors.tabInactive }}>
      <Tabs.Screen name="map" options={{ title: "Harita", tabBarIcon: ({ focused }) => <TabIcon Icon={Map} focused={focused} /> }} />
      <Tabs.Screen name="store" options={{ title: "Mağaza", tabBarIcon: ({ focused }) => <TabIcon Icon={ShoppingBag} focused={focused} /> }} />
      <Tabs.Screen name="notifications" options={{ title: "Bildirim", tabBarIcon: ({ focused }) => <TabIcon Icon={Bell} focused={focused} /> }} />
      <Tabs.Screen name="settings" options={{ title: "Ayarlar", tabBarIcon: ({ focused }) => <TabIcon Icon={Settings} focused={focused} /> }} />
      <Tabs.Screen name="leaderboard" options={{ title: "Liderlik", tabBarIcon: ({ focused }) => <TabIcon Icon={Trophy} focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="discover" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: { alignItems: "center", justifyContent: "center", height: 32 },
  indicator: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary, marginTop: 4 },
});
