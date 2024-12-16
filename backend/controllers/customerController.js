import pool from "../config/pgConfig.js";
import {CHECK_CUSTOMER_EXISTS, INSERT_NEW_CUSTOMER} from '../queries/customerQueries.js'

const getCustWithoutPagination = async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM customers`);
      if (result.rowCount === 0)
        return res.status(400).json({ message: "No customers found" });
      return res.status(200).json({ customers: result.rows });
    } catch (error) {
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
  
      // Create the supplier object to return in the response
      const newCustomer = {
        customer_id: insertCustomerResult.rows[0].supplier_id,
        customer_name,
        customer_email,
        created_at: new Date().toLocaleDateString("en-GB"), // Format: DD/MM/YYYY
      };
  
      // Respond with the created supplier details
      return res.status(201).json({
        message: "Customer created successfully",
        supplier: newCustomer,
      });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  };
  export {getCustWithoutPagination, createCustomer}