import jwt from "jsonwebtoken";
import { getToken } from "./getToken.js";

const verifyUserToken = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      return res
        .status(403)
        .json({ message: "Access denied. No token provided." });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token." }).end();
  }
};

export default verifyUserToken;
