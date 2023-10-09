export function decodeJwt(token: string) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload;
}

export function isTokenExpired(token: string | null | undefined) {
  if (!token) {
    return true;
  }
  const decoded = decodeJwt(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}
