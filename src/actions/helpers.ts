import { InitiateAuthCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { jwtDecode } from "jwt-decode";
import { AuthData, CognitoUser } from "../types";

export const getAuthDataFromAuthInitResponse = (
  initAuthResponse: InitiateAuthCommandOutput,
) => {
  if (
    !initAuthResponse.AuthenticationResult?.IdToken ||
    !initAuthResponse.AuthenticationResult?.AccessToken ||
    !initAuthResponse.AuthenticationResult?.RefreshToken
  ) {
    throw new Error("No username found");
  }

  const cognitoUser = jwtDecode(
    initAuthResponse.AuthenticationResult!.IdToken!,
  ) as CognitoUser;

  const authData: AuthData = {
    accessToken: initAuthResponse.AuthenticationResult?.AccessToken,
    refreshToken: initAuthResponse.AuthenticationResult?.RefreshToken,
    cognitoUser,
  };

  return authData;
};
