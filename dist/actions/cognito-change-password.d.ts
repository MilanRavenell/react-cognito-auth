import { Config } from "../types";
export declare function cognitoChangePassword(accessToken: string, prevPassword: string, newPassword: string, newPasswordConfirm: string, config: Config): Promise<void>;
