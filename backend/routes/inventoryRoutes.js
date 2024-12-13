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
  getTransactionList,
  getCostPrice,
  getCustomersWithoutPagination,
  getSuppliersWithoutPagination,
  getLocationsWithoutPagination,
  getItemsWithoutPagination,
  getCategoriesWithoutPagination,
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

// get without paginations 
router.get('/customers/noPagination', getCustomersWithoutPagination)
router.get('/suppliers/noPagination', getSuppliersWithoutPagination)
router.get('/locations/noPagination', getLocationsWithoutPagination)
router.get('/products/noPagination', getItemsWithoutPagination)
router.get('/categories/noPagination', getCategoriesWithoutPagination)

// Post requests
router.post("/price/costPrice", getCostPrice);
router.post("/addToExistingItem", increaseItemQuantity);
router.post("/createLocation", addNewLocation);
router.post("/createItem", addNewItemToInventory);
router.post("/createCategory", createProductCategory);
router.post("/createSupplier", createSupplier);
router.post("/sellItems", sellItems);



export default router;
