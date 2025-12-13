import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

export default function LogMealScreen() {
  const router = useRouter();
  const [type, setType] = useState("BREAKFAST");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLog = async () => {
    if (!calories) {
      Alert.alert("Error", "Please enter calories");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/nutrition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, calories, protein: protein || 0 }),
      });

      if (response.ok) {
        Alert.alert("Success", "Meal logged!");
        router.back();
      } else {
        throw new Error("Failed");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to log meal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-6 pt-12">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-gray-900">Log Meal</Text>
      </View>

      <Text className="text-lg font-bold mb-3 text-gray-700">Meal Type</Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
        {MEAL_TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            className={`px-4 py-2 rounded-full border ${type === t ? 'bg-green-100 border-green-500' : 'bg-gray-50 border-gray-200'}`}
            onPress={() => setType(t)}
          >
            <Text className={`font-semibold ${type === t ? 'text-green-700' : 'text-gray-600'}`}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-lg font-bold mb-3 text-gray-700">Calories</Text>
      <TextInput
        className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 text-lg"
        placeholder="e.g. 500"
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
      />

      <Text className="text-lg font-bold mb-3 text-gray-700">Protein (g)</Text>
      <TextInput
        className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8 text-lg"
        placeholder="e.g. 30"
        keyboardType="numeric"
        value={protein}
        onChangeText={setProtein}
      />

      <TouchableOpacity
        className={`bg-green-600 p-4 rounded-xl items-center ${loading ? "opacity-70" : ""}`}
        onPress={handleLog}
        disabled={loading}
      >
        <Text className="text-white font-bold text-lg">Log Meal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
