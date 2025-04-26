import jwt from "jsonwebtoken";
import { getToken } from "./getToken.js";

const verifyTokenAdmin = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.administrator !== true) {
      return res
        .status(403)
        .json({ message: "Access denied. Admin privileges required." });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token." });
  }
};

export default verifyTokenAdmin;
