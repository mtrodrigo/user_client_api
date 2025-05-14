import mongoose from "mongoose";
import { getToken } from "../helpers/getToken.js";
import { getUserByToken } from "../helpers/getUserByToken.js";
import { Sale } from "../models/Sale.js";
import { decrypt } from "../helpers/decrypt.js";

export default class SalesController {
  static async createSale(req, res) {
    try {
      //Get token for user
      const token = getToken(req);
      const user = await getUserByToken(token);

      //request validation
      if (!req.body) {
        return res.status(400).json({ error: "No request body" });
      }
      const { products } = req.body;
      if (!products || !Array.isArray(products)) {
        return res.status(400).json({ message: "Empy products list" });
      }

      //Create sale
      const saleData = {
        products: products.map((item) => ({
          name: item.name,
          code: item.code,
          price: item.price,
          quantity: item.quantity,
        })),
        user: {
          userId: user.id,
          name: user.name,
          email: user.email,
          cpf_cnpj: user.cpf_cnpj,
          address: user.address,
          city: user.city,
          state: user.state,
          phone: user.phone,
        },
        attended: false,
      };

      const salvedSale = await Sale.create(saleData);

      res.status(201).json({ message: "Sale salved", salvedSale });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async updateAttended(req, res) {
    try {
      const id = req.params.id;

      //Verify Id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(422).json({ message: "Invalid Id" });
      }

      //Verify request
      if (!req.body) {
        res.status(400).json({ message: "No request body" });
      }

      //Verify sale exists
      const existingSale = await Sale.findById(id);
      if (!existingSale) {
        return res.status(404).json({ message: "Sale not found" });
      }

      const { attended } = req.body;

      //Update
      const sale = await Sale.findByIdAndUpdate(
        id,
        { attended: !existingSale.attended },
        { new: true }
      );

      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }

      res.status(200).json({ message: "Product successfully served" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getSales(req, res) {
    try {
      const sales = await Sale.find().sort("-createdAt")
      const secretKey = process.env.SECRET_KEY

      const decryptedData = sales.map((sale) => {
        let decryptedCpfCnpj = "";
        
        try {
          if (sale.user.cpf_cnpj) {
            decryptedCpfCnpj = decrypt(sale.user.cpf_cnpj, secretKey)
          }
        } catch (error) {
          res.status(404).json({message: error});
        }

        return {
          ...sale.toObject(),
          user: {
            userId: sale.user.userId,
            name: sale.user.name,
            email: sale.user.email,
            address: sale.user.address,
            city: sale.user.city,
            state: sale.user.state,
            phone: sale.user.phone,
            cpf_cnpj: decryptedCpfCnpj
          }
        }
      })
      res.status(200).json({ message: "All users loaded successfully", decryptedData});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getSalesById(req, res) {
    try {
      const id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(422).json({ message: "Invalid Id" });
      }

      const sale = await Sale.findById(id);

      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }

      const secretKey = process.env.SECRET_KEY;
      let decryptedCpfCnpj = "";

      try {
        if (sale.user.cpf_cnpj) {
          decryptedCpfCnpj = decrypt(sale.user.cpf_cnpj, secretKey);
        }
      } catch (error) {
        return res.status(500).json({ message: "Error decrypting CPF/CNPJ" });
      }

      const saleWithDecryptedCpfCnpj = {
        ...sale.toObject(),
        user: {
          ...sale.user,
          cpf_cnpj: decryptedCpfCnpj,
        },
      };

      res.status(200).json(saleWithDecryptedCpfCnpj);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getSaleByUserId(req, res) {
    const userId = req.params.id

    // Verify user id
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(422).json({ message: "Invalid User ID" });
    }

    try {
        const sales = await Sale.find({ "user.userId": userId })
            .sort({ createdAt: -1 });

        if (!sales || sales.length === 0) {
            return res.status(404).json({ 
                message: "No orders found for this user",
                data: []
            });
        }

        res.status(200).json(sales);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ 
            message: "Internal server error: ", error });
    }
}
}
