import { View, Text, ScrollView } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useState } from 'react';
import CustomButton from '../../components/Custom/CustomButton';

const User = () => {
  const { user, logout } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setIsLoading(false);
  }

  return (
    <SafeAreaView className="h-full bg-black">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full h-full flex items-center justify-between p-4">
          <Text className="text-white text-3xl font-psemibold">User</Text>
          <Text className="text-white pt-24 text-xl">{user.displayName}</Text>
          <CustomButton title="logout" containerStyle="bg-red" isLoading={isLoading} onPress={handleLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default User