import pool from "../config/pgConfig.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import cloudinary from "../config/cloudinaryConfig.js";
import { transporter } from "../utils/transporter.js";
import { OAuth2Client } from "google-auth-library";
const CLIENT_ID = process.env.CLIENT_ID
const client = new OAuth2Client(CLIENT_ID)
import {
  createPasswordResetEmailTemplate,
  createPlainTextEmail,
} from "../templates/passwordResetTemplate.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Query user from database
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ user_id: user.user_id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Set cookie
    res.cookie("jwt", token, {
      httpOnly: true, // Accessible only to the server
      maxAge: 3600000, // 1 hour
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      secure: process.env.NODE_ENV === "production", 
    });

    // Send response without password
    const { password: _, ...userData } = user;
    return res.status(200).json({ user: userData });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginWithGoogle = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    // Verify the token using Google's OAuth2 client
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    // Extract the user's information from the token
    const payload = ticket.getPayload();
    const userId = 1; // Unique Google user ID
    const userEmail = payload.email;
    const userName = payload.name;
    const profile_image = payload.picture;

    // Check if the user already exists in the database
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE user_id = 1"
    );

    if (existingUser.rowCount === 0) {
      // Insert new user into the database
      const defaultValues = {
        location: null,
        phone_number: null,
        job_role: null,
        blood_group: null,
        date_of_birth: null,
        nationality: null,
        marital_status: null,
        marriage_date: null,
        spouse_name: null,
        place_of_birth: null,
        residential_status: null,
        father_name: null,
        religion: null,
        physically_challenged: false,
        international_employee: false,
        street_address: null,
        city: null,
        state: null,
        zip_code: null,
        country: null,
      };

      await pool.query(
        `INSERT INTO users (
          user_id, email, name, profile_image,
          location, phone_number, job_role,
          blood_group, date_of_birth, nationality, marital_status,
          marriage_date, spouse_name, place_of_birth, residential_status,
          father_name, religion, physically_challenged, international_employee,
          street_address, city, state, zip_code, country
        ) VALUES (
          $1, $2, $3, $4,
          $5, $6, $7, $8, $9, $10, $11,
          $12, $13, $14, $15, $16, $17, $18, $19,
          $20, $21, $22, $23, $24
        )`,
        [
          userId, userEmail, userName, profile_image,
          defaultValues.location, defaultValues.phone_number, defaultValues.job_role,
          defaultValues.blood_group, defaultValues.date_of_birth, defaultValues.nationality, defaultValues.marital_status,
          defaultValues.marriage_date, defaultValues.spouse_name, defaultValues.place_of_birth, defaultValues.residential_status,
          defaultValues.father_name, defaultValues.religion, defaultValues.physically_challenged, defaultValues.international_employee,
          defaultValues.street_address, defaultValues.city, defaultValues.state, defaultValues.zip_code, defaultValues.country,
        ]
      );
    }

    // Generate a JWT token
    const jwtToken = jwt.sign({ user_id: userId }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Set cookie
    res.cookie("jwt", jwtToken, {
      httpOnly: true, // Accessible only to the server
      maxAge: 3600000, // 1 hour
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Google login successful",
      user: {
        user_id: userId,
        email: userEmail,
        name: userName,
        profile_image,
      },
    });
  } catch (error) {
    console.error("Error during Google login:", error.message);
    res.status(500).json({ message: error.message });
  }
};


export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    if (existingUser.rowCount > 0) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into the database
    const result = await pool.query(
      `INSERT INTO users (name, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING user_id, name, email, created_at`,
      [name, email, hashedPassword]
    );

    const newUser = result.rows[0];

    // Send success response
    return res.status(201).json({
      message: "Account created successfully",
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};  

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error.message);
    res.status(500).json({ message: 'Error logging out' });
  }
};


