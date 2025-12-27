import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getExpenses, createExpense, updateExpense, deleteExpense } from "../controllers/expense.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getExpenses);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
