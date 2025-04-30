import { Product } from "../models/Product.js";
import axios from "axios";
import FormData from "form-data";
import mongoose from "mongoose";

export default class ProductController {
  static async create(req, res) {
    if (!req.body) {
      return res.status(400).json({ error: "No request body" });
    }

    const { name, code, description, price } = req.body;
    const image = req.file;

    //validations
    if (!name || !code || !description || !price) {
      return res.status(422).json({ message: "Empty request body" });
    }

    //Image upload to ImgBB
    try {
      const formData = new FormData();
      formData.append("image", image.buffer.toString("base64"));

      const imgbbResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.API_KEY}`,
        formData,
        { headers: formData.getHeaders() }
      );
      const imageUrl = imgbbResponse.data.data.url;

      //create a product
      const product = new Product({
        name,
        code,
        description,
        price,
        image: imageUrl,
      });

      await product.save();
      res.status(201).json({ message: "Registered product" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
  static async getAll(req, res) {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async getProductsById(req, res) {
    const id = req.params.id;

    // Verify ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ message: "Invalid Id" });
    }

    try {
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async updateProductById(req, res) {
    const id = req.params.id;

    
    //verify id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ messagem: "Invalid Id" });
    }

    if (!req.body) {
      return res.status(400).json({ error: "No request body" });
    }

    const { name, code, description, price } = req.body;
    const image = req.file;

    //validations
    if (!name || !code || !description || !price) {
      return res.status(422).json({ message: "Empty request body" });
    }
    //Image upload to ImgBB
    try {
      let imageUrl;

      if (image) {
        const formData = new FormData();
        formData.append("image", image.buffer.toString("base64"));

        const imgbbResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${process.env.API_KEY}`,
          formData,
          { headers: formData.getHeaders() }
        );
        imageUrl = imgbbResponse.data.data.url;
      }

      //check if product exists
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      //update a product
      const product = await Product.findByIdAndUpdate(
        id,
        {
          name,
          code,
          description,
          price,
          ...(image && { image: imageUrl }),
        },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async removeProductById(req, res) {
    try {
      const result = await Product.deleteOne({ _id: req.params.id });
      if (res.deletedCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({ message: "Product removed successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
}
