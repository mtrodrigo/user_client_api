import express from "express"
import cors from "cors"
import connectDb from "./src/db/conn.js"
import UserRoutes from "./src/routes/UserRoutes.js"
import ProductRoutes from "./src/routes/ProductRoutes.js"
import SaleRoutes from "./src/routes/SaleRoutes.js"

connectDb()

const app = express()

app.use(cors({origin: "*"}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/users", UserRoutes)
app.use("/products", ProductRoutes)
app.use("/sales", SaleRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));