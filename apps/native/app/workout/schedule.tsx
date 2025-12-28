import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
import { useRouter, Stack } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from "@expo/vector-icons";
import { authFetch } from "@/lib/api";

export default function ScheduleWorkoutScreen() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

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
        Alert.alert("Success", "Workout scheduled!");
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", "Failed to schedule workout");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const [mode, setMode] = useState<'date' | 'time'>('date');

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
    <View className="flex-1 bg-background p-6 pt-24">
      <Stack.Screen options={{ 
        title: "Schedule Workout",
        headerStyle: { backgroundColor: 'transparent' },
        headerTransparent: true,
        headerTintColor: '#2563eb',
      }} />

      <Text className="text-3xl font-bold text-foreground mb-8">Plan Your Grind</Text>

      <View className="flex-row justify-between mb-6 space-x-4">
        <View className="flex-1">
            <Text className="text-default-500 mb-2 font-semibold">Date</Text>
            <TouchableOpacity 
                className="bg-content1 p-4 rounded-xl border border-default-200 flex-row items-center justify-between"
                onPress={() => showMode('date')}
            >
                <Text className="text-foreground text-sm">{date.toLocaleDateString()}</Text>
                <Ionicons name="calendar" size={20} className="text-primary" />
            </TouchableOpacity>
        </View>

        <View className="flex-1">
            <Text className="text-default-500 mb-2 font-semibold">Time</Text>
            <TouchableOpacity 
                className="bg-content1 p-4 rounded-xl border border-default-200 flex-row items-center justify-between"
                onPress={() => showMode('time')}
            >
                <Text className="text-foreground text-sm">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                <Ionicons name="time" size={20} className="text-primary" />
            </TouchableOpacity>
        </View>
      </View>
        
      {showDatePicker && (
        <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChangeDate}
            minimumDate={mode === 'date' ? new Date() : undefined}
        />
      )}

      <View className="mb-8">
        <Text className="text-default-500 mb-2 font-semibold">Notes (Optional)</Text>
        <TextInput
            className="bg-content1 p-4 rounded-xl border border-default-200 text-foreground text-lg"
            placeholder="Leg day, Cardio, etc."
            placeholderTextColor="#9ca3af"
            value={notes}
            onChangeText={setNotes}
            multiline
        />
      </View>

      <TouchableOpacity 
        className={`bg-primary p-4 rounded-2xl items-center shadow-lg ${loading ? 'opacity-70' : ''}`}
        onPress={handleSchedule}
        disabled={loading}
      >
        <Text className="text-primary-foreground font-bold text-lg">
            {loading ? "Scheduling..." : "Schedule Workout"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
