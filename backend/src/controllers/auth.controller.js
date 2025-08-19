import ValidateSignUpData from "../utils/ValidateSignUpData.js";
import UserModel from "../model/UserModel.js";
import jwt from "jsonwebtoken";

export const SignUp = async (req, res) => {
    try {
        const { isValid, errors } = ValidateSignUpData(req);

        const { isValid, errors } = ValidateSignUpData(req);

        if (!isValid) {
            return res.status(400).json({ message: "Validation failed", errors });
        }

        const { firstName, lastName, username, email, password } = req.body;

        const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] })

        if (existingUser) {
            return res.status(400).json({ message: "Username or Email already exists" });
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
