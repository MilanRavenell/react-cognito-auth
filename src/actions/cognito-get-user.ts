import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { Config } from "../types";

export async function cognitoGetUser(
  accessToken: string,
  config: Config,
): Promise<void> {
  const cognito = new CognitoIdentityProviderClient({
    region: config.awsRegion,
  });

  const getUserCommand = new GetUserCommand({
    AccessToken: accessToken,
  });

  await cognito.send(getUserCommand);
}
