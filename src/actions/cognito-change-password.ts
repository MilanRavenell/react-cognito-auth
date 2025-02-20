import {
  CognitoIdentityProviderClient,
  ChangePasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { Config } from "../types";

export async function cognitoChangePassword(
  accessToken: string,
  prevPassword: string,
  newPassword: string,
  config: Config,
): Promise<void> {
  const cognito = new CognitoIdentityProviderClient({
    region: config.awsRegion,
  });

  const validateEmailCommand = new ChangePasswordCommand({
    AccessToken: accessToken,
    PreviousPassword: prevPassword,
    ProposedPassword: newPassword,
  });

  await cognito.send(validateEmailCommand);
}
