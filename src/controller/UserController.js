import { User } from "../models/User";
import bcrypt from "bcryptjs";
import {createUserToken} from "../helpers/createUserToken"

export default class UserController {
  static async register(req, res) {
    const {
      name,
      email,
      password,
      confirmpassword,
      cpf_cnpj,
      adress,
      city,
      state,
      phone,
    } = req.body;

    const administrator = false

    //validation
    if (
      !name ||
      !email ||
      !password ||
      !confirmpassword ||
      !cpf_cnpj ||
      !adress ||
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
    }

    //create user
    const salt = await bcrypt.genSalt(16);
    const passwordHash = await bcrypt.hash(password, salt);
    const cpf_cnpjHash = await bcrypt.hash(cpf_cnpj, salt);

    const user = new User({
      name,
      email,
      password: passwordHash,
      cpf_cnpj: cpf_cnpjHash,
      adress,
      city,
      state,
      phone,
      administrator: administrator
    });

    try {
        const newUser = await user.save()
        await createUserToken(newUser, req, res)
    } catch (error) {
        res.status(500).json({message: error})
    }
  }
}
