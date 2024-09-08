import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/Custom/CustomButton';
import { useContext, useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { getUser } from '../lib/fetch';
import { socket } from '../lib/socketio';
import { TextInput } from 'react-native-paper';

const App = () => {
  const { setUser, login } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const passwordInputRef = useRef(null);

  const handleLogin = async () => {
    try {
      // if (!username) return setErr("Fill username");
      // if (!password) return setErr("Fill password");

      // const response = await login(username, password);
      const response = await login("kubek", "Kubek6034#");

      if (!response.token) return setErr(response.message);

      router.replace('/home');
    } catch (err) {
      console.log(err.stack)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    await handleLogin();
    setIsLoading(false);
  }

  const handleInputError = (type) => {
    if (!err) return;
    const usernameErrors = ["Fill username", "User not found"];
    const passwordErrors = ["Fill password", "Wrong password"];

    if (usernameErrors.includes(err) && type === "username") return true;
    if (passwordErrors.includes(err) && type === "password") return true;
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
            {/* <TextInput
              label='Username'
              autoFocus
              onChangeText={(e) => setUsername(e)}
              returnKeyType='next'
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              autoComplete='username'
              error={handleInputError('username')}
              autoCapitalize='none'
              activeUnderlineColor='green'
              className="bg-white"
            />
            <TextInput
              ref={passwordInputRef}
              label='Password'
              secureTextEntry
              onChangeText={(e) => setPassword(e)}
              onSubmitEditing={handleSubmit}
              autoComplete='password'
              textContentType='password'
              error={handleInputError('password')}
              activeUnderlineColor='green'
              className="bg-white"
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