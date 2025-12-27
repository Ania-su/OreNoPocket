import pool from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SALT_ROUNDS = 10;

export const signup = async (req, res) => {
  try {
    const { firstname, lastname, username, birthdate, email, password } = req.body;

    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1 OR username=$2",
      [email, username]
    );
    if (existing.rows.length) return res.status(400).json({ message: "Email ou username déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (firstname, lastname, username, birthdate, email, password)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, firstname, lastname, username, email, birthdate, created_at`,
      [firstname, lastname, username, birthdate, email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (!user.rows.length) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

    const token = jwt.sign({ id: user.rows[0].id, username: user.rows[0].username }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export const me = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, firstname, lastname, username, email, birthdate, created_at FROM users WHERE id=$1",
      [req.user.userId]
    )
    if (!user.rows.length) return res.status(404).json({ message: "User not found" });

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
