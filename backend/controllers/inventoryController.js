import pool from "../config/pgConfig.js";
import {
  CHECK_CATEGORY_EXISTS,
  INSERT_NEW_CATEGORY,
  GET_ALL_LOCATIONS,
  GET_LOCATION_DETAILS,
  GET_ALL_CATEGORIES,
  GET_ALL_ITEMS_FROM_CATEGORY,
  IS_EXISTING_LOCATION,
  ADD_NEW_LOCATION,
  GET_LOCATION_ID,
  GET_CATEGORY_ID,
  GET_ITEM_FROM_LOCATION,
  GET_ITEM_QUANTITY,
  UPDATE_ITEM_QUANTITY,
  GET_ALL_SUPPLIERS,
  GET_ALL_ITEMS,
  CHECK_SUPPLIER_EXISTS,
  INSERT_NEW_SUPPLIER,
  GET_SUPPLIER_ID,
  GET_TOTAL_QUANTITY_OFITEM,
} from "../queries/inventoryQueries.js";

const getAllLocations = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default page: 1, limit: 10
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query(GET_ALL_LOCATIONS, [limit, offset]);
    const totalLocationsResult = await pool.query(
      `
        SELECT COUNT(*) FROM locations;
        `
    );
    const totalItems = parseInt(totalLocationsResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);
    if (result.rowCount === 0)
      return res.status(404).json({ message: "No locations yet" });
    const locations = result.rows;
    return res
      .status(200)
      .json({ locations: locations, totalPages, currentPage: page });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};
