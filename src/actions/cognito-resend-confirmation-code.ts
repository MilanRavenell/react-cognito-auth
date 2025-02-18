import {
  CognitoIdentityProviderClient,
  ResendConfirmationCodeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { Config } from "../types";

export async function cognitoResendConfirmationCode(
  user: string,
  config: Config,
): Promise<void> {
  const cognito = new CognitoIdentityProviderClient({
    region: config.awsRegion,
  });

  const resendConfirmationCodeCommand = new ResendConfirmationCodeCommand({
    ClientId: config.userPoolClientId,
    Username: user,
  });

  await cognito.send(resendConfirmationCodeCommand);
}
