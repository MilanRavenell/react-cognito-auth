"use server";
import JWT from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import { Config } from "../types";

export async function cognitoValidateAccessToken(
  token: string,
  config: Config,
): Promise<boolean> {
  const response = await fetch(
    `https://cognito-idp.${config.awsRegion}.amazonaws.com/${config.userPoolId}/.well-known/jwks.json`,
    { headers: { "Content-Type": "application/json" } },
  );

  const body = await response.json();
  if (!body || !body.keys || body.keys.length === 0) {
    throw new Error("Invalid JWT body");
  }

  const pem = jwkToPem(body.keys[1]);

  try {
    await new Promise((resolve, reject) => {
      JWT.verify(token, pem, (err, payload) => {
        if (err) {
          reject(new Error("Invalid token"));
        } else {
          resolve(payload);
        }
      });
    });

    return true;
  } catch (err) {
    return false;
  }
}
