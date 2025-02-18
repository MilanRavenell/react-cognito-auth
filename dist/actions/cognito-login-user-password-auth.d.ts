import { AuthData, Config } from "../types";
export declare function cognitoLoginUserPasswordAuth(user: string, pass: string, config: Config): Promise<AuthData>;
