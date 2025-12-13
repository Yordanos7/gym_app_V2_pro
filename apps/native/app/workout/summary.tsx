import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function WorkoutSummaryScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white justify-center items-center p-6">
      <View className="bg-green-100 p-6 rounded-full mb-6">
        <Ionicons name="trophy" size={64} color="#16a34a" />
      </View>
      
      <Text className="text-3xl font-bold text-gray-900 mb-2">Workout Complete!</Text>
      <Text className="text-gray-500 text-center mb-8">
        Great job crushing your workout. Keep up the momentum!
      </Text>

      <View className="flex-row space-x-4 mb-8 w-full">
        <View className="flex-1 bg-gray-50 p-4 rounded-xl items-center">
          <Text className="text-2xl font-bold text-gray-900">45</Text>
          <Text className="text-gray-500 text-sm">Minutes</Text>
        </View>
        <View className="flex-1 bg-gray-50 p-4 rounded-xl items-center">
          <Text className="text-2xl font-bold text-gray-900">12</Text>
          <Text className="text-gray-500 text-sm">Sets</Text>
        </View>
        <View className="flex-1 bg-gray-50 p-4 rounded-xl items-center">
          <Text className="text-2xl font-bold text-gray-900">320</Text>
          <Text className="text-gray-500 text-sm">Calories</Text>
        </View>
      </View>

      <TouchableOpacity 
        className="w-full bg-blue-600 p-4 rounded-xl items-center"
        onPress={() => router.replace("/(tabs)")}
      >
        <Text className="text-white font-bold text-lg">Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
