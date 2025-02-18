import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { AuthData, Config } from "../types";

export async function cognitoRefreshToken(
  authData: AuthData,
  config: Config,
): Promise<Pick<AuthData, "accessToken">> {
  const cognito = new CognitoIdentityProviderClient({
    region: config.awsRegion,
  });

  const initAuthCommand = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
    ClientId: config.userPoolClientId,
    AuthParameters: {
      USERNAME: authData.cognitoUser[config.cognitoUsernameField],
      REFRESH_TOKEN: authData.refreshToken,
    },
  });

  const response = await cognito.send(initAuthCommand);

  if (
    !response.AuthenticationResult?.IdToken ||
    !response.AuthenticationResult?.AccessToken
  ) {
    throw new Error("No username found");
  }

  return {
    accessToken: response.AuthenticationResult?.AccessToken,
  };
}
