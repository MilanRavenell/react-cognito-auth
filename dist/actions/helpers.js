"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthDataFromAuthInitResponse = void 0;
const jwt_decode_1 = require("jwt-decode");
const getAuthDataFromAuthInitResponse = (initAuthResponse) => {
    if (!initAuthResponse.AuthenticationResult?.IdToken ||
        !initAuthResponse.AuthenticationResult?.AccessToken ||
        !initAuthResponse.AuthenticationResult?.RefreshToken) {
        throw new Error("No username found");
    }
    const cognitoUser = (0, jwt_decode_1.jwtDecode)(initAuthResponse.AuthenticationResult.IdToken);
    const authData = {
        accessToken: initAuthResponse.AuthenticationResult?.AccessToken,
        refreshToken: initAuthResponse.AuthenticationResult?.RefreshToken,
        cognitoUser,
    };
    return authData;
};
exports.getAuthDataFromAuthInitResponse = getAuthDataFromAuthInitResponse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkNBQXVDO0FBR2hDLE1BQU0sK0JBQStCLEdBQUcsQ0FDN0MsZ0JBQTJDLEVBQzNDLEVBQUU7SUFDRixJQUNFLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLEVBQUUsT0FBTztRQUMvQyxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixFQUFFLFdBQVc7UUFDbkQsQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxZQUFZLEVBQ3BELENBQUM7UUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELE1BQU0sV0FBVyxHQUFHLElBQUEsc0JBQVMsRUFDM0IsZ0JBQWdCLENBQUMsb0JBQXFCLENBQUMsT0FBUSxDQUNqQyxDQUFDO0lBRWpCLE1BQU0sUUFBUSxHQUFhO1FBQ3pCLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxXQUFXO1FBQy9ELFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxZQUFZO1FBQ2pFLFdBQVc7S0FDWixDQUFDO0lBRUYsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQyxDQUFDO0FBdEJXLFFBQUEsK0JBQStCLG1DQXNCMUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbml0aWF0ZUF1dGhDb21tYW5kT3V0cHV0IH0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1jb2duaXRvLWlkZW50aXR5LXByb3ZpZGVyXCI7XG5pbXBvcnQgeyBqd3REZWNvZGUgfSBmcm9tIFwiand0LWRlY29kZVwiO1xuaW1wb3J0IHsgQXV0aERhdGEsIENvZ25pdG9Vc2VyIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmV4cG9ydCBjb25zdCBnZXRBdXRoRGF0YUZyb21BdXRoSW5pdFJlc3BvbnNlID0gKFxuICBpbml0QXV0aFJlc3BvbnNlOiBJbml0aWF0ZUF1dGhDb21tYW5kT3V0cHV0LFxuKSA9PiB7XG4gIGlmIChcbiAgICAhaW5pdEF1dGhSZXNwb25zZS5BdXRoZW50aWNhdGlvblJlc3VsdD8uSWRUb2tlbiB8fFxuICAgICFpbml0QXV0aFJlc3BvbnNlLkF1dGhlbnRpY2F0aW9uUmVzdWx0Py5BY2Nlc3NUb2tlbiB8fFxuICAgICFpbml0QXV0aFJlc3BvbnNlLkF1dGhlbnRpY2F0aW9uUmVzdWx0Py5SZWZyZXNoVG9rZW5cbiAgKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gdXNlcm5hbWUgZm91bmRcIik7XG4gIH1cblxuICBjb25zdCBjb2duaXRvVXNlciA9IGp3dERlY29kZShcbiAgICBpbml0QXV0aFJlc3BvbnNlLkF1dGhlbnRpY2F0aW9uUmVzdWx0IS5JZFRva2VuISxcbiAgKSBhcyBDb2duaXRvVXNlcjtcblxuICBjb25zdCBhdXRoRGF0YTogQXV0aERhdGEgPSB7XG4gICAgYWNjZXNzVG9rZW46IGluaXRBdXRoUmVzcG9uc2UuQXV0aGVudGljYXRpb25SZXN1bHQ/LkFjY2Vzc1Rva2VuLFxuICAgIHJlZnJlc2hUb2tlbjogaW5pdEF1dGhSZXNwb25zZS5BdXRoZW50aWNhdGlvblJlc3VsdD8uUmVmcmVzaFRva2VuLFxuICAgIGNvZ25pdG9Vc2VyLFxuICB9O1xuXG4gIHJldHVybiBhdXRoRGF0YTtcbn07XG4iXX0=