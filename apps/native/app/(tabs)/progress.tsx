import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProgressScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/progress`);
        if (response.ok) {
          const json = await response.json();
          setData(json);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" /></View>;

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6 pt-12">
      <Text className="text-3xl font-bold mb-6 text-gray-900">Your Progress</Text>

      <View className="flex-row space-x-4 mb-6">
        <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center">
          <Text className="text-gray-500 mb-1">Total Workouts</Text>
          <Text className="text-3xl font-bold text-blue-600">{data?.totalWorkouts || 0}</Text>
        </View>
        <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center">
          <Text className="text-gray-500 mb-1">Weight Change</Text>
          <Text className="text-3xl font-bold text-green-600">-2.5 kg</Text>
        </View>
      </View>

      <Text className="text-xl font-bold mb-4 text-gray-900">Weight History</Text>
      <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        {data?.weightHistory?.length > 0 ? (
          data.weightHistory.map((entry: any) => (
            <View key={entry.id} className="flex-row justify-between py-3 border-b border-gray-100 last:border-0">
              <Text className="text-gray-600">{new Date(entry.date).toLocaleDateString()}</Text>
              <Text className="font-bold text-gray-900">{entry.weight} kg</Text>
            </View>
          ))
        ) : (
          <Text className="text-gray-500 text-center py-4">No weight entries yet.</Text>
        )}
      </View>

      <Text className="text-xl font-bold mb-4 text-gray-900">Strength Stats</Text>
      <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <View className="flex-row justify-between py-3 border-b border-gray-100">
          <Text className="text-gray-600">Bench Press</Text>
          <Text className="font-bold text-gray-900">80 kg</Text>
        </View>
        <View className="flex-row justify-between py-3 border-b border-gray-100">
          <Text className="text-gray-600">Squat</Text>
          <Text className="font-bold text-gray-900">100 kg</Text>
        </View>
        <View className="flex-row justify-between py-3">
          <Text className="text-gray-600">Deadlift</Text>
          <Text className="font-bold text-gray-900">120 kg</Text>
        </View>
      </View>
    </ScrollView>
  );
}
