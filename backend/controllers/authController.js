import pool from "../config/pgConfig.js";
import jwt from "jsonwebtoken";
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    if (result.rowCount === 0) return res.status(404).json({ message: "User not found" });
    const user = result.rows[0];
    if (user.password !== password)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        user_id: user.user_id,
      },  
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("jwt", token, {
      httpOnly: true, // Makes the cookie accessible only to the server (prevents JS access)
      maxAge: 3600000, // Cookie expires after 1 hour
      sameSite: "None", // Necessary for cross-origin requests
      secure: process.env.NODE_ENV === "production", // Set to true for production (HTTPS required)
    });
    return res.status(200).json({ user: user });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

