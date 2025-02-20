"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoAuthError = exports.AuthState = exports.useCognitoAuth = void 0;
const react_1 = require("react");
const cookies_1 = require("./actions/cookies");
const cognito_login_user_password_auth_1 = require("./actions/cognito-login-user-password-auth");
const cognito_sign_up_1 = require("./actions/cognito-sign-up");
const cognito_resend_confirmation_code_1 = require("./actions/cognito-resend-confirmation-code");
const cognito_refresh_token_1 = require("./actions/cognito-refresh-token");
const cognito_change_password_1 = require("./actions/cognito-change-password");
const types_1 = require("./types");
Object.defineProperty(exports, "AuthState", { enumerable: true, get: function () { return types_1.AuthState; } });
Object.defineProperty(exports, "CognitoAuthError", { enumerable: true, get: function () { return types_1.CognitoAuthError; } });
const cognito_forgot_password_1 = require("./actions/cognito-forgot-password");
const useCognitoAuth = ({ config }) => {
    const [authData, setAuthData] = (0, react_1.useState)(null);
    const [authState, setAuthState] = (0, react_1.useState)(types_1.AuthState.INIT);
    const [signUpSession, setSignUpSession] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        (async () => {
            try {
                let cookieAuthData = await (0, cookies_1.getAuthCookies)();
                if (cookieAuthData) {
                    const refreshTokens = await (0, cognito_refresh_token_1.cognitoRefreshToken)(cookieAuthData, config);
                    cookieAuthData = {
                        ...cookieAuthData,
                        accessToken: refreshTokens.accessToken,
                    };
                    setAuthData(cookieAuthData);
                    setAuthState(types_1.AuthState.AUTHENTICATED);
                }
            }
            catch (err) {
                throw new types_1.CognitoAuthError("Failed to validate access token: " + err);
            }
            setAuthState(types_1.AuthState.UNAUTHENTICATED);
        })();
    }, []);
    (0, react_1.useEffect)(() => {
        if (authData) {
            setAuthState(types_1.AuthState.AUTHENTICATED);
        }
    }, [authData]);
    const login = (0, react_1.useCallback)(async (user, pass) => {
        try {
            const authData = await (0, cognito_login_user_password_auth_1.cognitoLoginUserPasswordAuth)(user, pass, config);
            await (0, cookies_1.setAuthCookies)(authData);
            setAuthData(authData);
        }
        catch (err) {
            throw new types_1.CognitoAuthError("Failed to login: " + err);
        }
    }, []);
    const initSignUp = (0, react_1.useCallback)(async (user, pass) => {
        try {
            const session = await (0, cognito_sign_up_1.cognitoInitSignup)(user, pass, config);
            if (session) {
                setSignUpSession(session);
            }
        }
        catch (err) {
            throw new types_1.CognitoAuthError("Failed to sign up: " + err);
        }
    }, []);
    const confirmSignUp = (0, react_1.useCallback)(async (user, code, callback) => {
        try {
            if (!signUpSession) {
                throw new Error("User has not started sign up");
            }
            const authData = await (0, cognito_sign_up_1.cognitoConfirmSignup)(user, code, signUpSession, config);
            await (0, cookies_1.setAuthCookies)(authData);
            if (callback) {
                await callback(authData);
            }
            setAuthData(authData);
        }
        catch (err) {
            throw new types_1.CognitoAuthError("Failed to confirm sign up: " + err);
        }
    }, [signUpSession]);
    const resendConfirmationCode = (0, react_1.useCallback)(async (user) => {
        try {
            await (0, cognito_resend_confirmation_code_1.cognitoResendConfirmationCode)(user, config);
        }
        catch (err) {
            throw new types_1.CognitoAuthError("Failed to resend confirmation code: " + err);
        }
    }, []);
    const changePassword = (0, react_1.useCallback)(async (prevPassword, newPassword) => {
        try {
            if (!authData || !authData.accessToken) {
                throw new Error("No access token, is user logged in?");
            }
            await (0, cognito_change_password_1.cognitoChangePassword)(authData?.accessToken, prevPassword, newPassword, config);
        }
        catch (err) {
            throw new types_1.CognitoAuthError("Failed to reset password: " + err);
        }
    }, [authData]);
    const signOut = (0, react_1.useCallback)(async () => {
        setAuthData(null);
        setAuthState(types_1.AuthState.UNAUTHENTICATED);
        await (0, cookies_1.clearAuthCookies)();
    }, []);
    const initForgotPassword = (0, react_1.useCallback)(async (username) => {
        try {
            await (0, cognito_forgot_password_1.cognitoInitForgotPassword)(username, config);
        }
        catch (error) {
            throw error;
        }
    }, [config]);
    const confirmForgotPassword = (0, react_1.useCallback)(async (username, newPassword, confirmationCode) => {
        try {
            await (0, cognito_forgot_password_1.cognitoConfirmForgotPassword)(username, newPassword, confirmationCode, config);
        }
        catch (error) {
            throw error;
        }
    }, [config]);
    return {
        authData,
        authState,
        login,
        initSignUp,
        confirmSignUp,
        resendConfirmationCode,
        signOut,
        changePassword,
        initForgotPassword,
        confirmForgotPassword,
    };
};
exports.useCognitoAuth = useCognitoAuth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQXlEO0FBQ3pELCtDQUkyQjtBQUMzQixpR0FBMEY7QUFDMUYsK0RBR21DO0FBQ25DLGlHQUEyRjtBQUMzRiwyRUFBc0U7QUFDdEUsK0VBQTBFO0FBQzFFLG1DQUF3RTtBQXdNdkQsMEZBeE1FLGlCQUFTLE9Bd01GO0FBQVksaUdBeE1BLHdCQUFnQixPQXdNQTtBQXZNdEQsK0VBRzJDO0FBbUNwQyxNQUFNLGNBQWMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFxQixFQUFlLEVBQUU7SUFDM0UsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQWtCLElBQUksQ0FBQyxDQUFDO0lBQ2hFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFZLGlCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEUsTUFBTSxDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBZ0IsSUFBSSxDQUFDLENBQUM7SUFFeEUsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDVixJQUFJLENBQUM7Z0JBQ0gsSUFBSSxjQUFjLEdBQUcsTUFBTSxJQUFBLHdCQUFjLEdBQUUsQ0FBQztnQkFDNUMsSUFBSSxjQUFjLEVBQUUsQ0FBQztvQkFDbkIsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFBLDJDQUFtQixFQUM3QyxjQUFjLEVBQ2QsTUFBTSxDQUNQLENBQUM7b0JBQ0YsY0FBYyxHQUFHO3dCQUNmLEdBQUcsY0FBYzt3QkFDakIsV0FBVyxFQUFFLGFBQWEsQ0FBQyxXQUFXO3FCQUN2QyxDQUFDO29CQUVGLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFDNUIsWUFBWSxDQUFDLGlCQUFT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SyxFQUFFLENBQUM7WUFDZixNQUFNLEtBQUssQ0FBQztRQUNkLENBQUM7SUFDSCxDQUFDLEVBQ0QsQ0FBQyxNQUFNLENBQUMsQ0FDVCxDQUFDO0lBRUYsTUFBTSxxQkFBcUIsR0FBRyxJQUFBLG1CQUFXLEVBQ3ZDLEtBQUssRUFBRSxRQUFnQixFQUFFLFdBQW1CLEVBQUUsZ0JBQXdCLEVBQUUsRUFBRTtRQUN4RSxJQUFJLENBQUM7WUFDSCxNQUFNLElBQUEsc0RBQTRCLEVBQ2hDLFFBQVEsRUFDUixXQUFXLEVBQ1gsZ0JBQWdCLEVBQ2hCLE1BQU0sQ0FDUCxDQUFDO1FBQ0osQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDZixNQUFNLEtBQUssQ0FBQztRQUNkLENBQUM7SUFDSCxDQUFDLEVBQ0QsQ0FBQyxNQUFNLENBQUMsQ0FDVCxDQUFDO0lBRUYsT0FBTztRQUNMLFFBQVE7UUFDUixTQUFTO1FBQ1QsS0FBSztRQUNMLFVBQVU7UUFDVixhQUFhO1FBQ2Isc0JBQXNCO1FBQ3RCLE9BQU87UUFDUCxjQUFjO1FBQ2Qsa0JBQWtCO1FBQ2xCLHFCQUFxQjtLQUN0QixDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBL0pXLFFBQUEsY0FBYyxrQkErSnpCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSwgdXNlQ2FsbGJhY2sgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7XG4gIGdldEF1dGhDb29raWVzLFxuICBjbGVhckF1dGhDb29raWVzLFxuICBzZXRBdXRoQ29va2llcyxcbn0gZnJvbSBcIi4vYWN0aW9ucy9jb29raWVzXCI7XG5pbXBvcnQgeyBjb2duaXRvTG9naW5Vc2VyUGFzc3dvcmRBdXRoIH0gZnJvbSBcIi4vYWN0aW9ucy9jb2duaXRvLWxvZ2luLXVzZXItcGFzc3dvcmQtYXV0aFwiO1xuaW1wb3J0IHtcbiAgY29nbml0b0luaXRTaWdudXAsXG4gIGNvZ25pdG9Db25maXJtU2lnbnVwLFxufSBmcm9tIFwiLi9hY3Rpb25zL2NvZ25pdG8tc2lnbi11cFwiO1xuaW1wb3J0IHsgY29nbml0b1Jlc2VuZENvbmZpcm1hdGlvbkNvZGUgfSBmcm9tIFwiLi9hY3Rpb25zL2NvZ25pdG8tcmVzZW5kLWNvbmZpcm1hdGlvbi1jb2RlXCI7XG5pbXBvcnQgeyBjb2duaXRvUmVmcmVzaFRva2VuIH0gZnJvbSBcIi4vYWN0aW9ucy9jb2duaXRvLXJlZnJlc2gtdG9rZW5cIjtcbmltcG9ydCB7IGNvZ25pdG9DaGFuZ2VQYXNzd29yZCB9IGZyb20gXCIuL2FjdGlvbnMvY29nbml0by1jaGFuZ2UtcGFzc3dvcmRcIjtcbmltcG9ydCB7IEF1dGhEYXRhLCBBdXRoU3RhdGUsIENvbmZpZywgQ29nbml0b0F1dGhFcnJvciB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQge1xuICBjb2duaXRvSW5pdEZvcmdvdFBhc3N3b3JkLFxuICBjb2duaXRvQ29uZmlybUZvcmdvdFBhc3N3b3JkLFxufSBmcm9tIFwiLi9hY3Rpb25zL2NvZ25pdG8tZm9yZ290LXBhc3N3b3JkXCI7XG5cbmludGVyZmFjZSBDb2duaXRvQXV0aFBhcmFtcyB7XG4gIGNvbmZpZzogQ29uZmlnO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvZ25pdG9BdXRoIHtcbiAgYXV0aERhdGE6IEF1dGhEYXRhIHwgbnVsbDtcbiAgYXV0aFN0YXRlOiBBdXRoU3RhdGU7XG4gIGxvZ2luOiAodXNlcjogc3RyaW5nLCBwYXNzOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG4gIGluaXRTaWduVXA6IChcbiAgICB1c2VyOiBzdHJpbmcsXG4gICAgcGFzczogc3RyaW5nLFxuICAgIHBhc3NDb25maXJtOiBzdHJpbmcsXG4gICkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgY29uZmlybVNpZ25VcDogKFxuICAgIHVzZXI6IHN0cmluZyxcbiAgICBjb2RlOiBzdHJpbmcsXG4gICAgY2FsbGJhY2s/OiAoYXV0aERhdGE6IEF1dGhEYXRhKSA9PiBQcm9taXNlPHZvaWQ+LFxuICApID0+IFByb21pc2U8dm9pZD47XG4gIHJlc2VuZENvbmZpcm1hdGlvbkNvZGU6ICh1c2VyOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG4gIHNpZ25PdXQ6ICgpID0+IFByb21pc2U8dm9pZD47XG4gIGNoYW5nZVBhc3N3b3JkOiAoXG4gICAgcHJldlBhc3N3b3JkOiBzdHJpbmcsXG4gICAgbmV3UGFzc3dvcmQ6IHN0cmluZyxcbiAgICBuZXdQYXNzd3JkQ29uZmlybTogc3RyaW5nLFxuICApID0+IFByb21pc2U8dm9pZD47XG4gIGluaXRGb3Jnb3RQYXNzd29yZDogKHVzZXJuYW1lOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG4gIGNvbmZpcm1Gb3Jnb3RQYXNzd29yZDogKFxuICAgIHVzZXJuYW1lOiBzdHJpbmcsXG4gICAgbmV3UGFzc3dvcmQ6IHN0cmluZyxcbiAgICBjb25maXJtYXRpb25Db2RlOiBzdHJpbmcsXG4gICkgPT4gUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUNvZ25pdG9BdXRoID0gKHsgY29uZmlnIH06IENvZ25pdG9BdXRoUGFyYW1zKTogQ29nbml0b0F1dGggPT4ge1xuICBjb25zdCBbYXV0aERhdGEsIHNldEF1dGhEYXRhXSA9IHVzZVN0YXRlPEF1dGhEYXRhIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFthdXRoU3RhdGUsIHNldEF1dGhTdGF0ZV0gPSB1c2VTdGF0ZTxBdXRoU3RhdGU+KEF1dGhTdGF0ZS5JTklUKTtcbiAgY29uc3QgW3NpZ25VcFNlc3Npb24sIHNldFNpZ25VcFNlc3Npb25dID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IGNvb2tpZUF1dGhEYXRhID0gYXdhaXQgZ2V0QXV0aENvb2tpZXMoKTtcbiAgICAgICAgaWYgKGNvb2tpZUF1dGhEYXRhKSB7XG4gICAgICAgICAgY29uc3QgcmVmcmVzaFRva2VucyA9IGF3YWl0IGNvZ25pdG9SZWZyZXNoVG9rZW4oXG4gICAgICAgICAgICBjb29raWVBdXRoRGF0YSxcbiAgICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICApO1xuICAgICAgICAgIGNvb2tpZUF1dGhEYXRhID0ge1xuICAgICAgICAgICAgLi4uY29va2llQXV0aERhdGEsXG4gICAgICAgICAgICBhY2Nlc3NUb2tlbjogcmVmcmVzaFRva2Vucy5hY2Nlc3NUb2tlbixcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgc2V0QXV0aERhdGEoY29va2llQXV0aERhdGEpO1xuICAgICAgICAgIHNldEF1dGhTdGF0ZShBdXRoU3RhdGUuQVVUSEVOVElDQVRFRCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aHJvdyBuZXcgQ29nbml0b0F1dGhFcnJvcihcIkZhaWxlZCB0byB2YWxpZGF0ZSBhY2Nlc3MgdG9rZW46IFwiICsgZXJyKTtcbiAgICAgIH1cblxuICAgICAgc2V0QXV0aFN0YXRlKEF1dGhTdGF0ZS5VTkFVVEhFTlRJQ0FURUQpO1xuICAgIH0pKCk7XG4gIH0sIFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgc2V0QXV0aFN0YXRlKEF1dGhTdGF0ZS5BVVRIRU5USUNBVEVEKTtcbiAgICB9XG4gIH0sIFthdXRoRGF0YV0pO1xuXG4gIGNvbnN0IGxvZ2luID0gdXNlQ2FsbGJhY2soYXN5bmMgKHVzZXI6IHN0cmluZywgcGFzczogc3RyaW5nKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGF1dGhEYXRhID0gYXdhaXQgY29nbml0b0xvZ2luVXNlclBhc3N3b3JkQXV0aCh1c2VyLCBwYXNzLCBjb25maWcpO1xuICAgICAgYXdhaXQgc2V0QXV0aENvb2tpZXMoYXV0aERhdGEpO1xuICAgICAgc2V0QXV0aERhdGEoYXV0aERhdGEpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhyb3cgbmV3IENvZ25pdG9BdXRoRXJyb3IoXCJGYWlsZWQgdG8gbG9naW46IFwiICsgZXJyKTtcbiAgICB9XG4gIH0sIFtdKTtcblxuICBjb25zdCBpbml0U2lnblVwID0gdXNlQ2FsbGJhY2soYXN5bmMgKHVzZXI6IHN0cmluZywgcGFzczogc3RyaW5nKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBjb2duaXRvSW5pdFNpZ251cCh1c2VyLCBwYXNzLCBjb25maWcpO1xuICAgICAgaWYgKHNlc3Npb24pIHtcbiAgICAgICAgc2V0U2lnblVwU2Vzc2lvbihzZXNzaW9uKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRocm93IG5ldyBDb2duaXRvQXV0aEVycm9yKFwiRmFpbGVkIHRvIHNpZ24gdXA6IFwiICsgZXJyKTtcbiAgICB9XG4gIH0sIFtdKTtcblxuICBjb25zdCBjb25maXJtU2lnblVwID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKFxuICAgICAgdXNlcjogc3RyaW5nLFxuICAgICAgY29kZTogc3RyaW5nLFxuICAgICAgY2FsbGJhY2s/OiAoYXV0aERhdGE6IEF1dGhEYXRhKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFzaWduVXBTZXNzaW9uKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVXNlciBoYXMgbm90IHN0YXJ0ZWQgc2lnbiB1cFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGF1dGhEYXRhID0gYXdhaXQgY29nbml0b0NvbmZpcm1TaWdudXAoXG4gICAgICAgICAgdXNlcixcbiAgICAgICAgICBjb2RlLFxuICAgICAgICAgIHNpZ25VcFNlc3Npb24sXG4gICAgICAgICAgY29uZmlnLFxuICAgICAgICApO1xuICAgICAgICBhd2FpdCBzZXRBdXRoQ29va2llcyhhdXRoRGF0YSk7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGF3YWl0IGNhbGxiYWNrKGF1dGhEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBzZXRBdXRoRGF0YShhdXRoRGF0YSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhyb3cgbmV3IENvZ25pdG9BdXRoRXJyb3IoXCJGYWlsZWQgdG8gY29uZmlybSBzaWduIHVwOiBcIiArIGVycik7XG4gICAgICB9XG4gICAgfSxcbiAgICBbc2lnblVwU2Vzc2lvbl0sXG4gICk7XG5cbiAgY29uc3QgcmVzZW5kQ29uZmlybWF0aW9uQ29kZSA9IHVzZUNhbGxiYWNrKGFzeW5jICh1c2VyOiBzdHJpbmcpID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgY29nbml0b1Jlc2VuZENvbmZpcm1hdGlvbkNvZGUodXNlciwgY29uZmlnKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRocm93IG5ldyBDb2duaXRvQXV0aEVycm9yKFwiRmFpbGVkIHRvIHJlc2VuZCBjb25maXJtYXRpb24gY29kZTogXCIgKyBlcnIpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIGNvbnN0IGNoYW5nZVBhc3N3b3JkID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKHByZXZQYXNzd29yZDogc3RyaW5nLCBuZXdQYXNzd29yZDogc3RyaW5nKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIWF1dGhEYXRhIHx8ICFhdXRoRGF0YS5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGFjY2VzcyB0b2tlbiwgaXMgdXNlciBsb2dnZWQgaW4/XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgY29nbml0b0NoYW5nZVBhc3N3b3JkKFxuICAgICAgICAgIGF1dGhEYXRhPy5hY2Nlc3NUb2tlbixcbiAgICAgICAgICBwcmV2UGFzc3dvcmQsXG4gICAgICAgICAgbmV3UGFzc3dvcmQsXG4gICAgICAgICAgY29uZmlnLFxuICAgICAgICApO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRocm93IG5ldyBDb2duaXRvQXV0aEVycm9yKFwiRmFpbGVkIHRvIHJlc2V0IHBhc3N3b3JkOiBcIiArIGVycik7XG4gICAgICB9XG4gICAgfSxcbiAgICBbYXV0aERhdGFdLFxuICApO1xuXG4gIGNvbnN0IHNpZ25PdXQgPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgc2V0QXV0aERhdGEobnVsbCk7XG4gICAgc2V0QXV0aFN0YXRlKEF1dGhTdGF0ZS5VTkFVVEhFTlRJQ0FURUQpO1xuICAgIGF3YWl0IGNsZWFyQXV0aENvb2tpZXMoKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGluaXRGb3Jnb3RQYXNzd29yZCA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jICh1c2VybmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjb2duaXRvSW5pdEZvcmdvdFBhc3N3b3JkKHVzZXJuYW1lLCBjb25maWcpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfSxcbiAgICBbY29uZmlnXSxcbiAgKTtcblxuICBjb25zdCBjb25maXJtRm9yZ290UGFzc3dvcmQgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAodXNlcm5hbWU6IHN0cmluZywgbmV3UGFzc3dvcmQ6IHN0cmluZywgY29uZmlybWF0aW9uQ29kZTogc3RyaW5nKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjb2duaXRvQ29uZmlybUZvcmdvdFBhc3N3b3JkKFxuICAgICAgICAgIHVzZXJuYW1lLFxuICAgICAgICAgIG5ld1Bhc3N3b3JkLFxuICAgICAgICAgIGNvbmZpcm1hdGlvbkNvZGUsXG4gICAgICAgICAgY29uZmlnLFxuICAgICAgICApO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfSxcbiAgICBbY29uZmlnXSxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIGF1dGhEYXRhLFxuICAgIGF1dGhTdGF0ZSxcbiAgICBsb2dpbixcbiAgICBpbml0U2lnblVwLFxuICAgIGNvbmZpcm1TaWduVXAsXG4gICAgcmVzZW5kQ29uZmlybWF0aW9uQ29kZSxcbiAgICBzaWduT3V0LFxuICAgIGNoYW5nZVBhc3N3b3JkLFxuICAgIGluaXRGb3Jnb3RQYXNzd29yZCxcbiAgICBjb25maXJtRm9yZ290UGFzc3dvcmQsXG4gIH07XG59O1xuXG5leHBvcnQgeyBDb25maWcsIEF1dGhTdGF0ZSwgQXV0aERhdGEsIENvZ25pdG9BdXRoRXJyb3IgfTtcbiJdfQ==