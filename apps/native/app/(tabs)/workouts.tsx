import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Program = {
  id: string;
  name: string;
  description: string | null;
  difficulty: string;
  days: any[];
};

export default function WorkoutsScreen() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/programs`);
        if (response.ok) {
          const json = await response.json();
          setPrograms(json);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const renderItem = ({ item }: { item: Program }) => (
    <TouchableOpacity 
      className="bg-white p-5 mb-4 rounded-2xl shadow-sm border border-gray-100"
      onPress={() => router.push(`/program/${item.id}`)}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-xl font-bold text-gray-900 flex-1 mr-2">{item.name}</Text>
        <View className={`px-3 py-1 rounded-full ${
          item.difficulty === 'BEGINNER' ? 'bg-green-100' : 
          item.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          <Text className={`text-xs font-bold ${
            item.difficulty === 'BEGINNER' ? 'text-green-700' : 
            item.difficulty === 'INTERMEDIATE' ? 'text-yellow-700' : 'text-red-700'
          }`}>
            {item.difficulty}
          </Text>
        </View>
      </View>
      
      <Text className="text-gray-500 mb-4" numberOfLines={2}>{item.description}</Text>
      
      <View className="flex-row items-center">
        <Ionicons name="calendar-outline" size={16} color="#6b7280" />
        <Text className="text-gray-500 ml-1 text-sm">{item.days.length} Days / Week</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 p-4 pt-12">
      <Text className="text-3xl font-bold mb-6 text-gray-900">Workout Plans</Text>

      <FlatList
        data={programs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center mt-10">
              <Text className="text-gray-500">No programs found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
