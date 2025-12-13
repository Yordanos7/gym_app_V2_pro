import { View, Text, TouchableOpacity } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold mb-4">Profile</Text>
      <TouchableOpacity 
        className="bg-red-500 p-3 rounded-lg"
        onPress={handleSignOut}
      >
        <Text className="text-white font-bold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
