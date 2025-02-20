"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cognitoInitForgotPassword = cognitoInitForgotPassword;
exports.cognitoConfirmForgotPassword = cognitoConfirmForgotPassword;
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const types_1 = require("../types");
async function cognitoInitForgotPassword(username, config) {
    const cognito = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
        region: config.awsRegion,
    });
    try {
        const forgotPasswordCommand = new client_cognito_identity_provider_1.ForgotPasswordCommand({
            ClientId: config.userPoolClientId,
            Username: username,
        });
        await cognito.send(forgotPasswordCommand);
    }
    catch (error) {
        const authError = new types_1.CognitoAuthError();
        authError.name = "ForgotPasswordError";
        authError.message =
            error instanceof Error
                ? error.message
                : "Failed to initiate password reset";
        throw authError;
    }
}
async function cognitoConfirmForgotPassword(username, newPassword, confirmationCode, config) {
    const cognito = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
        region: config.awsRegion,
    });
    try {
        const confirmForgotPasswordCommand = new client_cognito_identity_provider_1.ConfirmForgotPasswordCommand({
            ClientId: config.userPoolClientId,
            Username: username,
            Password: newPassword,
            ConfirmationCode: confirmationCode,
        });
        console.log("confirmForgotPasswordCommand", confirmForgotPasswordCommand);
        await cognito.send(confirmForgotPasswordCommand);
    }
    catch (error) {
        console.log("error", error);
        const authError = new types_1.CognitoAuthError();
        authError.name = "ConfirmForgotPasswordError";
        authError.message =
            error instanceof Error
                ? error.message
                : "Failed to confirm password reset";
        throw authError;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by1mb3Jnb3QtcGFzc3dvcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9ucy9jb2duaXRvLWZvcmdvdC1wYXNzd29yZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU9BLDhEQXdCQztBQUVELG9FQThCQztBQS9ERCxnR0FJbUQ7QUFDbkQsb0NBQW9EO0FBRTdDLEtBQUssVUFBVSx5QkFBeUIsQ0FDN0MsUUFBZ0IsRUFDaEIsTUFBYztJQUVkLE1BQU0sT0FBTyxHQUFHLElBQUksZ0VBQTZCLENBQUM7UUFDaEQsTUFBTSxFQUFFLE1BQU0sQ0FBQyxTQUFTO0tBQ3pCLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQztRQUNILE1BQU0scUJBQXFCLEdBQUcsSUFBSSx3REFBcUIsQ0FBQztZQUN0RCxRQUFRLEVBQUUsTUFBTSxDQUFDLGdCQUFnQjtZQUNqQyxRQUFRLEVBQUUsUUFBUTtTQUNuQixDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE1BQU0sU0FBUyxHQUFHLElBQUksd0JBQWdCLEVBQUUsQ0FBQztRQUN6QyxTQUFTLENBQUMsSUFBSSxHQUFHLHFCQUFxQixDQUFDO1FBQ3ZDLFNBQVMsQ0FBQyxPQUFPO1lBQ2YsS0FBSyxZQUFZLEtBQUs7Z0JBQ3BCLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTztnQkFDZixDQUFDLENBQUMsbUNBQW1DLENBQUM7UUFDMUMsTUFBTSxTQUFTLENBQUM7SUFDbEIsQ0FBQztBQUNILENBQUM7QUFFTSxLQUFLLFVBQVUsNEJBQTRCLENBQ2hELFFBQWdCLEVBQ2hCLFdBQW1CLEVBQ25CLGdCQUF3QixFQUN4QixNQUFjO0lBRWQsTUFBTSxPQUFPLEdBQUcsSUFBSSxnRUFBNkIsQ0FBQztRQUNoRCxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVM7S0FDekIsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDO1FBQ0gsTUFBTSw0QkFBNEIsR0FBRyxJQUFJLCtEQUE0QixDQUFDO1lBQ3BFLFFBQVEsRUFBRSxNQUFNLENBQUMsZ0JBQWdCO1lBQ2pDLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLGdCQUFnQixFQUFFLGdCQUFnQjtTQUNuQyxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLDRCQUE0QixDQUFDLENBQUM7UUFDMUUsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1QixNQUFNLFNBQVMsR0FBRyxJQUFJLHdCQUFnQixFQUFFLENBQUM7UUFDekMsU0FBUyxDQUFDLElBQUksR0FBRyw0QkFBNEIsQ0FBQztRQUM5QyxTQUFTLENBQUMsT0FBTztZQUNmLEtBQUssWUFBWSxLQUFLO2dCQUNwQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU87Z0JBQ2YsQ0FBQyxDQUFDLGtDQUFrQyxDQUFDO1FBQ3pDLE1BQU0sU0FBUyxDQUFDO0lBQ2xCLENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29nbml0b0lkZW50aXR5UHJvdmlkZXJDbGllbnQsXG4gIEZvcmdvdFBhc3N3b3JkQ29tbWFuZCxcbiAgQ29uZmlybUZvcmdvdFBhc3N3b3JkQ29tbWFuZCxcbn0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1jb2duaXRvLWlkZW50aXR5LXByb3ZpZGVyXCI7XG5pbXBvcnQgeyBDb25maWcsIENvZ25pdG9BdXRoRXJyb3IgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvZ25pdG9Jbml0Rm9yZ290UGFzc3dvcmQoXG4gIHVzZXJuYW1lOiBzdHJpbmcsXG4gIGNvbmZpZzogQ29uZmlnLFxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGNvZ25pdG8gPSBuZXcgQ29nbml0b0lkZW50aXR5UHJvdmlkZXJDbGllbnQoe1xuICAgIHJlZ2lvbjogY29uZmlnLmF3c1JlZ2lvbixcbiAgfSk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBmb3Jnb3RQYXNzd29yZENvbW1hbmQgPSBuZXcgRm9yZ290UGFzc3dvcmRDb21tYW5kKHtcbiAgICAgIENsaWVudElkOiBjb25maWcudXNlclBvb2xDbGllbnRJZCxcbiAgICAgIFVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICB9KTtcblxuICAgIGF3YWl0IGNvZ25pdG8uc2VuZChmb3Jnb3RQYXNzd29yZENvbW1hbmQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGF1dGhFcnJvciA9IG5ldyBDb2duaXRvQXV0aEVycm9yKCk7XG4gICAgYXV0aEVycm9yLm5hbWUgPSBcIkZvcmdvdFBhc3N3b3JkRXJyb3JcIjtcbiAgICBhdXRoRXJyb3IubWVzc2FnZSA9XG4gICAgICBlcnJvciBpbnN0YW5jZW9mIEVycm9yXG4gICAgICAgID8gZXJyb3IubWVzc2FnZVxuICAgICAgICA6IFwiRmFpbGVkIHRvIGluaXRpYXRlIHBhc3N3b3JkIHJlc2V0XCI7XG4gICAgdGhyb3cgYXV0aEVycm9yO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb2duaXRvQ29uZmlybUZvcmdvdFBhc3N3b3JkKFxuICB1c2VybmFtZTogc3RyaW5nLFxuICBuZXdQYXNzd29yZDogc3RyaW5nLFxuICBjb25maXJtYXRpb25Db2RlOiBzdHJpbmcsXG4gIGNvbmZpZzogQ29uZmlnLFxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGNvZ25pdG8gPSBuZXcgQ29nbml0b0lkZW50aXR5UHJvdmlkZXJDbGllbnQoe1xuICAgIHJlZ2lvbjogY29uZmlnLmF3c1JlZ2lvbixcbiAgfSk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBjb25maXJtRm9yZ290UGFzc3dvcmRDb21tYW5kID0gbmV3IENvbmZpcm1Gb3Jnb3RQYXNzd29yZENvbW1hbmQoe1xuICAgICAgQ2xpZW50SWQ6IGNvbmZpZy51c2VyUG9vbENsaWVudElkLFxuICAgICAgVXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgUGFzc3dvcmQ6IG5ld1Bhc3N3b3JkLFxuICAgICAgQ29uZmlybWF0aW9uQ29kZTogY29uZmlybWF0aW9uQ29kZSxcbiAgICB9KTtcblxuICAgIGNvbnNvbGUubG9nKFwiY29uZmlybUZvcmdvdFBhc3N3b3JkQ29tbWFuZFwiLCBjb25maXJtRm9yZ290UGFzc3dvcmRDb21tYW5kKTtcbiAgICBhd2FpdCBjb2duaXRvLnNlbmQoY29uZmlybUZvcmdvdFBhc3N3b3JkQ29tbWFuZCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5sb2coXCJlcnJvclwiLCBlcnJvcik7XG4gICAgY29uc3QgYXV0aEVycm9yID0gbmV3IENvZ25pdG9BdXRoRXJyb3IoKTtcbiAgICBhdXRoRXJyb3IubmFtZSA9IFwiQ29uZmlybUZvcmdvdFBhc3N3b3JkRXJyb3JcIjtcbiAgICBhdXRoRXJyb3IubWVzc2FnZSA9XG4gICAgICBlcnJvciBpbnN0YW5jZW9mIEVycm9yXG4gICAgICAgID8gZXJyb3IubWVzc2FnZVxuICAgICAgICA6IFwiRmFpbGVkIHRvIGNvbmZpcm0gcGFzc3dvcmQgcmVzZXRcIjtcbiAgICB0aHJvdyBhdXRoRXJyb3I7XG4gIH1cbn1cbiJdfQ==