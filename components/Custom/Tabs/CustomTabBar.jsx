import { useState, useEffect, useRef } from 'react';
import { Keyboard, Animated } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import CustomTabIcon from './CustomTabIcon';
import { useRouteInfo } from 'expo-router/build/hooks';
import { router } from 'expo-router';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const routeInfo = useRouteInfo()

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

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

  useEffect(() => {
    const routesWithoutTabBar = [];

    if (keyboardVisible === true || routesWithoutTabBar.includes(routeInfo.pathname)) setIsTabBarVisible(false);
    else setIsTabBarVisible(true);
  }, [keyboardVisible, routeInfo]);

  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 65,
        transform: [{ translateY }],
        display: isTabBarVisible === true ? 'flex' : 'none'
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

        const onLongPress = () => {
          if (routeInfo.pathname !== "/cloud" && route.name === "(drawer)") router.push("/cloud");
        }

        return (
          <TouchableRipple
            key={index}
            onPress={onPress}
            onLongPress={onLongPress}
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
