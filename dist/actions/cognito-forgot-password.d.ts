import { Config } from "../types";
export declare function cognitoInitForgotPassword(username: string, config: Config): Promise<void>;
export declare function cognitoConfirmForgotPassword(username: string, newPassword: string, confirmationCode: string, config: Config): Promise<void>;
