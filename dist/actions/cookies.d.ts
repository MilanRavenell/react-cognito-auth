import { AuthData } from "../types";
export declare function getAuthCookies(): Promise<AuthData | null>;
export declare function clearAuthCookies(): Promise<void>;
export declare function setAuthCookies(authData: AuthData): Promise<void>;