const getAllSuppliers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query(GET_ALL_SUPPLIERS, [limit, offset]);
    const totalSuppliersResult = await pool.query(
      `
        SELECT COUNT(*) FROM suppliers;
        `
    );
    const totalItems = parseInt(totalSuppliersResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);
    if (result.rowCount === 0)
      return res.status(404).json({ message: "No suppliers yet" });
    const suppliers = result.rows;
    return res
      .status(200)
      .json({ suppliers: suppliers, totalPages, currentPage: page });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const getInventoryDetails = async (req, res) => {
  try {
    const { id } = req.params; // Inventory ID from route params
    const result = await pool.query(GET_LOCATION_DETAILS, [id]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Inventory not found or no products available." });
    }

    const inventoryDetails = result.rows;
    return res.status(200).json({ inventoryDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query(GET_ALL_CATEGORIES, [limit, offset]);
    const totalItemsResult = await pool.query(
      `
      SELECT COUNT(*) FROM product_categories;
      `
    );
    const totalItems = parseInt(totalItemsResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);
    if (result.rowCount === 0)
      return res.status(404).json({ message: "No categories found" });

    return res
      .status(200)
      .json({ categories: result.rows, totalPages, currentPage: page });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const getItemsByCategoryInInventory = async (req, res) => {
  try {
    const { location_name, category_name } = req.params;
    const result = await pool.query(GET_ALL_ITEMS_FROM_CATEGORY, [
      location_name,
      category_name,
    ]);
    if (result.rowCount === 0)
      return res.status(404).json({
        message: "No items found for this category in the specified location",
      });

    return res.status(200).json({ items: result.rows });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const addNewLocation = async (req, res) => {
  try {
    const { location_name } = req.body;

    // Validate input
    if (!location_name) {
      return res.status(400).json({ message: "Location name is required" });
    }

    // Check if the location already exists
    const checkResult = await pool.query(IS_EXISTING_LOCATION, [location_name]);

    if (checkResult.rowCount > 0) {
      return res
        .status(409)
        .json({ message: "Inventory location already exists" });
    }

    // Insert new inventory
    const insertResult = await pool.query(ADD_NEW_LOCATION, [location_name]);

    return res.status(201).json({
      message: "New inventory added successfully",
      location: insertResult.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const addNewItemToInventory = async (req, res) => {
  try {
    const {
      location_name,
      category_name,
      product_name,
      quantity,
      supplier_name,
      cost_price,
    } = req.body;

    // Validate inputs
    if (
      !location_name ||
      !category_name ||
      !product_name ||
      !quantity ||
      !supplier_name ||
      !cost_price
    ) {
      return res.status(400).json({
        message:
          "All fields are required (location, category, product, quantity, supplier, cost price)",
      });
    }

    const quantityNumber = Number(quantity);
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be a positive number" });
    }

    const inventoryResult = await pool.query(GET_LOCATION_ID, [location_name]);
    const inventoryId = inventoryResult.rows[0].location_id;

    const categoryResult = await pool.query(GET_CATEGORY_ID, [category_name]);
    const categoryId = categoryResult.rows[0].category_id;

    const supplierResult = await pool.query(GET_SUPPLIER_ID, [supplier_name]);
    const supplierId = supplierResult.rows[0].supplier_id;

    // Add new product to the `products` table
    const insertProductQuery = `
      INSERT INTO products (category_id, product_name)
      VALUES ($1, $2)
      RETURNING product_id;
    `;
    const insertProductResult = await pool.query(insertProductQuery, [
      categoryId,
      product_name,
    ]);
    const productId = insertProductResult.rows[0].product_id;

    // Add new product to the inventory
    const inventoryItemQuery = `
      INSERT INTO inventory_items (location_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING inventory_item_id;
    `;
    const inventoryItemResult = await pool.query(inventoryItemQuery, [
      inventoryId,
      productId,
      quantityNumber,
    ]);

    // Record the transaction as a 'buy' transaction
    const transactionQuery = `
      INSERT INTO inventory_transactions (quantity, transaction_type, supplier_id,product_id, transaction_date, cost_price)
      VALUES ($1, $2, $3,$4, NOW(), $5)
      RETURNING transaction_id;
    `;
    const transactionResult = await pool.query(transactionQuery, [
      quantityNumber,
      "purchase",
      supplierId,
      productId,
      cost_price,
    ]);

    return res.status(201).json({
      message:
        "New item added to inventory successfully and transaction recorded.",
      inventory_item: inventoryItemResult.rows[0],
      transaction: transactionResult.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const increaseItemQuantity = async (req, res) => {
  try {
    const { location_id, product_id, quantity, cost_price, supplier_id } =
      req.body;

    // Check if the inventory-item combination exists
    const checkItem = await pool.query(GET_ITEM_QUANTITY, [
      location_id,
      product_id,
    ]);

    if (checkItem.rowCount === 0) {
      // If the item does not exist, insert it into the inventory
      await pool.query(
        `INSERT INTO inventory_items (location_id, product_id, quantity) VALUES ($1, $2, $3)`,
        [location_id, product_id, quantity]
      );

      // Log the purchase transaction
      await pool.query(
        `INSERT INTO inventory_transactions 
          (quantity, transaction_type, transaction_date, supplier_id, product_id, cost_price) 
         VALUES ($1, 'purchase', CURRENT_TIMESTAMP, $2, $3, $4)`,
        [quantity, supplier_id, product_id, cost_price]
      );

      return res.status(201).json({
        message:
          "Item added to the inventory and transaction logged successfully",
      });
    }

    // If the item exists, update the quantity
    await pool.query(UPDATE_ITEM_QUANTITY, [quantity, location_id, product_id]);

    // Log the transaction
    await pool.query(
      `INSERT INTO inventory_transactions 
        (quantity, transaction_type, transaction_date, supplier_id, product_id, cost_price) 
       VALUES ($1, 'purchase', CURRENT_TIMESTAMP, $2, $3, $4)`,
      [quantity, supplier_id, product_id, cost_price]
    );

    return res.status(200).json({
      message: "Item quantity increased and transaction logged successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const createProductCategory = async (req, res) => {
  try {
    const { category_name } = req.body;

    // Validate input
    if (!category_name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if the category already exists
    const categoryExistsResult = await pool.query(CHECK_CATEGORY_EXISTS, [
      category_name,
    ]);

    if (categoryExistsResult.rowCount > 0) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    // Insert the new category
    const insertCategoryResult = await pool.query(INSERT_NEW_CATEGORY, [
      category_name,
    ]);

    // Assuming `unique_item_count` starts at 0 for new categories
    const newCategory = {
      category_id: insertCategoryResult.rows[0].category_id,
      category_name,
      unique_item_count: 0, // Or calculate this value from another source
      created_at: new Date().toISOString(), // Assuming you want to add the current date/time
    };

    return res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
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
const createCustomer = async (req, res) => {
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

const getTransactionList = async (req, res) => {
  try {
    // SQL query to fetch transaction details
    const query = `
      SELECT 
        it.transaction_type, 
        TO_CHAR(it.transaction_date, 'DD/MM/YYYY') AS transaction_date, 
        s.supplier_name, 
        it.quantity, 
        p.product_name
      FROM 
        inventory_transactions it
      JOIN 
        suppliers s ON it.customer_id = s.customer_id
      JOIN 
        products p ON it.product_id = p.product_id
      ORDER BY 
        it.transaction_date DESC;
    `;

    // Execute the query
    const result = await pool.query(query);

    // If no transactions are found, return a message
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No transactions found." });
    }

    // Return the list of transactions
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching transaction list:", error);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

const getAverageCostPrice = async (product_id) => {
  const query = `
    SELECT 
        COALESCE(SUM(cost_price * quantity) / NULLIF(SUM(quantity), 0), 0) AS weighted_average_cp
    FROM inventory_transactions
    WHERE product_id = $1 AND transaction_type = 'purchase';
  `;
  const result = await pool.query(query, [product_id]);
  return result.rows[0]?.weighted_average_cp || 0;
};
const getCostPrice = async (req, res) => {
  try {
    const { product_id } = req.body;
    const avgCostPrice = await getAverageCostPrice(product_id);
    const totalResult = await pool.query(GET_TOTAL_QUANTITY_OFITEM, [product_id]);
    const totalAvailable = totalResult.rows[0]?.totalquantity || 0;
    return res.json({ costPrice: avgCostPrice, totalAvailable: totalAvailable });
  } catch (error) {
    console.error("Error fetching transaction list:", error);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

const sellItems = async (req, res) => {
  const { product_id, quantity, selling_price, customer_id } = req.body;

  // Validate input fields
  if (!product_id || !quantity || !customer_id || !selling_price) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const transactionType = "sell";

  try {
    // Begin transaction
    await pool.query("BEGIN");

    // Step 1: Check total available quantity in all locations
    const totalQuery = GET_TOTAL_QUANTITY_OFITEM;
    const totalResult = await pool.query(totalQuery, [product_id]);
      const totalAvailable = totalResult.rows[0]?.totalquantity || 0;

    if (totalAvailable < quantity) {
      await pool.query("ROLLBACK"); // Rollback if insufficient inventory
      return res
        .status(400)
        .json({ error: "Insufficient quantity in inventory." });
    }

    // Step 2: Deduct quantity from inventory
    let remainingQuantity = quantity;
    const selectLocationsQuery = `
        SELECT inventory_item_id, quantity 
        FROM inventory_items 
        WHERE product_id = $1 
        ORDER BY quantity DESC`;
    const locationsResult = await pool.query(selectLocationsQuery, [
      product_id,
    ]);
    const locations = locationsResult.rows;

    for (const location of locations) {
      if (remainingQuantity <= 0) break;

      const deduction = Math.min(remainingQuantity, location.quantity);
      remainingQuantity -= deduction;

      const updateInventoryQuery = `
          UPDATE inventory_items 
          SET quantity = quantity - $1 
          WHERE inventory_item_id = $2`;
      await pool.query(updateInventoryQuery, [
        deduction,
        location.inventory_item_id,
      ]);
    }

    // Step 3: Record transaction
    const averageCostPrice = await getAverageCostPrice(product_id);

    // Step 2: Business logic for selling price decision
    if (selling_price < averageCostPrice) {
      return res.status(400).json({
        error: `Selling price is lower than the average cost price.`,
      });
    }
    const insertTransactionQuery = `
        INSERT INTO inventory_transactions (quantity, transaction_type, customer_id, product_id, transaction_date, selling_price, cost_price) 
        VALUES ($1, $2, $3, $4, NOW(), $5, $6)`;
    await pool.query(insertTransactionQuery, [
      quantity,
      transactionType,
      customer_id,
      product_id,
      selling_price,
      averageCostPrice,
    ]);

    // Commit transaction
    await pool.query("COMMIT");

    // Step 4: Respond with success
    return res
      .status(200)
      .json({ message: "Items sold successfully and inventory updated." });
  } catch (error) {
    console.error("Error selling items:", error);
    await pool.query("ROLLBACK"); // Rollback transaction on error
    return res.status(500).json({ error: "Internal server error." });
  }
};
const getCustomersWithoutPagination = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM customers`);
    if (result.rowCount === 0)
      return res.status(400).json({ message: "No customers found" });
    return res.status(200).json({ customers: result.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getSuppliersWithoutPagination = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM suppliers`);
    if (result.rowCount === 0)
      return res.status(400).json({ message: "No suppliers found" });
    return res.status(200).json({ suppliers: result.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getLocationsWithoutPagination = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM locations`);
    if (result.rowCount === 0)
      return res.status(400).json({ message: "No locations found" });
    return res.status(200).json({ locations: result.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getItemsWithoutPagination = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM products`);
    if (result.rowCount === 0)
      return res.status(400).json({ message: "No products found" });
    return res.status(200).json({ products: result.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getCategoriesWithoutPagination = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM categories`);
    if (result.rowCount === 0)
      return res.status(400).json({ message: "No categories found" });
    return res.status(200).json({ categories: result.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getTotalQuantity = async (req, res) => {
  try {
    const {product_id} = req.params
    const totalResult = await pool.query(GET_TOTAL_QUANTITY_OFITEM, [product_id]);
    const totalAvailable = totalResult.rows[0]?.totalquantity || 0;
    return res.status(200).json({ "totalQuantity": totalAvailable });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export {
  getAllLocations,
  getInventoryDetails,
  getAllCategories,
  getItemsByCategoryInInventory,
  addNewLocation,
  addNewItemToInventory,
  increaseItemQuantity,
  createProductCategory,
  getAllSuppliers,
  getAllItems,
  createSupplier,
  createCustomer,
  sellItems,
  getTransactionList,
  getCostPrice,
  getCustomersWithoutPagination,
  getSuppliersWithoutPagination,
  getLocationsWithoutPagination,
  getItemsWithoutPagination,
  getCategoriesWithoutPagination,
};
