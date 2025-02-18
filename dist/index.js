"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoAuthError = exports.AuthState = exports.useCognitoAuth = void 0;
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
Object.defineProperty(exports, "AuthState", { enumerable: true, get: function () { return types_1.AuthState; } });
Object.defineProperty(exports, "CognitoAuthError", { enumerable: true, get: function () { return types_1.CognitoAuthError; } });
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
                throw new types_1.CognitoAuthError("Failed to validate access token: " + err);
            }
            setAuthState(types_1.AuthState.UNAUTHENTICATED);
        })();
    }, []);
    (0, react_1.useEffect)(() => {
        (async () => {
            if (authData) {
                try {
                    if (await (0, cognito_validate_access_token_1.cognitoValidateAccessToken)(authData.accessToken, config)) {
                        setAuthState(types_1.AuthState.AUTHENTICATED);
                        return;
                    }
                    setAuthState(types_1.AuthState.UNAUTHENTICATED);
                }
                catch (err) {
                    throw new types_1.CognitoAuthError("Failed to validate access token: " + err);
                }
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
            throw new types_1.CognitoAuthError("Failed to login: " + err);
        }
    }, []);
    const initSignUp = (0, react_1.useCallback)(async (user, pass, passConfirm) => {
        try {
            await (0, cognito_sign_up_1.cognitoSignup)(user, pass, passConfirm, config);
        }
        catch (err) {
            throw new types_1.CognitoAuthError("Failed to sign up: " + err);
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
            throw new types_1.CognitoAuthError("Failed to confirm sign up: " + err);
        }
    }, []);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQXlEO0FBQ3pELCtDQUkyQjtBQUMzQixpR0FBMEY7QUFDMUYsK0RBQTBEO0FBQzFELCtFQUF5RTtBQUN6RSxpR0FBMkY7QUFDM0YsMkZBQXFGO0FBQ3JGLDJFQUFzRTtBQUN0RSwrRUFBMEU7QUFDMUUsbUNBQXdFO0FBNkt2RCwwRkE3S0UsaUJBQVMsT0E2S0Y7QUFBWSxpR0E3S0Esd0JBQWdCLE9BNktBO0FBaEovQyxNQUFNLGNBQWMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFxQixFQUFlLEVBQUU7SUFDM0UsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQWtCLElBQUksQ0FBQyxDQUFDO0lBQ2hFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFZLGlCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFdEUsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDVixJQUFJLENBQUM7Z0JBQ0gsSUFBSSxjQUFjLEdBQUcsTUFBTSxJQUFBLHdCQUFjLEdBQUUsQ0FBQztnQkFDNUMsSUFBSSxjQUFjLEVBQUUsQ0FBQztvQkFDbkIsSUFDRSxDQUFDLENBQUMsTUFBTSxJQUFBLDBEQUEwQixFQUNoQyxjQUFjLENBQUMsV0FBVyxFQUMxQixNQUFNLENBQ1AsQ0FBQyxFQUNGLENBQUM7d0JBQ0QsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFBLDJDQUFtQixFQUM3QyxjQUFjLEVBQ2QsTUFBTSxDQUNQLENBQUM7d0JBQ0YsY0FBYyxHQUFHOzRCQUNmLEdBQUcsY0FBYzs0QkFDakIsV0FBVyxFQUFFLGFBQWEsQ0FBQyxXQUFXO3lCQUN2QyxDQUFDO29CQUNKLENBQUM7b0JBQ0QsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUM1QixPQUFPO2dCQUNULENBQUM7WUFDSCxDQUFDO1lBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztnQkFDYixNQUFNLElBQUksd0JBQWdCLENBQUMsbUNBQW1DLEdBQUksR0FBRyxDQUFDLENBQUM7WUFDekUsQ0FBQztZQUVELFlBQVksQ0FBQyxpQkFBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDUCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFUCxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNWLElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQ2IsSUFBSSxDQUFDO29CQUNILElBQUksTUFBTSxJQUFBLDBEQUEwQixFQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQzt3QkFDbkUsWUFBWSxDQUFDLGlCQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7d0JBQ3RDLE9BQU87b0JBQ1QsQ0FBQztvQkFFRCxZQUFZLENBQUMsaUJBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDMUMsQ0FBQztnQkFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO29CQUNiLE1BQU0sSUFBSSx3QkFBZ0IsQ0FBQyxtQ0FBbUMsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDeEUsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ1AsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUVmLE1BQU0sS0FBSyxHQUFHLElBQUEsbUJBQVcsRUFBQyxLQUFLLEVBQUUsSUFBWSxFQUFFLElBQVksRUFBRSxFQUFFO1FBQzdELElBQUksQ0FBQztZQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSwrREFBNEIsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sSUFBQSx3QkFBYyxFQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9CLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QixDQUFDO1FBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNiLE1BQU0sSUFBSSx3QkFBZ0IsQ0FBQyxtQkFBbUIsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUN4RCxDQUFDO0lBQ0gsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRVAsTUFBTSxVQUFVLEdBQUcsSUFBQSxtQkFBVyxFQUM1QixLQUFLLEVBQUUsSUFBWSxFQUFFLElBQVksRUFBRSxXQUFtQixFQUFFLEVBQUU7UUFDeEQsSUFBSSxDQUFDO1lBQ0gsTUFBTSxJQUFBLCtCQUFhLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkQsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixNQUFNLElBQUksd0JBQWdCLENBQUMscUJBQXFCLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDMUQsQ0FBQztJQUNILENBQUMsRUFDRCxFQUFFLENBQ0gsQ0FBQztJQUVGLE1BQU0sYUFBYSxHQUFHLElBQUEsbUJBQVcsRUFDL0IsS0FBSyxFQUNILElBQVksRUFDWixJQUFZLEVBQ1osUUFBZ0QsRUFDaEQsRUFBRTtRQUNGLElBQUksQ0FBQztZQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSw4Q0FBb0IsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sSUFBQSx3QkFBYyxFQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9CLElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQ2IsTUFBTSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0IsQ0FBQztZQUNELFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QixDQUFDO1FBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNiLE1BQU0sSUFBSSx3QkFBZ0IsQ0FBQyw2QkFBNkIsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNsRSxDQUFDO0lBQ0gsQ0FBQyxFQUNELEVBQUUsQ0FDSCxDQUFDO0lBRUYsTUFBTSxzQkFBc0IsR0FBRyxJQUFBLG1CQUFXLEVBQUMsS0FBSyxFQUFFLElBQVksRUFBRSxFQUFFO1FBQ2hFLElBQUksQ0FBQztZQUNILE1BQU0sSUFBQSxnRUFBNkIsRUFBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEQsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixNQUFNLElBQUksd0JBQWdCLENBQUMsc0NBQXNDLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDM0UsQ0FBQztJQUNILENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVQLE1BQU0sY0FBYyxHQUFHLElBQUEsbUJBQVcsRUFDaEMsS0FBSyxFQUNILFlBQW9CLEVBQ3BCLFdBQW1CLEVBQ25CLGlCQUF5QixFQUN6QixFQUFFO1FBQ0YsSUFBSSxDQUFDO1lBQ0gsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDdkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1lBQ3pELENBQUM7WUFFRCxNQUFNLElBQUEsK0NBQXFCLEVBQ3pCLFFBQVEsRUFBRSxXQUFXLEVBQ3JCLFlBQVksRUFDWixXQUFXLEVBQ1gsaUJBQWlCLEVBQ2pCLE1BQU0sQ0FDUCxDQUFDO1FBQ0osQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixNQUFNLElBQUksd0JBQWdCLENBQUMsNEJBQTRCLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDakUsQ0FBQztJQUNILENBQUMsRUFDRCxDQUFDLFFBQVEsQ0FBQyxDQUNYLENBQUM7SUFFRixNQUFNLE9BQU8sR0FBRyxJQUFBLG1CQUFXLEVBQUMsS0FBSyxJQUFJLEVBQUU7UUFDckMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLFlBQVksQ0FBQyxpQkFBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sSUFBQSwwQkFBZ0IsR0FBRSxDQUFDO0lBQzNCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVQLE9BQU87UUFDTCxRQUFRO1FBQ1IsU0FBUztRQUNULEtBQUs7UUFDTCxVQUFVO1FBQ1YsYUFBYTtRQUNiLHNCQUFzQjtRQUN0QixPQUFPO1FBQ1AsY0FBYztLQUNmLENBQUM7QUFDSixDQUFDLENBQUM7QUE5SVcsUUFBQSxjQUFjLGtCQThJekIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlLCB1c2VDYWxsYmFjayB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtcbiAgZ2V0QXV0aENvb2tpZXMsXG4gIGNsZWFyQXV0aENvb2tpZXMsXG4gIHNldEF1dGhDb29raWVzLFxufSBmcm9tIFwiLi9hY3Rpb25zL2Nvb2tpZXNcIjtcbmltcG9ydCB7IGNvZ25pdG9Mb2dpblVzZXJQYXNzd29yZEF1dGggfSBmcm9tIFwiLi9hY3Rpb25zL2NvZ25pdG8tbG9naW4tdXNlci1wYXNzd29yZC1hdXRoXCI7XG5pbXBvcnQgeyBjb2duaXRvU2lnbnVwIH0gZnJvbSBcIi4vYWN0aW9ucy9jb2duaXRvLXNpZ24tdXBcIjtcbmltcG9ydCB7IGNvZ25pdG9Db25maXJtU2lnbnVwIH0gZnJvbSBcIi4vYWN0aW9ucy9jb2duaXRvLWNvbmZpcm0tc2lnbi11cFwiO1xuaW1wb3J0IHsgY29nbml0b1Jlc2VuZENvbmZpcm1hdGlvbkNvZGUgfSBmcm9tIFwiLi9hY3Rpb25zL2NvZ25pdG8tcmVzZW5kLWNvbmZpcm1hdGlvbi1jb2RlXCI7XG5pbXBvcnQgeyBjb2duaXRvVmFsaWRhdGVBY2Nlc3NUb2tlbiB9IGZyb20gXCIuL2FjdGlvbnMvY29nbml0by12YWxpZGF0ZS1hY2Nlc3MtdG9rZW5cIjtcbmltcG9ydCB7IGNvZ25pdG9SZWZyZXNoVG9rZW4gfSBmcm9tIFwiLi9hY3Rpb25zL2NvZ25pdG8tcmVmcmVzaC10b2tlblwiO1xuaW1wb3J0IHsgY29nbml0b0NoYW5nZVBhc3N3b3JkIH0gZnJvbSBcIi4vYWN0aW9ucy9jb2duaXRvLWNoYW5nZS1wYXNzd29yZFwiO1xuaW1wb3J0IHsgQXV0aERhdGEsIEF1dGhTdGF0ZSwgQ29uZmlnLCBDb2duaXRvQXV0aEVycm9yIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW50ZXJmYWNlIENvZ25pdG9BdXRoUGFyYW1zIHtcbiAgY29uZmlnOiBDb25maWc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29nbml0b0F1dGgge1xuICBhdXRoRGF0YTogQXV0aERhdGEgfCBudWxsO1xuICBhdXRoU3RhdGU6IEF1dGhTdGF0ZTtcbiAgbG9naW46ICh1c2VyOiBzdHJpbmcsIHBhc3M6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgaW5pdFNpZ25VcDogKFxuICAgIHVzZXI6IHN0cmluZyxcbiAgICBwYXNzOiBzdHJpbmcsXG4gICAgcGFzc0NvbmZpcm06IHN0cmluZyxcbiAgKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBjb25maXJtU2lnblVwOiAoXG4gICAgdXNlcjogc3RyaW5nLFxuICAgIGNvZGU6IHN0cmluZyxcbiAgICBjYWxsYmFjaz86IChhdXRoRGF0YTogQXV0aERhdGEpID0+IFByb21pc2U8dm9pZD4sXG4gICkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgcmVzZW5kQ29uZmlybWF0aW9uQ29kZTogKHVzZXI6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgc2lnbk91dDogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgY2hhbmdlUGFzc3dvcmQ6IChcbiAgICBwcmV2UGFzc3dvcmQ6IHN0cmluZyxcbiAgICBuZXdQYXNzd29yZDogc3RyaW5nLFxuICAgIG5ld1Bhc3N3cmRDb25maXJtOiBzdHJpbmcsXG4gICkgPT4gUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUNvZ25pdG9BdXRoID0gKHsgY29uZmlnIH06IENvZ25pdG9BdXRoUGFyYW1zKTogQ29nbml0b0F1dGggPT4ge1xuICBjb25zdCBbYXV0aERhdGEsIHNldEF1dGhEYXRhXSA9IHVzZVN0YXRlPEF1dGhEYXRhIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFthdXRoU3RhdGUsIHNldEF1dGhTdGF0ZV0gPSB1c2VTdGF0ZTxBdXRoU3RhdGU+KEF1dGhTdGF0ZS5JTklUKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgY29va2llQXV0aERhdGEgPSBhd2FpdCBnZXRBdXRoQ29va2llcygpO1xuICAgICAgICBpZiAoY29va2llQXV0aERhdGEpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhKGF3YWl0IGNvZ25pdG9WYWxpZGF0ZUFjY2Vzc1Rva2VuKFxuICAgICAgICAgICAgICBjb29raWVBdXRoRGF0YS5hY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgKSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnN0IHJlZnJlc2hUb2tlbnMgPSBhd2FpdCBjb2duaXRvUmVmcmVzaFRva2VuKFxuICAgICAgICAgICAgICBjb29raWVBdXRoRGF0YSxcbiAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvb2tpZUF1dGhEYXRhID0ge1xuICAgICAgICAgICAgICAuLi5jb29raWVBdXRoRGF0YSxcbiAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IHJlZnJlc2hUb2tlbnMuYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZXRBdXRoRGF0YShjb29raWVBdXRoRGF0YSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhyb3cgbmV3IENvZ25pdG9BdXRoRXJyb3IoXCJGYWlsZWQgdG8gdmFsaWRhdGUgYWNjZXNzIHRva2VuOiBcIiAgKyBlcnIpO1xuICAgICAgfVxuXG4gICAgICBzZXRBdXRoU3RhdGUoQXV0aFN0YXRlLlVOQVVUSEVOVElDQVRFRCk7XG4gICAgfSkoKTtcbiAgfSwgW10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChhd2FpdCBjb2duaXRvVmFsaWRhdGVBY2Nlc3NUb2tlbihhdXRoRGF0YS5hY2Nlc3NUb2tlbiwgY29uZmlnKSkge1xuICAgICAgICAgICAgc2V0QXV0aFN0YXRlKEF1dGhTdGF0ZS5BVVRIRU5USUNBVEVEKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIHNldEF1dGhTdGF0ZShBdXRoU3RhdGUuVU5BVVRIRU5USUNBVEVEKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IENvZ25pdG9BdXRoRXJyb3IoXCJGYWlsZWQgdG8gdmFsaWRhdGUgYWNjZXNzIHRva2VuOiBcIiArIGVycik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KSgpO1xuICB9LCBbYXV0aERhdGFdKTtcblxuICBjb25zdCBsb2dpbiA9IHVzZUNhbGxiYWNrKGFzeW5jICh1c2VyOiBzdHJpbmcsIHBhc3M6IHN0cmluZykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBhdXRoRGF0YSA9IGF3YWl0IGNvZ25pdG9Mb2dpblVzZXJQYXNzd29yZEF1dGgodXNlciwgcGFzcywgY29uZmlnKTtcbiAgICAgIGF3YWl0IHNldEF1dGhDb29raWVzKGF1dGhEYXRhKTtcbiAgICAgIHNldEF1dGhEYXRhKGF1dGhEYXRhKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRocm93IG5ldyBDb2duaXRvQXV0aEVycm9yKFwiRmFpbGVkIHRvIGxvZ2luOiBcIiArIGVycik7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgY29uc3QgaW5pdFNpZ25VcCA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jICh1c2VyOiBzdHJpbmcsIHBhc3M6IHN0cmluZywgcGFzc0NvbmZpcm06IHN0cmluZykgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY29nbml0b1NpZ251cCh1c2VyLCBwYXNzLCBwYXNzQ29uZmlybSwgY29uZmlnKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aHJvdyBuZXcgQ29nbml0b0F1dGhFcnJvcihcIkZhaWxlZCB0byBzaWduIHVwOiBcIiArIGVycik7XG4gICAgICB9XG4gICAgfSxcbiAgICBbXSxcbiAgKTtcblxuICBjb25zdCBjb25maXJtU2lnblVwID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKFxuICAgICAgdXNlcjogc3RyaW5nLFxuICAgICAgY29kZTogc3RyaW5nLFxuICAgICAgY2FsbGJhY2s/OiAoYXV0aERhdGE6IEF1dGhEYXRhKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYXV0aERhdGEgPSBhd2FpdCBjb2duaXRvQ29uZmlybVNpZ251cCh1c2VyLCBjb2RlLCBjb25maWcpO1xuICAgICAgICBhd2FpdCBzZXRBdXRoQ29va2llcyhhdXRoRGF0YSk7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGF3YWl0IGNhbGxiYWNrKGF1dGhEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBzZXRBdXRoRGF0YShhdXRoRGF0YSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhyb3cgbmV3IENvZ25pdG9BdXRoRXJyb3IoXCJGYWlsZWQgdG8gY29uZmlybSBzaWduIHVwOiBcIiArIGVycik7XG4gICAgICB9XG4gICAgfSxcbiAgICBbXSxcbiAgKTtcblxuICBjb25zdCByZXNlbmRDb25maXJtYXRpb25Db2RlID0gdXNlQ2FsbGJhY2soYXN5bmMgKHVzZXI6IHN0cmluZykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBjb2duaXRvUmVzZW5kQ29uZmlybWF0aW9uQ29kZSh1c2VyLCBjb25maWcpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhyb3cgbmV3IENvZ25pdG9BdXRoRXJyb3IoXCJGYWlsZWQgdG8gcmVzZW5kIGNvbmZpcm1hdGlvbiBjb2RlOiBcIiArIGVycik7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgY29uc3QgY2hhbmdlUGFzc3dvcmQgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoXG4gICAgICBwcmV2UGFzc3dvcmQ6IHN0cmluZyxcbiAgICAgIG5ld1Bhc3N3b3JkOiBzdHJpbmcsXG4gICAgICBuZXdQYXNzd3JkQ29uZmlybTogc3RyaW5nLFxuICAgICkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFhdXRoRGF0YSB8fCAhYXV0aERhdGEuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBhY2Nlc3MgdG9rZW4sIGlzIHVzZXIgbG9nZ2VkIGluP1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IGNvZ25pdG9DaGFuZ2VQYXNzd29yZChcbiAgICAgICAgICBhdXRoRGF0YT8uYWNjZXNzVG9rZW4sXG4gICAgICAgICAgcHJldlBhc3N3b3JkLFxuICAgICAgICAgIG5ld1Bhc3N3b3JkLFxuICAgICAgICAgIG5ld1Bhc3N3cmRDb25maXJtLFxuICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aHJvdyBuZXcgQ29nbml0b0F1dGhFcnJvcihcIkZhaWxlZCB0byByZXNldCBwYXNzd29yZDogXCIgKyBlcnIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW2F1dGhEYXRhXSxcbiAgKTtcblxuICBjb25zdCBzaWduT3V0ID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIHNldEF1dGhEYXRhKG51bGwpO1xuICAgIHNldEF1dGhTdGF0ZShBdXRoU3RhdGUuVU5BVVRIRU5USUNBVEVEKTtcbiAgICBhd2FpdCBjbGVhckF1dGhDb29raWVzKCk7XG4gIH0sIFtdKTtcblxuICByZXR1cm4ge1xuICAgIGF1dGhEYXRhLFxuICAgIGF1dGhTdGF0ZSxcbiAgICBsb2dpbixcbiAgICBpbml0U2lnblVwLFxuICAgIGNvbmZpcm1TaWduVXAsXG4gICAgcmVzZW5kQ29uZmlybWF0aW9uQ29kZSxcbiAgICBzaWduT3V0LFxuICAgIGNoYW5nZVBhc3N3b3JkLFxuICB9O1xufTtcblxuZXhwb3J0IHsgQ29uZmlnLCBBdXRoU3RhdGUsIEF1dGhEYXRhLCBDb2duaXRvQXV0aEVycm9yIH07XG4iXX0=