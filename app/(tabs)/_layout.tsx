import { Redirect, Tabs } from "expo-router";
import { View, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Map, ShoppingBag, Trophy, Gift } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/lib/auth";

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
  const { session, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!session) {
    return <Redirect href={ROUTES.auth.signin} />;
  }

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
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ focused }) => <TabIcon Icon={Map} focused={focused} label="Harita" />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Liderlik",
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ focused }) => <TabIcon Icon={Trophy} focused={focused} label="Liderlik" />,
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: "Ödüller",
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ focused }) => <TabIcon Icon={Gift} focused={focused} label="Ödüller" />,
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: "Dükkan",
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ focused }) => <TabIcon Icon={ShoppingBag} focused={focused} label="Dükkan" />,
        }}
      />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="discover" options={{ href: null }} />
      <Tabs.Screen name="feed" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null, tabBarStyle: { display: "none" } }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: { alignItems: "center", justifyContent: "center", height: 30 },
  indicator: { width: 4, height: 3, borderRadius: 2, marginTop: 4 },
});
