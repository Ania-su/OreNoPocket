import pool from "../utils/db.js";

export const getExpenses = async (req, res) => {
  try {
    const { start, end, category, type } = req.query;
    let query = "SELECT * FROM expenses WHERE user_id=$1";
    const params = [req.user.userId];
    let idx = 2;

    if (start) {
      query += ` AND date >= $${idx++}`;
      params.push(start);
    }
    if (end) {
      query += ` AND date <= $${idx++}`;
      params.push(end);
    }
    if (category) {
      query += ` AND category_id=$${idx++}`;
      params.push(category);
    }
    if (type) {
      query += ` AND type=$${idx++}`;
      params.push(type);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { amount, type, description, date, start_date, end_date, category_id } = req.body;
    const result = await pool.query(
      `INSERT INTO expenses (user_id, category_id, amount, type, description, date, start_date, end_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [req.user.userId, category_id || null, amount, type || "one-time", description, date, start_date, end_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, description, date, start_date, end_date, category_id } = req.body;

    const check = await pool.query("SELECT * FROM expenses WHERE id=$1 AND user_id=$2", [id, req.user.userId]);
    if (check.rows.length === 0) return res.status(403).json({ message: "Unauthorized" });

    const result = await pool.query(
      `UPDATE expenses SET category_id=$1, amount=$2, type=$3, description=$4, date=$5, start_date=$6, end_date=$7
       WHERE id=$8 RETURNING *`,
      [category_id || null, amount, type, description, date, start_date, end_date, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM expenses WHERE id=$1 AND user_id=$2", [id, req.user.userId]);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
