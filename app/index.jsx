import { Keyboard, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/Custom/CustomButton';
import { useContext, useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { getUser } from '../lib/fetch';
import { socket } from '../lib/socketio';
import { HelperText, TextInput } from 'react-native-paper';
import { Image } from 'expo-image';

const App = () => {
  const { setUser, login } = useContext(AuthContext);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

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
      const response = await getUser("kubek");
      setUser(response);

      // if (!response.token) return setErr(response.message);


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
    if (!err) return false;
    const usernameErrors = ["Fill username", "User not found"];
    const passwordErrors = ["Fill password", "Wrong password"];

    if (usernameErrors.includes(err) && type === "username") return true;
    else if (passwordErrors.includes(err) && type === "password") return true;
    else return false;
  }

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

  useEffect(() => {
    if (err) {
      const timer = setTimeout(() => {
        setErr("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [err]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView className="h-full bg-black">
      <ScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps='handled'>
        <View className={`w-full h-full flex flex-col items-center px-4 ${keyboardVisible ? 'justify-end' : 'justify-center'}`}>
          <View className="w-full space-y-4">
            <View className="items-center">
              <Image
                source={require("../assets/images/icon.png")}
                style={{ height: 250, width: 250 }}
              />
            </View>
            <Text className="text-3xl text-white font-pregular">Log In to Home App</Text>
            <View>
              <TextInput
                label='Username'
                autoFocus
                onChangeText={(e) => setUsername(e)}
                returnKeyType='next'
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                autoComplete='username'
                error={handleInputError('username')}
                autoCapitalize='none'
                activeUnderlineColor='green'
                underlineColor='transparent'
                className="bg-white"
              />
              <HelperText className="font-psemibold" type="error" visible={handleInputError('username')}>{err}</HelperText>
            </View>
            <View>
              <TextInput
                ref={passwordInputRef}
                label='Password'
                secureTextEntry={!passwordVisible}
                onChangeText={(e) => setPassword(e)}
                onSubmitEditing={handleSubmit}
                autoComplete='password'
                textContentType='password'
                error={handleInputError('password')}
                activeUnderlineColor='green'
                underlineColor='transparent'
                className="bg-white"
                right={<TextInput.Icon onPress={() => setPasswordVisible(!passwordVisible)} icon={passwordVisible ? 'eye-off' : 'eye'} />}
              />
              <HelperText className="font-psemibold" type="error" visible={handleInputError('password')}>{err}</HelperText>
            </View>
            <CustomButton title='Login' containerStyle="w-full my-6" isLoading={isLoading} onPress={handleSubmit} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App