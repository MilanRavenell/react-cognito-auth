import { AuthData } from "../types";

const COGNITO_AUTH_COOKIE_KEY = "COGNITO_AUTH_COOKIE_KEY";

export async function getAuthCookies(): Promise<AuthData | null> {
  const authCookies = localStorage.getItem(COGNITO_AUTH_COOKIE_KEY);

  if (!authCookies) {
    return null;
  }

  return JSON.parse(authCookies);
}

export async function clearAuthCookies(): Promise<void> {
  await localStorage.removeItem(COGNITO_AUTH_COOKIE_KEY);
}

export async function setAuthCookies(authData: AuthData): Promise<void> {
  localStorage.setItem(COGNITO_AUTH_COOKIE_KEY, JSON.stringify(authData));
}
