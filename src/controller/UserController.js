import { User } from "../models/User.js";
import { createUserToken } from "../helpers/createUserToken.js";
import { encrypt } from "../helpers/encrypt.js";
import { decrypt } from "../helpers/decrypt.js";

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

    //email already exists
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(422).json({ message: "invalid E-mail" });
      return;
    }

    const secretKey = process.env.SECRET_KEY;

    //user cpf or cnpj exists
    const allUsers = await User.find({});
    const existsCpfCnpj = allUsers.find((user) => {
      const decryptedCpfCnpj = decrypt(user.cpf_cnpj, secretKey);
      return decryptedCpfCnpj === cpf_cnpj;
    });
    if (existsCpfCnpj) {
      return res
        .status(422)
        .json({ message: "CPF or CNPJ already registered" });
    }

    //encrypt data
    const cpf_cnpjEncrypted = encrypt(cpf_cnpj, secretKey);
    const passwordEncrypted = encrypt(password, secretKey);

    //create user
    const user = new User({
      name,
      email,
      password: passwordEncrypted,
      cpf_cnpj: cpf_cnpjEncrypted,
      address,
      city,
      state,
      phone,
      administrator: administrator,
    });

    try {
      const newUser = await user.save();
      const token = createUserToken(newUser);
      return res
        .status(201)
        .json({ message: "User created successfully", token });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await User.find().sort("-createdAt");
      const secretKey = process.env.SECRET_KEY;

      users.map((user) => {
        let decryptedCpfCnpj = "";
        let decryptedPassword = "";

        try {
          if (user.cpf_cnpj) {
            decryptedCpfCnpj = decrypt(user.cpf_cnpj, secretKey);
          }
          if (user.password) {
            decryptedPassword = decrypt(user.password, secretKey);
          }
        } catch (error) {
          res.status(404).json({ message: error });
        }

        return {
          ...user.toObject(),
          cpf_cnpj: decryptedCpfCnpj,
          password: decryptedPassword,
        };
      });

      res.status(200).json({ message: "All users loaded successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const secretKey = process.env.SECRET_KEY;

      // Validate if ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await User.findById(id);

      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Decrypted
      let decryptedCpfCnpj = "";
      let decryptedPassword = "";

      try {
        if (user.cpf_cnpj) {
          decryptedCpfCnpj = decrypt(user.cpf_cnpj, secretKey);
        }
        if (user.password) {
          decryptedPassword = decrypt(user.password, secretKey);
        }
      } catch (error) {
        return res.status(500).json({
          message: "Failed to decrypt sensitive data",
          error: error.message,
        });
      }

      const userResponse = {
        ...user.toObject(),
        cpf_cnpj: decryptedCpfCnpj,
        password: decryptedPassword,
      };

      res.status(200).json({
        message: "User retrieved successfully",
        user: userResponse,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching user data",
        error: error.message,
      });
    }
  }

  static async updateUser(req, res) {
    const id = req.params.id;

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
      administrator,
    } = req.body;

    // Validation
    if (
      !name ||
      !email ||
      !cpf_cnpj ||
      !address ||
      !city ||
      !state ||
      !phone ||
      administrator === undefined
    ) {
      res.status(422).json({ message: "Mandatory field not filled" });
      return;
    }

    // Check if user exists
    const userToUpdate = await User.findOne({ _id: id });
    if (!userToUpdate) {
      return res.status(422).json({ message: "User not found" });
    }

    // Check if the email is already in use by another user
    const emailExists = await User.findOne({ email: email, _id: { $ne: id } });
    if (emailExists) {
      return res
        .status(422)
        .json({ message: "Email already in use by another user" });
    }

    const secretKey = process.env.SECRET_KEY;
    const cpf_cnpjEncrypted = encrypt(cpf_cnpj, secretKey);

    // Checks if CPF/CNPJ already exists in another user
    const cpfCnpjExists = await User.findOne({
      cpf_cnpj: cpf_cnpjEncrypted,
      _id: { $ne: id },
    });

    if (cpfCnpjExists) {
      return res
        .status(422)
        .json({ message: "CPF/CNPJ already registered for another user" });
    }

    //update user
    const updateData = {
      name,
      email,
      cpf_cnpj: cpf_cnpjEncrypted,
      address,
      city,
      state,
      phone,
      administrator,
    };

    if (password) {
      if (password !== confirmpassword) {
        return res
          .status(422)
          .json({ message: "Password and confirmation are different" });
      }
      updateData.password = encrypt(password, secretKey);
    }

    try {
      await User.updateOne({ _id: id }, { $set: updateData });
      return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async removeUserById(req, res) {
    try {
      const result = await User.deleteOne({ _id: req.params.id });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User removed successfully" });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  static async login(req, res) {
    if (!req.body) {
      return res.status(400).json({ error: "Empty request body" });
    }

    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      res.status(422).json({ message: "E-mail and password are required" });
      return;
    }

    //check user
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(422).json({ message: "User is not registered" });
      return;
    }

    //check password
    const secretKey = process.env.SECRET_KEY;
    const decryptedPassword = decrypt(user.password, secretKey);
    if (password !== decryptedPassword) {
      res.status(422).json({ message: "Invalid password" });
      return;
    }
    //create token
    try {
      const token = createUserToken(user);
      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error generating token", error: error.message });
    }
  }
}
