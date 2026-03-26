import { jwtDecode } from "jwt-decode";

export type JwtPayloadCustom = {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  FullName?: string;
  exp?: number;
  iss?: string;
  aud?: string;
};

export function decodeAccessToken(token: string): JwtPayloadCustom | null {
  try {
    return jwtDecode<JwtPayloadCustom>(token);
  } catch (error) {
    console.log("Decode token failed:", error);
    return null;
  }
}

export function getUserRoleFromToken(token: string): string | null {
  const payload = decodeAccessToken(token);
  return (
    payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
    null
  );
}

export function getUserInfoFromToken(token: string) {
  const payload = decodeAccessToken(token);

  if (!payload) return null;

  return {
    userId:
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ] ?? null,
    email:
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ] ?? null,
    role:
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
      null,
    fullName: payload.FullName ?? null,
    exp: payload.exp ?? null,
  };
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeAccessToken(token);
  if (!payload?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}
