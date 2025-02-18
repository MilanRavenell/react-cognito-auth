import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { getAuthDataFromAuthInitResponse } from "./helpers";
import { AuthData, Config } from "../types";

export async function cognitoLoginUserPasswordAuth(
  user: string,
  pass: string,
  config: Config,
): Promise<AuthData> {
  const cognito = new CognitoIdentityProviderClient({
    region: config.awsRegion,
  });

  const initAuthCommand = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: config.userPoolClientId,
    AuthParameters: {
      USERNAME: user,
      PASSWORD: pass,
    },
  });

  const response = await cognito.send(initAuthCommand);

  return getAuthDataFromAuthInitResponse(response);
}
