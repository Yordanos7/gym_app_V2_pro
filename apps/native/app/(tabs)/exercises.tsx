import { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Exercise = {
  id: string;
  name: string;
  primaryMuscle: { name: string };
  equipment: string | null;
  videoUrl: string | null;
};

export default function ExercisesScreen() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const query = search ? `?search=${search}` : "";
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/exercises${query}`);
      if (response.ok) {
        const json = await response.json();
        setExercises(json);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExercises();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const renderItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity 
      className="bg-white p-4 mb-3 rounded-xl flex-row items-center shadow-sm border border-gray-100"
      onPress={() => router.push(`/exercise/${item.id}`)}
    >
      <View className="bg-blue-50 w-12 h-12 rounded-lg items-center justify-center mr-4">
        <Ionicons name="barbell" size={24} color="#2563eb" />
      </View>
      <View className="flex-1">
        <Text className="font-bold text-gray-900 text-lg">{item.name}</Text>
        <Text className="text-gray-500 capitalize">
          {item.primaryMuscle.name} • {item.equipment || "Bodyweight"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 p-4 pt-12">
      <Text className="text-3xl font-bold mb-6 text-gray-900">Exercises</Text>

      <View className="flex-row items-center bg-white p-3 rounded-xl border border-gray-200 mb-6">
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          className="flex-1 ml-3 text-lg"
          placeholder="Search exercises..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={exercises}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
