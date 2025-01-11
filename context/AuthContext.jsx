import { createContext, useState } from "react";
import { apiUrl, getUser } from "../lib/fetch";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";
import { socket } from "../lib/socketio";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        displayName: username,
        password: password
      })
    });

    const fetchedUser = await response.json();

    if (!fetchedUser.token) return { message: fetchedUser.message };

    const loggedUser = await getUser(username);

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