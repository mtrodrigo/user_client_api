import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        cpf_cnpj: {
            type: String,
            required: true,
            unique: true
        },
        adress: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        administrator: {
            type: Boolean
        }
    },
    {timestamps: true}
)
export const User = mongoose.model("User", userSchema) 