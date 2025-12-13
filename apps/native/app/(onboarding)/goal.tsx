import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useOnboarding } from "@/contexts/onboarding-context";

const GOALS = [
  { id: "MUSCLE_GAIN", label: "Build Muscle" },
  { id: "FAT_LOSS", label: "Lose Weight" },
  { id: "STRENGTH", label: "Gain Strength" },
  { id: "FITNESS", label: "Stay Fit" },
];

export default function GoalScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();

  const handleSelect = (goal: string) => {
    updateData({ goal });
    router.push("/(onboarding)/level");
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-3xl font-bold mb-2 text-center">What is your goal?</Text>
      <Text className="text-gray-500 mb-8 text-center">Select your primary fitness objective</Text>

      <View className="space-y-4">
        {GOALS.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="bg-gray-100 p-5 rounded-xl border border-gray-200 active:bg-blue-50 active:border-blue-500"
            onPress={() => handleSelect(item.id)}
          >
            <Text className="text-lg font-semibold text-center">{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
