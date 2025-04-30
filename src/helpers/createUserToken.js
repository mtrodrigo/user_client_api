import jwt from "jsonwebtoken";

export const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      cpf_cnj: user.cpf_cnj,
      adress: user.adress,
      city: user.city,
      state: user.state,
      phone: user.phone,
      administrator: user.administrator,
    },
    process.env.JWT_SECRET
  );

  res.status(200).json({ message: "Created", token});
};
