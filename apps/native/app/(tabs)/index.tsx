import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useSession } from "@/lib/use-session";
import { authFetch } from "@/lib/api";

import MotivationalHero from "@/components/MotivationalHero";
import { AnimatedStatsGrid } from "@/components/AnimatedStats";

type DashboardData = {
  userName: string;
  streak: number;
  goal: string;
  activeProgram: any;
  todaysWorkout: any;
};

const MOTIVATIONAL_QUOTES = [
  "Suffer the pain of discipline or suffer the pain of regret.",
  "The only bad workout is the one that didn't happen.",
  "Your only limit is you.",
  "Don't stop when you're tired. Stop when you're done.",
  "Strength within, pride throughout."
];

export default function HomeScreen() {
  const router = useRouter();
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quote] = useState(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

  const fetchDashboard = async () => {
    try {
      const response = await authFetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/dashboard`);
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
      <View className="flex-1 justify-center items-center bg-obsidian">
        <Animated.View entering={FadeIn.duration(800)} className="items-center">
            <View className="relative items-center justify-center mb-8">
                <View className="absolute w-24 h-24 bg-primary/10 rounded-full" />
                <View className="bg-primary/5 p-5 rounded-full border border-primary/20 animate-pulse">
                    <Ionicons name="barbell" size={40} color="#C6FF00" />
                </View>
            </View>
            <Text className="text-primary font-black tracking-[4px] uppercase text-[10px]">Initializing Grit</Text>
            
            {/* Minimal loader */}
            <View className="w-12 h-[2px] bg-zinc-900 mt-6 rounded-full overflow-hidden">
                <View className="h-full bg-primary w-1/2" />
            </View>
        </Animated.View>
      </View>
    );
  }

  const stats = [
    { label: "Streak", value: `${data?.streak || 0} Days`, icon: "flame" as const, index: 0 },
    { label: "Goal", value: data?.goal?.replace("_", " ") || "Body Build", icon: "trophy" as const, index: 1 },
    { label: "Water", value: "2.5L", icon: "water" as const, index: 2 },
  ];

  return (
    <View className="flex-1 bg-background dark">
      <StatusBar barStyle="light-content" />
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100}}
        refreshControl={
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                tintColor="#C6FF00" 
                progressViewOffset={50}
            />
        }
      >
        <MotivationalHero 
            userName={session?.user?.name || data?.userName || "Warrior"} 
            quote={quote}
        />

        <AnimatedStatsGrid stats={stats} />

        <View className="px-6 mt-8">
          {/* Active Program Section */}
          {data?.activeProgram && (
              <Animated.View entering={FadeInUp.delay(200)} className="mb-10">
                <View className="flex-row justify-between items-end mb-4">
                    <Text className="text-black text-2xl font-black italic uppercase tracking-tighter">Current Plan</Text>
                    <TouchableOpacity onPress={() => router.push(`/(tabs)/programs`)}>
                        <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Swap Program</Text>
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity 
                    activeOpacity={0.9}
                    className="bg-[#C6FF00] p-6 rounded-[32px] shadow-xl overflow-hidden"
                    onPress={() => router.push(`/program/${data.activeProgram.id}`)}
                >
                    <View className="flex-row justify-between items-start">
                        <View className="flex-1 pr-4">
                            <Text className="text-black/60 text-xs font-black uppercase tracking-widest mb-1">Active Now</Text>
                            <Text className="text-black text-2xl font-black italic uppercase leading-tight">{data.activeProgram.name}</Text>
                        </View>
                        <View className="bg-black/10 p-3 rounded-full border border-black/5">
                            <Ionicons name="trophy" size={24} color="black" />
                        </View>
                    </View>
                    
                    <View className="h-[1px] w-full bg-black/10 my-4" />
                    
                    <View className="flex-row justify-between items-center">
                        <Text className="text-black/60 text-xs font-bold uppercase tracking-wider">
                            {data.activeProgram.days?.length} Training sessions / week
                        </Text>
                        <View className="bg-black px-4 py-2 rounded-full">
                            <Text className="text-[#C6FF00] text-[10px] font-black uppercase tracking-widest">Resume</Text>
                        </View>
                    </View>
                </TouchableOpacity>
              </Animated.View>
          )}

          <Animated.View entering={FadeInUp.delay(400)}>
            <View className="flex-row justify-between items-end mb-4">
                <Text className="text-black text-2xl font-black italic uppercase tracking-tighter">Today's Grind</Text>
                <TouchableOpacity onPress={() => router.push("/(tabs)/exercises")}>
                    <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Browse List</Text>
                </TouchableOpacity>
            </View>
            
            {data?.todaysWorkout ? (
              <TouchableOpacity 
                activeOpacity={0.9}
                className="bg-content1 border border-white/5 p-6 rounded-[32px] shadow-2xl overflow-hidden"
                onPress={() => router.push(`/workout/${data.todaysWorkout.id}`)}
              >
                <View className="flex-row justify-between items-start mb-4">
                    <View>
                        <Text className="text-primary text-xs font-black uppercase tracking-[3px] mb-1">Workout of the Day</Text>
                        <Text className="text-black text-2xl font-bold">Scheduled Session</Text>
                    </View>
                    <View className="bg-primary/10 p-2 rounded-full">
                        <Ionicons name="play" size={24} color="#C6FF00" />
                    </View>
                </View>

                <View className="flex-row gap-4 mb-6">
                    <View className="flex-row items-center bg-white/5 px-3 py-1 rounded-full">
                        <Ionicons name="time-outline" size={14} color="#A1A1AA" />
                        <Text className="text-zinc-800 text-xs ml-1 font-medium">{data.todaysWorkout.duration}m</Text>
                    </View>
                    <View className="flex-row items-center bg-white/5 px-3 py-1 rounded-full">
                        <Ionicons name="flash-outline" size={14} color="#A1A1AA" />
                        <Text className="text-zinc-400 text-xs ml-1 font-medium">{data.todaysWorkout.exerciseCount} Ex</Text>
                    </View>
                </View>

                <View className="bg-primary h-14 rounded-2xl items-center justify-center shadow-lg shadow-primary/30">
                  <Text className="text-obsidian font-black uppercase tracking-widest">Activate Workout</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View className="bg-content1/40 border border-dashed border-white/10 p-8 rounded-[32px] items-center">
                <View className="w-16 h-16 bg-white/5 rounded-full items-center justify-center mb-4">
                    <Ionicons name="calendar-outline" size={32} color="#52525B" />
                </View>
                <Text className="text-zinc-400 text-center mb-6 font-medium">Rest day? Or just getting started?</Text>
                
                <View className="flex-row gap-3">
                    <TouchableOpacity 
                        className="bg-primary flex-1 h-12 rounded-xl items-center justify-center"
                        onPress={() => router.push("/workout/quick")}
                    >
                        <Text className="text-obsidian font-bold text-xs uppercase tracking-wider">Quick Start</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        className="bg-white/5 flex-1 h-12 rounded-xl items-center justify-center border border-white/10"
                        onPress={() => router.push("/workout/schedule")}
                    >
                        <Text className="text-black font-bold text-xs uppercase tracking-wider">Schedule</Text>
                    </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600)} className="mt-10">
            <Text className="text-black text-2xl font-black italic uppercase tracking-tighter mb-4">Quick Arsenal</Text>
            <View className="flex-row flex-wrap justify-between">
              {[
                { icon: "barbell", label: "Log Lift", route: "/workout/quick" },
                { icon: "nutrition", label: "Fuel Log", route: "/nutrition/log" },
                { icon: "body", label: "Stats", route: "/(tabs)/progress" },
                { icon: "water", label: "Hydrate", route: "/nutrition/log" },
              ].map((action, index) => (
                <TouchableOpacity 
                  key={index} 
                  activeOpacity={0.7}
                  className="w-[48%] bg-content1/60 border border-white/5 p-4 rounded-2xl mb-4 flex-row items-center"
                  onPress={() => router.push(action.route as any)}
                >
                  <View className="bg-primary/10 p-2 rounded-lg mr-3">
                    <Ionicons name={action.icon as any} size={20} color="#2fbe0bff" />
                  </View>
                  <Text className="font-bold text-black text-xs uppercase tracking-wider">{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
