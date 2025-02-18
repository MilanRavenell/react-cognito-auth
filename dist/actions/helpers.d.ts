import { InitiateAuthCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { AuthData } from "../types";
export declare const getAuthDataFromAuthInitResponse: (initAuthResponse: InitiateAuthCommandOutput) => AuthData;
