import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd fetch specific exercise details
    // For now, we'll fetch from the list endpoint or assume we have data
    // Let's just fetch the list and find it, or create a detail endpoint
    // I'll assume we can fetch list with ?id=... or just fetch all and find
    // Or better, create a detail endpoint. I'll use the list endpoint with search for now as a hack
    // Actually, I should have created a detail endpoint.
    // Let's just mock it or fetch list.
    
    // Quick fix: fetch list and filter client side for this demo
    const fetchExercise = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/exercises`);
        if (response.ok) {
          const json = await response.json();
          const found = json.find((e: any) => e.id === id);
          setExercise(found);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchExercise();
  }, [id]);

  if (loading) {
    return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#2563eb" /></View>;
  }

  if (!exercise) {
    return <View className="flex-1 justify-center items-center"><Text>Exercise not found</Text></View>;
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="h-64 bg-gray-200 items-center justify-center">
        <Ionicons name="videocam-outline" size={64} color="#9ca3af" />
        <Text className="text-gray-500 mt-2">Video Placeholder</Text>
      </View>

      <View className="p-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-blue-600 font-bold">Back</Text>
        </TouchableOpacity>

        <Text className="text-3xl font-bold text-gray-900 mb-2">{exercise.name}</Text>
        <View className="flex-row space-x-2 mb-6">
          <View className="bg-blue-100 px-3 py-1 rounded-full">
            <Text className="text-blue-700 font-medium text-xs">{exercise.primaryMuscle.name}</Text>
          </View>
          {exercise.equipment && (
            <View className="bg-gray-100 px-3 py-1 rounded-full">
              <Text className="text-gray-700 font-medium text-xs">{exercise.equipment}</Text>
            </View>
          )}
        </View>

        <Text className="text-xl font-bold mb-2 text-gray-900">Instructions</Text>
        <Text className="text-gray-600 leading-6 mb-6">
          {exercise.description || "No instructions available for this exercise."}
        </Text>

        <Text className="text-xl font-bold mb-2 text-gray-900">Mistakes to Avoid</Text>
        <Text className="text-gray-600 leading-6">
          • Keeping bad form
          {'\n'}• Rushing the movement
          {'\n'}• Using too much weight
        </Text>
      </View>
    </ScrollView>
  );
}
