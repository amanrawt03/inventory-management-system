import pool from "../config/pgConfig.js";
import {
  CHECK_CUSTOMER_EXISTS,
  INSERT_NEW_CUSTOMER,
} from "../queries/customerQueries.js";
import client from "../config/redisConfig.js";
import {publishNotification} from '../utils/publishNotification.js'
const getCustWithoutPagination = async (req, res) => {
  try {
    const cachedData = await client.get("customers");
    if (cachedData) {
      console.log("Cust cache hit");
      return res.status(200).json({ customers: JSON.parse(cachedData) });
    }

    console.log("Cust cache miss");

    // Query the database for all customers
    const result = await pool.query(`SELECT * FROM customers`);
    if (result.rowCount === 0) {
      return res.status(400).json({ message: "No customers found" });
    }

    await client.setEx("customers", 60, JSON.stringify(result.rows));

    return res.status(200).json({ customers: result.rows });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { customer_name, customer_email } = req.body;

    // Validate input: Ensure both customer_name and email are provided
    if (!customer_name || !customer_email) {
      return res
        .status(400)
        .json({ message: "Customer name and email are required" });
    }

    // Check if the customer already exists by email
    const customerExistsResult = await pool.query(CHECK_CUSTOMER_EXISTS, [
      customer_email,
    ]);

    if (customerExistsResult.rowCount > 0) {
      return res.status(400).json({
        message: "Customer with this email already exists",
      });
    }

    // Insert the new Customer into the database
    const insertCustomerResult = await pool.query(INSERT_NEW_CUSTOMER, [
      customer_name,
      customer_email,
    ]);

    // Create the customer object to return in the response
    const newCustomer = {
      customer_id: insertCustomerResult.rows[0].customer_id,
      customer_name,
      customer_email,
      created_at: new Date().toLocaleDateString("en-GB"), // Format: DD/MM/YYYY
    };

    await client.del("customers");

    // update notification table
    const successMessage = `New customer, ${customer_name} added`;
    const notifyResult = await pool.query(
      `INSERT INTO notifications (type, message) VALUES ($1, $2) RETURNING notification_id`,
      ["Entity Addition", successMessage]
    );
    const notification_id = notifyResult.rows[0].notification_id
    await pool.query(
      `INSERT INTO users_notifications (user_id, notification_id) VALUES 
       (1, $1), (2, $1)`,
      [notification_id]
    );
    const transactionNotification = {
      notification_id,
      type: "Entity Addition",
      is_read:false,
      message: successMessage,
      timestamp: new Date().toISOString(),
    };
    await publishNotification("notifications_channel", transactionNotification);	

    return res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
export { getCustWithoutPagination, createCustomer };
