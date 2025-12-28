import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StatusBar } from "react-native";
import { authFetch } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function ProgressScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await authFetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/progress`);
        if (response.ok) {
          const json = await response.json();
          setData(json);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) return (
    <View className="flex-1 justify-center items-center bg-black">
      <ActivityIndicator size="large" color="#C6FF00" />
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#18181b', '#000000']}
        className="absolute inset-0"
      />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header Section */}
        <View className="px-6 pt-16 mb-8">
            <Animated.View entering={FadeInDown.duration(600)}>
                <Text className="text-zinc-500 text-xs font-black uppercase tracking-[4px] mb-2">Performance Tracking</Text>
                <Text className="text-4xl font-black text-white italic uppercase tracking-tighter">
                    Apex <Text className="text-[#C6FF00]">Progress</Text>
                </Text>
            </Animated.View>
        </View>

        {/* Primary Stats Grid */}
        <View className="px-6 flex-row space-x-4 mb-10">
          <Animated.View 
            entering={FadeInUp.delay(200).springify()}
            className="flex-1 bg-zinc-900/50 p-6 rounded-[32px] border border-white/5 items-center shadow-2xl"
          >
             <View className="w-10 h-10 rounded-full bg-[#C6FF00]/10 items-center justify-center mb-4">
                <Ionicons name="flash" size={20} color="#C6FF00" />
             </View>
            <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Workouts</Text>
            <Text className="text-4xl font-black text-white italic">{data?.totalWorkouts || 0}</Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInUp.delay(300).springify()}
            className="flex-1 bg-zinc-900/50 p-6 rounded-[32px] border border-white/5 items-center shadow-2xl"
          >
             <View className="w-10 h-10 rounded-full bg-emerald-500/10 items-center justify-center mb-4">
                <Ionicons name="trending-down" size={20} color="#10b981" />
             </View>
            <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Weight Change</Text>
            <Text className="text-4xl font-black text-emerald-500 italic">-2.5<Text className="text-lg">kg</Text></Text>
          </Animated.View>
        </View>

        {/* Weight History Section */}
        <View className="px-6 mb-10">
          <View className="flex-row items-center justify-between mb-6 px-1">
             <Text className="text-zinc-400 text-xs font-black uppercase tracking-[3px]">Weight History</Text>
             <Ionicons name="stats-chart" size={16} color="#52525b" />
          </View>
          
          <Animated.View entering={FadeInUp.delay(400)} className="bg-zinc-900/40 rounded-3xl border border-white/5 overflow-hidden">
            {data?.weightHistory?.length > 0 ? (
              data.weightHistory.map((entry: any, i: number) => (
                <View key={entry.id} className={`flex-row justify-between p-5 ${i !== data.weightHistory.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 rounded-full bg-zinc-700 mr-3" />
                    <Text className="text-zinc-400 font-bold">{new Date(entry.date).toLocaleDateString()}</Text>
                  </View>
                  <Text className="font-black text-white text-lg italic">{entry.weight} <Text className="text-zinc-500 text-xs not-italic">KG</Text></Text>
                </View>
              ))
            ) : (
              <View className="items-center py-12">
                 <Ionicons name="calendar-outline" size={32} color="#27272a" />
                 <Text className="text-zinc-600 font-bold mt-2">No data recorded yet.</Text>
              </View>
            )}
          </Animated.View>
        </View>

        {/* Strength Stats Section */}
        <View className="px-6">
          <View className="flex-row items-center justify-between mb-6 px-1">
             <Text className="text-zinc-400 text-xs font-black uppercase tracking-[3px]">Strength Stats</Text>
             <Ionicons name="barbell" size={16} color="#52525b" />
          </View>

          <Animated.View entering={FadeInUp.delay(600)} className="bg-zinc-900/40 rounded-3xl border border-white/5 p-2">
            {[
                { label: 'Bench Press', value: '80', color: '#C6FF00' },
                { label: 'Squat', value: '100', color: '#ff5d00' },
                { label: 'Deadlift', value: '120', color: '#00ccff' }
            ].map((stat, i) => (
                 <View key={stat.label} className={`flex-row items-center justify-between p-4 ${i !== 2 ? 'border-b border-white/5' : ''}`}>
                    <View className="flex-row items-center">
                        <View style={{ backgroundColor: stat.color }} className="w-1 h-8 rounded-full mr-4 opacity-50" />
                        <Text className="text-white font-black text-lg uppercase italic tracking-tighter">{stat.label}</Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-white font-black text-2xl italic tracking-tighter">{stat.value} <Text className="text-zinc-500 text-xs not-italic">KG</Text></Text>
                    </View>
                 </View>
            ))}
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
