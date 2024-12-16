import pool from "../config/pgConfig.js";
import {
  GET_ALL_CATEGORIES,
  CHECK_CATEGORY_EXISTS,
  INSERT_NEW_CATEGORY,
} from "../queries/categoryQueries.js";

const getAllCategories = async (req, res) => {
  const { page = 1, limit = 9, searchTerm = '', sort = '' } = req.query;

  const offset = (page - 1) * limit;

  try {
    // Build the WHERE clause for search
    const searchFilter = searchTerm
      ? `WHERE LOWER(category_name) LIKE $3`
      : '';

    // Determine the ORDER BY clause for sorting
    const sortOrder = sort === 'asc' ? 'ASC' : 'DESC';

    // Query to fetch filtered and sorted categories
    const query = `
      SELECT *
      FROM product_categories
      ${searchFilter}
      ORDER BY category_name ${sortOrder}
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
      FROM product_categories 
      ${searchFilter}
    `;
    const countParams = searchTerm ? [`%${searchTerm.toLowerCase()}%`] : [];
    const totalItemsResult = await pool.query(countQuery, countParams);
    const totalItems = parseInt(totalItemsResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No categories found' });
    }

    return res.status(200).json({
      categories: result.rows,
      totalPages,
      currentPage: parseInt(page, 10),
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
    return res.status(200).json({ categories: result.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { getAllCategories, createProductCategory, getCatWithoutPagination };
