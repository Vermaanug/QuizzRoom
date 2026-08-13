import { Request } from "express";
import validator from "validator";
import { ValidationResult } from "../types/index.js";

const validateSignUpData = (req: Request): ValidationResult => {
  const {
    firstName = "",
    lastName = "",
    username = "",
    email = "",
    password = "",
  } = req.body;

  const errors: Record<string, string> = {};

  if (!firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!username.trim()) {
    errors.username = "Username is required";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!validator.isEmail(email)) {
    errors.email = "Email is invalid";
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    errors.password =
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one symbol";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default validateSignUpData;
