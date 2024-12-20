import pool from "../config/pgConfig.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import cloudinary from 'cloudinary';
import { catchAsync } from '../utils/catchAsync.js';
import {
  createPasswordResetEmailTemplate,
  createPlainTextEmail,
} from "../passwordResetTemplate.js";

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const login = async (req, res, next) => {
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
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
    });

    // Send response without password
    const { password: _, ...userData } = user;
    return res.status(200).json({ user: userData });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signup = async (req, res, next) => {
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

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    const user = result.rows[0];
    const username = user.username || user.email.split("@")[0];

    // Generate reset token with 1 minute expiration
    const resetToken = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.RESET_PASSWORD_SECRET,
      { expiresIn: "1m" }
    );

    const resetLink = `${process.env.FRONTEND_URL}/${resetToken}`;

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

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

    // Verify the token
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);

    // Fetch the existing password from the database
    const result = await pool.query(
      `SELECT password FROM users WHERE user_id = $1`,
      [decoded.user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User  not found" });
    }

    const existingPassword = result.rows[0].password;

    // Check if the new password is the same as the existing password
    const isMatch = await bcrypt.compare(newPassword, existingPassword);
    if (isMatch) {
      return res
        .status(400)
        .json({
          message: "New password cannot be the same as the old password",
        });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the password in the database
    await pool.query(`UPDATE users SET password = $1 WHERE user_id = $2`, [
      hashedPassword,
      decoded.user_id,
    ]);

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset token has expired" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const updateProfile = catchAsync(async (req, res) => {
  const userId = req.userId; 
  const {
    // Profile Info
    name,
    location,
    phoneNumber,
    jobRole,
    
    // Personal Info
    bloodGroup,
    dateOfBirth,
    nationality,
    maritalStatus,
    marriageDate,
    spouseName,
    placeOfBirth,
    residentialStatus,
    fatherName,
    religion,
    physicallyChalleneged,
    internationalEmployee,
    
    // Address Info
    streetAddress,
    city,
    state,
    zipCode,
    country
  } = req.body;

  try {
    let profileImageUrl = undefined;

    // Handle image upload if file exists
    if (req.file) {
      // First, fetch the old image URL to delete from cloudinary
      const oldImageResult = await pool.query(
        'SELECT profile_image FROM users WHERE user_id = $1',
        [userId]
      );

      const oldImageUrl = oldImageResult.rows[0]?.profile_image;

      // If there's an old image, delete it from cloudinary
      if (oldImageUrl) {
        const publicId = oldImageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile-images',
        width: 300,
        height: 300,
        crop: 'fill',
        quality: 'auto'
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
    addField('name', name);
    addField('location', location);
    addField('phone_number', phoneNumber);
    addField('job_role', jobRole);
    addField('blood_group', bloodGroup);
    addField('date_of_birth', dateOfBirth);
    addField('nationality', nationality);
    addField('marital_status', maritalStatus);
    addField('marriage_date', marriageDate);
    addField ('spouse_name', spouseName);
    addField('place_of_birth', placeOfBirth);
    addField('residential_status', residentialStatus);
    addField('father_name', fatherName);
    addField('religion', religion);
    addField('physically_challenged', physicallyChalleneged);
    addField('international_employee', internationalEmployee);
    addField('street_address', streetAddress);
    addField('city', city);
    addField('state', state);
    addField('zip_code', zipCode);
    addField('country', country);

    // Add profile image if it was uploaded
    if (profileImageUrl) {
      addField('profile_image', profileImageUrl);
    }

    // If there are no fields to update, return early
    if (updateFields.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields provided for update'
      });
    }

    // Construct and execute the update query
    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = $${paramCount} 
      RETURNING *;
    `;

    queryParams.push(userId);

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User  not found'
      });
    }

    // Remove sensitive information before sending response
    const updatedUser  = result.rows[0];
    delete updatedUser .password;

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser 
      }
    });

  } catch (error) {
    // If there was an error and we uploaded a new image, we should delete it
    if (profileImageUrl) {
      const publicId = profileImageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    throw error;
  }
}); 


export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }

    // Convert buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'profile-images',
      width: 300,
      height: 300,
      crop: 'fill',
      quality: 'auto'
    });

    res.status(200).json({
      status: 'success',
      imageUrl: result.secure_url
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload image'
    });
  }
};

// Get profile controller
export const getProfile = catchAsync(async (req, res) => {
  const userId = req.userId;

  const result = await pool.query(
    'SELECT * FROM users WHERE user_id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }

  const user = result.rows[0];
  delete user.password;

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});