import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withDelay, 
  useSharedValue 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface StatProps {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  index: number;
}

export const AnimatedStat = ({ label, value, icon, index }: StatProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(index * 100, withSpring(1));
    translateY.value = withDelay(index * 100, withSpring(0));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View 
      style={animatedStyle}
      className="flex-1 bg-content1/80 border border-white/10 p-4 rounded-3xl m-1 shadow-lg dark"
    >
      <View className="bg-primary/20 self-start p-2 rounded-xl mb-2">
        <Ionicons name={icon} size={20} color="#C6FF00" />
      </View>
      <Text className="text-foreground/60 text-xs font-medium uppercase tracking-wider">{label}</Text>
      <Text className="text-foreground text-xl font-bold mt-1">{value}</Text>
    </Animated.View>
  );
};

export const AnimatedStatsGrid = ({ stats }: { stats: StatProps[] }) => {
  return (
    <View className="flex-row flex-wrap px-4 -mt-10">
      {stats.map((stat, i) => (
        <AnimatedStat key={i} {...stat} index={i} />
      ))}
    </View>
  );
};
