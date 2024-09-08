import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Keyboard, Animated } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

const CustomTabIcon = ({ icon, name, focused }) => {
  return (
    <View className="flex items-center justify-center">
      <View>{icon}</View>
      <Text className={focused ? "font-psemibold text-green" : "font-pregular"}>
        {name}
      </Text>
    </View>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      Animated.timing(translateY, {
        toValue: 100, // Move the tab bar down
        duration: 300, // Duration of the animation
        useNativeDriver: true,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      Animated.timing(translateY, {
        toValue: 0, // Move the tab bar back to its original position
        duration: 300, // Duration of the animation
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [translateY]);

  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        transform: [{ translateY }],
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableRipple
            key={index}
            onPress={onPress}
            rippleColor="rgba(0, 0, 0, .20)"
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}
          >
            <CustomTabIcon
              icon={options.tabBarIcon({ focused: isFocused })}
              name={label}
              focused={isFocused}
            />
          </TouchableRipple>
        );
      })}
    </Animated.View>
  );
};

export default CustomTabBar;
