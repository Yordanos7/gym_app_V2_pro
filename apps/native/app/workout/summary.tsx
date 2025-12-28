
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { authFetch } from "@/lib/api";

export default function WorkoutSummaryScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    
    const fetchSession = async () => {
      try {
        const res = await authFetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/workout-session/${sessionId}`);
        if(res.ok) {
            const data = await res.json();
            setSession(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  const calculateStats = () => {
    if (!session) return { duration: 0, sets: 0, volume: 0 };
    
    const start = new Date(session.date).getTime();
    const end = session.endedAt ? new Date(session.endedAt).getTime() : new Date().getTime();
    const duration = Math.round((end - start) / 1000 / 60); // minutes

    let sets = 0;
    let volume = 0;

    session.exercises.forEach((ex: any) => {
        sets += ex.sets.length;
        ex.sets.forEach((s: any) => {
            if (s.weight && s.reps) {
                volume += s.weight * s.reps;
            }
        });
    });

    return { duration, sets, volume };
  };

  const { duration, sets, volume } = calculateStats();

  if (loading) return (
    <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#C6FF00" />
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={['#18181b', '#000000']}
        className="absolute inset-0"
      />

      <ScrollView className="flex-1 px-6 pt-20" contentContainerStyle={{ paddingBottom: 100 }}>
        <Animated.View entering={FadeInDown.duration(800)} className="items-center mb-10">
            <View className="w-24 h-24 bg-[#C6FF00]/10 rounded-full items-center justify-center mb-6 border border-[#C6FF00]/20 shadow-[0_0_30px_rgba(198,255,0,0.2)]">
                 <Ionicons name="trophy" size={40} color="#C6FF00" />
            </View>
            <Text className="text-white text-3xl font-black italic uppercase tracking-tighter mb-2">Mission Complete</Text>
            <Text className="text-zinc-500 text-sm font-medium">Outstanding work, Warrior.</Text>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View entering={FadeInUp.delay(200).springify()} className="flex-row justify-between mb-10">
             <View className="items-center w-[30%] bg-zinc-900/50 p-4 rounded-3xl border border-white/5">
                <Text className="text-2xl font-black text-white font-monospaced mb-1">{duration}</Text>
                <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Minutes</Text>
             </View>
             <View className="items-center w-[30%] bg-zinc-900/50 p-4 rounded-3xl border border-white/5">
                <Text className="text-2xl font-black text-[#C6FF00] font-monospaced mb-1">{sets}</Text>
                <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Total Sets</Text>
             </View>
             <View className="items-center w-[30%] bg-zinc-900/50 p-4 rounded-3xl border border-white/5">
                <Text className="text-2xl font-black text-white font-monospaced mb-1">{(volume / 1000).toFixed(1)}k</Text>
                <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Vol (kg)</Text>
             </View>
        </Animated.View>

        <Text className="text-zinc-400 text-xs font-black uppercase tracking-[3px] mb-6 pl-2">Session Breakdown</Text>
        
        {session?.exercises.map((ex: any, i: number) => (
            <Animated.View 
                key={ex.id} 
                entering={FadeInDown.delay(400 + (i * 100))}
                className="bg-zinc-900/80 p-5 rounded-2xl mb-4 border border-white/5"
            >
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-white font-bold text-lg">{ex.exercise.name}</Text>
                    <View className="bg-white/5 px-3 py-1 rounded-lg">
                        <Text className="text-zinc-400 text-xs font-bold">{ex.sets.length} Sets</Text>
                    </View>
                </View>
                {ex.sets.length > 0 && (
                     <Text className="text-zinc-600 text-xs">
                        Best set: <Text className="text-[#C6FF00] font-bold">{Math.max(...ex.sets.map((s:any) => s.weight || 0))}kg</Text> for {Math.max(...ex.sets.map((s:any) => s.reps))} reps
                     </Text>
                )}
            </Animated.View>
        ))}

        <TouchableOpacity 
            className="w-full bg-[#C6FF00] h-16 rounded-2xl items-center justify-center mt-6 shadow-lg shadow-[#C6FF00]/10"
            onPress={() => router.replace("/(tabs)")}
        >
            <Text className="text-black font-black text-lg uppercase tracking-widest">Return Home</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
