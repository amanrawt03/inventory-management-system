import pool from "../config/pgConfig.js";
import {
  CHECK_CATEGORY_EXISTS,
  INSERT_NEW_CATEGORY,
} from "../queries/categoryQueries.js";

import client from "../config/redisConfig.js";

const getAllCategories = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, sortOrder = "ASC" } = req.query;

    // Create a cache key based on query parameters
    const cacheKey = `categories:${search}:${page}:${limit}:${sortOrder}`;

    // Check if the data is available in Redis cache
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      // console.log("Cache hit");
      return res.status(200).json(JSON.parse(cachedData));
    }

    // console.log("Cache miss");

    // Construct the base query
    const baseQuery = `
      SELECT * FROM product_categories 
      WHERE LOWER(category_name) LIKE LOWER($1)
      ORDER BY category_name ${sortOrder}
    `;

    // Count query for pagination
    const countQuery = `
      SELECT COUNT(*) FROM product_categories 
      WHERE LOWER(category_name) LIKE LOWER($1)
    `;

    // Search parameter with wildcards
    const searchParam = `%${search}%`;

    // Get total count
    const countResult = await pool.query(countQuery, [searchParam]);
    const totalCategories = parseInt(countResult.rows[0].count);

    // Calculate pagination
    const totalPages = Math.ceil(totalCategories / limit);
    const offset = (page - 1) * limit;

    // Get paginated results
    const result = await pool.query(`${baseQuery} LIMIT $2 OFFSET $3`, [
      searchParam,
      limit,
      offset,
    ]);

    const responseData = {
      categories: result.rows,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCategories: totalCategories,
        itemsPerPage: limit,
      },
    };

    await client.setEx(cacheKey, 10 ,JSON.stringify(responseData));

    return res.status(200).json(responseData);
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

    await client.del('getCategories')
    
    const successMessage = `New category, ${category_name} added`;
    const notifyResult = await pool.query(
      `INSERT INTO notifications (type, message) VALUES ($1, $2) RETURNING notification_id`,
      ["Entity Addition", successMessage]
    );
    const notification_id = notifyResult.rows[0].notification_id
    const transactionNotification = {
      notification_id,
      type: "Entity Addition",
      is_read:false,
      message: successMessage,
      timestamp: new Date().toISOString(),
    };
    await publishNotification("notifications_channel", transactionNotification);	
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

const getCatWithoutPagination = async (req, res) => {
  try {
    let categories;
    if (client.isOpen) {
      categories = await client.get('getCategories');
    }
    if (categories) {
      // console.log("cat cache hit");
      categories = JSON.parse(categories)
    } else {
      // console.log("cat cache miss");
      const result = await pool.query(`SELECT * FROM product_categories`);
      if (result.rowCount === 0)
        return res.status(400).json({ message: "No categories found" });
      categories = result.rows
      if(client.isOpen){
        await client.setEx('getCategories', 10, JSON.stringify(categories))
      }
    }
    return res.status(200).json({ categories: categories });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { getAllCategories, createProductCategory, getCatWithoutPagination };
