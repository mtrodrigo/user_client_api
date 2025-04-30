import mongoose from "mongoose";
import { getToken } from "../helpers/getToken.js";
import { getUserByToken } from "../helpers/getUserByToken.js";
import { Sale } from "../models/Sale.js";

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
          userId: user.userId,
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

      const salvedSale = await Sales.create(saleData);

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
      const sale = await Sale.findByIdAndUpdate(id, {
        attended,
      });

      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }

      res.status(200).json({ message: "Product successfully served" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getSales(req, res) {}
}
