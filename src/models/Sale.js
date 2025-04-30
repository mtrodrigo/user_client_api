import mongoose from "mongoose";

const { Schema } = mongoose;

const salesSchema = new Schema(
  {
    products: [
      {
        name: String,
        code: String,
        price: Number,
        quantity: Number,
      },
    ],
    user: {
      userId: String,
      name: String,
      email: String,
      cpf_cnpj: String,
      address: String,
      city: String,
      state: String,
      phone: String,
    },
    attended: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export const Sale = mongoose.model("Sale", salesSchema);
