import express from "express";
import cors from "cors";
import connectDb from "../src/db/conn.js";
import UserRoutes from "../src/routes/UserRoutes.js";
import ProductRoutes from "../src/routes/ProductRoutes.js";
import SaleRoutes from "../src/routes/SaleRoutes.js";

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/users", UserRoutes);
app.use("/products", ProductRoutes);
app.use("/sales", SaleRoutes);
app.get("/", (req, res) => res.status(200).json({ status: "OK" }));

// Vercel serverless handler
const handler = async (req, res) => {
  try {
    await connectDb();
    return app(req, res);
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Initialize database connection for local development
if (process.env.VERCEL_ENV !== "production") {
  (async () => {
    try {
      await connectDb();
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => console.log(`Local server on port ${PORT}`));
    } catch (error) {
      console.error("Failed to start local server:", error);
    }
  })();
}
