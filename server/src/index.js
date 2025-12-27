import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import expensesRoutes from "./routes/expense.route.js";
import incomesRoutes from "./routes/income.route.js";
import categoriesRoutes from "./routes/category.route.js";
import receiptsRoutes from "./routes/receipt.route.js";
import passport from "./config/passport.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;  

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/incomes", incomesRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/receipts", receiptsRoutes);


app.get("/", (req, res) => res.send("Ore No Pocket API is running"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
