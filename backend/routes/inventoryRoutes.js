import e from "express";
const router = e.Router();
import {
  getAllLocations,
  addNewLocation,
  getLocWithoutPagination
} from "../controllers/inventoryController.js";

// Get requests
router.get("/paginate", getAllLocations);
router.get('/', getLocWithoutPagination)
router.post("/", addNewLocation);


export default router;
