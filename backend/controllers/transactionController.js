import pool from "../config/pgConfig.js";
const formatPrice = (price) => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} lac`;
  } else {
    return `₹${price.toLocaleString()}`;
  }
};
import {
  GET_TOTAL_QUANTITY_OFITEM,
} from "../queries/inventoryQueries.js";

import { publishNotification } from "../utils/publishNotification.js";
const sellItems = async (req, res) => {
  try {
    const { orders } = req.body;
    if (!orders || orders.length === 0)
      return res.status(400).json({ message: "No orders yet" });

    let totalItemsSold = 0;
    let totalAmount = 0;
    const sellTransactionId = (
      await pool.query(
        `INSERT INTO sell_transactions (customer_id, total_items_sold, total_amount) 
           VALUES ($1, $2, $3) RETURNING sell_transaction_id`,
        [orders[0].customer_id, 0, 0] 
      )
    ).rows[0].sell_transaction_id;

    for (let i = 0; i < orders.length; i++) {
      const { product_id, cost_price, selling_price, quantity } = orders[i];

      // Get category id by product id
      const catResult = await pool.query(
        `SELECT category_id FROM products WHERE product_id = $1`,
        [product_id]
      );
      const category_id = catResult.rows[0].category_id;

      // Get total available quantity for this product
      const totalResult = await pool.query(GET_TOTAL_QUANTITY_OFITEM, [
        product_id,
      ]);
      const totalAvailable = totalResult.rows[0]?.totalquantity || 0;

      if (quantity > totalAvailable)
        return res.status(400).json({
          message: `Quantity exceeds available stock for product_id: ${product_id}.`,
        });

      let remainingQuantity = quantity;

      // Get quantities of this product at different locations
      const result = await pool.query(
        `SELECT inventory_item_id, quantity 
           FROM inventory_items 
           WHERE product_id = $1 
           ORDER BY quantity DESC`,
        [product_id]
      );
      const locations = result.rows;

      for (const location of locations) {
        if (remainingQuantity <= 0) break;

        const deductQuantity = Math.min(remainingQuantity, location.quantity);
        remainingQuantity -= deductQuantity;

        await pool.query(
          `UPDATE inventory_items 
             SET quantity = quantity - $1 
             WHERE inventory_item_id = $2`,
          [deductQuantity, location.inventory_item_id]
        );
      }

      // Add to sold_items table
      await pool.query(
        `INSERT INTO sold_items (sell_transaction_id, product_id, quantity, cost_price, selling_price, category_id) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          sellTransactionId,
          product_id,
          quantity,
          cost_price,
          selling_price,
          category_id,
        ]
      );

      // Check for stock threshold
      const updatedResult = await pool.query(GET_TOTAL_QUANTITY_OFITEM, [
        product_id,
      ]);
      const updatedQuantity = updatedResult.rows[0]?.totalquantity || 0;

      if (updatedQuantity < 15) {
        const product_res = await pool.query(`SELECT product_name FROM products WHERE product_id = $1`,[product_id])
        const product_name = product_res.rows[0].product_name
        
        const message = `Stock for Product ${product_name} is below the minimum threshold (${updatedQuantity} remaining).`;
        const notifyResult = await pool.query(
          `INSERT INTO notifications (type, message) VALUES ($1, $2) RETURNING notification_id`,
          ["Stock Alert", message]
        );
        const notification_id = notifyResult.rows[0].notification_id
        
        // Associate notification with users
        await pool.query(
          `INSERT INTO users_notifications (user_id, notification_id) VALUES 
           (1, $1), (2, $1)`,
          [notification_id]
        );

        const stockAlertNotification = {
          notification_id,
          type: "Stock Alert",
          is_read: false,
          message,
          timestamp: new Date().toISOString(),
        };
        await publishNotification(
          "notifications_channel",
          stockAlertNotification
        );
      }

      // Update totals for sell transaction
      totalItemsSold += quantity;
      totalAmount += selling_price * quantity;
    }

    // Update the sell transaction with final totals
    await pool.query(
      `UPDATE sell_transactions 
         SET total_items_sold = $1, total_amount = $2 
         WHERE sell_transaction_id = $3`,
      [totalItemsSold, totalAmount, sellTransactionId]
    );

    // Publish success notification
    let finalAmount = formatPrice(totalAmount)
    const successMessage = `${totalItemsSold} items for ${finalAmount} sold to ${orders[0].customer_name}`;
    const notifyResult = await pool.query(
      `INSERT INTO notifications (type, message) VALUES ($1, $2) RETURNING notification_id`,
      ["Transaction Update", successMessage]
    );
    const notify_Id = notifyResult.rows[0].notification_id
    
    // Associate success notification with users
    await pool.query(
      `INSERT INTO users_notifications (user_id, notification_id) VALUES 
       (1, $1), (2, $1)`,
      [notify_Id]
    );

    const transactionNotification = {
      notification_id: notify_Id,
      type: "Transaction Update",
      is_read: false,
      message: successMessage,
      timestamp: new Date().toISOString(),
    };
    await publishNotification("notifications_channel", transactionNotification);
    return res.status(200).json({ message: "Transaction Successful" });
  } catch (error) {
    console.error("Error selling items:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};


const purchaseItems = async (req, res) => {
  try {
    const { orders } = req.body;

    if (!orders || orders.length === 0) {
      return res.status(400).json({ message: "No orders found" });
    }

    let totalItemsPurchased = 0;
    let totalCostPrice = 0;

    // Create an entry in the purchase_transactions table
    const purchaseTransactionId = (
      await pool.query(
        `INSERT INTO purchase_transactions (supplier_id, total_items_purchased, total_cost_price) 
         VALUES ($1, $2, $3) RETURNING purchase_transaction_id`,
        [orders[0].supplier_id, 0, 0]
      )
    ).rows[0].purchase_transaction_id;

    for (let i = 0; i < orders.length; i++) {
      const { product_id, cost_price, quantity, location_id } = orders[i];

      // Get category id for the product
      const catResult = await pool.query(
        `SELECT category_id FROM products WHERE product_id = $1`,
        [product_id]
      );
      const category_id = catResult.rows[0].category_id;

      // Update or insert into inventory_items
      const inventoryResult = await pool.query(
        `SELECT inventory_item_id, quantity 
         FROM inventory_items 
         WHERE product_id = $1 AND location_id = $2`,
        [product_id, location_id]
      );

      if (inventoryResult.rows.length > 0) {
        // Update existing inventory item
        const inventoryItem = inventoryResult.rows[0];
        await pool.query(
          `UPDATE inventory_items 
           SET quantity = quantity + $1 
           WHERE inventory_item_id = $2`,
          [quantity, inventoryItem.inventory_item_id]
        );
      } else {
        // Insert new inventory item
        await pool.query(
          `INSERT INTO inventory_items (product_id, location_id, quantity) 
           VALUES ($1, $2, $3)`,
          [product_id, location_id, quantity]
        );
      }

      // Add to purchased_items table
      await pool.query(
        `INSERT INTO purchased_items (purchase_transaction_id, product_id, quantity, cost_price, category_id, location_id) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          purchaseTransactionId,
          product_id,
          quantity,
          cost_price,
          category_id,
          location_id,
        ]
      );

      // Update totals for the purchase transaction
      totalItemsPurchased += quantity;
      totalCostPrice += cost_price * quantity;
    }

    // Update the purchase transaction with final totals
    await pool.query(
      `UPDATE purchase_transactions 
       SET total_items_purchased = $1, total_cost_price = $2 
       WHERE purchase_transaction_id = $3`,
      [totalItemsPurchased, totalCostPrice, purchaseTransactionId]
    );

    let finalAmount = formatPrice(totalCostPrice)
    // update notification table
    const successMessage = `${totalItemsPurchased} items for ${finalAmount} is purchased from ${orders[0].supplier_name}`;
    const notifyResult = await pool.query(
      `INSERT INTO notifications (type, message) VALUES ($1, $2) RETURNING notification_id`,
      ["Transaction Update", successMessage]
    );

    const notify_Id = notifyResult.rows[0].notification_id
    await pool.query(
      `INSERT INTO users_notifications (user_id, notification_id) VALUES 
       (1, $1), (2, $1)`,
      [notify_Id]
    );
    const transactionNotification = {
      notification_id:notify_Id,
      is_read:false,
      type: "Transaction Update",
      message: successMessage,
      timestamp: new Date().toISOString(),
    };
    await publishNotification("notifications_channel", transactionNotification);
    return res.status(200).json({ message: "Purchase transaction successful" });
  } catch (error) {
    console.error("Error processing purchase transaction:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getSellingTransaction = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, sortOrder = "ASC" } = req.query;

    // Construct the base query
    const baseQuery = `
      SELECT 
        st.sell_transaction_id, 
        st.customer_id, 
        st.total_items_sold, 
        st.total_amount, 
        st.transaction_date, 
        c.customer_name 
      FROM 
        sell_transactions st
      JOIN 
        customers c ON st.customer_id = c.customer_id
      WHERE 
        LOWER(c.customer_name) LIKE LOWER($1) OR 
        st.sell_transaction_id::TEXT LIKE $1
      ORDER BY 
        st.transaction_date ${sortOrder}
    `;

    // Count query for pagination
    const countQuery = `
      SELECT COUNT(*) 
      FROM 
        sell_transactions st
      JOIN 
        customers c ON st.customer_id = c.customer_id
      WHERE 
        LOWER(c.customer_name) LIKE LOWER($1) OR 
        st.sell_transaction_id::TEXT LIKE $1
    `;

    // Search parameter with wildcards
    const searchParam = `%${search}%`;

    // Validate page and limit
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({
        error: "Page and limit must be positive integers.",
      });
    }

    // Get total count
    const countResult = await pool.query(countQuery, [searchParam]);
    const totalTransactions = parseInt(countResult.rows[0].count);

    // Calculate pagination
    const totalPages = Math.ceil(totalTransactions / limitNumber);
    const offset = (pageNumber - 1) * limitNumber;

    // Get paginated results
    const result = await pool.query(`${baseQuery} LIMIT $2 OFFSET $3`, [
      searchParam,
      limitNumber,
      offset,
    ]);

    // Handle no results
    if (result.rowCount === 0) {
      return res.status(200).json({
        transactions: [],
        pagination: {
          currentPage: pageNumber,
          totalPages: 0,
          totalTransactions: 0,
          itemsPerPage: limitNumber,
        },
      });
    }

    return res.status(200).json({
      transactions: result.rows,
      pagination: {
        currentPage: pageNumber,
        totalPages: totalPages,
        totalTransactions: totalTransactions,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error processing sell transactions:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

const getPurchaseTransaction = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided
  const offset = (page - 1) * limit; // Calculate the offset for pagination

  try {
    // Fetch total count of transactions for pagination
    const countResult = await pool.query(`
      SELECT COUNT(*) AS total_count 
      FROM purchase_transactions
    `);
    const totalCount = parseInt(countResult.rows[0].total_count, 10);
    const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

    // Fetch transactions with pagination
    const transacResult = await pool.query(
      `
      SELECT 
        pt.purchase_transaction_id, 
        pt.supplier_id, 
        pt.total_items_purchased, 
        pt.total_cost_price, 
        pt.transaction_date, 
        s.supplier_name 
      FROM 
        purchase_transactions pt
      JOIN 
        suppliers s 
      ON 
        pt.supplier_id = s.supplier_id
      ORDER BY 
        pt.transaction_date DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset]
    );

    if (transacResult.rowCount === 0) {
      return res.status(400).json({ message: "No transactions yet." });
    }

    // Return the transactions with supplier names and pagination info
    return res.status(200).json({
      transactions: transacResult.rows,
      totalPages,
      currentPage: parseInt(page, 10),
      totalCount,
    });
  } catch (error) {
    console.error("Error processing purchase transactions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getSellingInsights = async (req, res) => {
  const { sell_transaction_id } = req.params;

  try {
    // Validate sell_transaction_id
    if (!sell_transaction_id) {
      return res
        .status(400)
        .json({ message: "sell_transaction_id is required." });
    }

    // Query to get sold items along with product name and category name
    const query = `
      SELECT 
        si.sold_item_id,
        si.quantity,
        si.cost_price,
        si.selling_price,
        p.product_name,
        pc.category_name
      FROM sold_items si
      JOIN products p ON si.product_id = p.product_id
      JOIN product_categories pc ON si.category_id = pc.category_id
      WHERE si.sell_transaction_id = $1
    `;

    const result = await pool.query(query, [sell_transaction_id]);

    // Check if any items are found
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No items found for this transaction." });
    }

    // Return the insights
    return res.status(200).json({
      transactionId: sell_transaction_id,
      items: result.rows,
    });
  } catch (error) {
    console.error("Error fetching selling insights:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const getPurchasedInsights = async (req, res) => {
  const { purchase_transaction_id } = req.params;

  try {
    // Validate sell_transaction_id
    if (!purchase_transaction_id) {
      return res
        .status(400)
        .json({ message: "purchase_transaction_id is required." });
    }

    // Query to get sold items along with product name and category name
    const query = `
      SELECT 
        pi.purchase_item_id,
        pi.quantity,
        pi.cost_price,
        l.location_name,
        p.product_name,
        pc.category_name
      FROM purchased_items pi
      JOIN products p ON pi.product_id = p.product_id
      JOIN product_categories pc ON pi.category_id = pc.category_id
      JOIN locations l ON pi.location_id = l.location_id
      WHERE pi.purchase_transaction_id = $1
    `;

    const result = await pool.query(query, [purchase_transaction_id]);

    // Check if any items are found
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No items found for this transaction." });
    }

    // Return the insights
    return res.status(200).json({
      transactionId: purchase_transaction_id,
      items: result.rows,
    });
  } catch (error) {
    console.error("Error fetching selling insights:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export {
  sellItems,
  purchaseItems,
  getSellingTransaction,
  getPurchaseTransaction,
  getSellingInsights,
  getPurchasedInsights,
};

