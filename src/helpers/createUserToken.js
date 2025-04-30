import jwt from "jsonwebtoken";

export const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    {
      id: user._id,
      administrator: user.administrator,
    },
    process.env.JWT_SECRET
  );

  res.status(200).json({ message: "Created", token});
};
