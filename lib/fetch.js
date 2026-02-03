export const apiUrl = process.env.NODE_ENV === "development" ? process.env.EXPO_PUBLIC_BACKEND_URL_LOCAL + '/api' : process.env.EXPO_PUBLIC_BACKEND_URL + '/api'

import * as SecureStore from 'expo-secure-store';

// Users

export const getUser = async (displayName) => {
  const response = await fetch(`${apiUrl}/auth/users/${displayName}`)

  return await response.json();
}

// Auth

export const checkSession = async (token) => {
  const response = await fetch(`${apiUrl}/auth/check-session`, {
    method: "POST",
    headers: {
      "Authorization": token
    },
  });

  return await response.json();
}

export const refreshToken = async (token) => {
  const response = await fetch(`${apiUrl}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Authorization": token
    },
  });

  return await response.json();
}

// Darts

export const getDartsGame = async (identifier) => {
  const response = await fetch(`${apiUrl}/darts/dartsGames/${identifier}`, {
    headers: {
      "Authorization": JSON.parse(await SecureStore.getItemAsync("user")).token
    }
  });

  return await response.json();
}

export const deleteDartsGame = async (gameId) => {
  const response = await fetch(`${apiUrl}/darts/dartsGames/${gameId}`, {
    method: "DELETE",
    headers: {
      "Authorization": JSON.parse(await SecureStore.getItemAsync("user")).token
    }
  });

  return await response.json();
}

// Cloud

// Users

export const getCloudUser = async (uDisplayName) => {
  const response = await fetch(`${apiUrl}/ftp/users/${uDisplayName}`, {
    headers: {
      "Authorization": JSON.parse(await SecureStore.getItemAsync("user")).token
    }
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

  const response = await fetch(url);
  const data = await response.json();
  return data.files;
}

export const getFile = async (id) => {
  const response = await fetch(`${apiUrl}/ftp/files/${id}`, {
    headers: {
      "Authorization": JSON.parse(await SecureStore.getItemAsync("user")).token
    }
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
    headers: {
      "Authorization": JSON.parse(await SecureStore.getItemAsync("user")).token
    }
  });
  const data = await response.json();
  return data.folders;
}

export const getFolder = async (id) => {
  const response = await fetch(`${apiUrl}/ftp/folders/${id}`, {
    headers: {
      "Authorization": JSON.parse(await SecureStore.getItemAsync("user")).token
    }
  });
  const data = await response.json();

  return data.folder;
}