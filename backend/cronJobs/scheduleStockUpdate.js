import cron from "node-cron";
import pool from "../config/pgConfig.js";
import { GET_ITEMS_OF_LOW_STOCK_LEVELS } from "../queries/cronjobQueries.js";
import { transporter } from '../utils/transporter.js'
import { generateLowStockEmailTemplate, generatePlainTextEmail } from "../templates/lowStockAlert.js";

const task = async () => {
  try {
    console.log("Fetcing products having stock levels less than min threshold");
    const result = await pool.query(GET_ITEMS_OF_LOW_STOCK_LEVELS);
    
    if (result.rowCount === 0) {
      console.log("All items are stocked above the minimum threshold");
    } else {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "🚨 Low Stock Alert - Immediate Action Required",
        html: generateLowStockEmailTemplate(result.rows),
        text: generatePlainTextEmail(result.rows),
      };

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log("Error sending email:", error);
        }
        console.log("Stock level updates have been sent to your email:", info.response);
      });
    }
  } catch (error) {
    console.log("Error in task execution:", error);
  }
};

// cron.schedule("55 11 * * 1-5", task);
// cron.schedule("*/5 * * * * *", task);