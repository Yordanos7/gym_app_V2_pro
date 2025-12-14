import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { authClient } from "@/lib/auth-client";

export default function ActiveWorkoutScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<any[]>([]);

  useEffect(() => {
    const startSession = async () => {
      try {
        const notes = id === 'quick' ? "Quick Workout" : `Workout from Program ${id}`;
        const res = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/workout-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes }),
        });
        const newSession = await res.json();
        setSession(newSession);

        const exRes = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/exercises`);
        const allExercises = await exRes.json();
        
        if (id === 'quick') {
             setExercises(allExercises.sort(() => 0.5 - Math.random()).slice(0, 5));
        } else {
             setExercises(allExercises.slice(0, 3));
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to start workout");
      } finally {
        setLoading(false);
      }
    };
    startSession();
  }, [id]);

  const handleLogSet = async (exerciseId: string, reps: string, weight: string) => {
    if (!session) return;
    try {
      await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/workout-session/${session.id}/set`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseId, reps, weight }),
      });
      Alert.alert("Success", "Set logged!");
    } catch (error) {
      Alert.alert("Error", "Failed to log set");
    }
  };

  const handleFinish = async () => {
    if (!session) return;
    try {
      await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/workout-session/${session.id}/finish`, {
        method: "PUT",
      });
      router.replace("/workout/summary");
    } catch (error) {
      Alert.alert("Error", "Failed to finish workout");
    }
  };

  if (loading) return <View className="flex-1 justify-center items-center bg-background"><ActivityIndicator size="large" color="#2563eb" /></View>;

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ 
        title: id === 'quick' ? "Quick Workout" : "Active Workout",
        headerStyle: { backgroundColor: 'transparent' },
        headerTransparent: true,
        headerTintColor: '#2563eb', // This might need to be dynamic, but keeping simple for now
      }} />
      
      <ScrollView className="flex-1 p-4 pt-24">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-1">Let's Crush It!</Text>
          <Text className="text-default-500">Session ID: {session?.id?.slice(0, 8)}...</Text>
        </View>

        <View className="pb-24">
          {exercises.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} onLog={(reps, weight) => handleLogSet(ex.id, reps, weight)} />
          ))}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 border-t border-default-200">
        <TouchableOpacity 
          className="bg-primary p-4 rounded-2xl items-center shadow-lg"
          onPress={handleFinish}
        >
          <Text className="text-primary-foreground font-bold text-lg">Finish Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ExerciseCard({ exercise, onLog }: { exercise: any, onLog: (r: string, w: string) => void }) {
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  return (
    <View className="bg-content1 p-5 rounded-2xl mb-4 shadow-sm border border-default-200">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-foreground flex-1 mr-2">{exercise.name}</Text>
        <TouchableOpacity className="bg-primary-50 p-2 rounded-full">
          <Ionicons name="information-circle-outline" size={20} className="text-primary" />
        </TouchableOpacity>
      </View>
      
      <View className="flex-row space-x-3 items-end">
        <View className="flex-1">
          <Text className="text-xs text-default-500 mb-1 ml-1">Reps</Text>
          <TextInput 
            className="bg-default-100 p-3 rounded-xl text-foreground font-semibold text-center"
            placeholder="0"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
          />
        </View>
        
        <View className="flex-1">
          <Text className="text-xs text-default-500 mb-1 ml-1">Weight (kg)</Text>
          <TextInput 
            className="bg-default-100 p-3 rounded-xl text-foreground font-semibold text-center"
            placeholder="0"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
        </View>

        <TouchableOpacity 
          className="bg-primary h-[50px] w-[50px] justify-center items-center rounded-xl shadow-sm"
          onPress={() => {
            onLog(reps, weight);
            setReps("");
            setWeight("");
          }}
        >
          <Ionicons name="add" size={28} className="text-primary-foreground" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
