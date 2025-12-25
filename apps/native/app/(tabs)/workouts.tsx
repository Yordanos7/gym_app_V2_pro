import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";

type Program = {
  id: string;
  name: string;
  description: string | null;
  difficulty: string;
  days: any[];
};

export default function WorkoutsScreen() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/programs`);
        if (response.ok) {
          const json = await response.json();
          setPrograms(json);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const renderItem = ({ item, index }: { item: Program, index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
        <TouchableOpacity 
        className="bg-[#18181b] p-5 mb-4 rounded-3xl shadow-md border border-white/5 overflow-hidden"
        onPress={() => router.push(`/program/${item.id}`)}
        activeOpacity={0.9}
        >
        <LinearGradient
            colors={['rgba(255,255,255,0.03)', 'transparent']}
            className="absolute inset-0"
        />
        
        <View className="flex-row justify-between items-start mb-3">
            <View>
                <Text className="text-xl font-bold text-white mb-1">{item.name}</Text>
                <View className="flex-row items-center">
                    <Ionicons name="flash" size={12} color="#C6FF00" />
                    <Text className="text-[#C6FF00] text-[10px] font-bold uppercase tracking-wider ml-1">
                        {item.difficulty}
                    </Text>
                </View>
            </View>
            <View className="bg-zinc-900 w-10 h-10 rounded-full items-center justify-center border border-white/5">
                 <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
        </View>
        
        <Text className="text-zinc-400 text-sm mb-4 leading-5" numberOfLines={2}>{item.description}</Text>
        
        <View className="flex-row items-center bg-black/40 self-start px-3 py-1.5 rounded-lg">
            <Ionicons name="calendar-outline" size={14} className="text-zinc-500" />
            <Text className="text-zinc-400 ml-2 text-xs font-semibold">{item.days.length} Days / Week</Text>
        </View>
        </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Header Section */}
      <View className="relative h-48 bg-zinc-900 overflow-hidden mb-6">
        <LinearGradient
            colors={['#18181b', '#000000']}
            className="absolute inset-0"
        />
        {/* Background Texture */}
        <View className="absolute -right-10 -bottom-10 opacity-10 transform rotate-12">
             <Ionicons name="barbell" size={200} color="white" />
        </View>
        
        <View className="flex-1 justify-end p-6 pb-8">
            <Text className="text-[#C6FF00] text-xs font-black uppercase tracking-[4px] mb-2">Training</Text>
            <Text className="text-white text-4xl font-black italic uppercase tracking-tighter">Programs</Text>
        </View>
      </View>

      <FlatList
        data={programs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center mt-20 opacity-50">
               <Ionicons name="file-tray-outline" size={48} color="white" />
              <Text className="text-zinc-500 mt-4 font-bold">No programs found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
