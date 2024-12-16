import e from "express";
const router = e.Router();
import { getCostPrice, getAllItems , getItemsWithoutPagination, createItem} from "../controllers/itemsController.js";
router.get("/paginate", getAllItems);
router.get("/", getItemsWithoutPagination);
router.post("/costPrice", getCostPrice);
router.post("/", createItem);

export default router;
