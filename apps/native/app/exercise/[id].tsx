import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, Dimensions } from "react-native";
import { authFetch } from "@/lib/api";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp, SharedValue, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, interpolate } from "react-native-reanimated";

import YoutubePlayer from "react-native-youtube-iframe";

const { width } = Dimensions.get("window");

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [100, 200], [0, 1]);
    return { opacity };
  });

  const heroStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [-100, 0], [1.2, 1], 'clamp');
    return { transform: [{ scale }] };
  });

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await authFetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/exercises/${id}`);
        if (response.ok) {
          const json = await response.json();
          setExercise(json);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchExercise();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#C6FF00" />
      </View>
    );
  }

  if (!exercise) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white">Exercise not found</Text>
      </View>
    );
  }

  const stats = [
    { label: "Difficulty", value: exercise.difficulty, icon: "speedometer-outline" as const },
    { label: "Mechanics", value: exercise.mechanics, icon: "construct-outline" as const },
    { label: "Force", value: exercise.force, icon: "flash-outline" as const },
  ];

  return (
    <View className="flex-1 bg-black">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      {/* Sticky Header */}
      <Animated.View 
        style={headerStyle}
        className="absolute top-0 left-0 right-0 z-50 h-24 bg-black/80 backdrop-blur-lg border-b border-white/5 flex-row items-center px-6 pt-10"
      >
        <Text className="text-white font-black uppercase italic text-lg">{exercise.name}</Text>
      </Animated.View>

      <TouchableOpacity 
        onPress={() => router.back()}
        className="absolute top-14 left-6 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md items-center justify-center border border-white/10"
      >
        <Ionicons name="arrow-back" size={20} color="white" />
      </TouchableOpacity>

      <Animated.ScrollView 
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Elite Hero Visual / Video Player */}
        <Animated.View style={heroStyle} className="h-[380px] w-full bg-zinc-950 overflow-hidden">
          {exercise.videoUrl ? (
             <View className="flex-1 items-center justify-center pt-10">
                <View style={{ width: width, height: width * (9/16) }}>
                    <YoutubePlayer
                        height={width * (9/16)}
                        width={width}
                        play={false}
                        videoId={exercise.videoUrl}
                        onReady={() => setVideoReady(true)}
                    />
                </View>
                {!videoReady && (
                    <View className="absolute inset-0 items-center justify-center bg-black">
                        <ActivityIndicator color="#C6FF00" />
                    </View>
                )}
             </View>
          ) : (
            <View className="flex-1 items-center justify-center opacity-40">
                <Ionicons name="barbell" size={120} color="#C6FF00" />
            </View>
          )}

          {/* Bottom Fade Gradient - Only at the bottom */}
          <LinearGradient
            colors={['transparent', 'black']}
            className="absolute bottom-0 left-0 right-0 h-32 z-10"
            pointerEvents="none"
          />
          
          <View className="absolute bottom-6 left-6 right-6 z-20">
            <Animated.View entering={FadeInDown.delay(200).duration(800)}>
              <View className="flex-row items-center space-x-2 mb-3">
                <View className="bg-[#C6FF00] px-3 py-1 rounded-full">
                  <Text className="text-black text-[10px] font-black uppercase tracking-widest">{exercise.equipment}</Text>
                </View>
                <View className="bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  <Text className="text-white text-[10px] font-black uppercase tracking-widest">{exercise.primaryMuscle.name}</Text>
                </View>
              </View>
              <Text className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">
                {exercise.name}
              </Text>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Scientific Breakdown Grid */}
        <View className="px-6 -mt-8 z-30">
          <Animated.View 
            entering={FadeInUp.delay(400).duration(800)}
            className="flex-row bg-zinc-900 p-6 rounded-[32px] border border-white/5 shadow-2xl"
          >
            {stats.map((stat, i) => (
              <View key={stat.label} className={`flex-1 items-center ${i !== stats.length - 1 ? 'border-r border-white/10' : ''}`}>
                <Ionicons name={stat.icon} size={20} color="#C6FF00" className="mb-2" />
                <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</Text>
                <Text className="text-white text-xs font-black uppercase italic">{stat.value}</Text>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Target Muscle Section */}
        <View className="px-6 mt-10">
          <Text className="text-zinc-500 text-xs font-black uppercase tracking-[4px] mb-6">Target Muscles</Text>
          <View className="flex-row flex-wrap gap-4">
            <View className="bg-[#C6FF00]/5 border border-[#C6FF00]/20 p-4 rounded-3xl items-center flex-1 min-w-[140px]">
               <View className="w-12 h-12 bg-[#C6FF00]/10 rounded-2xl items-center justify-center mb-3">
                  <Ionicons name="body-outline" size={24} color="#C6FF00" />
               </View>
               <Text className="text-[#C6FF00] text-xs font-black uppercase mb-1">Primary</Text>
               <Text className="text-white font-bold">{exercise.primaryMuscle.name}</Text>
            </View>
            
            {exercise.secondaryMuscle && (
               <View className="bg-zinc-900 border border-white/5 p-4 rounded-3xl items-center flex-1 min-w-[140px]">
                <View className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center mb-3">
                    <Ionicons name="body-outline" size={24} color="#52525b" />
                </View>
                <Text className="text-zinc-500 text-xs font-black uppercase mb-1">Secondary</Text>
                <Text className="text-white font-bold">{exercise.secondaryMuscle.name}</Text>
              </View>
            )}
          </View>
        </View>

        {/* How-To Section */}
        <View className="px-6 mt-12">
          <Text className="text-zinc-500 text-xs font-black uppercase tracking-[4px] mb-6">Scientific Execution</Text>
          <View className="bg-zinc-900 rounded-[32px] p-8 border border-white/5">
             <Text className="text-white text-base leading-7 font-medium opacity-80 mb-8">
               {exercise.description}
             </Text>
             
             {exercise.tips && (
               <View className="p-6 bg-[#C6FF00]/5 rounded-2xl border border-[#C6FF00]/20 mb-8">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="bulb" size={18} color="#C6FF00" />
                    <Text className="text-[#C6FF00] font-black uppercase text-xs ml-2 tracking-widest">Pro Tips</Text>
                  </View>
                  <Text className="text-[#C6FF00]/80 text-sm leading-6">
                    {exercise.tips}
                  </Text>
               </View>
             )}

             {exercise.mistakes && (
               <View>
                  <Text className="text-red-500/60 font-black uppercase text-xs mb-4 tracking-widest">Mistakes to Avoid</Text>
                  <View className="space-y-4">
                    {exercise.mistakes.split(',').map((mistake: string, i: number) => (
                      <View key={i} className="flex-row items-start">
                        <Ionicons name="close-circle" size={16} color="#ef4444" className="mt-0.5" />
                        <Text className="text-zinc-500 text-sm ml-3 leading-6">{mistake.trim()}</Text>
                      </View>
                    ))}
                  </View>
               </View>
             )}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
