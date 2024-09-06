import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { useContext, useEffect, useRef, useState } from 'react';
import { Redirect, router } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { getUser } from '../lib/fetch';
import { socket } from '../lib/socketio';

const App = () => {
  const { setUser, login } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const passwordInputRef = useRef(null);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // const response = await login(username, password);
      const response = await login("kubek", "Kubek6034#");

      if (!response.token) {
        setErr(response.message)
        setIsLoading(false);
        return;
      }

      router.replace('/home');
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

  const getSecureStore = async () => {
    setIsLoading(true);
    const alreadyLoggedIn = await SecureStore.getItemAsync("user");
    if (alreadyLoggedIn) {
      const loggedInUser = await getUser(alreadyLoggedIn)
      setUser(loggedInUser);
      router.replace("/home");
      socket.connect();
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getSecureStore();
  }, []);


  return (
    <SafeAreaView className="h-full px-4 bg-black">
      <ScrollView contentContainerStyle={{ height: "100%" }} keyboardShouldPersistTaps='handled'>
        <View className="w-full h-full flex flex-col justify-center items-center">
          <View className="w-full space-y-4">
            <Text className="text-3xl text-white font-pregular">Log In to Home App</Text>
            {/* <Text className="text-white pt-2">Username</Text>
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
            /> */}
            <CustomButton title='Login' containerStyle="w-full mt-6" isLoading={isLoading} onPress={handleSubmit} />
            <Text className="text-red text-xl text-center font-bold">{err}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App