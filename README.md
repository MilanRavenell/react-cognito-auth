# React Cognito Auth Hook

A React hook for handling AWS Cognito authentication flows with built-in token management and persistence.

## Features

- Complete AWS Cognito authentication flow
- Token persistence using cookies
- Automatic token refresh
- TypeScript support
- Handles login, signup, confirmation, and password changes
- Built-in auth state management

## Installation

```bash
npm install react-cognito-auth-hook
```

or

```bash
yarn add react-cognito-auth-hook
```

## Prerequisites

Before using this package, you need:

1. An AWS account with a configured Cognito User Pool
2. A Cognito User Pool Client configured with the following:
   - Enabled `USER_PASSWORD_AUTH`, `USER_AUTH` authentication flows

You will need the following information from your AWS Cognito setup:

- User Pool ID
- User Pool Client ID
- AWS Region

## Configuration

First, create a configuration object with your AWS Cognito details:

```typescript
const config = {
  region: "YOUR_AWS_REGION",
  userPoolId: "YOUR_USER_POOL_ID",
  clientId: "YOUR_CLIENT_ID",
};
```

## Usage

### Basic Authentication Flow

```typescript
import { useCognitoAuth } from 'react-cognito-auth-hook';

function App() {
  const {
    authData,
    authState,
    login,
    initSignUp,
    confirmSignUp,
    signOut
  } = useCognitoAuth({ config });

  // Check authentication state
  if (authState === 'AUTHENTICATED') {
    return (
      <div>
        <h1>Welcome, {authData?.username}!</h1>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Please log in</h1>
      {/* Your login/signup forms here */}
    </div>
  );
}
```

### Login

```typescript
try {
  await login(username, password);
  // User is now logged in
} catch (error) {
  // Handle login error
}
```

### Sign Up

```typescript
try {
  // Initialize sign up
  await initSignUp(username, password, passwordConfirm);

  // Confirm sign up with code
  await confirmSignUp(username, confirmationCode);
  // User is now signed up and logged in
} catch (error) {
  // Handle signup error
}
```

### Change Password

```typescript
try {
  await changePassword(currentPassword, newPassword, newPasswordConfirm);
  // Password successfully changed
} catch (error) {
  // Handle password change error
}
```

### Resend Confirmation Code

```typescript
try {
  await resendConfirmationCode(username);
  // Confirmation code sent
} catch (error) {
  // Handle error
}
```

### Forgot Password

```typescript
try {
  // Initialize forgot password flow
  await initForgotPassword(username);
  // This will trigger Cognito to send a confirmation code

  // Confirm new password with code
  await confirmForgotPassword(username, newPassword, confirmationCode);
  // Password has been reset successfully
} catch (error) {
  // Handle forgot password error
}
```

## Auth States

The hook provides the following authentication states:

- `INIT`: Initial loading state
- `AUTHENTICATED`: User is authenticated
- `UNAUTHENTICATED`: User is not authenticated

## API Reference

### Hook Return Values

- `authData`: Object containing the current authentication data (tokens, username)
- `authState`: Current authentication state
- `login(username: string, password: string)`: Login with username and password
- `initSignUp(username: string, password: string, passwordConfirm: string)`: Start the signup process
- `confirmSignUp(username: string, code: string, callback?: Function)`: Confirm signup with verification code
- `resendConfirmationCode(username: string)`: Resend verification code
- `signOut()`: Sign out the current user
- `changePassword(prevPassword: string, newPassword: string, newPasswordConfirm: string)`: Change user's password
- `initForgotPassword(username: string)`: Start the forgot password process
- `confirmForgotPassword(username: string, newPassword: string, code: string)`: Confirm new password with verification code

## Security

This package handles authentication tokens securely by:

- Storing tokens in HTTP-only cookies
- Automatically refreshing tokens
- Validating tokens before use
- Clearing tokens on sign out

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
