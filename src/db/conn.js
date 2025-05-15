import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

let cachedConnection = null

const connectDb = async () => {
    if (cachedConnection) {
        console.log("Using existing database connection")
        return cachedConnection
    }

    try {
        const DB_URL = process.env.DB_URL
        if(!DB_URL) {
            throw new Error("DB_URL not defined in .env file")
        }
        
        const connection = await mongoose.connect(DB_URL, {
            dbName: "sea_camarao",
            serverSelectionTimeoutMS: 5000
        })
        
        console.log("MongoDB connected successfully!")
        cachedConnection = connection
        return connection
        
    } catch (error) {
        console.error(`Error connecting to database: ${error}`)
        throw error
    }
}

export default connectDb