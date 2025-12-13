import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { authClient } from "@/lib/auth-client";

export default function ActiveWorkoutScreen() {
  const { id } = useLocalSearchParams(); // This is programId for now
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<any[]>([]);

  // Start session on mount
  useEffect(() => {
    const startSession = async () => {
      try {
        // Create session
        const notes = id === 'quick' ? "Quick Workout" : `Workout from Program ${id}`;
        const res = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/workout-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes }),
        });
        const newSession = await res.json();
        setSession(newSession);

        // Fetch exercises
        // If quick workout, maybe fetch all or let user add? For now, fetch random 5
        const exRes = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/exercises`);
        const allExercises = await exRes.json();
        
        if (id === 'quick') {
             // Random 5 for quick workout
             setExercises(allExercises.sort(() => 0.5 - Math.random()).slice(0, 5));
        } else {
             // Mock program exercises
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

  if (loading) return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" /></View>;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6 pt-12 bg-white shadow-sm mb-4">
        <Text className="text-2xl font-bold text-gray-900">Active Workout</Text>
        <Text className="text-gray-500">Session ID: {session?.id?.slice(0, 8)}...</Text>
      </View>

      <View className="p-4">
        {exercises.map((ex) => (
          <ExerciseCard key={ex.id} exercise={ex} onLog={(reps, weight) => handleLogSet(ex.id, reps, weight)} />
        ))}
      </View>

      <View className="p-4 pb-10">
        <TouchableOpacity 
          className="bg-green-600 p-4 rounded-xl items-center"
          onPress={handleFinish}
        >
          <Text className="text-white font-bold text-lg">Finish Workout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function ExerciseCard({ exercise, onLog }: { exercise: any, onLog: (r: string, w: string) => void }) {
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  return (
    <View className="bg-white p-4 rounded-xl mb-4 shadow-sm border border-gray-100">
      <Text className="text-lg font-bold mb-2">{exercise.name}</Text>
      <View className="flex-row space-x-2 mb-2">
        <TextInput 
          className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-200"
          placeholder="Reps"
          keyboardType="numeric"
          value={reps}
          onChangeText={setReps}
        />
        <TextInput 
          className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-200"
          placeholder="Weight (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
        <TouchableOpacity 
          className="bg-blue-600 justify-center px-4 rounded-lg"
          onPress={() => {
            onLog(reps, weight);
            setReps("");
            setWeight("");
          }}
        >
          <Ionicons name="checkmark" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
