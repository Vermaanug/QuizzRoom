import ValidateSignUpData from "../utils/ValidateSignUpData.js";
import UserModel from "../model/UserModel.js";
import jwt from "jsonwebtoken";
import validator from "validator";

export const SignUp = async (req, res) => {
  try {
    const { isValid, errors } = ValidateSignUpData(req);

    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const { firstName, lastName, username, email, password } = req.body;

    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    const newUser = new UserModel({
      firstName,
      lastName,
      username,
      email,
      password,
    });

    await newUser.save();

    return res.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || validator.isEmpty(username.trim())) {
      return res.status(400).json({ message: "Email is required" });
    } else if (!password || validator.isEmpty(password.trim())) {
      return res.status(400).json({ message: "Password is required" });
    }

    let query = {};
    if (username.includes("@")) {
      query.email = username;
    } else {
      query.username = username;
    }

    const user = await UserModel.findOne(query);

    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const isPasswordMatched = await user.validatePassword(password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.cookie("token", token, { httpOnly: true });
    return res.json({ message: "Login successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
