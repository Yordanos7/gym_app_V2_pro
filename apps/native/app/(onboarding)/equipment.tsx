import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useOnboarding } from "@/contexts/onboarding-context";
import { authClient } from "@/lib/auth-client";

const EQUIPMENT = [
  { id: "DUMBBELLS", label: "Dumbbells" },
  { id: "BARBELL", label: "Barbell" },
  { id: "MACHINES", label: "Machines" },
  { id: "BODYWEIGHT", label: "Bodyweight Only" },
];

export default function EquipmentScreen() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleEquipment = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    if (selected.length === 0) {
      Alert.alert("Selection Required", "Please select at least one equipment option");
      return;
    }
    
    setLoading(true);
    updateData({ equipment: selected });
    
    try {
      const { data: session } = await authClient.getSession();
      const token = session?.session.token; // Or however we get the token if needed, but better-auth might handle cookies

      // Using fetch for now, assuming cookies/headers are handled or we need to pass them
      // better-auth expo plugin should handle storage.
      // Let's try using the authClient's fetch if available, or just standard fetch
      
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}` // If needed
        },
        body: JSON.stringify({ ...data, equipment: selected }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }
      
      router.replace("/(drawer)");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-3xl font-bold mb-2 text-center">Equipment</Text>
      <Text className="text-gray-500 mb-8 text-center">What do you have access to?</Text>

      <View className="space-y-4 mb-8">
        {EQUIPMENT.map((item) => (
          <TouchableOpacity
            key={item.id}
            className={`p-5 rounded-xl border ${selected.includes(item.id) ? 'bg-blue-50 border-blue-500' : 'bg-gray-100 border-gray-200'}`}
            onPress={() => toggleEquipment(item.id)}
          >
            <Text className={`text-lg font-semibold text-center ${selected.includes(item.id) ? 'text-blue-700' : 'text-gray-800'}`}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        className={`w-full bg-blue-600 p-4 rounded-xl ${loading ? "opacity-70" : ""}`}
        onPress={handleFinish}
        disabled={loading}
      >
        <Text className="text-white font-bold text-lg text-center">
          {loading ? "Saving..." : "Finish Setup"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
