import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const CustomTabIcon = ({ icon, name, focused }) => {
  // Animated value for opacity and scale
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  // Run animation when `focused` changes
  useEffect(() => {
    if (focused) {
      // Animate opacity to 1 and scale to 1 when focused
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true, // Optimizes performance
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate opacity back to 0 and scale to 0.8 when not focused
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 0.8,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused, opacity, scale]);

  return (
    <View className="flex items-center justify-center">
      <View>{icon}</View>
      {focused && (
        <Animated.Text
          style={{
            opacity, // Animated opacity
            transform: [{ scale }], // Animated scale
          }}
          className="font-psemibold text-green"
        >
          {name}
        </Animated.Text>
      )}
    </View>
  );
};
export default CustomTabIcon