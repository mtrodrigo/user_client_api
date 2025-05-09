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
    const image64 = req.body.image;

    //validations
    if (!name || !code || !description || !price) {
      return res.status(422).json({ message: "Empty request body" });
    }

    //Image upload to ImgBB
    try {
      const formData = new FormData();
      formData.append("image", image64);

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
  
    // Verificar autenticação primeiro
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Token não fornecido" });
    }
  
    // Verificar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ message: "ID inválido" });
    }
  
    try {
      // Verificar se o produto existe antes de tentar atualizar
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
  
      let imageUrl;
      const updates = {};
  
      // Processar imagem se fornecida
      if (req.file) {
        try {
          const formData = new FormData();
          formData.append("image", req.file.buffer.toString("base64"));
  
          const imgbbResponse = await axios.post(
            `https://api.imgbb.com/1/upload?key=${process.env.API_KEY}`,
            formData,
            { headers: formData.getHeaders() }
          );
          
          if (!imgbbResponse.data.success) {
            throw new Error("Falha ao enviar imagem para ImgBB");
          }
          
          imageUrl = imgbbResponse.data.data.url;
          updates.image = imageUrl;
        } catch (error) {
          console.error("Erro no upload da imagem:", error);
          return res.status(500).json({ message: "Erro ao processar imagem" });
        }
      }
  
      // Processar outros campos
      if (req.body.name) updates.name = req.body.name;
      if (req.body.code) updates.code = req.body.code;
      if (req.body.description) updates.description = req.body.description;
      
      if (req.body.price) {
        const price = parseFloat(req.body.price);
        if (isNaN(price)) {
          return res.status(400).json({ message: "Preço inválido" });
        }
        updates.price = price;
      }
  
      // Verificar se há atualizações
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "Nenhuma atualização fornecida" });
      }
  
      // Atualizar produto
      const product = await Product.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );
  
      res.status(200).json({ 
        success: true,
        message: "Produto atualizado com sucesso",
        data: product
      });
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          message: "Erro de validação",
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: "Erro interno no servidor",
        error: error.message 
      });
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
