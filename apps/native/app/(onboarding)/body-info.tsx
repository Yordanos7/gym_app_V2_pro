import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useOnboarding } from "@/contexts/onboarding-context";

export default function BodyInfoScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");

  const handleNext = () => {
    if (!age || !height || !weight || !gender) {
      Alert.alert("Missing Info", "Please fill in all fields");
      return;
    }
    updateData({ age, height, weight, gender });
    router.push("/(onboarding)/equipment");
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24, justifyContent: 'center', flexGrow: 1 }}>
      <Text className="text-3xl font-bold mb-2 text-center">About You</Text>
      <Text className="text-gray-500 mb-8 text-center">This helps us calculate your needs</Text>

      <View className="space-y-4">
        <View>
          <Text className="mb-2 font-medium text-gray-700">Gender</Text>
          <View className="flex-row space-x-4">
            {['Male', 'Female'].map((g) => (
              <TouchableOpacity 
                key={g}
                onPress={() => setGender(g)}
                className={`flex-1 p-4 rounded-lg border ${gender === g ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-200'}`}
              >
                <Text className={`text-center font-semibold ${gender === g ? 'text-blue-600' : 'text-gray-600'}`}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View>
          <Text className="mb-2 font-medium text-gray-700">Age</Text>
          <TextInput
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4"
            placeholder="Years"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </View>

        <View>
          <Text className="mb-2 font-medium text-gray-700">Height (cm)</Text>
          <TextInput
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4"
            placeholder="cm"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
        </View>

        <View>
          <Text className="mb-2 font-medium text-gray-700">Weight (kg)</Text>
          <TextInput
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4"
            placeholder="kg"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
        </View>

        <TouchableOpacity
          className="w-full bg-blue-600 p-4 rounded-xl mt-6"
          onPress={handleNext}
        >
          <Text className="text-white font-bold text-lg text-center">Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
