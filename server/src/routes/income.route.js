import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getIncomes, createIncome, updateIncome, deleteIncome } from "../controllers/income.controller.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", getIncomes);
router.post("/", createIncome);
router.put("/:id", updateIncome);
router.delete("/:id", deleteIncome);

export default router;
