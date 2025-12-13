import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/programs/${id}`);
        if (response.ok) {
          const json = await response.json();
          setProgram(json);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProgram();
  }, [id]);

  if (loading) {
    return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#2563eb" /></View>;
  }

  if (!program) {
    return <View className="flex-1 justify-center items-center"><Text>Program not found</Text></View>;
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 pt-12 bg-blue-600">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-white mb-2">{program.name}</Text>
        <Text className="text-blue-100">{program.description}</Text>
      </View>

      <View className="p-6">
        <Text className="text-xl font-bold mb-4 text-gray-900">Weekly Schedule</Text>
        
        {program.days.map((day: any) => (
          <View key={day.id} className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <Text className="text-lg font-bold text-gray-800 mb-2">{day.title}</Text>
            <View className="space-y-2">
              {day.exercises.map((ex: any) => (
                <TouchableOpacity 
                  key={ex.id} 
                  className="flex-row items-center bg-white p-3 rounded-lg border border-gray-200"
                  onPress={() => router.push(`/exercise/${ex.exercise.id}`)}
                >
                  <Ionicons name="barbell-outline" size={20} color="#4b5563" />
                  <Text className="ml-3 text-gray-700 font-medium">{ex.exercise.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
