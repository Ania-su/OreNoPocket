import pool from "../utils/db.js";
import fs from "fs";
import path from "path";   

export const getReceipts = async (req, res) => {
  try {
    const { expense_id } = req.params;
    const result = await pool.query(
      "SELECT * FROM receipts WHERE expense_id=$1",
      [expense_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const uploadReceipt = async (req, res) => {
  try {
    const { expense_id } = req.body;
    if (!req.file) return res.status(400).json({ message: "Missing file" });

    const filePath = req.file.path;
    const result = await pool.query(
      "INSERT INTO receipts (expense_id, file_path, file_type, file_size) VALUES ($1,$2,$3,$4) RETURNING *",
      [expense_id, filePath, req.file.mimetype, req.file.size]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
