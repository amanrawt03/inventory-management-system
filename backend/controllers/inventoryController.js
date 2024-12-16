import pool from "../config/pgConfig.js";
import {
  GET_ALL_LOCATIONS,
  IS_EXISTING_LOCATION,
  ADD_NEW_LOCATION,

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

const getLocWithoutPagination = async(req,res)=>{
  try { 
    const result = await pool.query('SELECT * FROM locations')
    if(result.rowCount === 0)return res.status(400).json({message:"No locatons found"})
    return res.status(200).json({locations:result.rows})
  } catch (error) {
    return res.status(500).json({message:"Internal Server Error", error: error.message })
  }
}

export {
  getAllLocations,
  addNewLocation,
  getLocWithoutPagination
};
