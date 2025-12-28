import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, StatusBar, Platform } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Animated, { FadeInDown, FadeInUp, LayoutAnimationConfig } from "react-native-reanimated";
import { useSession } from "@/lib/use-session";

export default function ActiveWorkoutScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [workoutSession, setWorkoutSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<any[]>([]);
  const [allExercises, setAllExercises] = useState<any[]>([]);
  const [timer, setTimer] = useState<{active: boolean, timeLeft: number}>({ active: false, timeLeft: 0 });

  // Check authentication FIRST before doing anything
  useEffect(() => {
    if (isPending) return; // Wait for session check to complete
    
    if (!session) {
      // User is not authenticated, redirect immediately
      Alert.alert(
        "Authentication Required", 
        "Please sign in to start a workout",
        [{ text: "Sign In", onPress: () => router.replace("/(auth)/welcome") }]
      );
      router.replace("/(auth)/welcome");
      return;
    }
  }, [session, isPending]);

  useEffect(() => {
    // Don't start session if user is not authenticated
    if (isPending) return;
    
    if (!session) {
      setLoading(false);
      return;
    }

    const startSession = async () => {
      // Double check authentication before making call
      if (!session) return;

      try {
        const notes = id === 'quick' ? "Quick Workout" : `Workout from Program ${id}`;
        const res = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/workout-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ notes }),
        });

        if (!res.ok) {
           const errText = await res.text();
           
           // If unauthorized, redirect to welcome (Handle gracefully WITHOUT logging error)
           if (res.status === 401) {
             Alert.alert(
               "Session Expired", 
               "Your session has expired. Please sign in again.",
               [{ 
                 text: "Sign In", 
                 onPress: () => {
                   // Ensure navigation happens
                   router.dismissAll();
                   router.replace("/(auth)/welcome");
                 }
               }]
             );
             return;
           }

           // Only log real errors
           console.error("Failed to create session:", errText);
           throw new Error("Failed to create session");
        }

        const newSession = await res.json();
        setWorkoutSession(newSession);

        const exRes = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/exercises`, {
             credentials: "include" 
        });
        const exercisesData = await exRes.json();
        setAllExercises(exercisesData);
        
        if (id === 'quick') {
             setExercises(exercisesData.sort(() => 0.5 - Math.random()).slice(0, 5));
        } else {
             setExercises(allExercises.slice(0, 3)); // Fallback, though ideally would fetch program exercises
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

  useEffect(() => {
    let interval: any;
    if (timer.active && timer.timeLeft > 0) {
      interval = setInterval(() => {
        setTimer(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (timer.timeLeft === 0) {
      setTimer(prev => ({ ...prev, active: false }));
    }
    return () => clearInterval(interval);
  }, [timer.active, timer.timeLeft]);

  const handleSwap = (index: number) => {
    if (allExercises.length === 0) return;
    const currentIds = new Set(exercises.map(e => e.id));
    const available = allExercises.filter(e => !currentIds.has(e.id));
    
    if (available.length > 0) {
      const randomNew = available[Math.floor(Math.random() * available.length)];
      const newExercises = [...exercises];
      newExercises[index] = randomNew;
      setExercises(newExercises);
    } else {
        Alert.alert("No more exercises", "Variety is the spice of life, but you have seen them all!");
    }
  };

  const handleLogSet = async (exerciseId: string, reps: string, weight: string) => {
    if (!workoutSession) return;
    try {
      await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/workout-session/${workoutSession.id}/set`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ exerciseId, reps, weight }),
      });
      // Trigger Timer
      setTimer({ active: true, timeLeft: 45 }); // Default rest 45s
    } catch (error) {
      Alert.alert("Error", "Failed to log set");
    }
  };

  const handleFinish = async () => {
    if (!workoutSession) return;
    try {
      await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/workout-session/${workoutSession.id}/finish`, {
        method: "PUT",
        credentials: "include",
        });
      router.replace(`/workout/summary?sessionId=${workoutSession.id}`);
    } catch (error) {
      Alert.alert("Error", "Failed to finish workout");
    }
  };

  if (loading) return (
    <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#C6FF00" />
        <Text className="text-zinc-500 mt-4 text-xs font-bold uppercase tracking-widest">Preparing Session...</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Background Ambience */}
      <LinearGradient
        colors={['#18181b', '#000000']}
        className="absolute inset-0"
      />
      
      <View className="pt-14 px-6 pb-4 z-10">
        <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity 
                onPress={() => router.back()}
                className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 items-center justify-center"
            >
                <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            <View className="items-center">
                <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-[3px]">Session Active</Text>
                <Text className="text-white text-lg font-black uppercase italic tracking-tighter">
                    {id === 'quick' ? "Quick Hit" : "Program Workout"}
                </Text>
            </View>
            <View className="w-10" /> 
        </View>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 150 }}>
        {exercises.map((ex, index) => (
            <Animated.View 
                entering={FadeInDown.delay(index * 100).springify()} 
                key={ex.id || index}
            >
                <ExerciseCard 
                    exercise={ex} 
                    index={index + 1}
                    onLog={(reps, weight) => handleLogSet(ex.id, reps, weight)} 
                    onSwap={() => handleSwap(index)}
                />
            </Animated.View>
        ))}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent pt-10">
        <TouchableOpacity 
          activeOpacity={0.8}
          className="bg-[#C6FF00] h-16 rounded-2xl items-center justify-center shadow-[0_0_20px_rgba(198,255,0,0.3)]"
          onPress={handleFinish}
        >
          <Text className="text-black font-black text-lg uppercase tracking-widest">Complete Workout</Text>
        </TouchableOpacity>
      </View>

      {timer.active && (
        <BlurView intensity={20} tint="dark" className="absolute inset-0 justify-center items-center z-50">
           <View className="absolute inset-0 bg-black/60" />
            <Animated.View entering={FadeInUp.springify()} className="w-[85%] bg-[#121212] p-8 rounded-[40px] items-center border border-white/10 shadow-2xl">
                <Text className="text-zinc-500 text-xs font-black uppercase tracking-[4px] mb-8">Resting</Text>
                
                <View className="relative w-64 h-64 items-center justify-center mb-10">
                    <View className="absolute inset-0 rounded-full border-4 border-zinc-800" />
                    <View className="absolute inset-0 rounded-full border-t-4 border-[#C6FF00] opacity-50 rotate-45" />
                    <Text className="text-8xl font-black text-white font-monospaced tracking-tighter">
                        {Math.floor(timer.timeLeft / 60)}:{String(timer.timeLeft % 60).padStart(2, '0')}
                    </Text>
                </View>
                
                <View className="flex-row gap-3 w-full mb-4">
                    <TouchableOpacity 
                        className="flex-1 bg-zinc-900 h-14 rounded-2xl border border-white/5 items-center justify-center"
                        onPress={() => setTimer(prev => ({ ...prev, timeLeft: prev.timeLeft + 10 }))}
                    >
                        <Text className="text-white font-bold">+10s</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                         className="flex-1 bg-zinc-900 h-14 rounded-2xl border border-white/5 items-center justify-center"
                        onPress={() => setTimer(prev => ({ ...prev, timeLeft: Math.max(0, prev.timeLeft - 10) }))}
                    >
                        <Text className="text-white font-bold">-10s</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    className="w-full bg-[#C6FF00] h-14 rounded-2xl items-center justify-center shadow-lg shadow-[#C6FF00]/20"
                    onPress={() => setTimer(prev => ({ ...prev, active: false }))}
                >
                    <Text className="text-black font-black uppercase tracking-widest">Resume Lift</Text>
                </TouchableOpacity>
            </Animated.View>
        </BlurView>
      )}
    </View>
  );
}

function ExerciseCard({ exercise, index, onLog, onSwap }: { exercise: any, index: number, onLog: (r: string, w: string) => void, onSwap: () => void }) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View className="mb-6 overflow-hidden rounded-3xl bg-[#18181b] border border-white/5 shadow-md">
      {/* Card Header gradient */}
      <LinearGradient
        colors={['rgba(255,255,255,0.05)', 'transparent']}
        className="absolute inset-0 h-20"
      />

      <View className="p-5">
        <View className="flex-row justify-between items-start mb-6">
            <View className="flex-1 mr-4">
                <Text className="text-[#C6FF00] text-[10px] font-black uppercase tracking-wider mb-1">Exercise {String(index).padStart(2, '0')}</Text>
                <Text className="text-white text-xl font-bold leading-6">{exercise.name}</Text>
                <Text className="text-zinc-500 text-xs mt-1 capitalize">{exercise.muscle_group || "General"}</Text>
            </View>
            <View className="flex-row gap-2">
                <TouchableOpacity 
                    className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 items-center justify-center"
                    onPress={onSwap}
                >
                    <Ionicons name="shuffle-outline" size={18} color="#71717a" />
                </TouchableOpacity>
            </View>
        </View>
        
        <View className="flex-row gap-3">
            {/* Timer Block */}
            <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => setIsActive(!isActive)}
                className={`flex-1 rounded-2xl border ${isActive ? 'bg-[#C6FF00]/10 border-[#C6FF00]/30' : 'bg-zinc-900 border-white/5'} p-4 justify-between min-h-[100px]`}
            >
                <View className="flex-row justify-between items-start">
                    <Ionicons name="timer-outline" size={20} color={isActive ? "#C6FF00" : "#52525B"} />
                    <View className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#C6FF00] animate-pulse' : 'bg-zinc-800'}`} />
                </View>
                <View>
                     <Text className={`text-3xl font-black font-monospaced tracking-tight ${isActive ? 'text-[#C6FF00]' : 'text-zinc-400'}`}>
                        {formatTime(seconds)}
                    </Text>
                    <Text className="text-zinc-600 text-[10px] font-black uppercase tracking-wider mt-1">{isActive ? 'Recording' : 'Paused'}</Text>
                </View>
            </TouchableOpacity>

            {/* Action Block */}
            <TouchableOpacity 
              activeOpacity={0.8}
              className="w-1/3 bg-zinc-800 rounded-2xl items-center justify-center border border-white/5"
              onPress={() => {
                onLog("1", seconds.toString()); 
                setIsActive(false);
                setSeconds(0);
              }}
            >
               <View className="w-10 h-10 rounded-full bg-[#C6FF00] items-center justify-center mb-2 shadow-lg shadow-[#C6FF00]/10">
                   <Ionicons name="checkmark" size={24} color="black" />
               </View>
               <Text className="text-white font-bold text-xs uppercase tracking-wider">Log Set</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

