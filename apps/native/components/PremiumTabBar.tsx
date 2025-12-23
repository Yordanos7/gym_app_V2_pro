import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  withSequence
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width * 0.92;

export default function PremiumTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate(route.name);
            }
          };

          const iconName = () => {
             switch(route.name) {
                case 'index': return isFocused ? 'home' : 'home-outline';
                case 'workouts': return isFocused ? 'barbell' : 'barbell-outline';
                case 'exercises': return isFocused ? 'list' : 'list-outline';
                case 'progress': return isFocused ? 'stats-chart' : 'stats-chart-outline';
                case 'profile': return isFocused ? 'person' : 'person-outline';
                default: return 'help';
             }
          };

          return (
            <TabItem
              key={route.key}
              isFocused={isFocused}
              onPress={onPress}
              icon={iconName() as any}
            />
          );
        })}
      </BlurView>
    </View>
  );
}

function TabItem({ isFocused, onPress, icon }: { isFocused: boolean; onPress: () => void; icon: keyof typeof Ionicons.glyphMap }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isFocused ? 1.2 : 1) }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.tabItem}
    >
      <Animated.View style={[animatedStyle, styles.iconContainer]}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={isFocused ? '#C6FF00' : '#A1A1AA'} 
        />
        {isFocused && (
            <View className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full" />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurContainer: {
    flexDirection: 'row',
    width: TAB_BAR_WIDTH,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
