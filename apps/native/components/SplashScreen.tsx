import { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SplashScreen() {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="flex-1 bg-blue-600 justify-center items-center">
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Text className="text-5xl font-bold text-white mb-8 tracking-wider">GYM APP</Text>
        
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="barbell" size={80} color="white" />
        </Animated.View>
        
        <Text className="text-blue-100 mt-8 text-lg font-medium">Loading your gains...</Text>
      </Animated.View>
    </View>
  );
}
