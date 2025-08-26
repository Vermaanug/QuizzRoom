import jwt from "jsonwebtoken";
import UserModel from "../model/UserModel.js";

const authMiddleWare = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { id: userId } = decodedToken;

    const user = await UserModel.findById({ _id: userId });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleWare;
