export const apiUrl = process.env.NODE_ENV === "development" ? process.env.EXPO_PUBLIC_BACKEND_URL_LOCAL + '/api' : process.env.EXPO_PUBLIC_BACKEND_URL + '/api'

// Users

export const getUser = async (displayName) => {
  const response = await fetch(`${apiUrl}/auth/users/${displayName}`)

  return await response.json();
}

// Darts

export const joinLiveGamePreview = async (gameCode) => {
  const response = await fetch(`${apiUrl}/darts/dartsGames/join-live-game-preview/${gameCode}`, {
    method: "POST",
  });

  return await response.json();
}