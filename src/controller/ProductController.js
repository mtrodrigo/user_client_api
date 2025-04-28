import { Product } from "../models/Product.js";
import axios from "axios";
import FormData from "form-data";

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
      console.log(product);
      
      await product.save();
      res.status(201).json({ message: "Registered product" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
}
