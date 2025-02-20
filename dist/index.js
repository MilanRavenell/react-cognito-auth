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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQXlEO0FBQ3pELCtDQUkyQjtBQUMzQixpR0FBMEY7QUFDMUYsK0RBQW9GO0FBQ3BGLGlHQUEyRjtBQUMzRiwyRUFBc0U7QUFDdEUsK0VBQTBFO0FBQzFFLG1DQUF3RTtBQTBNdkQsMEZBMU1FLGlCQUFTLE9BME1GO0FBQVksaUdBMU1BLHdCQUFnQixPQTBNQTtBQXpNdEQsK0VBRzJDO0FBK0JwQyxNQUFNLGNBQWMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFxQixFQUFlLEVBQUU7SUFDM0UsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQWtCLElBQUksQ0FBQyxDQUFDO0lBQ2hFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFZLGlCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEUsTUFBTSxDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBZ0IsSUFBSSxDQUFDLENBQUM7SUFFeEUsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDVixJQUFJLENBQUM7Z0JBQ0gsSUFBSSxjQUFjLEdBQUcsTUFBTSxJQUFBLHdCQUFjLEdBQUUsQ0FBQztnQkFDNUMsSUFBSSxjQUFjLEVBQUUsQ0FBQztvQkFDbkIsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFBLDJDQUFtQixFQUM3QyxjQUFjLEVBQ2QsTUFBTSxDQUNQLENBQUM7b0JBQ0YsY0FBYyxHQUFHO3dCQUNmLEdBQUcsY0FBYzt3QkFDakIsV0FBVyxFQUFFLGFBQWEsQ0FBQyxXQUFXO3FCQUN2QyxDQUFDO29CQUVGLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFDNUIsWUFBWSxDQUFDLGlCQUFT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QUFLLEVBQUUsQ0FBQztZQUNmLE1BQU0sS0FBSyxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUMsRUFDRCxDQUFDLE1BQU0sQ0FBQyxDQUNULENBQUM7SUFFRixNQUFNLHFCQUFxQixHQUFHLElBQUEsbUJBQVcsRUFDdkMsS0FBSyxFQUFFLFFBQWdCLEVBQUUsV0FBbUIsRUFBRSxnQkFBd0IsRUFBRSxFQUFFO1FBQ3hFLElBQUksQ0FBQztZQUNILE1BQU0sSUFBQSxzREFBNEIsRUFDaEMsUUFBUSxFQUNSLFdBQVcsRUFDWCxnQkFBZ0IsRUFDaEIsTUFBTSxDQUNQLENBQUM7UUFDSixDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNmLE1BQU0sS0FBSyxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUMsRUFDRCxDQUFDLE1BQU0sQ0FBQyxDQUNULENBQUM7SUFFRixPQUFPO1FBQ0wsUUFBUTtRQUNSLFNBQVM7UUFDVCxLQUFLO1FBQ0wsVUFBVTtRQUNWLGFBQWE7UUFDYixzQkFBc0I7UUFDdEIsT0FBTztRQUNQLGNBQWM7UUFDZCxrQkFBa0I7UUFDbEIscUJBQXFCO0tBQ3RCLENBQUM7QUFDSixDQUFDLENBQUM7QUFyS1csUUFBQSxjQUFjLGtCQXFLekIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlLCB1c2VDYWxsYmFjayB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtcbiAgZ2V0QXV0aENvb2tpZXMsXG4gIGNsZWFyQXV0aENvb2tpZXMsXG4gIHNldEF1dGhDb29raWVzLFxufSBmcm9tIFwiLi9hY3Rpb25zL2Nvb2tpZXNcIjtcbmltcG9ydCB7IGNvZ25pdG9Mb2dpblVzZXJQYXNzd29yZEF1dGggfSBmcm9tIFwiLi9hY3Rpb25zL2NvZ25pdG8tbG9naW4tdXNlci1wYXNzd29yZC1hdXRoXCI7XG5pbXBvcnQgeyBjb2duaXRvSW5pdFNpZ251cCwgY29nbml0b0NvbmZpcm1TaWdudXAgfSBmcm9tIFwiLi9hY3Rpb25zL2NvZ25pdG8tc2lnbi11cFwiO1xuaW1wb3J0IHsgY29nbml0b1Jlc2VuZENvbmZpcm1hdGlvbkNvZGUgfSBmcm9tIFwiLi9hY3Rpb25zL2NvZ25pdG8tcmVzZW5kLWNvbmZpcm1hdGlvbi1jb2RlXCI7XG5pbXBvcnQgeyBjb2duaXRvUmVmcmVzaFRva2VuIH0gZnJvbSBcIi4vYWN0aW9ucy9jb2duaXRvLXJlZnJlc2gtdG9rZW5cIjtcbmltcG9ydCB7IGNvZ25pdG9DaGFuZ2VQYXNzd29yZCB9IGZyb20gXCIuL2FjdGlvbnMvY29nbml0by1jaGFuZ2UtcGFzc3dvcmRcIjtcbmltcG9ydCB7IEF1dGhEYXRhLCBBdXRoU3RhdGUsIENvbmZpZywgQ29nbml0b0F1dGhFcnJvciB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBcbiAgY29nbml0b0luaXRGb3Jnb3RQYXNzd29yZCxcbiAgY29nbml0b0NvbmZpcm1Gb3Jnb3RQYXNzd29yZCBcbn0gZnJvbSAnLi9hY3Rpb25zL2NvZ25pdG8tZm9yZ290LXBhc3N3b3JkJztcblxuaW50ZXJmYWNlIENvZ25pdG9BdXRoUGFyYW1zIHtcbiAgY29uZmlnOiBDb25maWc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29nbml0b0F1dGgge1xuICBhdXRoRGF0YTogQXV0aERhdGEgfCBudWxsO1xuICBhdXRoU3RhdGU6IEF1dGhTdGF0ZTtcbiAgbG9naW46ICh1c2VyOiBzdHJpbmcsIHBhc3M6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgaW5pdFNpZ25VcDogKFxuICAgIHVzZXI6IHN0cmluZyxcbiAgICBwYXNzOiBzdHJpbmcsXG4gICAgcGFzc0NvbmZpcm06IHN0cmluZyxcbiAgKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBjb25maXJtU2lnblVwOiAoXG4gICAgdXNlcjogc3RyaW5nLFxuICAgIGNvZGU6IHN0cmluZyxcbiAgICBjYWxsYmFjaz86IChhdXRoRGF0YTogQXV0aERhdGEpID0+IFByb21pc2U8dm9pZD4sXG4gICkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgcmVzZW5kQ29uZmlybWF0aW9uQ29kZTogKHVzZXI6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgc2lnbk91dDogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgY2hhbmdlUGFzc3dvcmQ6IChcbiAgICBwcmV2UGFzc3dvcmQ6IHN0cmluZyxcbiAgICBuZXdQYXNzd29yZDogc3RyaW5nLFxuICAgIG5ld1Bhc3N3cmRDb25maXJtOiBzdHJpbmcsXG4gICkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgaW5pdEZvcmdvdFBhc3N3b3JkOiAodXNlcm5hbWU6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgY29uZmlybUZvcmdvdFBhc3N3b3JkOiAodXNlcm5hbWU6IHN0cmluZywgbmV3UGFzc3dvcmQ6IHN0cmluZywgY29uZmlybWF0aW9uQ29kZTogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xufVxuXG5leHBvcnQgY29uc3QgdXNlQ29nbml0b0F1dGggPSAoeyBjb25maWcgfTogQ29nbml0b0F1dGhQYXJhbXMpOiBDb2duaXRvQXV0aCA9PiB7XG4gIGNvbnN0IFthdXRoRGF0YSwgc2V0QXV0aERhdGFdID0gdXNlU3RhdGU8QXV0aERhdGEgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW2F1dGhTdGF0ZSwgc2V0QXV0aFN0YXRlXSA9IHVzZVN0YXRlPEF1dGhTdGF0ZT4oQXV0aFN0YXRlLklOSVQpO1xuICBjb25zdCBbc2lnblVwU2Vzc2lvbiwgc2V0U2lnblVwU2Vzc2lvbl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgY29va2llQXV0aERhdGEgPSBhd2FpdCBnZXRBdXRoQ29va2llcygpO1xuICAgICAgICBpZiAoY29va2llQXV0aERhdGEpIHtcbiAgICAgICAgICBjb25zdCByZWZyZXNoVG9rZW5zID0gYXdhaXQgY29nbml0b1JlZnJlc2hUb2tlbihcbiAgICAgICAgICAgIGNvb2tpZUF1dGhEYXRhLFxuICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICk7XG4gICAgICAgICAgY29va2llQXV0aERhdGEgPSB7XG4gICAgICAgICAgICAuLi5jb29raWVBdXRoRGF0YSxcbiAgICAgICAgICAgIGFjY2Vzc1Rva2VuOiByZWZyZXNoVG9rZW5zLmFjY2Vzc1Rva2VuLFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBzZXRBdXRoRGF0YShjb29raWVBdXRoRGF0YSk7XG4gICAgICAgICAgc2V0QXV0aFN0YXRlKEF1dGhTdGF0ZS5BVVRIRU5USUNBVEVEKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRocm93IG5ldyBDb2duaXRvQXV0aEVycm9yKFwiRmFpbGVkIHRvIHZhbGlkYXRlIGFjY2VzcyB0b2tlbjogXCIgKyBlcnIpO1xuICAgICAgfVxuXG4gICAgICBzZXRBdXRoU3RhdGUoQXV0aFN0YXRlLlVOQVVUSEVOVElDQVRFRCk7XG4gICAgfSkoKTtcbiAgfSwgW10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGF1dGhEYXRhKSB7XG4gICAgICBzZXRBdXRoU3RhdGUoQXV0aFN0YXRlLkFVVEhFTlRJQ0FURUQpO1xuICAgIH1cbiAgfSwgW2F1dGhEYXRhXSk7XG5cbiAgY29uc3QgbG9naW4gPSB1c2VDYWxsYmFjayhhc3luYyAodXNlcjogc3RyaW5nLCBwYXNzOiBzdHJpbmcpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgYXV0aERhdGEgPSBhd2FpdCBjb2duaXRvTG9naW5Vc2VyUGFzc3dvcmRBdXRoKHVzZXIsIHBhc3MsIGNvbmZpZyk7XG4gICAgICBhd2FpdCBzZXRBdXRoQ29va2llcyhhdXRoRGF0YSk7XG4gICAgICBzZXRBdXRoRGF0YShhdXRoRGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aHJvdyBuZXcgQ29nbml0b0F1dGhFcnJvcihcIkZhaWxlZCB0byBsb2dpbjogXCIgKyBlcnIpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIGNvbnN0IGluaXRTaWduVXAgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAodXNlcjogc3RyaW5nLCBwYXNzOiBzdHJpbmcpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBjb2duaXRvSW5pdFNpZ251cCh1c2VyLCBwYXNzLCBjb25maWcpO1xuICAgICAgICBpZiAoc2Vzc2lvbikge1xuICAgICAgICAgIHNldFNpZ25VcFNlc3Npb24oc2Vzc2lvbik7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aHJvdyBuZXcgQ29nbml0b0F1dGhFcnJvcihcIkZhaWxlZCB0byBzaWduIHVwOiBcIiArIGVycik7XG4gICAgICB9XG4gICAgfSxcbiAgICBbXSxcbiAgKTtcblxuICBjb25zdCBjb25maXJtU2lnblVwID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKFxuICAgICAgdXNlcjogc3RyaW5nLFxuICAgICAgY29kZTogc3RyaW5nLFxuICAgICAgY2FsbGJhY2s/OiAoYXV0aERhdGE6IEF1dGhEYXRhKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFzaWduVXBTZXNzaW9uKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVXNlciBoYXMgbm90IHN0YXJ0ZWQgc2lnbiB1cFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGF1dGhEYXRhID0gYXdhaXQgY29nbml0b0NvbmZpcm1TaWdudXAoXG4gICAgICAgICAgdXNlcixcbiAgICAgICAgICBjb2RlLFxuICAgICAgICAgIHNpZ25VcFNlc3Npb24sXG4gICAgICAgICAgY29uZmlnLFxuICAgICAgICApO1xuICAgICAgICBhd2FpdCBzZXRBdXRoQ29va2llcyhhdXRoRGF0YSk7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGF3YWl0IGNhbGxiYWNrKGF1dGhEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBzZXRBdXRoRGF0YShhdXRoRGF0YSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhyb3cgbmV3IENvZ25pdG9BdXRoRXJyb3IoXCJGYWlsZWQgdG8gY29uZmlybSBzaWduIHVwOiBcIiArIGVycik7XG4gICAgICB9XG4gICAgfSxcbiAgICBbc2lnblVwU2Vzc2lvbl0sXG4gICk7XG5cbiAgY29uc3QgcmVzZW5kQ29uZmlybWF0aW9uQ29kZSA9IHVzZUNhbGxiYWNrKGFzeW5jICh1c2VyOiBzdHJpbmcpID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgY29nbml0b1Jlc2VuZENvbmZpcm1hdGlvbkNvZGUodXNlciwgY29uZmlnKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRocm93IG5ldyBDb2duaXRvQXV0aEVycm9yKFwiRmFpbGVkIHRvIHJlc2VuZCBjb25maXJtYXRpb24gY29kZTogXCIgKyBlcnIpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIGNvbnN0IGNoYW5nZVBhc3N3b3JkID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKFxuICAgICAgcHJldlBhc3N3b3JkOiBzdHJpbmcsXG4gICAgICBuZXdQYXNzd29yZDogc3RyaW5nLFxuICAgICkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFhdXRoRGF0YSB8fCAhYXV0aERhdGEuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBhY2Nlc3MgdG9rZW4sIGlzIHVzZXIgbG9nZ2VkIGluP1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IGNvZ25pdG9DaGFuZ2VQYXNzd29yZChcbiAgICAgICAgICBhdXRoRGF0YT8uYWNjZXNzVG9rZW4sXG4gICAgICAgICAgcHJldlBhc3N3b3JkLFxuICAgICAgICAgIG5ld1Bhc3N3b3JkLFxuICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aHJvdyBuZXcgQ29nbml0b0F1dGhFcnJvcihcIkZhaWxlZCB0byByZXNldCBwYXNzd29yZDogXCIgKyBlcnIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW2F1dGhEYXRhXSxcbiAgKTtcblxuICBjb25zdCBzaWduT3V0ID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIHNldEF1dGhEYXRhKG51bGwpO1xuICAgIHNldEF1dGhTdGF0ZShBdXRoU3RhdGUuVU5BVVRIRU5USUNBVEVEKTtcbiAgICBhd2FpdCBjbGVhckF1dGhDb29raWVzKCk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBpbml0Rm9yZ290UGFzc3dvcmQgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAodXNlcm5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY29nbml0b0luaXRGb3Jnb3RQYXNzd29yZCh1c2VybmFtZSwgY29uZmlnKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH0sXG4gICAgW2NvbmZpZ11cbiAgKTtcblxuICBjb25zdCBjb25maXJtRm9yZ290UGFzc3dvcmQgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAodXNlcm5hbWU6IHN0cmluZywgbmV3UGFzc3dvcmQ6IHN0cmluZywgY29uZmlybWF0aW9uQ29kZTogc3RyaW5nKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjb2duaXRvQ29uZmlybUZvcmdvdFBhc3N3b3JkKFxuICAgICAgICAgIHVzZXJuYW1lLFxuICAgICAgICAgIG5ld1Bhc3N3b3JkLFxuICAgICAgICAgIGNvbmZpcm1hdGlvbkNvZGUsXG4gICAgICAgICAgY29uZmlnXG4gICAgICAgICk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtjb25maWddXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBhdXRoRGF0YSxcbiAgICBhdXRoU3RhdGUsXG4gICAgbG9naW4sXG4gICAgaW5pdFNpZ25VcCxcbiAgICBjb25maXJtU2lnblVwLFxuICAgIHJlc2VuZENvbmZpcm1hdGlvbkNvZGUsXG4gICAgc2lnbk91dCxcbiAgICBjaGFuZ2VQYXNzd29yZCxcbiAgICBpbml0Rm9yZ290UGFzc3dvcmQsXG4gICAgY29uZmlybUZvcmdvdFBhc3N3b3JkLFxuICB9O1xufTtcblxuZXhwb3J0IHsgQ29uZmlnLCBBdXRoU3RhdGUsIEF1dGhEYXRhLCBDb2duaXRvQXV0aEVycm9yIH07XG4iXX0=