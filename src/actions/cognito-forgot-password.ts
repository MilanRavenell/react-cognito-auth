import {
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { Config, CognitoAuthError } from "../types";

export async function cognitoInitForgotPassword(
  username: string,
  config: Config,
): Promise<void> {
  const cognito = new CognitoIdentityProviderClient({
    region: config.awsRegion,
  });

  try {
    const forgotPasswordCommand = new ForgotPasswordCommand({
      ClientId: config.userPoolClientId,
      Username: username,
    });

    await cognito.send(forgotPasswordCommand);
  } catch (error) {
    const authError = new CognitoAuthError();
    authError.name = "ForgotPasswordError";
    authError.message =
      error instanceof Error
        ? error.message
        : "Failed to initiate password reset";
    throw authError;
  }
}

export async function cognitoConfirmForgotPassword(
  username: string,
  newPassword: string,
  confirmationCode: string,
  config: Config,
): Promise<void> {
  const cognito = new CognitoIdentityProviderClient({
    region: config.awsRegion,
  });

  try {
    const confirmForgotPasswordCommand = new ConfirmForgotPasswordCommand({
      ClientId: config.userPoolClientId,
      Username: username,
      Password: newPassword,
      ConfirmationCode: confirmationCode,
    });

    console.log("confirmForgotPasswordCommand", confirmForgotPasswordCommand);
    await cognito.send(confirmForgotPasswordCommand);
  } catch (error) {
    console.log("error", error);
    const authError = new CognitoAuthError();
    authError.name = "ConfirmForgotPasswordError";
    authError.message =
      error instanceof Error
        ? error.message
        : "Failed to confirm password reset";
    throw authError;
  }
}
