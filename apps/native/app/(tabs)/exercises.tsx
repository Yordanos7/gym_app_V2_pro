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
      className="bg-content1 p-4 mb-3 rounded-xl flex-row items-center shadow-sm border border-default-200"
      onPress={() => router.push(`/exercise/${item.id}`)}
    >
      <View className="bg-primary-50 w-12 h-12 rounded-lg items-center justify-center mr-4">
        <Ionicons name="barbell" size={24} className="text-primary" />
      </View>
      <View className="flex-1">
        <Text className="font-bold text-foreground text-lg">{item.name}</Text>
        <Text className="text-default-500 capitalize">
          {item.primaryMuscle.name} • {item.equipment || "Bodyweight"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} className="text-default-400" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background p-4 pt-12">
      <Text className="text-3xl font-bold mb-6 text-foreground">Exercises</Text>

      <View className="flex-row items-center bg-content1 p-3 rounded-xl border border-default-200 mb-6">
        <Ionicons name="search" size={20} className="text-default-400" />
        <TextInput
          className="flex-1 ml-3 text-lg text-foreground"
          placeholder="Search exercises..."
          placeholderTextColor="#9ca3af"
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
