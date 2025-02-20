import { Config } from "../types";
export declare function cognitoChangePassword(accessToken: string, prevPassword: string, newPassword: string, config: Config): Promise<void>;
