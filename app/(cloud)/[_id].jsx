import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View, Text } from 'react-native';
import { useEffect } from 'react';

export default function DocumentScreen() {
  const { _id } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setParams({ headerTitle: _id });
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-white text-xl">{_id}</Text>
    </View>
  );
}