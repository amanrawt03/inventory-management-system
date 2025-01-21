import e from "express";
const router = e.Router();
import { getCostPrice, getAllItems , getItemsWithoutPagination, createItem, getStockInfo, getAllProductsSummary} from "../controllers/itemsController.js";

router.get("/getStockInfo", getStockInfo);
router.get("/paginate", getAllItems);
router.get("/", getItemsWithoutPagination);
router.get("/product-summary", getAllProductsSummary);
router.post("/costPrice", getCostPrice);
router.post("/", createItem);

export default router;
