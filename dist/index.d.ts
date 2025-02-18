import { AuthData, AuthState, Config, CognitoAuthError } from "./types";
interface CognitoAuthParams {
    config: Config;
}
export interface CognitoAuth {
    authData: AuthData | null;
    authState: AuthState;
    login: (user: string, pass: string) => Promise<void>;
    initSignUp: (user: string, pass: string, passConfirm: string) => Promise<void>;
    confirmSignUp: (user: string, code: string, callback?: (authData: AuthData) => Promise<void>) => Promise<void>;
    resendConfirmationCode: (user: string) => Promise<void>;
    signOut: () => Promise<void>;
    changePassword: (prevPassword: string, newPassword: string, newPasswrdConfirm: string) => Promise<void>;
}
export declare const useCognitoAuth: ({ config }: CognitoAuthParams) => CognitoAuth;
export { Config, AuthState, AuthData, CognitoAuthError };
