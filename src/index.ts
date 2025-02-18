import { useEffect, useState, useCallback } from "react";
import {
  getAuthCookies,
  clearAuthCookies,
  setAuthCookies,
} from "./actions/cookies";
import { cognitoLoginUserPasswordAuth } from "./actions/cognito-login-user-password-auth";
import { cognitoSignup } from "./actions/cognito-sign-up";
import { cognitoConfirmSignup } from "./actions/cognito-confirm-sign-up";
import { cognitoResendConfirmationCode } from "./actions/cognito-resend-confirmation-code";
import { cognitoValidateAccessToken } from "./actions/cognito-validate-access-token";
import { cognitoRefreshToken } from "./actions/cognito-refresh-token";
import { cognitoChangePassword } from "./actions/cognito-change-password";
import { AuthData, AuthState, Config, CognitoAuthError } from "./types";

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
}

export const useCognitoAuth = ({ config }: CognitoAuthParams): CognitoAuth => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [authState, setAuthState] = useState<AuthState>(AuthState.INIT);

  useEffect(() => {
    (async () => {
      try {
        let cookieAuthData = await getAuthCookies();
        if (cookieAuthData) {
          if (
            !(await cognitoValidateAccessToken(
              cookieAuthData.accessToken,
              config,
            ))
          ) {
            const refreshTokens = await cognitoRefreshToken(
              cookieAuthData,
              config,
            );
            cookieAuthData = {
              ...cookieAuthData,
              accessToken: refreshTokens.accessToken,
            };
          }
          setAuthData(cookieAuthData);
          return;
        }
      } catch (err) {
        throw new CognitoAuthError("Failed to validate access token: "  + err);
      }

      setAuthState(AuthState.UNAUTHENTICATED);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (authData) {
        try {
          if (await cognitoValidateAccessToken(authData.accessToken, config)) {
            setAuthState(AuthState.AUTHENTICATED);
            return;
          }
  
          setAuthState(AuthState.UNAUTHENTICATED);
        } catch (err) {
          throw new CognitoAuthError("Failed to validate access token: " + err);
        }
      }
    })();
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

  const initSignUp = useCallback(
    async (user: string, pass: string, passConfirm: string) => {
      try {
        await cognitoSignup(user, pass, passConfirm, config);
      } catch (err) {
        throw new CognitoAuthError("Failed to sign up: " + err);
      }
    },
    [],
  );

  const confirmSignUp = useCallback(
    async (
      user: string,
      code: string,
      callback?: (authData: AuthData) => Promise<void>,
    ) => {
      try {
        const authData = await cognitoConfirmSignup(user, code, config);
        await setAuthCookies(authData);
        if (callback) {
          await callback(authData);
        }
        setAuthData(authData);
      } catch (err) {
        throw new CognitoAuthError("Failed to confirm sign up: " + err);
      }
    },
    [],
  );

  const resendConfirmationCode = useCallback(async (user: string) => {
    try {
      await cognitoResendConfirmationCode(user, config);
    } catch (err) {
      throw new CognitoAuthError("Failed to resend confirmation code: " + err);
    }
  }, []);

  const changePassword = useCallback(
    async (
      prevPassword: string,
      newPassword: string,
      newPasswrdConfirm: string,
    ) => {
      try {
        if (!authData || !authData.accessToken) {
          throw new Error("No access token, is user logged in?");
        }

        await cognitoChangePassword(
          authData?.accessToken,
          prevPassword,
          newPassword,
          newPasswrdConfirm,
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

  return {
    authData,
    authState,
    login,
    initSignUp,
    confirmSignUp,
    resendConfirmationCode,
    signOut,
    changePassword,
  };
};
