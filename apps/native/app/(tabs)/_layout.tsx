import { Tabs } from "expo-router";
import PremiumTabBar from "@/components/PremiumTabBar";

export default function TabLayout() {
  return (
    <Tabs 
      tabBar={(props) => <PremiumTabBar {...props} />}
      screenOptions={{ 
        headerShown: false, 
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home" }}
      />
      <Tabs.Screen
        name="programs"
        options={{ title: "Programs" }}
      />
      <Tabs.Screen
        name="exercises"
        options={{ title: "Exercises" }}
      />
      <Tabs.Screen
        name="progress"
        options={{ title: "Progress" }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile" }}
      />
    </Tabs>
  );
}
