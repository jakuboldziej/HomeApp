import { createContext, useState } from "react";
import { getUser, loginUser } from "../lib/fetch";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";
import { socket } from "../lib/socketio";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const fetchedUser = await loginUser(username, password);

    if (!fetchedUser.token) return { message: fetchedUser.message };

    const loggedUser = await getUser(username, fetchedUser.token);

    setUser(loggedUser);

    await SecureStore.setItemAsync("user", JSON.stringify({
      displayName: loggedUser.displayName,
      token: fetchedUser.token
    }));

    socket.connect();

    return fetchedUser;
  }

  const logout = async () => {
    router.replace("/")
    setUser(null);
    await SecureStore.deleteItemAsync("user");
    socket.disconnect();
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}