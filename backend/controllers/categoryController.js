import pool from "../config/pgConfig.js";
import {
  CHECK_CATEGORY_EXISTS,
  INSERT_NEW_CATEGORY,
} from "../queries/categoryQueries.js";

const getAllCategories = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10, sortOrder = 'ASC' } = req.query;

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
    const result = await pool.query(
      `${baseQuery} LIMIT $2 OFFSET $3`, 
      [searchParam, limit, offset]
    );

    return res.status(200).json({
      categories: result.rows,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCategories: totalCategories,
        itemsPerPage: limit,
      }
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

const getCatWithoutPagination = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM product_categories`);
    if (result.rowCount === 0)
      return res.status(400).json({ message: "No categories found" });
    return res.status(200).json({ categories: result.rows  });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { getAllCategories, createProductCategory, getCatWithoutPagination };
