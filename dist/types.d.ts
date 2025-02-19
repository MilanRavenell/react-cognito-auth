export interface CognitoUser {
    [key: string]: string;
}
export interface AuthData {
    accessToken: string;
    refreshToken: string;
    cognitoUser: CognitoUser;
}
export declare enum AuthState {
    INIT = "INIT",
    AUTHENTICATED = "AUTHENTICATED",
    UNAUTHENTICATED = "UNAUTHENTICATED"
}
export interface Config {
    userPoolClientId: string;
    userPoolId: string;
    awsRegion: string;
}
export declare class CognitoAuthError extends Error {
    name: string;
    message: string;
}
