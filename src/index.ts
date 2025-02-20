import { useEffect, useState, useCallback } from "react";
import {
  getAuthCookies,
  clearAuthCookies,
  setAuthCookies,
} from "./actions/cookies";
import { cognitoLoginUserPasswordAuth } from "./actions/cognito-login-user-password-auth";
import {
  cognitoInitSignup,
  cognitoConfirmSignup,
} from "./actions/cognito-sign-up";
import { cognitoResendConfirmationCode } from "./actions/cognito-resend-confirmation-code";
import { cognitoRefreshToken } from "./actions/cognito-refresh-token";
import { cognitoChangePassword } from "./actions/cognito-change-password";
import { AuthData, AuthState, Config, CognitoAuthError } from "./types";
import {
  cognitoInitForgotPassword,
  cognitoConfirmForgotPassword,
} from "./actions/cognito-forgot-password";

interface CognitoAuthParams {
  config: Config;
}

export interface CognitoAuth {
  authData: AuthData | null;
  authState: AuthState;
  login: (user: string, pass: string) => Promise<void>;
  initSignUp: (
    user: string,
    pass: string,
    passConfirm: string,
  ) => Promise<void>;
  confirmSignUp: (
    user: string,
    code: string,
    callback?: (authData: AuthData) => Promise<void>,
  ) => Promise<void>;
  resendConfirmationCode: (user: string) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (
    prevPassword: string,
    newPassword: string,
    newPasswrdConfirm: string,
  ) => Promise<void>;
  initForgotPassword: (username: string) => Promise<void>;
  confirmForgotPassword: (
    username: string,
    newPassword: string,
    confirmationCode: string,
  ) => Promise<void>;
}

export const useCognitoAuth = ({ config }: CognitoAuthParams): CognitoAuth => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [authState, setAuthState] = useState<AuthState>(AuthState.INIT);
  const [signUpSession, setSignUpSession] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        let cookieAuthData = await getAuthCookies();
        if (cookieAuthData) {
          const refreshTokens = await cognitoRefreshToken(
            cookieAuthData,
            config,
          );
          cookieAuthData = {
            ...cookieAuthData,
            accessToken: refreshTokens.accessToken,
          };

          setAuthData(cookieAuthData);
          setAuthState(AuthState.AUTHENTICATED);
        }
      } catch (err) {
        throw new CognitoAuthError("Failed to validate access token: " + err);
      }

      setAuthState(AuthState.UNAUTHENTICATED);
    })();
  }, []);

  useEffect(() => {
    if (authData) {
      setAuthState(AuthState.AUTHENTICATED);
    }
  }, [authData]);

  const login = useCallback(async (user: string, pass: string) => {
    try {
      const authData = await cognitoLoginUserPasswordAuth(user, pass, config);
      await setAuthCookies(authData);
      setAuthData(authData);
    } catch (err) {
      throw new CognitoAuthError("Failed to login: " + err);
    }
  }, []);

  const initSignUp = useCallback(async (user: string, pass: string) => {
    try {
      const session = await cognitoInitSignup(user, pass, config);
      if (session) {
        setSignUpSession(session);
      }
    } catch (err) {
      throw new CognitoAuthError("Failed to sign up: " + err);
    }
  }, []);

  const confirmSignUp = useCallback(
    async (
      user: string,
      code: string,
      callback?: (authData: AuthData) => Promise<void>,
    ) => {
      try {
        if (!signUpSession) {
          throw new Error("User has not started sign up");
        }

        const authData = await cognitoConfirmSignup(
          user,
          code,
          signUpSession,
          config,
        );
        await setAuthCookies(authData);
        if (callback) {
          await callback(authData);
        }
        setAuthData(authData);
      } catch (err) {
        throw new CognitoAuthError("Failed to confirm sign up: " + err);
      }
    },
    [signUpSession],
  );

  const resendConfirmationCode = useCallback(async (user: string) => {
    try {
      await cognitoResendConfirmationCode(user, config);
    } catch (err) {
      throw new CognitoAuthError("Failed to resend confirmation code: " + err);
    }
  }, []);

  const changePassword = useCallback(
    async (prevPassword: string, newPassword: string) => {
      try {
        if (!authData || !authData.accessToken) {
          throw new Error("No access token, is user logged in?");
        }

        await cognitoChangePassword(
          authData?.accessToken,
          prevPassword,
          newPassword,
          config,
        );
      } catch (err) {
        throw new CognitoAuthError("Failed to reset password: " + err);
      }
    },
    [authData],
  );

  const signOut = useCallback(async () => {
    setAuthData(null);
    setAuthState(AuthState.UNAUTHENTICATED);
    await clearAuthCookies();
  }, []);

  const initForgotPassword = useCallback(
    async (username: string) => {
      try {
        await cognitoInitForgotPassword(username, config);
      } catch (error) {
        throw error;
      }
    },
    [config],
  );

  const confirmForgotPassword = useCallback(
    async (username: string, newPassword: string, confirmationCode: string) => {
      try {
        await cognitoConfirmForgotPassword(
          username,
          newPassword,
          confirmationCode,
          config,
        );
      } catch (error) {
        throw error;
      }
    },
    [config],
  );

  return {
    authData,
    authState,
    login,
    initSignUp,
    confirmSignUp,
    resendConfirmationCode,
    signOut,
    changePassword,
    initForgotPassword,
    confirmForgotPassword,
  };
};

export { Config, AuthState, AuthData, CognitoAuthError };
