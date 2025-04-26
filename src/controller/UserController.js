import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { createUserToken } from "../helpers/createUserToken.js";

export default class UserController {
  static async register(req, res) {
    if (!req.body) {
      return res.status(400).json({ error: "Empty request body" });
    }

    const {
      name,
      email,
      password,
      confirmpassword,
      cpf_cnpj,
      address,
      city,
      state,
      phone,
    } = req.body;

    const administrator = false;

    //validation
    if (
      !name ||
      !email ||
      !password ||
      !confirmpassword ||
      !cpf_cnpj ||
      !address ||
      !city ||
      !state ||
      !phone
    ) {
      res.status(422).json({ message: "Mandatory field not filled" });
      return;
    }

    if (password !== confirmpassword) {
      res
        .status(422)
        .json({ message: "Password and confirmation are different" });
      return;
    }

    //user already exists
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(422).json({ message: "invalid E-mail" });
      return;
    }

    //user cpf or cnpj exists
    const cpf_cnpjHash = await bcrypt.hash(cpf_cnpj, process.env.FIXED_SALT);

    const cpf_cnpjExists = await User.findOne({ cpf_cnpj: cpf_cnpjHash });
    if (cpf_cnpjExists) {
      res.status(422).json({ message: "CPF or CNPJ already registered" });
      return;
    }

    const salt = await bcrypt.genSalt(16);
    const passwordHash = await bcrypt.hash(password, salt);

    //create user
    const user = new User({
      name,
      email,
      password: passwordHash,
      cpf_cnpj: cpf_cnpjHash,
      address,
      city,
      state,
      phone,
      administrator: administrator,
    });

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async getAllUsers(req, res) {
    const users = await User.find().sort("-createdAt");
    res.status(200).json({ users: users });
  }
}
