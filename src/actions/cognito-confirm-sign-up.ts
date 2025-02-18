import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { getAuthDataFromAuthInitResponse } from "./helpers";
import { AuthData, Config } from "../types";

export async function cognitoConfirmSignup(
  user: string,
  code: string,
  config: Config,
): Promise<AuthData> {
  const cognito = new CognitoIdentityProviderClient({
    region: config.awsRegion,
  });

  const validateEmailCommand = new ConfirmSignUpCommand({
    ClientId: config.userPoolClientId,
    Username: user,
    ConfirmationCode: code,
  });

  const { Session } = await cognito.send(validateEmailCommand);

  const initiateAuthCommand = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_AUTH,
    ClientId: config.userPoolClientId,
    Session,
  });

  const initAuthResponse = await cognito.send(initiateAuthCommand);
  return getAuthDataFromAuthInitResponse(initAuthResponse);
}
