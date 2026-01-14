import { View, Text, TouchableOpacity, ScrollView, StatusBar, Alert, Image } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/lib/use-session";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function ProfileScreen() {
  const router = useRouter();
  const { data: session } = useSession();

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

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#18181b', '#000000']}
        className="absolute inset-0"
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero Section */}
        <Animated.View entering={FadeInUp.duration(800)} className="pt-20 px-6 pb-10">
            <View className="items-center">
                <View className="relative">
                    <LinearGradient
                        colors={['#C6FF00', '#7AB800']}
                        className="w-28 h-28 rounded-full p-[2px]"
                    >
                        <View className="bg-black w-full h-full rounded-full items-center justify-center overflow-hidden border-[4px] border-black">
                           {session?.user?.image ? (
                               <Image source={{ uri: session.user.image }} className="w-full h-full" />
                           ) : (
                               <Text className="text-[#C6FF00] text-3xl font-black italic">{session?.user?.name?.substring(0, 2).toUpperCase() || "WA"}</Text>
                           )}
                        </View>
                    </LinearGradient>
                    <TouchableOpacity className="absolute bottom-0 right-0 bg-[#C6FF00] w-8 h-8 rounded-full items-center justify-center border-4 border-black">
                        <Ionicons name="camera" size={14} color="black" />
                    </TouchableOpacity>
                </View>
                
                <Text className="text-white text-3xl font-black uppercase italic mt-6 tracking-tighter">
                    {session?.user?.name || "Warrior"}
                </Text>
                <View className="flex-row items-center mt-1">
                    <View className="bg-[#C6FF00]/10 border border-[#C6FF00]/30 px-3 py-1 rounded-full flex-row items-center">
                        <Ionicons name="shield-checkmark" size={12} color="#C6FF00" />
                        <Text className="text-[#C6FF00] text-[10px] font-black uppercase ml-1.5 tracking-widest">Elite Member</Text>
                    </View>
                </View>
            </View>

            {/* Quick Stats */}
            <View className="flex-row justify-between mt-10">
                <View className="items-center flex-1">
                    <Text className="text-white text-xl font-black italic">12</Text>
                    <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Sessions</Text>
                </View>
                <View className="w-[1px] h-full bg-white/5" />
                <View className="items-center flex-1">
                    <Text className="text-[#C6FF00] text-xl font-black italic">8</Text>
                    <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Streak</Text>
                </View>
                <View className="w-[1px] h-full bg-white/5" />
                <View className="items-center flex-1">
                    <Text className="text-white text-xl font-black italic">LVL 4</Text>
                    <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Rank</Text>
                </View>
            </View>
        </Animated.View>

        {/* Content Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(800)} className="px-6">
            <SectionHeader title="Performance" />
            <ProfileItem 
                icon="analytics-outline" 
                label="Workout Statistics" 
                onPress={() => {}} 
                secondary="Detailed breakdown"
            />
            <ProfileItem 
                icon="medal-outline" 
                label="Achievements" 
                onPress={() => {}} 
                secondary="12 unlocked"
            />

            <SectionHeader title="Settings" />
            <ProfileItem 
                icon="person-outline" 
                label="Account Settings" 
                onPress={() => {}} 
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
