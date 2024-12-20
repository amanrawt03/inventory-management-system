import pool from "../config/pgConfig.js";
import { GET_ALL_SUPPLIERS, CHECK_SUPPLIER_EXISTS, INSERT_NEW_SUPPLIER } from "../queries/supplierQueries.js";

const getAllSuppliers = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10, sortOrder = 'ASC' } = req.query;

    // Construct the base query
    const baseQuery = `
      SELECT * FROM suppliers 
      WHERE LOWER(supplier_name) LIKE LOWER($1)
      ORDER BY supplier_name ${sortOrder}
    `;

    // Count query for pagination
    const countQuery = `
      SELECT COUNT(*) FROM suppliers
      WHERE LOWER(supplier_name) LIKE LOWER($1)
    `;

    // Search parameter with wildcards
    const searchParam = `%${search}%`;

    // Get total count
    const countResult = await pool.query(countQuery, [searchParam]);
    const totalSuppliers = parseInt(countResult.rows[0].count);

    // Calculate pagination
    const totalPages = Math.ceil(totalSuppliers / limit);
    const offset = (page - 1) * limit;

    // Get paginated results
    const result = await pool.query(
      `${baseQuery} LIMIT $2 OFFSET $3`,
      [searchParam, limit, offset]
    );

    return res.status(200).json({
      suppliers: result.rows,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalSuppliers: totalSuppliers,
        itemsPerPage: limit,
      }
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const getSuppWithoutPagination = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM suppliers`);
    if (result.rowCount === 0)
      return res.status(400).json({ message: "No suppliers found" });
    return res.status(200).json({ suppliers: result.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createSupplier = async (req, res) => {
  try {
    const { supplier_name, contact_email } = req.body;

    // Validate input: Ensure both supplier_name and email are provided
    if (!supplier_name || !contact_email) {
      return res
        .status(400)
        .json({ message: "Supplier name and email are required" });
    }

    // Check if the supplier already exists by email
    const supplierExistsResult = await pool.query(CHECK_SUPPLIER_EXISTS, [
      contact_email,
    ]);

    if (supplierExistsResult.rowCount > 0) {
      return res.status(400).json({
        message: "Supplier with this email already exists",
      });
    }

    // Insert the new supplier into the database
    const insertSupplierResult = await pool.query(INSERT_NEW_SUPPLIER, [
      supplier_name,
      contact_email,
    ]);

    // Create the supplier object to return in the response
    const newSupplier = {
      supplier_id: insertSupplierResult.rows[0].supplier_id,
      supplier_name,
      contact_email,
      transaction_count: 0, // Assuming no transactions initially
      created_at: new Date().toLocaleDateString("en-GB"), // Format: DD/MM/YYYY
    };

    // Respond with the created supplier details
    return res.status(201).json({
      message: "Supplier created successfully",
      supplier: newSupplier,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export { getAllSuppliers, getSuppWithoutPagination, createSupplier };
