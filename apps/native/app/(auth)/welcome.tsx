import { View, Text, TouchableOpacity, StatusBar, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp, FadeIn } from "react-native-reanimated";

const { height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#18181b', '#000000', '#0a0a0a']}
        className="absolute inset-0"
      />

      {/* Animated Glow Effect */}
      <Animated.View 
        entering={FadeIn.duration(2000)}
        className="absolute top-20 self-center w-64 h-64 bg-[#C6FF00]/20 rounded-full blur-3xl"
        style={{ opacity: 0.3 }}
      />

      <View className="flex-1 justify-between px-6 pt-20 pb-12">
        {/* Logo & Hero Section */}
        <Animated.View entering={FadeInDown.duration(1000).springify()} className="items-center mt-10">
          {/* Logo */}
          <View className="w-28 h-28 bg-[#C6FF00]/10 rounded-full items-center justify-center mb-8 border-2 border-[#C6FF00]/30 shadow-[0_0_40px_rgba(198,255,0,0.3)]">
            <Ionicons name="barbell" size={56} color="#C6FF00" />
          </View>

          {/* App Name */}
          <Text className="text-white text-5xl font-black italic uppercase tracking-tighter text-center mb-4">
            Gym<Text className="text-[#C6FF00]">APP</Text>
          </Text>

          {/* Tagline */}
          <Text className="text-zinc-400 text-base font-medium text-center tracking-wide px-8">
            Transform Your Body,{"\n"}Elevate Your Mind
          </Text>
        </Animated.View>

        {/* Feature Highlights */}
        <Animated.View entering={FadeInUp.delay(400).springify()} className="space-y-4 mb-8">
          {[
            { icon: "fitness", title: "Track Workouts", desc: "Log every rep, set, and session" },
            { icon: "trending-up", title: "Build Strength", desc: "Progressive overload made simple" },
            { icon: "flame", title: "Stay Consistent", desc: "Build streaks and smash goals" },
          ].map((feature, index) => (
            <Animated.View 
              key={index}
              entering={FadeInUp.delay(600 + index * 100).springify()}
              className="flex-row items-center bg-zinc-900/40 border border-white/5 rounded-2xl p-4"
            >
              <View className="w-12 h-12 bg-[#C6FF00]/10 rounded-full items-center justify-center mr-4">
                <Ionicons name={feature.icon as any} size={24} color="#C6FF00" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-base font-bold mb-1">{feature.title}</Text>
                <Text className="text-zinc-500 text-xs font-medium">{feature.desc}</Text>
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        {/* CTA Buttons */}
        <Animated.View entering={FadeInUp.delay(1000).springify()} className="space-y-4">
          {/* Primary CTA - Get Started */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-full bg-[#C6FF00] h-16 rounded-2xl items-center justify-center shadow-[0_0_30px_rgba(198,255,0,0.4)]"
            onPress={() => router.push("/(auth)/sign-up")}
          >
            <Text className="text-black font-black text-lg uppercase tracking-widest">
              Get Started
            </Text>
          </TouchableOpacity>

          {/* Secondary CTA - Sign In */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-full bg-zinc-900/50 border-2 border-white/10 h-16 rounded-2xl items-center justify-center"
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text className="text-white font-bold text-base uppercase tracking-widest">
              Sign In
            </Text>
          </TouchableOpacity>

          {/* Fine Print */}
          <Text className="text-zinc-600 text-xs text-center mt-4 font-medium">
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}
