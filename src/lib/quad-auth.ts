export const QUAD_PROTO_PASSWORD = "Quadrang123!";
export const QUAD_AUTH_COOKIE_NAME = "quad_proto_auth";

const AUTH_SALT = "quad_proto_salt_98234_secure";

// Web Crypto compatible SHA-256 hash generator
export async function generateQuadAuthToken(): Promise<string> {
  const data = new TextEncoder().encode(`${QUAD_PROTO_PASSWORD}:${AUTH_SALT}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyQuadAuthToken(token?: string | null): Promise<boolean> {
  if (!token || typeof token !== "string") {
    return false;
  }
  const expectedToken = await generateQuadAuthToken();
  return token === expectedToken;
}
