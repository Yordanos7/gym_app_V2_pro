import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { authClient } from "@/lib/auth-client";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        router.replace("/(tabs)");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-background p-6">
      <Text className="text-3xl font-bold mb-8 text-primary">Gym App</Text>
      
      <View className="w-full space-y-4">
        <View>
          <Text className="mb-2 text-default-500">Email</Text>
          <TextInput
            className="w-full border border-default-200 rounded-lg p-3 text-foreground"
            placeholder="Enter your email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View>
          <Text className="mb-2 text-default-500">Password</Text>
          <TextInput
            className="w-full border border-default-200 rounded-lg p-3 text-foreground"
            placeholder="Enter your password"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className={`w-full bg-primary p-4 rounded-lg items-center ${loading ? "opacity-70" : ""}`}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text className="text-primary-foreground font-bold text-lg">
            {loading ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-default-500">Don't have an account? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-bold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
