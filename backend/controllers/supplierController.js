import pool from "../config/pgConfig.js";
import { GET_ALL_SUPPLIERS, CHECK_SUPPLIER_EXISTS, INSERT_NEW_SUPPLIER } from "../queries/supplierQueries.js";
const getAllSuppliers = async (req, res) => {
  const { page = 1, limit = 8, searchTerm = '', sort = '' } = req.query;

  const offset = (page - 1) * limit;

  try {
    // Build the WHERE clause for search
    const searchFilter = searchTerm
      ? `WHERE LOWER(supplier_name) LIKE $3`
      : '';

    // Determine the ORDER BY clause for sorting
    const sortOrder = sort === 'asc' ? 'ASC' : 'DESC';

    // Query to fetch filtered and sorted suppliers
    const query = `
      SELECT *
      FROM suppliers
      ${searchFilter}
      ORDER BY supplier_name ${sortOrder}
      LIMIT $1 OFFSET $2
    `;

    // Prepare query parameters
    const queryParams = searchTerm
      ? [limit, offset, `%${searchTerm.toLowerCase()}%`]
      : [limit, offset];

    // Execute the query
    const result = await pool.query(query, queryParams);

    // Query to get the total count (with filter)
    const countQuery = `
      SELECT COUNT(*) 
      FROM suppliers 
      ${searchFilter}
    `;
    const countParams = searchTerm ? [`%${searchTerm.toLowerCase()}%`] : [];
    const totalItemsResult = await pool.query(countQuery, countParams);
    const totalItems = parseInt(totalItemsResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No suppliers found' });
    }

    return res.status(200).json({
      suppliers: result.rows,
      totalPages,
      currentPage: parseInt(page, 10),
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
