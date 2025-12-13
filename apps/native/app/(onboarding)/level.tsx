import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useOnboarding } from "@/contexts/onboarding-context";

const LEVELS = [
  { id: "BEGINNER", label: "Beginner", desc: "New to training" },
  { id: "INTERMEDIATE", label: "Intermediate", desc: "Train regularly" },
  { id: "ADVANCED", label: "Advanced", desc: "Experienced athlete" },
];

export default function LevelScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();

  const handleSelect = (level: string) => {
    updateData({ level });
    router.push("/(onboarding)/body-info");
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-3xl font-bold mb-2 text-center">Experience Level</Text>
      <Text className="text-gray-500 mb-8 text-center">How experienced are you with training?</Text>

      <View className="space-y-4">
        {LEVELS.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="bg-gray-100 p-5 rounded-xl border border-gray-200 active:bg-blue-50 active:border-blue-500"
            onPress={() => handleSelect(item.id)}
          >
            <Text className="text-lg font-semibold text-center mb-1">{item.label}</Text>
            <Text className="text-gray-500 text-center text-sm">{item.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
