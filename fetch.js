const apiUrl = process.env.EXPO_BACKEND_URL

console.log(process.env, apiUrl)

// Users

export const getUser = async (displayName) => {
  const response = await fetch(`https://oldziej.pl/api/auth/users/${displayName}`)

  return await response.json();
}