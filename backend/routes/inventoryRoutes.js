import e from "express";
const router = e.Router();
import {
  getAllLocations,
  getAllSuppliers,
  getInventoryDetails,
  getItemsByCategoryInInventory,
  addNewLocation,
  addNewItemToInventory,
  increaseItemQuantity,
  createProductCategory,
  getAllCategories,
  getAllItems,
  createSupplier,
  sellItems,
  getTransactionList
} from "../controllers/inventoryController.js";

// Get requests
router.get("/", getAllLocations);
router.get("/transactions/all", getTransactionList);
router.get("/suppliers/all", getAllSuppliers);
router.get("/category/all", getAllCategories);
router.get("/items/all", getAllItems);
router.get("/:id", getInventoryDetails);
router.get(
  "/items/:location_name/:category_name",
  getItemsByCategoryInInventory
);

// Post requests
router.post("/addToExistingItem", increaseItemQuantity);
router.post("/createLocation", addNewLocation);
router.post("/createItem", addNewItemToInventory);
router.post("/createCategory", createProductCategory);
router.post("/createSupplier", createSupplier);
router.post("/sellItems", sellItems);



export default router;
