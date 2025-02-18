import { AuthData, Config } from "../types";
export declare function cognitoRefreshToken(authData: AuthData, config: Config): Promise<Pick<AuthData, "accessToken">>;
