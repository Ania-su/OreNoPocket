import pool from "../utils/db.js";

export const getIncomes = async (req, res) => {
  try {
    const { start, end } = req.query;
    let query = "SELECT * FROM incomes WHERE user_id=$1";
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

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createIncome = async (req, res) => {
  try {
    const { amount, source, description, date } = req.body;
    const result = await pool.query(
      `INSERT INTO incomes (user_id, amount, source, description, date) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [req.user.userId, amount, source, description, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, source, description, date } = req.body;

    const check = await pool.query("SELECT * FROM incomes WHERE id=$1 AND user_id=$2", [id, req.user.userId]);
    if (check.rows.length === 0) return res.status(403).json({ message: "Pas autorisé" });

    const result = await pool.query(
      `UPDATE incomes SET amount=$1, source=$2, description=$3, date=$4 WHERE id=$5 RETURNING *`,
      [amount, source, description, date, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM incomes WHERE id=$1 AND user_id=$2", [id, req.user.userId]);
    res.json({ message: "Income deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
