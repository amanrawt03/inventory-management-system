import cron from "node-cron";
import pool from "../config/pgConfig.js";
import { transporter } from "../utils/transporter.js";
import { CLEAR_EMPTY_ITEMS } from "../queries/cronjobQueries.js";
import { generateZeroStockRemovalTemplate, generatePlainTextZeroStockEmail } from "../templates/clearEntriesMail.js";

const zeroStockRemovalTask = async () => {
  try {
    // Get items with zero stock
    const zeroStockResult = await pool.query(CLEAR_EMPTY_ITEMS);

    // If there are items to remove
    if (zeroStockResult.rowCount > 0) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "🗑️ Zero Stock Items Removal Notification",
        html: generateZeroStockRemovalTemplate(zeroStockResult.rows),
        text: generatePlainTextZeroStockEmail(zeroStockResult.rows),
      };

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log("Error sending email:", error);
        }
        console.log("Zero stock removal notification has been sent:", info.response);
      });

      // Delete zero stock items
      await pool.query(`
        DELETE FROM inventory 
        WHERE totalstocks = 0
      `);
      console.log(`Removed ${zeroStockResult.rowCount} items with zero stock`);
    } else {
      console.log("No zero stock items to remove");
    }
  } catch (error) {
    console.log("Error in zero stock removal task:", error);
  }
};

// cron.schedule("* * * * * *", zeroStockRemovalTask);
// cron.schedule("55 23 * * *", zeroStockRemovalTask);
