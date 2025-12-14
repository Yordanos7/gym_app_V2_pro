import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
import { useRouter, Stack } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from "@expo/vector-icons";

export default function ScheduleWorkoutScreen() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/workout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
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

      <View className="mb-6">
        <Text className="text-default-500 mb-2 font-semibold">Date</Text>
        <TouchableOpacity 
            className="bg-content1 p-4 rounded-xl border border-default-200 flex-row items-center justify-between"
            onPress={() => setShowDatePicker(true)}
        >
            <Text className="text-foreground text-lg">{date.toLocaleDateString()}</Text>
            <Ionicons name="calendar" size={24} className="text-primary" />
        </TouchableOpacity>
        
        {showDatePicker && (
            <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
                minimumDate={new Date()}
            />
        )}
      </View>

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
