import { createContext, useState } from "react";
import { getUser } from "../fetch";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const response = await fetch('https://oldziej.pl/api/auth/login', {
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
    await SecureStore.setItemAsync("user", loggedUser.displayName);

    return fetchedUser;
  }

  const logout = async () => {
    router.replace("/")
    setUser(null);
    await SecureStore.deleteItemAsync("user");
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}