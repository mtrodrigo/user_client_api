import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const connectDb = async () => {
    try {
        const DB_URL = process.env.DB_URL
        if(!DB_URL) {
            throw new Error("DB_URL not defined in .env file")
        }

        await mongoose.connect(DB_URL, {
            dbName: "sea_camarao"
        })

        console.log("MongoDB connected successfully!");
        
    } catch (error) {
        console.error(`Error to connect: ${error}`);
        process.exit(1)
    }
}

export default connectDb