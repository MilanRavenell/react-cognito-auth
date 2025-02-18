"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCognitoAuth = void 0;
const react_1 = require("react");
const cookies_1 = require("./actions/cookies");
const cognito_login_user_password_auth_1 = require("./actions/cognito-login-user-password-auth");
const cognito_sign_up_1 = require("./actions/cognito-sign-up");
const cognito_confirm_sign_up_1 = require("./actions/cognito-confirm-sign-up");
const cognito_resend_confirmation_code_1 = require("./actions/cognito-resend-confirmation-code");
const cognito_validate_access_token_1 = require("./actions/cognito-validate-access-token");
const cognito_refresh_token_1 = require("./actions/cognito-refresh-token");
const cognito_change_password_1 = require("./actions/cognito-change-password");
const types_1 = require("./types");
const useCognitoAuth = ({ config }) => {
    const [authData, setAuthData] = (0, react_1.useState)(null);
    const [authState, setAuthState] = (0, react_1.useState)(types_1.AuthState.INIT);
    (0, react_1.useEffect)(() => {
        (async () => {
            try {
                let cookieAuthData = await (0, cookies_1.getAuthCookies)();
                if (cookieAuthData) {
                    if (!(await (0, cognito_validate_access_token_1.cognitoValidateAccessToken)(cookieAuthData.accessToken, config))) {
                        const refreshTokens = await (0, cognito_refresh_token_1.cognitoRefreshToken)(cookieAuthData, config);
                        cookieAuthData = {
                            ...cookieAuthData,
                            accessToken: refreshTokens.accessToken,
                        };
                    }
                    setAuthData(cookieAuthData);
                    return;
                }
            }
            catch (err) {
                console.error("Failed to validate access token", err);
            }
            setAuthState(types_1.AuthState.UNAUTHENTICATED);
        })();
    }, []);
    (0, react_1.useEffect)(() => {
        (async () => {
            if (authData) {
                if (await (0, cognito_validate_access_token_1.cognitoValidateAccessToken)(authData.accessToken, config)) {
                    setAuthState(types_1.AuthState.AUTHENTICATED);
                    return;
                }
                setAuthState(types_1.AuthState.UNAUTHENTICATED);
            }
        })();
    }, [authData]);
    const login = (0, react_1.useCallback)(async (user, pass) => {
        try {
            const authData = await (0, cognito_login_user_password_auth_1.cognitoLoginUserPasswordAuth)(user, pass, config);
            await (0, cookies_1.setAuthCookies)(authData);
            setAuthData(authData);
        }
        catch (err) {
            console.error("Failed to login", err);
            throw new Error("Failed to login");
        }
    }, []);
    const initSignUp = (0, react_1.useCallback)(async (user, pass, passConfirm) => {
        try {
            await (0, cognito_sign_up_1.cognitoSignup)(user, pass, passConfirm, config);
        }
        catch (err) {
            console.error("Failed to sign up", err);
            throw new Error("Failed to sign up");
        }
    }, []);
    const confirmSignUp = (0, react_1.useCallback)(async (user, code, callback) => {
        try {
            const authData = await (0, cognito_confirm_sign_up_1.cognitoConfirmSignup)(user, code, config);
            await (0, cookies_1.setAuthCookies)(authData);
            if (callback) {
                await callback(authData);
            }
            setAuthData(authData);
        }
        catch (err) {
            console.error("Failed to confirm sign up", err);
            throw new Error("Failed to confirm sign up");
        }
    }, []);
    const resendConfirmationCode = (0, react_1.useCallback)(async (user) => {
        try {
            await (0, cognito_resend_confirmation_code_1.cognitoResendConfirmationCode)(user, config);
        }
        catch (err) {
            console.error("Failed to resend confirmation code", err);
            throw new Error("Failed to resend confirmation code");
        }
    }, []);
    const changePassword = (0, react_1.useCallback)(async (prevPassword, newPassword, newPasswrdConfirm) => {
        try {
            if (!authData || !authData.accessToken) {
                throw new Error("No access token");
            }
            await (0, cognito_change_password_1.cognitoChangePassword)(authData?.accessToken, prevPassword, newPassword, newPasswrdConfirm, config);
        }
        catch (err) {
            console.error("Failed to reset password", err);
            throw new Error("Failed to reset password");
        }
    }, [authData]);
    const signOut = (0, react_1.useCallback)(async () => {
        setAuthData(null);
        setAuthState(types_1.AuthState.UNAUTHENTICATED);
        await (0, cookies_1.clearAuthCookies)();
    }, []);
    return {
        authData,
        authState,
        login,
        initSignUp,
        confirmSignUp,
        resendConfirmationCode,
        signOut,
        changePassword,
    };
};
exports.useCognitoAuth = useCognitoAuth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQXlEO0FBQ3pELCtDQUkyQjtBQUMzQixpR0FBMEY7QUFDMUYsK0RBQTBEO0FBQzFELCtFQUF5RTtBQUN6RSxpR0FBMkY7QUFDM0YsMkZBQXFGO0FBQ3JGLDJFQUFzRTtBQUN0RSwrRUFBMEU7QUFDMUUsbUNBQXNEO0FBNkIvQyxNQUFNLGNBQWMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFxQixFQUFlLEVBQUU7SUFDM0UsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQWtCLElBQUksQ0FBQyxDQUFDO0lBQ2hFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFZLGlCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFdEUsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDVixJQUFJLENBQUM7Z0JBQ0gsSUFBSSxjQUFjLEdBQUcsTUFBTSxJQUFBLHdCQUFjLEdBQUUsQ0FBQztnQkFDNUMsSUFBSSxjQUFjLEVBQUUsQ0FBQztvQkFDbkIsSUFDRSxDQUFDLENBQUMsTUFBTSxJQUFBLDBEQUEwQixFQUNoQyxjQUFjLENBQUMsV0FBVyxFQUMxQixNQUFNLENBQ1AsQ0FBQyxFQUNGLENBQUM7d0JBQ0QsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFBLDJDQUFtQixFQUM3QyxjQUFjLEVBQ2QsTUFBTSxDQUNQLENBQUM7d0JBQ0YsY0FBYyxHQUFHOzRCQUNmLEdBQUcsY0FBYzs0QkFDakIsV0FBVyxFQUFFLGFBQWEsQ0FBQyxXQUFXO3lCQUN2QyxDQUFDO29CQUNKLENBQUM7b0JBQ0QsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUM1QixPQUFPO2dCQUNULENBQUM7WUFDSCxDQUFDO1lB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LDBCQUFnQixHQUFFLENBQUM7SUFDM0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRVAsT0FBTztRQUNMLFFBQVE7UUFDUixTQUFTO1FBQ1QsS0FBSztRQUNMLFVBQVU7UUFDVixhQUFhO1FBQ2Isc0JBQXNCO1FBQ3RCLE9BQU87UUFDUCxjQUFjO0tBQ2YsQ0FBQztBQUNKLENBQUMsQ0FBQztBQS9JVyxRQUFBLGNBQWMsa0JBK0l6QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUsIHVzZUNhbGxiYWNrIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge1xuICBnZXRBdXRoQ29va2llcyxcbiAgY2xlYXJBdXRoQ29va2llcyxcbiAgc2V0QXV0aENvb2tpZXMsXG59IGZyb20gXCIuL2FjdGlvbnMvY29va2llc1wiO1xuaW1wb3J0IHsgY29nbml0b0xvZ2luVXNlclBhc3N3b3JkQXV0aCB9IGZyb20gXCIuL2FjdGlvbnMvY29nbml0by1sb2dpbi11c2VyLXBhc3N3b3JkLWF1dGhcIjtcbmltcG9ydCB7IGNvZ25pdG9TaWdudXAgfSBmcm9tIFwiLi9hY3Rpb25zL2NvZ25pdG8tc2lnbi11cFwiO1xuaW1wb3J0IHsgY29nbml0b0NvbmZpcm1TaWdudXAgfSBmcm9tIFwiLi9hY3Rpb25zL2NvZ25pdG8tY29uZmlybS1zaWduLXVwXCI7XG5pbXBvcnQgeyBjb2duaXRvUmVzZW5kQ29uZmlybWF0aW9uQ29kZSB9IGZyb20gXCIuL2FjdGlvbnMvY29nbml0by1yZXNlbmQtY29uZmlybWF0aW9uLWNvZGVcIjtcbmltcG9ydCB7IGNvZ25pdG9WYWxpZGF0ZUFjY2Vzc1Rva2VuIH0gZnJvbSBcIi4vYWN0aW9ucy9jb2duaXRvLXZhbGlkYXRlLWFjY2Vzcy10b2tlblwiO1xuaW1wb3J0IHsgY29nbml0b1JlZnJlc2hUb2tlbiB9IGZyb20gXCIuL2FjdGlvbnMvY29nbml0by1yZWZyZXNoLXRva2VuXCI7XG5pbXBvcnQgeyBjb2duaXRvQ2hhbmdlUGFzc3dvcmQgfSBmcm9tIFwiLi9hY3Rpb25zL2NvZ25pdG8tY2hhbmdlLXBhc3N3b3JkXCI7XG5pbXBvcnQgeyBBdXRoRGF0YSwgQXV0aFN0YXRlLCBDb25maWcgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbnRlcmZhY2UgQ29nbml0b0F1dGhQYXJhbXMge1xuICBjb25maWc6IENvbmZpZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb2duaXRvQXV0aCB7XG4gIGF1dGhEYXRhOiBBdXRoRGF0YSB8IG51bGw7XG4gIGF1dGhTdGF0ZTogQXV0aFN0YXRlO1xuICBsb2dpbjogKHVzZXI6IHN0cmluZywgcGFzczogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBpbml0U2lnblVwOiAoXG4gICAgdXNlcjogc3RyaW5nLFxuICAgIHBhc3M6IHN0cmluZyxcbiAgICBwYXNzQ29uZmlybTogc3RyaW5nLFxuICApID0+IFByb21pc2U8dm9pZD47XG4gIGNvbmZpcm1TaWduVXA6IChcbiAgICB1c2VyOiBzdHJpbmcsXG4gICAgY29kZTogc3RyaW5nLFxuICAgIGNhbGxiYWNrPzogKGF1dGhEYXRhOiBBdXRoRGF0YSkgPT4gUHJvbWlzZTx2b2lkPixcbiAgKSA9PiBQcm9taXNlPHZvaWQ+O1xuICByZXNlbmRDb25maXJtYXRpb25Db2RlOiAodXNlcjogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBzaWduT3V0OiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBjaGFuZ2VQYXNzd29yZDogKFxuICAgIHByZXZQYXNzd29yZDogc3RyaW5nLFxuICAgIG5ld1Bhc3N3b3JkOiBzdHJpbmcsXG4gICAgbmV3UGFzc3dyZENvbmZpcm06IHN0cmluZyxcbiAgKSA9PiBQcm9taXNlPHZvaWQ+O1xufVxuXG5leHBvcnQgY29uc3QgdXNlQ29nbml0b0F1dGggPSAoeyBjb25maWcgfTogQ29nbml0b0F1dGhQYXJhbXMpOiBDb2duaXRvQXV0aCA9PiB7XG4gIGNvbnN0IFthdXRoRGF0YSwgc2V0QXV0aERhdGFdID0gdXNlU3RhdGU8QXV0aERhdGEgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW2F1dGhTdGF0ZSwgc2V0QXV0aFN0YXRlXSA9IHVzZVN0YXRlPEF1dGhTdGF0ZT4oQXV0aFN0YXRlLklOSVQpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBjb29raWVBdXRoRGF0YSA9IGF3YWl0IGdldEF1dGhDb29raWVzKCk7XG4gICAgICAgIGlmIChjb29raWVBdXRoRGF0YSkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICEoYXdhaXQgY29nbml0b1ZhbGlkYXRlQWNjZXNzVG9rZW4oXG4gICAgICAgICAgICAgIGNvb2tpZUF1dGhEYXRhLmFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICApKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY29uc3QgcmVmcmVzaFRva2VucyA9IGF3YWl0IGNvZ25pdG9SZWZyZXNoVG9rZW4oXG4gICAgICAgICAgICAgIGNvb2tpZUF1dGhEYXRhLFxuICAgICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29va2llQXV0aERhdGEgPSB7XG4gICAgICAgICAgICAgIC4uLmNvb2tpZUF1dGhEYXRhLFxuICAgICAgICAgICAgICBhY2Nlc3NUb2tlbjogcmVmcmVzaFRva2Vucy5hY2Nlc3NUb2tlbixcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHNldEF1dGhEYXRhKGNvb2tpZUF1dGhEYXRhKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHZhbGlkYXRlIGFjY2VzcyB0b2tlblwiLCBlcnIpO1xuICAgICAgfVxuXG4gICAgICBzZXRBdXRoU3RhdGUoQXV0aFN0YXRlLlVOQVVUSEVOVElDQVRFRCk7XG4gICAgfSkoKTtcbiAgfSwgW10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgICBpZiAoYXdhaXQgY29nbml0b1ZhbGlkYXRlQWNjZXNzVG9rZW4oYXV0aERhdGEuYWNjZXNzVG9rZW4sIGNvbmZpZykpIHtcbiAgICAgICAgICBzZXRBdXRoU3RhdGUoQXV0aFN0YXRlLkFVVEhFTlRJQ0FURUQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldEF1dGhTdGF0ZShBdXRoU3RhdGUuVU5BVVRIRU5USUNBVEVEKTtcbiAgICAgIH1cbiAgICB9KSgpO1xuICB9LCBbYXV0aERhdGFdKTtcblxuICBjb25zdCBsb2dpbiA9IHVzZUNhbGxiYWNrKGFzeW5jICh1c2VyOiBzdHJpbmcsIHBhc3M6IHN0cmluZykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBhdXRoRGF0YSA9IGF3YWl0IGNvZ25pdG9Mb2dpblVzZXJQYXNzd29yZEF1dGgodXNlciwgcGFzcywgY29uZmlnKTtcbiAgICAgIGF3YWl0IHNldEF1dGhDb29raWVzKGF1dGhEYXRhKTtcbiAgICAgIHNldEF1dGhEYXRhKGF1dGhEYXRhKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gbG9naW5cIiwgZXJyKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBsb2dpblwiKTtcbiAgICB9XG4gIH0sIFtdKTtcblxuICBjb25zdCBpbml0U2lnblVwID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKHVzZXI6IHN0cmluZywgcGFzczogc3RyaW5nLCBwYXNzQ29uZmlybTogc3RyaW5nKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjb2duaXRvU2lnbnVwKHVzZXIsIHBhc3MsIHBhc3NDb25maXJtLCBjb25maWcpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gc2lnbiB1cFwiLCBlcnIpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gc2lnbiB1cFwiKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtdLFxuICApO1xuXG4gIGNvbnN0IGNvbmZpcm1TaWduVXAgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoXG4gICAgICB1c2VyOiBzdHJpbmcsXG4gICAgICBjb2RlOiBzdHJpbmcsXG4gICAgICBjYWxsYmFjaz86IChhdXRoRGF0YTogQXV0aERhdGEpID0+IFByb21pc2U8dm9pZD4sXG4gICAgKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBhdXRoRGF0YSA9IGF3YWl0IGNvZ25pdG9Db25maXJtU2lnbnVwKHVzZXIsIGNvZGUsIGNvbmZpZyk7XG4gICAgICAgIGF3YWl0IHNldEF1dGhDb29raWVzKGF1dGhEYXRhKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgYXdhaXQgY2FsbGJhY2soYXV0aERhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHNldEF1dGhEYXRhKGF1dGhEYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGNvbmZpcm0gc2lnbiB1cFwiLCBlcnIpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gY29uZmlybSBzaWduIHVwXCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW10sXG4gICk7XG5cbiAgY29uc3QgcmVzZW5kQ29uZmlybWF0aW9uQ29kZSA9IHVzZUNhbGxiYWNrKGFzeW5jICh1c2VyOiBzdHJpbmcpID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgY29nbml0b1Jlc2VuZENvbmZpcm1hdGlvbkNvZGUodXNlciwgY29uZmlnKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gcmVzZW5kIGNvbmZpcm1hdGlvbiBjb2RlXCIsIGVycik7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gcmVzZW5kIGNvbmZpcm1hdGlvbiBjb2RlXCIpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIGNvbnN0IGNoYW5nZVBhc3N3b3JkID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKFxuICAgICAgcHJldlBhc3N3b3JkOiBzdHJpbmcsXG4gICAgICBuZXdQYXNzd29yZDogc3RyaW5nLFxuICAgICAgbmV3UGFzc3dyZENvbmZpcm06IHN0cmluZyxcbiAgICApID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICghYXV0aERhdGEgfHwgIWF1dGhEYXRhLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gYWNjZXNzIHRva2VuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgY29nbml0b0NoYW5nZVBhc3N3b3JkKFxuICAgICAgICAgIGF1dGhEYXRhPy5hY2Nlc3NUb2tlbixcbiAgICAgICAgICBwcmV2UGFzc3dvcmQsXG4gICAgICAgICAgbmV3UGFzc3dvcmQsXG4gICAgICAgICAgbmV3UGFzc3dyZENvbmZpcm0sXG4gICAgICAgICAgY29uZmlnLFxuICAgICAgICApO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gcmVzZXQgcGFzc3dvcmRcIiwgZXJyKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIHJlc2V0IHBhc3N3b3JkXCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW2F1dGhEYXRhXSxcbiAgKTtcblxuICBjb25zdCBzaWduT3V0ID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIHNldEF1dGhEYXRhKG51bGwpO1xuICAgIHNldEF1dGhTdGF0ZShBdXRoU3RhdGUuVU5BVVRIRU5USUNBVEVEKTtcbiAgICBhd2FpdCBjbGVhckF1dGhDb29raWVzKCk7XG4gIH0sIFtdKTtcblxuICByZXR1cm4ge1xuICAgIGF1dGhEYXRhLFxuICAgIGF1dGhTdGF0ZSxcbiAgICBsb2dpbixcbiAgICBpbml0U2lnblVwLFxuICAgIGNvbmZpcm1TaWduVXAsXG4gICAgcmVzZW5kQ29uZmlybWF0aW9uQ29kZSxcbiAgICBzaWduT3V0LFxuICAgIGNoYW5nZVBhc3N3b3JkLFxuICB9O1xufTtcbiJdfQ==