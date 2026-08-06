import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  forgotPasswordSchema,
  loginSchema,
  signupSchema,
} from "./auth.schema.ts";

const validSignup = {
  firstName: "Alex",
  lastName: "Morgan",
  username: "alexmorgan",
  email: "alex@example.com",
  password: "Strong!123",
  acceptTerms: true,
};

describe("signupSchema", () => {
  it("accepts a complete valid signup", () => {
    assert.equal(signupSchema.safeParse(validSignup).success, true);
  });

  const invalidPasswords = [
    ["short password", "Aa!1"],
    ["missing lowercase", "PASSWORD!1"],
    ["missing uppercase", "password!1"],
    ["missing number", "Password!"],
    ["missing symbol", "Password1"],
  ];

  for (const [scenario, password] of invalidPasswords) {
    it(`rejects a ${scenario}`, () => {
      assert.equal(signupSchema.safeParse({ ...validSignup, password }).success, false);
    });
  }

  it("requires terms acceptance", () => {
    assert.equal(signupSchema.safeParse({ ...validSignup, acceptTerms: false }).success, false);
  });

  it("rejects invalid identity fields", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      firstName: "A",
      lastName: "M",
      username: "ab",
      email: "invalid-email",
    });
    assert.equal(result.success, false);
  });
});

describe("loginSchema", () => {
  it("accepts either an email or username with a password", () => {
    assert.equal(loginSchema.safeParse({ username: "alex@example.com", password: "secret" }).success, true);
    assert.equal(loginSchema.safeParse({ username: "alex", password: "secret" }).success, true);
  });

  it("rejects blank credentials", () => {
    assert.equal(loginSchema.safeParse({ username: "   ", password: "" }).success, false);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts a valid email", () => {
    assert.equal(forgotPasswordSchema.safeParse({ email: "alex@example.com" }).success, true);
  });

  it("rejects an invalid email", () => {
    assert.equal(forgotPasswordSchema.safeParse({ email: "not-an-email" }).success, false);
  });
});
