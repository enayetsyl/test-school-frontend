// src/utils/authToken.ts
let inMemoryToken: string | null = null;

export function setAccessToken(token: string | null): void {
  inMemoryToken = token;
  try {
    if (token) localStorage.setItem("accessToken", token);
    else localStorage.removeItem("accessToken");
  } catch {
    // localStorage may be disabled — ignore
  }
}

export function getAccessToken(): string | null {
  if (inMemoryToken) return inMemoryToken;
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
}
