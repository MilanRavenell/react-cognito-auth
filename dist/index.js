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
    const changePassword = (0, react_1.useCallback)(async (prevPassword, newPassword, newPasswrdConfirm) => {
        try {
            if (!authData || !authData.accessToken) {
                throw new Error("No access token, is user logged in?");
            }
            await (0, cognito_change_password_1.cognitoChangePassword)(authData?.accessToken, prevPassword, newPassword, newPasswrdConfirm, config);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQXlEO0FBQ3pELCtDQUkyQjtBQUMzQixpR0FBMEY7QUFDMUYsK0RBQW9GO0FBQ3BGLGlHQUEyRjtBQUMzRiwyRUFBc0U7QUFDdEUsK0VBQTBFO0FBQzFFLG1DQUF3RTtBQTRNdkQsMEZBNU1FLGlCQUFTLE9BNE1GO0FBQVksaUdBNU1BLHdCQUFnQixPQTRNQTtBQTNNdEQsK0VBRzJDO0FBK0JwQyxNQUFNLGNBQWMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFxQixFQUFlLEVBQUU7SUFDM0UsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQWtCLElBQUksQ0FBQyxDQUFDO0lBQ2hFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFZLGlCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEUsTUFBTSxDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBZ0IsSUFBSSxDQUFDLENBQUM7SUFFeEUsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDVixJQUFJLENBQUM7Z0JBQ0gsSUFBSSxjQUFjLEdBQUcsTUFBTSxJQUFBLHdCQUFjLEdBQUUsQ0FBQztnQkFDNUMsSUFBSSxjQUFjLEVBQUUsQ0FBQztvQkFDbkIsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFBLDJDQUFtQixFQUM3QyxjQUFjLEVBQ2QsTUFBTSxDQUNQLENBQUM7b0JBQ0YsY0FBYyxHQUFHO3dCQUNmLEdBQUcsY0FBYzt3QkFDakIsV0FBVyxFQUFFLGFBQWEsQ0FBQyxXQUFXO3FCQUN2QyxDQUFDO29CQUVGLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFDNUIsWUFBWSxDQUFDLGlCQUFT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QUFDO1FBQ3BELENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2YsTUFBTSxLQUFLLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQyxFQUNELENBQUMsTUFBTSxDQUFDLENBQ1QsQ0FBQztJQUVGLE1BQU0scUJBQXFCLEdBQUcsSUFBQSxtQkFBVyxFQUN2QyxLQUFLLEVBQUUsUUFBZ0IsRUFBRSxXQUFtQixFQUFFLGdCQUF3QixFQUFFLEVBQUU7UUFDeEUsSUFBSSxDQUFDO1lBQ0gsTUFBTSxJQUFBLHNEQUE0QixFQUNoQyxRQUFRLEVBQ1IsV0FBVyxFQUNYLGdCQUFnQixFQUNoQixNQUFNLENBQ1AsQ0FBQztRQUNKLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2YsTUFBTSxLQUFLLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQyxFQUNELENBQUMsTUFBTSxDQUFDLENBQ1QsQ0FBQztJQUVGLE9BQU87UUFDTCxRQUFRO1FBQ1IsU0FBUztRQUNULEtBQUs7UUFDTCxVQUFVO1FBQ1YsYUFBYTtRQUNiLHNCQUFzQjtRQUN0QixPQUFPO1FBQ1AsY0FBYztRQUNkLGtCQUFrQjtRQUNsQixxQkFBcUI7S0FDdEIsQ0FBQztBQUNKLENBQUMsQ0FBQztBQXZLVyxRQUFBLGNBQWMsa0JBdUt6QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUsIHVzZUNhbGxiYWNrIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge1xuICBnZXRBdXRoQ29va2llcyxcbiAgY2xlYXJBdXRoQ29va2llcyxcbiAgc2V0QXV0aENvb2tpZXMsXG59IGZyb20gXCIuL2FjdGlvbnMvY29va2llc1wiO1xuaW1wb3J0IHsgY29nbml0b0xvZ2luVXNlclBhc3N3b3JkQXV0aCB9IGZyb20gXCIuL2FjdGlvbnMvY29nbml0by1sb2dpbi11c2VyLXBhc3N3b3JkLWF1dGhcIjtcbmltcG9ydCB7IGNvZ25pdG9Jbml0U2lnbnVwLCBjb2duaXRvQ29uZmlybVNpZ251cCB9IGZyb20gXCIuL2FjdGlvbnMvY29nbml0by1zaWduLXVwXCI7XG5pbXBvcnQgeyBjb2duaXRvUmVzZW5kQ29uZmlybWF0aW9uQ29kZSB9IGZyb20gXCIuL2FjdGlvbnMvY29nbml0by1yZXNlbmQtY29uZmlybWF0aW9uLWNvZGVcIjtcbmltcG9ydCB7IGNvZ25pdG9SZWZyZXNoVG9rZW4gfSBmcm9tIFwiLi9hY3Rpb25zL2NvZ25pdG8tcmVmcmVzaC10b2tlblwiO1xuaW1wb3J0IHsgY29nbml0b0NoYW5nZVBhc3N3b3JkIH0gZnJvbSBcIi4vYWN0aW9ucy9jb2duaXRvLWNoYW5nZS1wYXNzd29yZFwiO1xuaW1wb3J0IHsgQXV0aERhdGEsIEF1dGhTdGF0ZSwgQ29uZmlnLCBDb2duaXRvQXV0aEVycm9yIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IFxuICBjb2duaXRvSW5pdEZvcmdvdFBhc3N3b3JkLFxuICBjb2duaXRvQ29uZmlybUZvcmdvdFBhc3N3b3JkIFxufSBmcm9tICcuL2FjdGlvbnMvY29nbml0by1mb3Jnb3QtcGFzc3dvcmQnO1xuXG5pbnRlcmZhY2UgQ29nbml0b0F1dGhQYXJhbXMge1xuICBjb25maWc6IENvbmZpZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb2duaXRvQXV0aCB7XG4gIGF1dGhEYXRhOiBBdXRoRGF0YSB8IG51bGw7XG4gIGF1dGhTdGF0ZTogQXV0aFN0YXRlO1xuICBsb2dpbjogKHVzZXI6IHN0cmluZywgcGFzczogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBpbml0U2lnblVwOiAoXG4gICAgdXNlcjogc3RyaW5nLFxuICAgIHBhc3M6IHN0cmluZyxcbiAgICBwYXNzQ29uZmlybTogc3RyaW5nLFxuICApID0+IFByb21pc2U8dm9pZD47XG4gIGNvbmZpcm1TaWduVXA6IChcbiAgICB1c2VyOiBzdHJpbmcsXG4gICAgY29kZTogc3RyaW5nLFxuICAgIGNhbGxiYWNrPzogKGF1dGhEYXRhOiBBdXRoRGF0YSkgPT4gUHJvbWlzZTx2b2lkPixcbiAgKSA9PiBQcm9taXNlPHZvaWQ+O1xuICByZXNlbmRDb25maXJtYXRpb25Db2RlOiAodXNlcjogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBzaWduT3V0OiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBjaGFuZ2VQYXNzd29yZDogKFxuICAgIHByZXZQYXNzd29yZDogc3RyaW5nLFxuICAgIG5ld1Bhc3N3b3JkOiBzdHJpbmcsXG4gICAgbmV3UGFzc3dyZENvbmZpcm06IHN0cmluZyxcbiAgKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBpbml0Rm9yZ290UGFzc3dvcmQ6ICh1c2VybmFtZTogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBjb25maXJtRm9yZ290UGFzc3dvcmQ6ICh1c2VybmFtZTogc3RyaW5nLCBuZXdQYXNzd29yZDogc3RyaW5nLCBjb25maXJtYXRpb25Db2RlOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG59XG5cbmV4cG9ydCBjb25zdCB1c2VDb2duaXRvQXV0aCA9ICh7IGNvbmZpZyB9OiBDb2duaXRvQXV0aFBhcmFtcyk6IENvZ25pdG9BdXRoID0+IHtcbiAgY29uc3QgW2F1dGhEYXRhLCBzZXRBdXRoRGF0YV0gPSB1c2VTdGF0ZTxBdXRoRGF0YSB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbYXV0aFN0YXRlLCBzZXRBdXRoU3RhdGVdID0gdXNlU3RhdGU8QXV0aFN0YXRlPihBdXRoU3RhdGUuSU5JVCk7XG4gIGNvbnN0IFtzaWduVXBTZXNzaW9uLCBzZXRTaWduVXBTZXNzaW9uXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBjb29raWVBdXRoRGF0YSA9IGF3YWl0IGdldEF1dGhDb29raWVzKCk7XG4gICAgICAgIGlmIChjb29raWVBdXRoRGF0YSkge1xuICAgICAgICAgIGNvbnN0IHJlZnJlc2hUb2tlbnMgPSBhd2FpdCBjb2duaXRvUmVmcmVzaFRva2VuKFxuICAgICAgICAgICAgY29va2llQXV0aERhdGEsXG4gICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb29raWVBdXRoRGF0YSA9IHtcbiAgICAgICAgICAgIC4uLmNvb2tpZUF1dGhEYXRhLFxuICAgICAgICAgICAgYWNjZXNzVG9rZW46IHJlZnJlc2hUb2tlbnMuYWNjZXNzVG9rZW4sXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHNldEF1dGhEYXRhKGNvb2tpZUF1dGhEYXRhKTtcbiAgICAgICAgICBzZXRBdXRoU3RhdGUoQXV0aFN0YXRlLkFVVEhFTlRJQ0FURUQpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhyb3cgbmV3IENvZ25pdG9BdXRoRXJyb3IoXCJGYWlsZWQgdG8gdmFsaWRhdGUgYWNjZXNzIHRva2VuOiBcIiArIGVycik7XG4gICAgICB9XG5cbiAgICAgIHNldEF1dGhTdGF0ZShBdXRoU3RhdGUuVU5BVVRIRU5USUNBVEVEKTtcbiAgICB9KSgpO1xuICB9LCBbXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoYXV0aERhdGEpIHtcbiAgICAgIHNldEF1dGhTdGF0ZShBdXRoU3RhdGUuQVVUSEVOVElDQVRFRCk7XG4gICAgfVxuICB9LCBbYXV0aERhdGFdKTtcblxuICBjb25zdCBsb2dpbiA9IHVzZUNhbGxiYWNrKGFzeW5jICh1c2VyOiBzdHJpbmcsIHBhc3M6IHN0cmluZykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBhdXRoRGF0YSA9IGF3YWl0IGNvZ25pdG9Mb2dpblVzZXJQYXNzd29yZEF1dGgodXNlciwgcGFzcywgY29uZmlnKTtcbiAgICAgIGF3YWl0IHNldEF1dGhDb29raWVzKGF1dGhEYXRhKTtcbiAgICAgIHNldEF1dGhEYXRhKGF1dGhEYXRhKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRocm93IG5ldyBDb2duaXRvQXV0aEVycm9yKFwiRmFpbGVkIHRvIGxvZ2luOiBcIiArIGVycik7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgY29uc3QgaW5pdFNpZ25VcCA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jICh1c2VyOiBzdHJpbmcsIHBhc3M6IHN0cmluZykgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGNvZ25pdG9Jbml0U2lnbnVwKHVzZXIsIHBhc3MsIGNvbmZpZyk7XG4gICAgICAgIGlmIChzZXNzaW9uKSB7XG4gICAgICAgICAgc2V0U2lnblVwU2Vzc2lvbihzZXNzaW9uKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRocm93IG5ldyBDb2duaXRvQXV0aEVycm9yKFwiRmFpbGVkIHRvIHNpZ24gdXA6IFwiICsgZXJyKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtdLFxuICApO1xuXG4gIGNvbnN0IGNvbmZpcm1TaWduVXAgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoXG4gICAgICB1c2VyOiBzdHJpbmcsXG4gICAgICBjb2RlOiBzdHJpbmcsXG4gICAgICBjYWxsYmFjaz86IChhdXRoRGF0YTogQXV0aERhdGEpID0+IFByb21pc2U8dm9pZD4sXG4gICAgKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIXNpZ25VcFNlc3Npb24pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVc2VyIGhhcyBub3Qgc3RhcnRlZCBzaWduIHVwXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXV0aERhdGEgPSBhd2FpdCBjb2duaXRvQ29uZmlybVNpZ251cChcbiAgICAgICAgICB1c2VyLFxuICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgc2lnblVwU2Vzc2lvbixcbiAgICAgICAgICBjb25maWcsXG4gICAgICAgICk7XG4gICAgICAgIGF3YWl0IHNldEF1dGhDb29raWVzKGF1dGhEYXRhKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgYXdhaXQgY2FsbGJhY2soYXV0aERhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHNldEF1dGhEYXRhKGF1dGhEYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aHJvdyBuZXcgQ29nbml0b0F1dGhFcnJvcihcIkZhaWxlZCB0byBjb25maXJtIHNpZ24gdXA6IFwiICsgZXJyKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtzaWduVXBTZXNzaW9uXSxcbiAgKTtcblxuICBjb25zdCByZXNlbmRDb25maXJtYXRpb25Db2RlID0gdXNlQ2FsbGJhY2soYXN5bmMgKHVzZXI6IHN0cmluZykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBjb2duaXRvUmVzZW5kQ29uZmlybWF0aW9uQ29kZSh1c2VyLCBjb25maWcpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhyb3cgbmV3IENvZ25pdG9BdXRoRXJyb3IoXCJGYWlsZWQgdG8gcmVzZW5kIGNvbmZpcm1hdGlvbiBjb2RlOiBcIiArIGVycik7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgY29uc3QgY2hhbmdlUGFzc3dvcmQgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoXG4gICAgICBwcmV2UGFzc3dvcmQ6IHN0cmluZyxcbiAgICAgIG5ld1Bhc3N3b3JkOiBzdHJpbmcsXG4gICAgICBuZXdQYXNzd3JkQ29uZmlybTogc3RyaW5nLFxuICAgICkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFhdXRoRGF0YSB8fCAhYXV0aERhdGEuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBhY2Nlc3MgdG9rZW4sIGlzIHVzZXIgbG9nZ2VkIGluP1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IGNvZ25pdG9DaGFuZ2VQYXNzd29yZChcbiAgICAgICAgICBhdXRoRGF0YT8uYWNjZXNzVG9rZW4sXG4gICAgICAgICAgcHJldlBhc3N3b3JkLFxuICAgICAgICAgIG5ld1Bhc3N3b3JkLFxuICAgICAgICAgIG5ld1Bhc3N3cmRDb25maXJtLFxuICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aHJvdyBuZXcgQ29nbml0b0F1dGhFcnJvcihcIkZhaWxlZCB0byByZXNldCBwYXNzd29yZDogXCIgKyBlcnIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW2F1dGhEYXRhXSxcbiAgKTtcblxuICBjb25zdCBzaWduT3V0ID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIHNldEF1dGhEYXRhKG51bGwpO1xuICAgIHNldEF1dGhTdGF0ZShBdXRoU3RhdGUuVU5BVVRIRU5USUNBVEVEKTtcbiAgICBhd2FpdCBjbGVhckF1dGhDb29raWVzKCk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBpbml0Rm9yZ290UGFzc3dvcmQgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAodXNlcm5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY29nbml0b0luaXRGb3Jnb3RQYXNzd29yZCh1c2VybmFtZSwgY29uZmlnKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH0sXG4gICAgW2NvbmZpZ11cbiAgKTtcblxuICBjb25zdCBjb25maXJtRm9yZ290UGFzc3dvcmQgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAodXNlcm5hbWU6IHN0cmluZywgbmV3UGFzc3dvcmQ6IHN0cmluZywgY29uZmlybWF0aW9uQ29kZTogc3RyaW5nKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjb2duaXRvQ29uZmlybUZvcmdvdFBhc3N3b3JkKFxuICAgICAgICAgIHVzZXJuYW1lLFxuICAgICAgICAgIG5ld1Bhc3N3b3JkLFxuICAgICAgICAgIGNvbmZpcm1hdGlvbkNvZGUsXG4gICAgICAgICAgY29uZmlnXG4gICAgICAgICk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtjb25maWddXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBhdXRoRGF0YSxcbiAgICBhdXRoU3RhdGUsXG4gICAgbG9naW4sXG4gICAgaW5pdFNpZ25VcCxcbiAgICBjb25maXJtU2lnblVwLFxuICAgIHJlc2VuZENvbmZpcm1hdGlvbkNvZGUsXG4gICAgc2lnbk91dCxcbiAgICBjaGFuZ2VQYXNzd29yZCxcbiAgICBpbml0Rm9yZ290UGFzc3dvcmQsXG4gICAgY29uZmlybUZvcmdvdFBhc3N3b3JkLFxuICB9O1xufTtcblxuZXhwb3J0IHsgQ29uZmlnLCBBdXRoU3RhdGUsIEF1dGhEYXRhLCBDb2duaXRvQXV0aEVycm9yIH07XG4iXX0=