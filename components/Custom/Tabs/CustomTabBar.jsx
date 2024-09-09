import { useState, useEffect, useRef } from 'react';
import { Keyboard, Animated } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import CustomTabIcon from './CustomTabIcon';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      Animated.timing(translateY, {
        toValue: 65,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setKeyboardVisible(true));
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false)
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
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
        height: 65,
        transform: [{ translateY }],
        display: keyboardVisible ? 'none' : 'flex'
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
