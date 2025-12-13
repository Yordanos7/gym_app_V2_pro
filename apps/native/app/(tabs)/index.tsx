import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";
import { ThemeToggle } from "@/components/theme-toggle";

type DashboardData = {
  userName: string;
  streak: number;
  goal: string;
  todaysWorkout: any;
};

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/dashboard`, {
        headers: {
            // Add auth headers if needed, relying on cookie for now
        }
      });
      if (response.ok) {
        const json = await response.json();
        setData(json);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-foreground">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-background"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={loading ? undefined : "#2563eb"} />}
    >
      <View className="p-6 pt-12 bg-content1 rounded-b-3xl shadow-sm">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-default-500 text-lg">Welcome back,</Text>
            <Text className="text-3xl font-bold text-foreground">{data?.userName || "User"}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <ThemeToggle />
            <TouchableOpacity className="bg-default-100 p-2 rounded-full">
              <Ionicons name="notifications-outline" size={24} className="text-foreground" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row space-x-4">
          <View className="flex-1 bg-primary-50 p-4 rounded-xl border border-primary-100">
            <View className="flex-row items-center mb-2">
              <Ionicons name="flame" size={20} color="#2563eb" />
              <Text className="ml-2 text-primary-700 font-semibold">Streak</Text>
            </View>
            <Text className="text-2xl font-bold text-primary-900">{data?.streak || 0} Days</Text>
          </View>
          
          <View className="flex-1 bg-secondary-50 p-4 rounded-xl border border-secondary-100">
            <View className="flex-row items-center mb-2">
              <Ionicons name="trophy" size={20} color="#9333ea" />
              <Text className="ml-2 text-secondary-700 font-semibold">Goal</Text>
            </View>
            <Text className="text-lg font-bold text-secondary-900 capitalize">{data?.goal?.replace("_", " ") || "Set Goal"}</Text>
          </View>
        </View>
      </View>

      <View className="p-6">
        <Text className="text-xl font-bold mb-4 text-foreground">Today's Workout</Text>
        
        {data?.todaysWorkout ? (
          <TouchableOpacity className="bg-content1 p-5 rounded-2xl shadow-sm border border-default-200">
            <Text className="text-lg font-bold mb-2 text-foreground">Full Body Power</Text>
            <Text className="text-default-500 mb-4">45 mins • 8 Exercises</Text>
            <View className="bg-primary py-3 rounded-xl items-center">
              <Text className="text-primary-foreground font-bold">Start Workout</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View className="bg-content1 p-6 rounded-2xl shadow-sm border border-default-200 items-center">
            <Ionicons name="calendar-outline" size={48} className="text-default-400" />
            <Text className="text-default-500 mt-4 text-center">No workout scheduled for today</Text>
            <TouchableOpacity 
              className="mt-4 bg-primary px-6 py-3 rounded-xl"
              onPress={() => router.push("/workout/quick")}
            >
              <Text className="text-primary-foreground font-bold">Start Quick Workout</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text className="text-xl font-bold mt-8 mb-4 text-foreground">Quick Actions</Text>
        <View className="flex-row flex-wrap justify-between">
          {[
            { icon: "barbell", label: "Log Workout", color: "bg-orange-100", iconColor: "#ea580c", route: "/workout/quick" },
            { icon: "nutrition", label: "Log Meal", color: "bg-green-100", iconColor: "#16a34a", route: "/nutrition/log" },
            { icon: "body", label: "Body Stats", color: "bg-blue-100", iconColor: "#2563eb", route: "/(tabs)/progress" },
            { icon: "water", label: "Water", color: "bg-cyan-100", iconColor: "#0891b2", route: "/nutrition/log" },
          ].map((action, index) => (
            <TouchableOpacity 
              key={index} 
              className="w-[48%] bg-content1 p-4 rounded-xl mb-4 shadow-sm border border-default-200 flex-row items-center"
              onPress={() => router.push(action.route as any)}
            >
              <View className={`${action.color} p-2 rounded-lg mr-3`}>
                <Ionicons name={action.icon as any} size={20} color={action.iconColor} />
              </View>
              <Text className="font-semibold text-foreground">{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
