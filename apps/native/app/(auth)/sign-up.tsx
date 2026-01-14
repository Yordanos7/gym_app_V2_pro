import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from "react-native";
import { Link, useRouter } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        router.replace("/");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#18181b', '#000000']}
        className="absolute inset-0"
      />

      <View className="flex-1 justify-center px-6">
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => router.back()}
          className="absolute top-14 left-6 w-10 h-10 rounded-full bg-zinc-900/50 border border-white/10 items-center justify-center z-10"
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.duration(800).springify()} className="mb-10 items-center">
            <View className="w-20 h-20 bg-[#C6FF00]/10 rounded-full items-center justify-center mb-6 border border-[#C6FF00]/20 shadow-[0_0_30px_rgba(198,255,0,0.2)]">
                <Ionicons name="person-add" size={36} color="#C6FF00" />
            </View>
            <Text className="text-white text-4xl font-black italic uppercase tracking-tighter text-center">
                Join The <Text className="text-[#C6FF00]">Club</Text>
            </Text>
            <Text className="text-zinc-500 text-sm font-medium mt-2 tracking-wide uppercase">
                Start your transformation
            </Text>
        </Animated.View>
        
        <Animated.View entering={FadeInUp.delay(200).springify()} className="space-y-4">
            {/* Name Input */}
            <View>
                <Text className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Full Name</Text>
                <View className="flex-row items-center bg-zinc-900/50 border border-white/10 rounded-2xl px-4 h-14">
                    <Ionicons name="person-outline" size={20} color="#71717a" />
                    <TextInput
                        className="flex-1 text-white ml-3 font-medium text-base"
                        placeholder="Enter your name"
                        placeholderTextColor="#52525b"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
            </View>

            {/* Email Input */}
            <View>
                <Text className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Email</Text>
                <View className="flex-row items-center bg-zinc-900/50 border border-white/10 rounded-2xl px-4 h-14">
                    <Ionicons name="mail-outline" size={20} color="#71717a" />
                    <TextInput
                        className="flex-1 text-white ml-3 font-medium text-base"
                        placeholder="Enter your email"
                        placeholderTextColor="#52525b"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>
            </View>

            {/* Password Input */}
            <View>
                <Text className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Password</Text>
                <View className="flex-row items-center bg-zinc-900/50 border border-white/10 rounded-2xl px-4 h-14">
                    <Ionicons name="lock-closed-outline" size={20} color="#71717a" />
                    <TextInput
                        className="flex-1 text-white ml-3 font-medium text-base"
                        placeholder="Choose a password"
                        placeholderTextColor="#52525b"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={secureTextEntry}
                    />
                    <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                        <Ionicons name={secureTextEntry ? "eye-off-outline" : "eye-outline"} size={20} color="#71717a" />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                className="w-full bg-[#C6FF00] h-14 rounded-2xl items-center justify-center mt-4 shadow-[0_0_20px_rgba(198,255,0,0.3)] active:opacity-90"
                onPress={handleSignUp}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="black" />
                ) : (
                    <Text className="text-black font-black text-lg uppercase tracking-widest">Create Account</Text>
                )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
                <Text className="text-zinc-500 text-sm">Already have an account? </Text>
                <Link href="/(auth)/sign-in" asChild>
                    <TouchableOpacity>
                        <Text className="text-[#C6FF00] font-bold text-sm ml-1">Sign In</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </Animated.View>
      </View>
    </View>
  );
}
