"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoAuthError = exports.AuthState = exports.useCognitoAuth = void 0;
const react_1 = require("react");
const cookies_1 = require("./actions/cookies");
const cognito_login_user_password_auth_1 = require("./actions/cognito-login-user-password-auth");
const cognito_sign_up_1 = require("./actions/cognito-sign-up");
const cognito_confirm_sign_up_1 = require("./actions/cognito-confirm-sign-up");
const cognito_resend_confirmation_code_1 = require("./actions/cognito-resend-confirmation-code");
const cognito_refresh_token_1 = require("./actions/cognito-refresh-token");
const cognito_change_password_1 = require("./actions/cognito-change-password");
const types_1 = require("./types");
Object.defineProperty(exports, "AuthState", { enumerable: true, get: function () { return types_1.AuthState; } });
Object.defineProperty(exports, "CognitoAuthError", { enumerable: true, get: function () { return types_1.CognitoAuthError; } });
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
    const initSignUp = (0, react_1.useCallback)(async (user, pass, passConfirm) => {
        try {
            const session = await (0, cognito_sign_up_1.cognitoSignup)(user, pass, passConfirm, config);
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
            const authData = await (0, cognito_confirm_sign_up_1.cognitoConfirmSignup)(user, code, signUpSession, config);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQXlEO0FBQ3pELCtDQUkyQjtBQUMzQixpR0FBMEY7QUFDMUYsK0RBQTBEO0FBQzFELCtFQUF5RTtBQUN6RSxpR0FBMkY7QUFDM0YsMkVBQXNFO0FBQ3RFLCtFQUEwRTtBQUMxRSxtQ0FBd0U7QUF5S3ZELDBGQXpLRSxpQkFBUyxPQXlLRjtBQUFZLGlHQXpLQSx3QkFBZ0IsT0F5S0E7QUE1SS9DLE1BQU0sY0FBYyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQXFCLEVBQWUsRUFBRTtJQUMzRSxNQUFNLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBa0IsSUFBSSxDQUFDLENBQUM7SUFDaEUsTUFBTSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQVksaUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0RSxNQUFNLENBQUMsYUFBYSxFQUFFLGdCQUFnQixDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFnQixJQUFJLENBQUMsQ0FBQztJQUV4RSxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNWLElBQUksQ0FBQztnQkFDSCxJQUFJLGNBQWMsR0FBRyxNQUFNLElBQUEsd0JBQWMsR0FBRSxDQUFDO2dCQUM1QyxJQUFJLGNBQWMsRUFBRSxDQUFDO29CQUNuQixNQUFNLGFBQWEsR0FBRyxNQUFNLElBQUEsMkNBQW1CLEVBQzdDLGNBQWMsRUFDZCxNQUFNLENBQ1AsQ0FBQztvQkFDRixjQUFjLEdBQUc7d0JBQ2YsR0FBRyxjQUFjO3dCQUNqQixXQUFXLEVBQUUsYUFBYSxDQUFDLFdBQVc7cUJBQ3ZDLENBQUM7b0JBRUYsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUM1QixZQUFZLENBQUMsaUJBQVMs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QUMsQ0FBQztBQTFJVyxRQUFBLGNBQWMsa0JBMEl6QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUsIHVzZUNhbGxiYWNrIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge1xuICBnZXRBdXRoQ29va2llcyxcbiAgY2xlYXJBdXRoQ29va2llcyxcbiAgc2V0QXV0aENvb2tpZXMsXG59IGZyb20gXCIuL2FjdGlvbnMvY29va2llc1wiO1xuaW1wb3J0IHsgY29nbml0b0xvZ2luVXNlclBhc3N3b3JkQXV0aCB9IGZyb20gXCIuL2FjdGlvbnMvY29nbml0by1sb2dpbi11c2VyLXBhc3N3b3JkLWF1dGhcIjtcbmltcG9ydCB7IGNvZ25pdG9TaWdudXAgfSBmcm9tIFwiLi9hY3Rpb25zL2NvZ25pdG8tc2lnbi11cFwiO1xuaW1wb3J0IHsgY29nbml0b0NvbmZpcm1TaWdudXAgfSBmcm9tIFwiLi9hY3Rpb25zL2NvZ25pdG8tY29uZmlybS1zaWduLXVwXCI7XG5pbXBvcnQgeyBjb2duaXRvUmVzZW5kQ29uZmlybWF0aW9uQ29kZSB9IGZyb20gXCIuL2FjdGlvbnMvY29nbml0by1yZXNlbmQtY29uZmlybWF0aW9uLWNvZGVcIjtcbmltcG9ydCB7IGNvZ25pdG9SZWZyZXNoVG9rZW4gfSBmcm9tIFwiLi9hY3Rpb25zL2NvZ25pdG8tcmVmcmVzaC10b2tlblwiO1xuaW1wb3J0IHsgY29nbml0b0NoYW5nZVBhc3N3b3JkIH0gZnJvbSBcIi4vYWN0aW9ucy9jb2duaXRvLWNoYW5nZS1wYXNzd29yZFwiO1xuaW1wb3J0IHsgQXV0aERhdGEsIEF1dGhTdGF0ZSwgQ29uZmlnLCBDb2duaXRvQXV0aEVycm9yIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW50ZXJmYWNlIENvZ25pdG9BdXRoUGFyYW1zIHtcbiAgY29uZmlnOiBDb25maWc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29nbml0b0F1dGgge1xuICBhdXRoRGF0YTogQXV0aERhdGEgfCBudWxsO1xuICBhdXRoU3RhdGU6IEF1dGhTdGF0ZTtcbiAgbG9naW46ICh1c2VyOiBzdHJpbmcsIHBhc3M6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgaW5pdFNpZ25VcDogKFxuICAgIHVzZXI6IHN0cmluZyxcbiAgICBwYXNzOiBzdHJpbmcsXG4gICAgcGFzc0NvbmZpcm06IHN0cmluZyxcbiAgKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBjb25maXJtU2lnblVwOiAoXG4gICAgdXNlcjogc3RyaW5nLFxuICAgIGNvZGU6IHN0cmluZyxcbiAgICBjYWxsYmFjaz86IChhdXRoRGF0YTogQXV0aERhdGEpID0+IFByb21pc2U8dm9pZD4sXG4gICkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgcmVzZW5kQ29uZmlybWF0aW9uQ29kZTogKHVzZXI6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgc2lnbk91dDogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgY2hhbmdlUGFzc3dvcmQ6IChcbiAgICBwcmV2UGFzc3dvcmQ6IHN0cmluZyxcbiAgICBuZXdQYXNzd29yZDogc3RyaW5nLFxuICAgIG5ld1Bhc3N3cmRDb25maXJtOiBzdHJpbmcsXG4gICkgPT4gUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUNvZ25pdG9BdXRoID0gKHsgY29uZmlnIH06IENvZ25pdG9BdXRoUGFyYW1zKTogQ29nbml0b0F1dGggPT4ge1xuICBjb25zdCBbYXV0aERhdGEsIHNldEF1dGhEYXRhXSA9IHVzZVN0YXRlPEF1dGhEYXRhIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFthdXRoU3RhdGUsIHNldEF1dGhTdGF0ZV0gPSB1c2VTdGF0ZTxBdXRoU3RhdGU+KEF1dGhTdGF0ZS5JTklUKTtcbiAgY29uc3QgW3NpZ25VcFNlc3Npb24sIHNldFNpZ25VcFNlc3Npb25dID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IGNvb2tpZUF1dGhEYXRhID0gYXdhaXQgZ2V0QXV0aENvb2tpZXMoKTtcbiAgICAgICAgaWYgKGNvb2tpZUF1dGhEYXRhKSB7XG4gICAgICAgICAgY29uc3QgcmVmcmVzaFRva2VucyA9IGF3YWl0IGNvZ25pdG9SZWZyZXNoVG9rZW4oXG4gICAgICAgICAgICBjb29raWVBdXRoRGF0YSxcbiAgICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICApO1xuICAgICAgICAgIGNvb2tpZUF1dGhEYXRhID0ge1xuICAgICAgICAgICAgLi4uY29va2llQXV0aERhdGEsXG4gICAgICAgICAgICBhY2Nlc3NUb2tlbjogcmVmcmVzaFRva2Vucy5hY2Nlc3NUb2tlbixcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgc2V0QXV0aERhdGEoY29va2llQXV0aERhdGEpO1xuICAgICAgICAgIHNldEF1dGhTdGF0ZShBdXRoU3RhdGUuQVVUSEVOVElDQVRFRCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aHJvdyBuZXcgQ29nbml0b0F1dGhFcnJvcihcIkZhaWxlZCB0byB2YWxpZGF0ZSBhY2Nlc3MgdG9rZW46IFwiICsgZXJyKTtcbiAgICAgIH1cblxuICAgICAgc2V0QXV0aFN0YXRlKEF1dGhTdGF0ZS5VTkFVVEhFTlRJQ0FURUQpO1xuICAgIH0pKCk7XG4gIH0sIFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgc2V0QXV0aFN0YXRlKEF1dGhTdGF0ZS5BVVRIRU5USUNBVEVEKTtcbiAgICB9XG4gIH0sIFthdXRoRGF0YV0pO1xuXG4gIGNvbnN0IGxvZ2luID0gdXNlQ2FsbGJhY2soYXN5bmMgKHVzZXI6IHN0cmluZywgcGFzczogc3RyaW5nKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGF1dGhEYXRhID0gYXdhaXQgY29nbml0b0xvZ2luVXNlclBhc3N3b3JkQXV0aCh1c2VyLCBwYXNzLCBjb25maWcpO1xuICAgICAgYXdhaXQgc2V0QXV0aENvb2tpZXMoYXV0aERhdGEpO1xuICAgICAgc2V0QXV0aERhdGEoYXV0aERhdGEpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhyb3cgbmV3IENvZ25pdG9BdXRoRXJyb3IoXCJGYWlsZWQgdG8gbG9naW46IFwiICsgZXJyKTtcbiAgICB9XG4gIH0sIFtdKTtcblxuICBjb25zdCBpbml0U2lnblVwID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKHVzZXI6IHN0cmluZywgcGFzczogc3RyaW5nLCBwYXNzQ29uZmlybTogc3RyaW5nKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgY29nbml0b1NpZ251cCh1c2VyLCBwYXNzLCBwYXNzQ29uZmlybSwgY29uZmlnKTtcbiAgICAgICAgaWYgKHNlc3Npb24pIHtcbiAgICAgICAgICBzZXRTaWduVXBTZXNzaW9uKHNlc3Npb24pO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhyb3cgbmV3IENvZ25pdG9BdXRoRXJyb3IoXCJGYWlsZWQgdG8gc2lnbiB1cDogXCIgKyBlcnIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW10sXG4gICk7XG5cbiAgY29uc3QgY29uZmlybVNpZ25VcCA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jIChcbiAgICAgIHVzZXI6IHN0cmluZyxcbiAgICAgIGNvZGU6IHN0cmluZyxcbiAgICAgIGNhbGxiYWNrPzogKGF1dGhEYXRhOiBBdXRoRGF0YSkgPT4gUHJvbWlzZTx2b2lkPixcbiAgICApID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICghc2lnblVwU2Vzc2lvbikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVzZXIgaGFzIG5vdCBzdGFydGVkIHNpZ24gdXBcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhdXRoRGF0YSA9IGF3YWl0IGNvZ25pdG9Db25maXJtU2lnbnVwKFxuICAgICAgICAgIHVzZXIsXG4gICAgICAgICAgY29kZSxcbiAgICAgICAgICBzaWduVXBTZXNzaW9uLFxuICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgKTtcbiAgICAgICAgYXdhaXQgc2V0QXV0aENvb2tpZXMoYXV0aERhdGEpO1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBhd2FpdCBjYWxsYmFjayhhdXRoRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0QXV0aERhdGEoYXV0aERhdGEpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRocm93IG5ldyBDb2duaXRvQXV0aEVycm9yKFwiRmFpbGVkIHRvIGNvbmZpcm0gc2lnbiB1cDogXCIgKyBlcnIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW3NpZ25VcFNlc3Npb25dLFxuICApO1xuXG4gIGNvbnN0IHJlc2VuZENvbmZpcm1hdGlvbkNvZGUgPSB1c2VDYWxsYmFjayhhc3luYyAodXNlcjogc3RyaW5nKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGNvZ25pdG9SZXNlbmRDb25maXJtYXRpb25Db2RlKHVzZXIsIGNvbmZpZyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aHJvdyBuZXcgQ29nbml0b0F1dGhFcnJvcihcIkZhaWxlZCB0byByZXNlbmQgY29uZmlybWF0aW9uIGNvZGU6IFwiICsgZXJyKTtcbiAgICB9XG4gIH0sIFtdKTtcblxuICBjb25zdCBjaGFuZ2VQYXNzd29yZCA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jIChcbiAgICAgIHByZXZQYXNzd29yZDogc3RyaW5nLFxuICAgICAgbmV3UGFzc3dvcmQ6IHN0cmluZyxcbiAgICAgIG5ld1Bhc3N3cmRDb25maXJtOiBzdHJpbmcsXG4gICAgKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIWF1dGhEYXRhIHx8ICFhdXRoRGF0YS5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGFjY2VzcyB0b2tlbiwgaXMgdXNlciBsb2dnZWQgaW4/XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgY29nbml0b0NoYW5nZVBhc3N3b3JkKFxuICAgICAgICAgIGF1dGhEYXRhPy5hY2Nlc3NUb2tlbixcbiAgICAgICAgICBwcmV2UGFzc3dvcmQsXG4gICAgICAgICAgbmV3UGFzc3dvcmQsXG4gICAgICAgICAgbmV3UGFzc3dyZENvbmZpcm0sXG4gICAgICAgICAgY29uZmlnLFxuICAgICAgICApO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRocm93IG5ldyBDb2duaXRvQXV0aEVycm9yKFwiRmFpbGVkIHRvIHJlc2V0IHBhc3N3b3JkOiBcIiArIGVycik7XG4gICAgICB9XG4gICAgfSxcbiAgICBbYXV0aERhdGFdLFxuICApO1xuXG4gIGNvbnN0IHNpZ25PdXQgPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgc2V0QXV0aERhdGEobnVsbCk7XG4gICAgc2V0QXV0aFN0YXRlKEF1dGhTdGF0ZS5VTkFVVEhFTlRJQ0FURUQpO1xuICAgIGF3YWl0IGNsZWFyQXV0aENvb2tpZXMoKTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiB7XG4gICAgYXV0aERhdGEsXG4gICAgYXV0aFN0YXRlLFxuICAgIGxvZ2luLFxuICAgIGluaXRTaWduVXAsXG4gICAgY29uZmlybVNpZ25VcCxcbiAgICByZXNlbmRDb25maXJtYXRpb25Db2RlLFxuICAgIHNpZ25PdXQsXG4gICAgY2hhbmdlUGFzc3dvcmQsXG4gIH07XG59O1xuXG5leHBvcnQgeyBDb25maWcsIEF1dGhTdGF0ZSwgQXV0aERhdGEsIENvZ25pdG9BdXRoRXJyb3IgfTtcbiJdfQ==