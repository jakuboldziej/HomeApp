export const apiUrl = process.env.NODE_ENV === "development" ? process.env.EXPO_PUBLIC_BACKEND_URL_LOCAL + '/api' : process.env.EXPO_PUBLIC_BACKEND_URL + '/api'

import * as SecureStore from 'expo-secure-store';

export const cfAccessHeaders = process.env.EXPO_PUBLIC_CF_ACCESS_CLIENT_ID && process.env.EXPO_PUBLIC_CF_ACCESS_CLIENT_SECRET
  ? {
    "CF-Access-Client-Id": process.env.EXPO_PUBLIC_CF_ACCESS_CLIENT_ID,
    "CF-Access-Client-Secret": process.env.EXPO_PUBLIC_CF_ACCESS_CLIENT_SECRET
  }
  : {};

const publicHeaders = (extraHeaders = {}) => ({
  ...cfAccessHeaders,
  ...extraHeaders
});

const authHeaders = async (extraHeaders = {}) => ({
  ...cfAccessHeaders,
  ...extraHeaders,
  "Authorization": JSON.parse(await SecureStore.getItemAsync("user")).token
});

// Users

export const getUser = async (displayName) => {
  const response = await fetch(`${apiUrl}/auth/users/${displayName}`, {
    headers: publicHeaders()
  })

  return await response.json();
}

// Auth

export const loginUser = async (displayName, password) => {
  const response = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: publicHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ displayName, password })
  });

  return await response.json();
}

export const checkSession = async (token) => {
  const response = await fetch(`${apiUrl}/auth/check-session`, {
    method: "POST",
    headers: publicHeaders({ "Authorization": token }),
  });

  return await response.json();
}

export const refreshToken = async (token) => {
  const response = await fetch(`${apiUrl}/auth/refresh-token`, {
    method: "POST",
    headers: publicHeaders({ "Authorization": token }),
  });

  return await response.json();
}

// Darts

export const getDartsGame = async (identifier) => {
  const response = await fetch(`${apiUrl}/darts/dartsGames/${identifier}`, {
    headers: await authHeaders()
  });

  return await response.json();
}

export const deleteDartsGame = async (gameId) => {
  const response = await fetch(`${apiUrl}/darts/dartsGames/${gameId}`, {
    method: "DELETE",
    headers: await authHeaders()
  });

  return await response.json();
}

export const getDartsTournament = async (identifier) => {
  const gameResponse = await fetch(`${apiUrl}/darts/dartsTournaments/${identifier}`, {
    headers: await authHeaders()
  });

  return await gameResponse.json();
}

export const postDartsGame = async (gameData) => {
  const response = await fetch(`${apiUrl}/darts/dartsGames`, {
    method: "POST",
    body: JSON.stringify({
      created_by: gameData.created_by,
      users: gameData.users,
      podiums: gameData.podiums,
      podium: gameData.podium,
      turn: gameData.turn,
      active: gameData.active,
      gameMode: gameData.gameMode,
      startPoints: gameData.startPoints,
      checkOut: gameData.checkOut,
      sets: gameData.sets,
      legs: gameData.legs,
      round: gameData.round,
      training: gameData.training || false,
    }),
    headers: await authHeaders({ "Content-Type": "application/json" }),
  });

  return await response.json();
}

export const getInitialUsersGameState = async (users, startPoints, randomize = false) => {
  const response = await fetch(`${apiUrl}/darts/utils/getInitialUsersGameState`, {
    method: "POST",
    body: JSON.stringify({
      users,
      startPoints,
      randomize
    }),
    headers: await authHeaders({ "Content-Type": "application/json" }),
  });

  return await response.json();
}

export const getDartsUser = async (identifier) => {
  const response = await fetch(`${apiUrl}/darts/dartsUsers/${identifier}`, {
    headers: await authHeaders()
  });

  return await response.json();
}

export const getAuthUser = async (identifier) => {
  const response = await fetch(`${apiUrl}/auth/users/${identifier}`, {
    headers: publicHeaders()
  });

  return await response.json();
}

export const getESP32Availability = async (gameCode) => {
  const response = await fetch(`${apiUrl}/esp32/check-availability/${gameCode}`, {
    headers: await authHeaders()
  });

  return await response.json();
}

export const postESP32JoinGame = async (gameCode) => {
  const response = await fetch(`${apiUrl}/esp32/join-game/${gameCode}`, {
    method: "POST",
    headers: await authHeaders()
  });

  return await response.json();
}

// Cloud

// Users

export const getCloudUser = async (uDisplayName) => {
  const response = await fetch(`${apiUrl}/ftp/users/${uDisplayName}`, {
    headers: await authHeaders()
  });

  return await response.json();
}

// Files

export const getFiles = async (userDisplayName = null) => {
  let url = `${apiUrl}/ftp/files`;

  const queryParams = [];
  if (userDisplayName) {
    queryParams.push(`user=${userDisplayName}`)
  }

  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }

  const response = await fetch(url, {
    headers: publicHeaders()
  });
  const data = await response.json();
  return data.files;
}

export const getFile = async (id) => {
  const response = await fetch(`${apiUrl}/ftp/files/${id}`, {
    headers: await authHeaders()
  });
  const data = await response.json();
  return data.file;
}

// Folders

export const getFolders = async (userDisplayName = null, folderName = null) => {
  let url = `${apiUrl}/ftp/folders`;

  const queryParams = [];
  if (userDisplayName) {
    queryParams.push(`user=${userDisplayName}`)
  }
  if (folderName) {
    queryParams.push(`folderName=${folderName}`)
  }

  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }

  const response = await fetch(url, {
    headers: await authHeaders()
  });
  const data = await response.json();
  return data.folders;
}

export const getFolder = async (id) => {
  const response = await fetch(`${apiUrl}/ftp/folders/${id}`, {
    headers: await authHeaders()
  });
  const data = await response.json();

  return data.folder;
}