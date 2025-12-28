import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/programs/${id}`);
        if (response.ok) {
          const json = await response.json();
          setProgram(json);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProgram();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#C6FF00" />
      </View>
    );
  }

  if (!program) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white">Program not found</Text>
      </View>
    );
  }

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
        {/* Custom Header & Hero */}
        <View className="relative">
          {/* Header Controls */}
          <View className="absolute top-14 left-6 z-20">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md items-center justify-center border border-white/10"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Hero Content */}
          <View className="pt-32 pb-10 px-6 bg-zinc-900 border-b border-white/5">
             <Animated.View entering={FadeInDown.duration(600).springify()}>
                <View className="flex-row items-center space-x-2 mb-4">
                  <View className="bg-[#C6FF00]/10 px-3 py-1 rounded-full border border-[#C6FF00]/20">
                    <Text className="text-[#C6FF00] text-xs font-bold uppercase tracking-wider">Program</Text>
                  </View>
                  <View className="bg-zinc-800 px-3 py-1 rounded-full border border-white/5">
                    <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">{(program.days?.length || 0) * 4} Weeks</Text>
                  </View>
                </View>

                <Text className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">
                  {program.name}
                </Text>
                
                <Text className="text-zinc-400 text-sm font-medium leading-6">
                  {program.description}
                </Text>
             </Animated.View>
          </View>
        </View>

        {/* Schedule Section */}
        <View className="px-6 pt-8">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-white text-xl font-black uppercase tracking-tight">Weekly Schedule</Text>
            <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{program.days?.length || 0} Days/Week</Text>
          </View>

          <View className="space-y-6">
            {program.days?.map((day: any, index: number) => (
              <Animated.View 
                key={day.id} 
                entering={FadeInDown.delay(200 + (index * 100)).duration(600)}
                className="bg-zinc-900/50 rounded-3xl overflow-hidden border border-white/5"
              >
                <View className="p-5 border-b border-white/5 bg-white/[0.02]">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-black text-white uppercase italic">{day.title}</Text>
                    <View className="w-8 h-8 rounded-full bg-[#C6FF00]/10 items-center justify-center">
                       <Text className="text-[#C6FF00] font-bold text-xs">{index + 1}</Text>
                    </View>
                  </View>
                </View>

                <View className="p-4 space-y-3">
                  {day.exercises?.map((ex: any) => (
                    <TouchableOpacity 
                      key={ex.id} 
                      onPress={() => router.push(`/exercise/${ex.exercise.id}`)}
                      className="flex-row items-center bg-black/40 p-3 rounded-xl border border-white/5 active:bg-white/5"
                    >
                      <View className="w-10 h-10 rounded-lg bg-zinc-800 items-center justify-center border border-white/5">
                        <Ionicons name="barbell" size={18} color="#C6FF00" />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-white font-bold text-sm" numberOfLines={1}>{ex.exercise.name}</Text>
                        <Text className="text-zinc-500 text-xs mt-0.5">{ex.exercise.targetMuscle || 'General'}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#52525b" />
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 left-6 right-6">
        <Animated.View entering={FadeInUp.delay(800).springify()}>
          <TouchableOpacity 
            className="w-full bg-[#C6FF00] h-16 rounded-2xl flex-row items-center justify-center shadow-lg shadow-[#C6FF00]/20 active:opacity-90"
            onPress={() => {
                console.log("Start Program");
            }}
          >
            <Text className="text-black font-black text-lg uppercase tracking-widest mr-2">Start Program</Text>
            <Ionicons name="arrow-forward-circle" size={24} color="black" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
