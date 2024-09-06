export const login = async (username, password) => {
  const response = await fetch('https://ec2f-188-122-23-154.ngrok-free.app/api/auth/login', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      displayName: username,
      password: password
    })
  });

  return await response.json();
}