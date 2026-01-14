import { View, Text, TouchableOpacity, ScrollView, StatusBar, Alert, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/lib/use-session";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { authFetch } from "@/lib/api";

export default function ProfileScreen() {
  const router = useRouter();
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authFetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/profile`);
        if (response.ok) {
          const json = await response.json();
          setProfileData(json);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to exit the grind?",
      [
        { text: "Stay", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive",
          onPress: async () => {
            await authClient.signOut();
            router.replace("/(auth)/sign-in");
          }
        }
      ]
    );
  };

  const ProfileItem = ({ icon, label, onPress, color = "white", secondary = "" }: any) => (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-2xl mb-3 h-16"
    >
      <View className="flex-row items-center">
        <View className={`w-10 h-10 rounded-xl items-center justify-center mr-4 bg-zinc-800`}>
          <Ionicons name={icon} size={20} color={color === "white" ? "#C6FF00" : color} />
        </View>
        <View>
            <Text className="text-white font-bold tracking-tight">{label}</Text>
            {secondary ? <Text className="text-zinc-500 text-[10px] uppercase font-black mt-0.5">{secondary}</Text> : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#3f3f46" />
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-[3px] mb-4 mt-6 ml-1">{title}</Text>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#C6FF00" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#18181b', '#000000']}
        className="absolute inset-0"
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero Section */}
        <Animated.View entering={FadeInUp.duration(800)} className="pt-24 px-6 pb-10">
            <View className="items-center">
                <View className="relative">
                    {/* Identity Badge - stylized big initial */}
                    <View className="w-24 h-24 rounded-[32px] bg-zinc-900 border border-white/10 items-center justify-center shadow-2xl overflow-hidden">
                        <LinearGradient
                            colors={['#C6FF00', 'transparent']}
                            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }}
                        />
                        <Text className="text-[#C6FF00] text-5xl font-black italic">
                            {(profileData?.name || session?.user?.name || "W")[0].toUpperCase()}
                        </Text>
                    </View>
                    
                    {/* Level Badge Ornament */}
                    <View className="absolute -top-2 -right-2 bg-black border border-[#C6FF00]/50 w-8 h-8 rounded-full items-center justify-center shadow-lg">
                         <Ionicons name="flash" size={14} color="#C6FF00" />
                    </View>
                </View>
                
                <View className="items-center mt-8">
                    <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-[5px] mb-2">Authenticated Warrior</Text>
                    <Text className="text-white text-4xl font-black uppercase italic tracking-tighter leading-none">
                        {profileData?.name || session?.user?.name || "Warrior"}
                    </Text>
                    
                    <View className="flex-row items-center mt-6">
                        <View className="bg-[#C6FF00] px-4 py-1.5 rounded-full rotate-[-2deg]">
                            <Text className="text-black text-[10px] font-black uppercase tracking-widest">
                                {profileData?.level || "Elite Member"}
                            </Text>
                        </View>
                        <View className="w-2 h-2 rounded-full bg-zinc-800 mx-3" />
                         <View className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
                            <Text className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Since 2025</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Quick Stats */}
            <View className="flex-row justify-between mt-10">
                <View className="items-center flex-1">
                    <Text className="text-white text-xl font-black italic">{profileData?.stats.sessions || 0}</Text>
                    <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Sessions</Text>
                </View>
                <View className="w-[1px] h-full bg-white/5" />
                <View className="items-center flex-1">
                    <Text className="text-[#C6FF00] text-xl font-black italic">{profileData?.stats.streak || 0}</Text>
                    <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Streak</Text>
                </View>
                <View className="w-[1px] h-full bg-white/5" />
                <View className="items-center flex-1">
                    <Text className="text-white text-xl font-black italic">{profileData?.stats.rank || "RANK 1"}</Text>
                    <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Status</Text>
                </View>
            </View>
        </Animated.View>

        {/* Content Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(800)} className="px-6">
            <SectionHeader title="Performance" />
            <ProfileItem 
                icon="analytics-outline" 
                label="Workout Statistics" 
                onPress={() => router.push("/(tabs)/progress")} 
                secondary="Detailed breakdown"
            />
            <ProfileItem 
                icon="medal-outline" 
                label="Achievements" 
                onPress={() => Alert.alert("Coming Soon", "Achievement details are on the roadmap!")} 
                secondary={`${profileData?.stats.achievements || 0} unlocked`}
            />

            <SectionHeader title="Settings" />
            <ProfileItem 
                icon="person-outline" 
                label="Account Settings" 
                onPress={() => Alert.alert("Settings", "Account settings will be available in the next update.")} 
            />
            <ProfileItem 
                icon="notifications-outline" 
                label="Notifications" 
                onPress={() => {}} 
            />
            <ProfileItem 
                icon="lock-closed-outline" 
                label="Privacy & Security" 
                onPress={() => {}} 
            />

            <SectionHeader title="Support" />
            <ProfileItem 
                icon="help-circle-outline" 
                label="Help Center" 
                onPress={() => {}} 
            />
            <ProfileItem 
                icon="chatbubble-ellipses-outline" 
                label="Send Feedback" 
                onPress={() => {}} 
            />

            {/* Danger Zone */}
            <TouchableOpacity 
                onPress={handleSignOut}
                className="mt-10 flex-row items-center justify-center p-4 bg-red-500/10 border border-red-500/20 rounded-2xl h-16"
            >
                <Ionicons name="log-out-outline" size={20} color="#ef4444" className="mr-3" />
                <Text className="text-red-500 font-black uppercase tracking-widest ml-2">Terminate Session</Text>
            </TouchableOpacity>

            <Text className="text-zinc-700 text-[10px] text-center mt-10 font-bold uppercase tracking-[2px]">
                GymApp V2.0 • Build 2025.12
            </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
