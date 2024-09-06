import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { useEffect, useRef, useState } from 'react';
import { login } from '../fetch';
import { router } from 'expo-router';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const passwordInputRef = useRef(null);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await login(username, password);

      if (!response.token) {
        console.log(response)
        setErr(response.message)
        setIsLoading(false);
        return;
      }

      router.push('/home');
    } catch (err) {
      console.log(err.stack)
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (err) {
      const timer = setTimeout(() => {
        setErr("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [err]);

  return (
    <SafeAreaView className="h-full px-4 bg-black">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full h-full flex flex-col justify-center items-center">
          <View className="w-full space-y-4">
            <Text className="text-3xl text-white font-pregular">Log In to Home App</Text>
            <Text className="text-white pt-2">Username</Text>
            <TextInput
              className="bg-lime w-full p-4 rounded-xl font-pregular"
              placeholder='Username'
              autoFocus
              onChangeText={(e) => setUsername(e)}
              returnKeyType='next'
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              autoComplete='username'
            />
            <Text className="text-white pt-2">Password</Text>
            <TextInput
              ref={passwordInputRef}
              className="bg-lime w-full p-4 rounded-xl font-pregular"
              placeholder='Password'
              secureTextEntry
              onChangeText={(e) => setPassword(e)}
              onSubmitEditing={handleSubmit}
              autoComplete='password'
            />
            <CustomButton title='Login' containerStyles="w-full mt-6" isLoading={isLoading} onPress={handleSubmit} />
            <Text className="text-red text-xl text-center">{err}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App