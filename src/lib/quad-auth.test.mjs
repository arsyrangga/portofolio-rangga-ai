import test from "node:test";
import assert from "node:assert/strict";
import {
  QUAD_PROTO_PASSWORD,
  QUAD_AUTH_COOKIE_NAME,
  generateQuadAuthToken,
  verifyQuadAuthToken,
} from "./quad-auth.ts";

test("QUAD_PROTO_PASSWORD matches specification", () => {
  assert.equal(QUAD_PROTO_PASSWORD, "Quadrang123!");
});

test("QUAD_AUTH_COOKIE_NAME is quad_proto_auth", () => {
  assert.equal(QUAD_AUTH_COOKIE_NAME, "quad_proto_auth");
});

test("generateQuadAuthToken generates valid signature", async () => {
  const token = await generateQuadAuthToken();
  assert.ok(typeof token === "string" && token.length > 20);

  const isValid = await verifyQuadAuthToken(token);
  assert.equal(isValid, true);
});

test("verifyQuadAuthToken rejects invalid tokens", async () => {
  assert.equal(await verifyQuadAuthToken(""), false);
  assert.equal(await verifyQuadAuthToken(null), false);
  assert.equal(await verifyQuadAuthToken("invalid-token-12345"), false);
});
