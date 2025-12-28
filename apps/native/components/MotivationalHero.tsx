import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { authClient } from '@/lib/auth-client';

interface HeroProps {
  userName: string;
  quote?: string;
}

export default function MotivationalHero({ userName, quote = "GRIT & GLOW" }: HeroProps) {
  const router = useRouter();
  
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning Champ";
    if (hour < 18) return "Afternoon Warrior";
    return "Evening Beast";
  };

  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await authClient.signOut();
            router.replace("/(auth)/welcome");
          }
        }
      ]
    );
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
            
            {/* User Name with Logout Button */}
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-4xl font-black italic tracking-tighter leading-none flex-1">
                {userName.toUpperCase()}
              </Text>
              
              {/* Logout Button */}
              <TouchableOpacity
                onPress={handleLogout}
                className="ml-4 bg-zinc-900/50 border border-white/10 rounded-full px-4 py-2 flex-row items-center"
                activeOpacity={0.7}
              >
                <Ionicons name="log-out-outline" size={18} color="#C6FF00" />
                <Text className="text-[#C6FF00] font-bold text-xs uppercase tracking-wider ml-2">
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
            
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
