import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StatusBar, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { authFetch } from "@/lib/api";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const MEAL_TYPES = [
  { id: "BREAKFAST", label: "Breakfast", icon: "sunny-outline" },
  { id: "LUNCH", label: "Lunch", icon: "fast-food-outline" },
  { id: "DINNER", label: "Dinner", icon: "moon-outline" }
];

export default function LogMealScreen() {
  const router = useRouter();
  const [type, setType] = useState("BREAKFAST");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState<any[]>([]);
  const [fetchingMeals, setFetchingMeals] = useState(true);

  const fetchMeals = async () => {
    try {
      const response = await authFetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/nutrition`);
      if (response.ok) {
        const data = await response.json();
        setMeals(data);
      }
    } catch (error) {
      console.error("Fetch meals error:", error);
    } finally {
      setFetchingMeals(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleLog = async () => {
    if (!calories) {
      Alert.alert("Refuel Error", "Energy count required! Please enter calories.");
      return;
    }

    setLoading(true);
    try {
      const response = await authFetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/nutrition`, {
        method: "POST",
        body: JSON.stringify({ 
          type, 
          calories: Number(calories) || 0, 
          protein: Number(protein) || 0 
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Fuel logged. Ready for the next burn!");
        setCalories("");
        setProtein("");
        fetchMeals();
      } else {
        const errorText = await response.text();
        console.error("Log error:", errorText);
        Alert.alert("Error", "Failed to log intake. Try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong during data sync.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (id: string) => {
    Alert.alert(
      "Delete Log",
      "Are you sure you want to remove this fuel entry?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              const response = await authFetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/nutrition/${id}`, {
                method: "DELETE"
              });
              if (response.ok) {
                fetchMeals();
              } else {
                const errorText = await response.text();
                console.error("Delete error:", errorText);
                Alert.alert("Error", "Failed to delete meal");
              }
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Something went wrong");
            }
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#18181b', '#000000']}
        className="absolute inset-0"
      />
      
      <Stack.Screen options={{ 
        headerShown: false
      }} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-16" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center mb-10">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 items-center justify-center mr-4"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            <View>
              <Text className="text-[#C6FF00] text-xs font-black uppercase tracking-[3px]">Nutrition</Text>
              <Text className="text-white text-3xl font-black italic uppercase tracking-tighter">Log Your <Text className="text-[#C6FF00]">Fuel</Text></Text>
            </View>
          </View>

          <Animated.View entering={FadeInDown.delay(100).duration(800)}>
            {/* Meal Type Selection */}
            <View className="mb-8">
                <Text className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4 ml-1">Which session is this?</Text>
                <View className="flex-row flex-wrap gap-3">
                    {MEAL_TYPES.map((meal) => (
                    <TouchableOpacity
                        key={meal.id}
                        className={`flex-1 min-w-[100px] p-4 rounded-2xl border flex-col items-center justify-center ${type === meal.id ? 'bg-[#C6FF00]/10 border-[#C6FF00]' : 'bg-zinc-900/50 border-white/10'}`}
                        onPress={() => setType(meal.id)}
                    >
                        <Ionicons name={meal.icon as any} size={24} color={type === meal.id ? '#C6FF00' : '#71717a'} />
                        <Text className={`font-bold mt-2 text-xs uppercase tracking-wider ${type === meal.id ? 'text-[#C6FF00]' : 'text-zinc-500'}`}>{meal.label}</Text>
                    </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Inputs Section */}
            <View className="space-y-6 mb-10">
                <View>
                    <Text className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3 ml-1">Calories (Kcal)</Text>
                    <View className="flex-row items-center bg-zinc-900/50 border border-white/10 rounded-2xl px-4 h-16">
                        <Ionicons name="flame-outline" size={20} color="#C6FF00" />
                        <TextInput
                            className="flex-1 text-white ml-3 font-bold text-lg"
                            placeholder="Enter amount"
                            placeholderTextColor="#52525b"
                            keyboardType="numeric"
                            value={calories}
                            onChangeText={setCalories}
                        />
                        <Text className="text-zinc-600 font-black italic">ENERGY</Text>
                    </View>
                </View>

                <View>
                    <Text className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3 ml-1">Protein (Grams)</Text>
                    <View className="flex-row items-center bg-zinc-900/50 border border-white/10 rounded-2xl px-4 h-16">
                        <Ionicons name="barbell-outline" size={20} color="#C6FF00" />
                        <TextInput
                            className="flex-1 text-white ml-3 font-bold text-lg"
                            placeholder="Enter amount"
                            placeholderTextColor="#52525b"
                            keyboardType="numeric"
                            value={protein}
                            onChangeText={setProtein}
                        />
                        <Text className="text-zinc-600 font-black italic">MUSCLE</Text>
                    </View>
                </View>
            </View>

            {/* Call to Action */}
            <TouchableOpacity 
                className={`w-full bg-[#C6FF00] h-16 rounded-2xl items-center justify-center shadow-[0_0_30px_rgba(198,255,0,0.3)] ${loading ? 'opacity-50' : 'active:opacity-80'}`}
                onPress={handleLog}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="black" />
                ) : (
                    <View className="flex-row items-center">
                        <Text className="text-black font-black text-lg uppercase tracking-widest mr-2">Confirm Intake</Text>
                        <Ionicons name="checkmark-done" size={20} color="black" />
                    </View>
                )}
            </TouchableOpacity>
            
            <View className="mt-10 mb-10">
                <View className="flex-row items-center justify-between mb-6">
                    <Text className="text-white text-xl font-black uppercase tracking-tighter">Today's <Text className="text-[#C6FF00]">Fuel</Text></Text>
                    {meals.length > 0 && (
                        <View className="bg-zinc-900 px-3 py-1 rounded-full border border-white/5">
                            <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{meals.length} ENTRIES</Text>
                        </View>
                    )}
                </View>

                {fetchingMeals ? (
                    <ActivityIndicator color="#C6FF00" />
                ) : meals.length === 0 ? (
                    <View className="bg-zinc-900/30 border border-dashed border-white/10 rounded-3xl p-10 items-center justify-center">
                        <Ionicons name="restaurant-outline" size={32} color="#27272a" />
                        <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-4">Empty Tank. Start Fueling!</Text>
                    </View>
                ) : (
                    <View className="space-y-4">
                        {meals.slice().reverse().map((meal) => (
                            <Animated.View 
                                entering={FadeInUp.duration(400)}
                                key={meal.id} 
                                className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4 flex-row items-center justify-between"
                            >
                                <View className="flex-row items-center flex-1">
                                    <View className="w-12 h-12 bg-[#C6FF00]/10 rounded-xl items-center justify-center mr-4 border border-[#C6FF00]/20">
                                        <Ionicons 
                                            name={MEAL_TYPES.find(m => m.id === meal.type)?.icon as any || "fast-food-outline"} 
                                            size={20} 
                                            color="#C6FF00" 
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white font-black uppercase text-xs tracking-wider">{meal.type}</Text>
                                        <View className="flex-row items-center mt-1">
                                            <Text className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mr-3">{meal.calories} kcal</Text>
                                            <Text className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">{meal.protein}g protein</Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity 
                                    onPress={() => handleDeleteMeal(meal.id)}
                                    className="w-10 h-10 items-center justify-center rounded-full active:bg-red-500/10"
                                >
                                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                )}
            </View>
            
            <View className="mt-10 p-6 rounded-3xl bg-zinc-900/30 border border-white/5 items-center">
                <Ionicons name="shield-checkmark" size={32} color="#C6FF00" />
                <Text className="text-zinc-400 text-center text-xs font-medium mt-3 leading-5">
                    "Abs are made in the kitchen."{"\n"}
                    Keep your macros tracked to stay elite.
                </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
