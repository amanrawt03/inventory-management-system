import pool from "../config/pgConfig.js";
import {
  GET_ALL_ITEMS,
  GET_TOTAL_QUANTITY_OFITEM,
} from "../queries/inventoryQueries.js";
import client from "../config/redisConfig.js";
import { publishNotification } from "../utils/publishNotification.js";
const getStockInfo = async (req, res) => {
  try {
    const { product_id } = req.query;
    if (!product_id) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    res.writeHead(200, {
      "Access-Control-Allow-Origin": "http://localhost:5173",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      "Content-Encoding": "none",
    });
    res.flushHeaders();

    // Initial quantity fetch
    const totalResult = await pool.query(GET_TOTAL_QUANTITY_OFITEM, [
      product_id,
    ]);
    const totalAvailable = totalResult.rows[0]?.totalquantity || 0;
    res.write(`data: ${JSON.stringify({ totalAvailable })}\n\n`);

    // Set up notification listener
    const client = await pool.connect();
    await client.query("LISTEN inventory_change");

    // Handle notifications
    client.on("notification", async (msg) => {
      const payload = JSON.parse(msg.payload);

      // Only send update if it's for the requested product
      if (payload.product_id === parseInt(product_id)) {
        res.write(
          `data: ${JSON.stringify({
            totalAvailable: payload.totalAvailable,
          })}\n\n`
        );
      }
    });

    // Handle client disconnect
    req.on("close", () => {
      client.query("UNLISTEN inventory_change");
      client.release();
    });
  } catch (error) {
    console.error("Error fetching stock info:", error.message);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
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
      stockValue: avgCostPrice * totalAvailable,
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
    let products;
    if (client.isOpen) {
      products = await client.get("getProducts");
    }
    if (products) {
      // console.log('cache hit')
      products = JSON.parse(products);
      return res.status(200).json({ items: products });
    }
    console.log("cache miss");
    const result = await pool.query(`SELECT * FROM products`);
    if (result.rowCount === 0)
      return res.status(400).json({ message: "No products found" });
    await client.setEx("getProducts", 60, JSON.stringify(result.rows));
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
    const itemResult = await pool.query(
      `INSERT INTO products (category_id, product_name) VALUES ($1,$2) RETURNING *`,
      [category_id, product_name]
    );

    // update notification table
    await client.del("getProducts");
    const successMessage = `New product, ${product_name} added`;
    const notifyResult = await pool.query(
      `INSERT INTO notifications (type, message) VALUES ($1, $2) RETURNING notification_id`,
      ["Entity Addition", successMessage]
    );
    const notification_id = notifyResult.rows[0].notification_id;
    await pool.query(
      `INSERT INTO users_notifications (user_id, notification_id) VALUES 
       (1, $1), (2, $1)`,
      [notification_id]
    );
    const transactionNotification = {
      notification_id,
      type: "Entity Addition",
      is_read: false,
      message: successMessage,
      timestamp: new Date().toISOString(),
    };
    await publishNotification("notifications_channel", transactionNotification);
    return res.status(200).json({ message: "Successfully added product", item: itemResult.rows[0]});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllProductsSummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.product_name, 
        pi.product_id,
        COALESCE(SUM(pi.cost_price * pi.quantity) / NULLIF(SUM(pi.quantity), 0), 0) AS weighted_average_cp,
        (SELECT SUM(ii.quantity) 
         FROM inventory_items ii 
         WHERE ii.product_id = pi.product_id) AS total_quantity
      FROM purchased_items pi
      JOIN products p ON pi.product_id = p.product_id
      GROUP BY pi.product_id, p.product_name
    `);

    const productsSummary = result.rows.map((row) => ({
      productName: row.product_name,
      avgCostPrice: Math.floor(row.weighted_average_cp || 0),
      totalQuantity: row.total_quantity || 0,
    }));

    return res.json(productsSummary);
  } catch (error) {
    console.error("Error fetching products summary:", error);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

export {
  getCostPrice,
  getAllItems,
  getItemsWithoutPagination,
  createItem,
  getStockInfo,
  getAllProductsSummary,
};
