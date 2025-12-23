import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface HeroProps {
  userName: string;
  quote?: string;
}

export default function MotivationalHero({ userName, quote = "GRIT & GLOW" }: HeroProps) {
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning Champ";
    if (hour < 18) return "Afternoon Warrior";
    return "Evening Beast";
  };

  return (
    <View className="h-[320px] w-full overflow-hidden rounded-b-[40px] bg-obsidian">
      <ImageBackground 
        source={require('@/assets/images/hero.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(10,10,10,0.8)', '#0A0A0A']}
          style={StyleSheet.absoluteFill}
        />
        
        <View className="flex-1 justify-end p-8 pb-16">
          <Animated.View entering={FadeInDown.delay(200).duration(800)}>
            <Text className="text-primary font-bold tracking-tighter text-sm uppercase mb-1">
              {getTimeGreeting()}
            </Text>
            <Text className="text-white text-4xl font-black italic tracking-tighter leading-none">
              {userName.toUpperCase()}
            </Text>
            <View className="h-1 w-12 bg-primary mt-3 rounded-full" />
            <Text className="text-white/60 text-xs font-medium tracking-[4px] mt-4 uppercase">
              {quote}
            </Text>
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
}
