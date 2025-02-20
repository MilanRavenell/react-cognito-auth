import { AuthData, Config } from "../types";
export declare function cognitoConfirmSignup(
  user: string,
  code: string,
  session: string,
  config: Config,
): Promise<AuthData>;
