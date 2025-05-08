import jwt from "jsonwebtoken";

export const createUserToken = (user) => {
  const token = jwt.sign(
    { id: user._id, email: user.email, administrator: user.administrator },
    process.env.JWT_SECRET,
  );
  return token;
};
