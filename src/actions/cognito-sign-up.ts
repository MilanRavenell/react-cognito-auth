import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { Config } from "../types";

export async function cognitoSignup(
  user: string,
  pass: string,
  passConfirm: string,
  config: Config,
): Promise<string | undefined> {
  if (pass !== passConfirm) {
    throw new Error("Passwords did not match");
  }

  const cognito = new CognitoIdentityProviderClient({
    region: config.awsRegion,
  });

  const createUserCommand = new SignUpCommand({
    ClientId: config.userPoolClientId,
    Username: user,
    Password: pass,
  });

  const { Session } = await cognito.send(createUserCommand);
  return Session;
}
