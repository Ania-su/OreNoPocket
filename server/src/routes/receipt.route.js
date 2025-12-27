import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.js";
import { getReceipts, uploadReceipt } from "../controllers/receipt.controller.js";

const router = express.Router();
router.use(authMiddleware);

const upload = multer({ dest: "uploads/" });

router.get("/:expense_id", getReceipts);
router.post("/", upload.single("receipt"), uploadReceipt);

export default router;
