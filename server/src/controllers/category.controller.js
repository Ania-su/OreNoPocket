import pool from "../utils/db.js";

export const getCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories WHERE user_id=$1", [req.user.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      "INSERT INTO categories (user_id, name) VALUES ($1, $2) RETURNING *",
      [req.user.userId, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const check = await pool.query("SELECT * FROM categories WHERE id=$1 AND user_id=$2", [id, req.user.userId]);
    if (check.rows.length === 0) return res.status(403).json({ message: "Unauthorized" });

    const result = await pool.query(
      "UPDATE categories SET name=$1 WHERE id=$2 RETURNING *",
      [name, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM categories WHERE id=$1 AND user_id=$2", [id, req.user.userId]);
    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
