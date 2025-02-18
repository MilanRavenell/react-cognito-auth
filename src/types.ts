export interface CognitoUser {
  [key: string]: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  cognitoUser: CognitoUser;
}

export enum AuthState {
  INIT = "INIT",
  AUTHENTICATED = "AUTHENTICATED",
  UNAUTHENTICATED = "UNAUTHENTICATED",
}

export interface Config {
  userPoolClientId: string;
  userPoolId: string;
  awsRegion: string;
  cognitoUsernameField: string;
}

export class CognitoAuthError extends Error {
  name: string;
  message: string;
}

