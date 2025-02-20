import { AuthData, Config } from "../types";
export declare function cognitoInitSignup(user: string, pass: string, config: Config): Promise<string | undefined>;
export declare function cognitoConfirmSignup(user: string, code: string, session: string, config: Config): Promise<AuthData>;
