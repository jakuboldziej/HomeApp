import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const CustomTabIcon = ({ icon, name, focused }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
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
            opacity,
            transform: [{ scale }],
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