export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const username = user.username || user.email.split("@")[0];

    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 300 * 1000); // 5 minute expiration

    // Store the token in the database
    await pool.query(
      `INSERT INTO tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
      [user.user_id, resetToken, expiresAt]
    );

    const resetLink = `${process.env.FRONTEND_URL}/${resetToken}`;

    // Configure email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: createPasswordResetEmailTemplate(username, resetLink),
      text: createPlainTextEmail(username, resetLink),
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Password reset link has been sent to your email",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Check if the token exists and is not expired
    const result = await pool.query(
      `SELECT * FROM tokens WHERE token = $1 AND expires_at > NOW()`,
      [token]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const { user_id } = result.rows[0];

    // Fetch the existing password
    const userResult = await pool.query(
      `SELECT password FROM users WHERE user_id = $1`,
      [user_id]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingPassword = userResult.rows[0].password;

    // Check if the new password matches the existing one
    const isMatch = await bcrypt.compare(newPassword, existingPassword);
    if (isMatch) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password",
      });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    await pool.query(`UPDATE users SET password = $1 WHERE user_id = $2`, [
      hashedPassword,
      user_id,
    ]);

    // Delete the token after successful reset
    await pool.query(`DELETE FROM tokens WHERE token = $1`, [token]);

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



// Get profile controller
export const getProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const user = result.rows[0];

    // If no profile image is found, set a default image URL
    if (!user.profile_image) {
      user.profile_image =
        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
    }

    delete user.password; // Remove sensitive information
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching profile",
    });
  }
};

export const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword, confirmPassword } = req.body;

  // Validate input
  if (!email || !oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      status: "error",
      message: "Email, old password, and new password are required",
    });
  }

  try {
    // First, get the user and their current password hash
    const userQuery = "SELECT user_id, password FROM users WHERE email = $1";
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const user = userResult.rows[0];

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: "error",
        message: "Current password is incorrect",
      });
    }

    // Check if the new password is the same as the existing password
    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords donot match",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in database
    const updateQuery = `
        UPDATE users 
        SET 
          password = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $2
        RETURNING email`;

    const updateResult = await pool.query(updateQuery, [
      hashedPassword,
      user.user_id,
    ]);

    if (updateResult.rows.length === 0) {
      throw new Error("Failed to update password");
    }

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    throw new Error("Failed to change password");
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.userId;
  const {
    // Profile Info
    name,
    location,
    phone_number,
    job_role,

    // Personal Info
    blood_group,
    date_of_birth,
    nationality,
    marital_status,
    marriageDate,
    spouseName,
    placeOfBirth,
    residentialStatus,
    father_name,
    religion,
    physically_challeneged,
    international_employee,

    // Address Info
    street_address,
    city,
    state,
    zip_code,
    country,
  } = req.body;

  try {
    let profileImageUrl = undefined;

    // Handle image upload if file exists
    if (req.file) {
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile-images",
        width: 300,
        height: 300,
        crop: "fill",
        quality: "auto",
      });

      profileImageUrl = result.secure_url;
    }

    // Build the dynamic query
    let updateFields = [];
    let queryParams = [];
    let paramCount = 1;

    // Helper function to add fields to update query
    const addField = (fieldName, value) => {
      if (value !== undefined) {
        updateFields.push(`${fieldName} = $${paramCount}`);
        queryParams.push(value);
        paramCount++;
      }
    };

    // Add all fields to update
    addField("name", name);
    addField("location", location);
    addField("phone_number", phone_number);
    addField("job_role", job_role);
    addField("blood_group", blood_group);
    addField("date_of_birth", date_of_birth);
    addField("nationality", nationality);
    addField("marital_status", marital_status);
    addField("marriage_date", marriageDate);
    addField("spouse_name", spouseName);
    addField("place_of_birth", placeOfBirth);
    addField("residential_status", residentialStatus);
    addField("father_name", father_name);
    addField("religion", religion);
    addField("physically_challenged", physically_challeneged);
    addField("international_employee", international_employee);
    addField("street_address", street_address);
    addField("city", city);
    addField("state", state);
    addField("zip_code", zip_code);
    addField("country", country);

    // Add profile image if it was uploaded
    if (profileImageUrl) {
      addField("profile_image", profileImageUrl);
    }

    // If there are no fields to update, return early
    if (updateFields.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No fields provided for update",
      });
    }

    // Construct and execute the update query
    const query = `
        UPDATE users 
        SET ${updateFields.join(", ")}, 
            updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = $${paramCount} 
        RETURNING *;
      `;

    queryParams.push(userId);

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Remove sensitive information before sending response
    const updatedUser = result.rows[0];
    delete updatedUser.password;

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    throw error.message;
  }
};
