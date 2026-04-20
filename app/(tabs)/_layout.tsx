import { Tabs } from "expo-router";
import { View, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Map, ShoppingBag, Bell, User, Target } from "lucide-react-native";
import { Colors } from "@/constants/colors";

function TabIcon({ Icon, focused, label }: { Icon: typeof Map; focused: boolean; label: string }) {
  return (
    <View style={styles.iconContainer}>
      <Icon
        size={22}
        color={focused ? Colors.cyan : Colors.tabInactive}
        strokeWidth={focused ? 2.5 : 1.8}
      />
      {focused && <View style={[styles.indicator, { backgroundColor: Colors.cyan }]} />}
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surfaceSolid,
          borderTopWidth: 1,
          borderTopColor: Colors.surfaceBorder,
          height: 62 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 10,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600", marginTop: 2, letterSpacing: 0.3 },
        tabBarActiveTintColor: Colors.cyan,
        tabBarInactiveTintColor: Colors.tabInactive,
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Harita",
          tabBarIcon: ({ focused }) => <TabIcon Icon={Map} focused={focused} label="Harita" />,
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: "Görev",
          tabBarIcon: ({ focused }) => <TabIcon Icon={Target} focused={focused} label="Görev" />,
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: "Mağaza",
          tabBarIcon: ({ focused }) => <TabIcon Icon={ShoppingBag} focused={focused} label="Mağaza" />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Olay",
          tabBarIcon: ({ focused }) => <TabIcon Icon={Bell} focused={focused} label="Olay" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ focused }) => <TabIcon Icon={User} focused={focused} label="Profil" />,
        }}
      />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="leaderboard" options={{ href: null }} />
      <Tabs.Screen name="discover" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: { alignItems: "center", justifyContent: "center", height: 30 },
  indicator: { width: 4, height: 3, borderRadius: 2, marginTop: 4 },
});
