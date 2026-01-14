import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Platform, StatusBar, ActivityIndicator, KeyboardAvoidingView, ScrollView } from "react-native";
import { useRouter, Stack } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from "@expo/vector-icons";
import { authFetch } from "@/lib/api";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function ScheduleWorkoutScreen() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');

  const handleSchedule = async () => {
    setLoading(true);
    try {
      const response = await authFetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/workout-session`, {
        method: "POST",
        body: JSON.stringify({ 
            notes: notes || "Scheduled Workout",
            date: date.toISOString() 
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Mission locked! Workout scheduled.");
        router.replace("/(tabs)");
      } else {
        const errorText = await response.text();
        console.error("Schedule error:", errorText);
        Alert.alert("Error", "Failed to schedule. Try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode: 'date' | 'time') => {
    setShowDatePicker(true);
    setMode(currentMode);
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
        <ScrollView className="flex-1 px-6 pt-16">
          {/* Header */}
          <View className="flex-row items-center mb-10">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 items-center justify-center mr-4"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            <View>
              <Text className="text-[#C6FF00] text-xs font-black uppercase tracking-[3px]">Schedule</Text>
              <Text className="text-white text-3xl font-black italic uppercase tracking-tighter">Plan Your <Text className="text-[#C6FF00]">Grind</Text></Text>
            </View>
          </View>

          <Animated.View entering={FadeInDown.delay(100).duration(800)}>
            {/* Date Selection */}
            <View className="mb-6">
                <Text className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3 ml-1">When do we start?</Text>
                <View className="flex-row space-x-4">
                    <TouchableOpacity 
                        className="flex-1 bg-zinc-900/50 p-4 rounded-2xl border border-white/10 flex-row items-center justify-between h-16"
                        onPress={() => showMode('date')}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="calendar-outline" size={20} color="#C6FF00" className="mr-3" />
                            <Text className="text-white font-bold ml-2">{date.toLocaleDateString()}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="#71717a" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="flex-1 bg-zinc-900/50 p-4 rounded-2xl border border-white/10 flex-row items-center justify-between h-16"
                        onPress={() => showMode('time')}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="time-outline" size={20} color="#C6FF00" className="mr-3" />
                            <Text className="text-white font-bold ml-2">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="#71717a" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Notes Section */}
            <View className="mb-10">
                <Text className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3 ml-1">Strategy / Notes (Optional)</Text>
                <View className="bg-zinc-900/50 rounded-2xl border border-white/10 p-4 min-h-[120px]">
                    <TextInput
                        className="text-white font-medium text-base text-left"
                        placeholder="e.g. Focus on Heavy Squats, Morning Blast..."
                        placeholderTextColor="#52525b"
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                        textAlignVertical="top"
                    />
                </View>
            </View>

            {/* Call to Action */}
            <TouchableOpacity 
                className={`w-full bg-[#C6FF00] h-16 rounded-2xl items-center justify-center shadow-[0_0_30px_rgba(198,255,0,0.3)] ${loading ? 'opacity-50' : 'active:opacity-80'}`}
                onPress={handleSchedule}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="black" />
                ) : (
                    <View className="flex-row items-center">
                        <Text className="text-black font-black text-lg uppercase tracking-widest mr-2">Lock It In</Text>
                        <Ionicons name="flash" size={20} color="black" />
                    </View>
                )}
            </TouchableOpacity>
            
            <Text className="text-zinc-600 text-[10px] text-center mt-6 uppercase font-bold tracking-[2px]">
                Consistency is the key to mastery
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {showDatePicker && (
        <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
            minimumDate={new Date()}
            themeVariant="dark"
        />
      )}
    </View>
  );
}
