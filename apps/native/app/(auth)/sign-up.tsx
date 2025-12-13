import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { authClient } from "@/lib/auth-client";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        router.replace("/(tabs)");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-3xl font-bold mb-8 text-primary">Create Account</Text>
      
      <View className="w-full space-y-4">
        <View>
          <Text className="mb-2 text-gray-600">Name</Text>
          <TextInput
            className="w-full border border-gray-300 rounded-lg p-3"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View>
          <Text className="mb-2 text-gray-600">Email</Text>
          <TextInput
            className="w-full border border-gray-300 rounded-lg p-3"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View>
          <Text className="mb-2 text-gray-600">Password</Text>
          <TextInput
            className="w-full border border-gray-300 rounded-lg p-3"
            placeholder="Choose a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className={`w-full bg-blue-600 p-4 rounded-lg items-center ${loading ? "opacity-70" : ""}`}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text className="text-white font-bold text-lg">
            {loading ? "Sign Up" : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600">Already have an account? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity>
              <Text className="text-blue-600 font-bold">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
