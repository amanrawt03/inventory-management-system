import pool from "../config/pgConfig.js";
import {
  GET_ALL_ITEMS,
  GET_TOTAL_QUANTITY_OFITEM,
} from "../queries/inventoryQueries.js";

const getStockInfo = async (req, res) => {
  try {
    const { product_id } = req.query; // Accept product_id as query parameter
    if (!product_id) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const totalResult = await pool.query(GET_TOTAL_QUANTITY_OFITEM, [product_id]);
    const totalAvailable = totalResult.rows[0]?.totalquantity || 0;

    // Stream the totalAvailable quantity to the client
    res.write(`data: ${JSON.stringify({ totalAvailable })}\n\n`);

    // Example: Keep the connection open for further updates if needed
  } catch (error) {
    console.error("Error fetching stock info:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};


const getCostPrice = async (req, res) => {
  try {
    const { product_id } = req.body;
    const result = await pool.query(
      `
        SELECT 
            COALESCE(SUM(cost_price * quantity) / NULLIF(SUM(quantity), 0), 0) AS weighted_average_cp
        FROM purchased_items
        WHERE product_id = $1
      `,
      [product_id]
    );

    const avgCostPrice = Math.floor(result.rows[0]?.weighted_average_cp || 0);

    const totalResult = await pool.query(GET_TOTAL_QUANTITY_OFITEM, [
      product_id,
    ]);
    const totalAvailable = totalResult.rows[0]?.totalquantity || 0;
    return res.json({
      costPrice: avgCostPrice,
      totalAvailable: totalAvailable,
    });
  } catch (error) {
    console.error("Error fetching transaction list:", error);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

const getAllItems = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default page: 1, limit: 10

  // Calculate the offset for pagination
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(GET_ALL_ITEMS, [limit, offset]);

    const totalItemsResult = await pool.query(
      `
        SELECT COUNT(*) FROM products;
        `
    );
    const totalItems = parseInt(totalItemsResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No items found in the database." });
    }

    return res.status(200).json({
      items: result.rows,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching items:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getItemsWithoutPagination = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM products`);
    if (result.rowCount === 0)
      return res.status(400).json({ message: "No products found" });
    return res.status(200).json({ items: result.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createItem = async (req, res) => {
  try {
    const { product_name, category_id } = req.body;
    const catResult = await pool.query(
      `SELECT * FROM product_categories WHERE category_id = $1`,
      [category_id]
    );
    if (catResult.rowCount === 0)
      return res.status(400).json({ message: "No such category exists" });
    await pool.query(
      `INSERT INTO products (category_id, product_name) VALUES ($1,$2)`,
      [category_id, product_name]
    );
    return res.status(200).json({ message: "Successfully added product" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export {
  getCostPrice,
  getAllItems,
  getItemsWithoutPagination,
  createItem,
  getStockInfo,
};
