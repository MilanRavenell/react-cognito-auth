"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cognitoLoginUserPasswordAuth = cognitoLoginUserPasswordAuth;
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const helpers_1 = require("./helpers");
async function cognitoLoginUserPasswordAuth(user, pass, config) {
    const cognito = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
        region: config.awsRegion,
    });
    const initAuthCommand = new client_cognito_identity_provider_1.InitiateAuthCommand({
        AuthFlow: client_cognito_identity_provider_1.AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: config.userPoolClientId,
        AuthParameters: {
            USERNAME: user,
            PASSWORD: pass,
        },
    });
    const response = await cognito.send(initAuthCommand);
    return (0, helpers_1.getAuthDataFromAuthInitResponse)(response);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by1sb2dpbi11c2VyLXBhc3N3b3JkLWF1dGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9ucy9jb2duaXRvLWxvZ2luLXVzZXItcGFzc3dvcmQtYXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVFBLG9FQXFCQztBQTdCRCxnR0FJbUQ7QUFDbkQsdUNBQTREO0FBR3JELEtBQUssVUFBVSw0QkFBNEIsQ0FDaEQsSUFBWSxFQUNaLElBQVksRUFDWixNQUFjO0lBRWQsTUFBTSxPQUFPLEdBQUcsSUFBSSxnRUFBNkIsQ0FBQztRQUNoRCxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVM7S0FDekIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxlQUFlLEdBQUcsSUFBSSxzREFBbUIsQ0FBQztRQUM5QyxRQUFRLEVBQUUsK0NBQVksQ0FBQyxrQkFBa0I7UUFDekMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxnQkFBZ0I7UUFDakMsY0FBYyxFQUFFO1lBQ2QsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQUUsSUFBSTtTQUNmO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxRQUFRLEdBQUcsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBRXJELE9BQU8sSUFBQSx5Q0FBK0IsRUFBQyxRQUFRLENBQUMsQ0FBQztBQUNuRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29nbml0b0lkZW50aXR5UHJvdmlkZXJDbGllbnQsXG4gIEluaXRpYXRlQXV0aENvbW1hbmQsXG4gIEF1dGhGbG93VHlwZSxcbn0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1jb2duaXRvLWlkZW50aXR5LXByb3ZpZGVyXCI7XG5pbXBvcnQgeyBnZXRBdXRoRGF0YUZyb21BdXRoSW5pdFJlc3BvbnNlIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHsgQXV0aERhdGEsIENvbmZpZyB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29nbml0b0xvZ2luVXNlclBhc3N3b3JkQXV0aChcbiAgdXNlcjogc3RyaW5nLFxuICBwYXNzOiBzdHJpbmcsXG4gIGNvbmZpZzogQ29uZmlnLFxuKTogUHJvbWlzZTxBdXRoRGF0YT4ge1xuICBjb25zdCBjb2duaXRvID0gbmV3IENvZ25pdG9JZGVudGl0eVByb3ZpZGVyQ2xpZW50KHtcbiAgICByZWdpb246IGNvbmZpZy5hd3NSZWdpb24sXG4gIH0pO1xuXG4gIGNvbnN0IGluaXRBdXRoQ29tbWFuZCA9IG5ldyBJbml0aWF0ZUF1dGhDb21tYW5kKHtcbiAgICBBdXRoRmxvdzogQXV0aEZsb3dUeXBlLlVTRVJfUEFTU1dPUkRfQVVUSCxcbiAgICBDbGllbnRJZDogY29uZmlnLnVzZXJQb29sQ2xpZW50SWQsXG4gICAgQXV0aFBhcmFtZXRlcnM6IHtcbiAgICAgIFVTRVJOQU1FOiB1c2VyLFxuICAgICAgUEFTU1dPUkQ6IHBhc3MsXG4gICAgfSxcbiAgfSk7XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBjb2duaXRvLnNlbmQoaW5pdEF1dGhDb21tYW5kKTtcblxuICByZXR1cm4gZ2V0QXV0aERhdGFGcm9tQXV0aEluaXRSZXNwb25zZShyZXNwb25zZSk7XG59XG4iXX0=