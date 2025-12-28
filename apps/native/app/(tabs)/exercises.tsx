import { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";

type Exercise = {
  id: string;
  name: string;
  primaryMuscle: { name: string };
  equipment: string | null;
  videoUrl: string | null;
  targetMuscle?: string;
};

export default function ExercisesScreen() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchExercises = async (searchTerm: string) => {
    setLoading(true);
    try {
      const query = searchTerm ? `?search=${searchTerm}` : "";
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
      fetchExercises(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const renderItem = ({ item, index }: { item: Exercise; index: number }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 50).duration(400)}
      layout={Layout.springify()}
    >
      <TouchableOpacity 
        className="bg-zinc-900/80 p-5 mb-4 rounded-3xl flex-row items-center border border-white/5 active:bg-zinc-800"
        onPress={() => router.push(`/exercise/${item.id}`)}
      >
        <View className="bg-[#C6FF00]/10 w-12 h-12 rounded-2xl items-center justify-center mr-4 border border-[#C6FF00]/20">
          <Ionicons name="barbell" size={24} color="#C6FF00" />
        </View>
        <View className="flex-1">
          <Text className="font-black text-white text-lg italic uppercase tracking-tighter">{item.name}</Text>
          <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
            {item.primaryMuscle?.name || "General"} • {item.equipment || "Bodyweight"}
          </Text>
        </View>
        <View className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
            <Ionicons name="chevron-forward" size={16} color="#C6FF00" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-black">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#18181b', '#000000']}
        className="absolute inset-0"
      />

      <View className="flex-1 px-6 pt-16">
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)} className="mb-8">
            <Text className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">
                Forge <Text className="text-[#C6FF00]">Body</Text>
            </Text>
            <Text className="text-zinc-500 text-sm font-medium tracking-wide">
                Explore exercises to master your technique.
            </Text>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View 
            entering={FadeInDown.delay(200).duration(600)}
            className="flex-row items-center bg-zinc-900/80 px-4 h-14 rounded-2xl border border-white/5 mb-8 shadow-2xl"
        >
          <Ionicons name="search" size={20} color="#C6FF00" />
          <TextInput
            className="flex-1 ml-3 text-white font-bold text-base"
            placeholder="Search exercises..."
            placeholderTextColor="#52525b"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
          {loading && <ActivityIndicator size="small" color="#C6FF00" />}
          {!loading && search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                  <Ionicons name="close-circle" size={20} color="#52525b" />
              </TouchableOpacity>
          )}
        </Animated.View>

        {/* List Section Title */}
        <View className="flex-row items-center justify-between mb-4 px-1">
            <Text className="text-zinc-400 text-xs font-black uppercase tracking-[3px]">Technique Library</Text>
            <View className="bg-zinc-800 px-2 py-0.5 rounded-md">
                <Text className="text-zinc-500 text-[10px] font-bold">{exercises.length} Items</Text>
            </View>
        </View>

        {exercises.length === 0 && !loading ? (
             <View className="flex-1 justify-center items-center pb-20">
                <Ionicons name="flask-outline" size={48} color="#27272a" />
                <Text className="text-zinc-600 mt-4 font-bold">No exercises found.</Text>
             </View>
        ) : (
            <FlatList
                data={exercises}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
            />
        )}
      </View>
    </View>
  );
}
