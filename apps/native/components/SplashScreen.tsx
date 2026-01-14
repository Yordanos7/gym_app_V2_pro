import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  useSharedValue,
  Easing,
  FadeIn
} from "react-native-reanimated";

export default function SplashScreen() {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Continuous rotation for the barbell
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Subtle pulse effect
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ],
  }));

  return (
    <View className="flex-1 bg-obsidian justify-center items-center">
      <Animated.View entering={FadeIn.duration(800)} className="items-center">
        {/* Glowing Logo Container */}
        <View className="relative items-center justify-center mb-10">
          <View className="absolute w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          <Animated.View style={animatedIconStyle} className="bg-primary/10 p-6 rounded-full border border-primary/20">
            <Ionicons name="barbell" size={60} color="#C6FF00" />
          </Animated.View>
        </View>

        <Text className="text-white text-4xl font-black italic tracking-tighter mb-2 uppercase">
          GYM <Text className="text-primary">APP</Text>
        </Text>
        
        <View className="flex-row items-center gap-2 mt-4">
          <View className="h-[2px] w-8 bg-zinc-800" />
          <Text className="text-primary/60 text-[10px] font-black uppercase tracking-[4px]">
            Loading your gains
          </Text>
          <View className="h-[2px] w-8 bg-zinc-800" />
        </View>

        {/* Progress Indicator */}
        <View className="w-48 h-1 bg-zinc-900 rounded-full mt-12 overflow-hidden border border-white/5">
            <Animated.View 
                className="h-full bg-primary"
                entering={FadeIn.delay(400)}
                style={{ width: '40%' }} // Static representation or could be animated if progress known
            />
        </View>
      </Animated.View>
    </View>
  );
}
