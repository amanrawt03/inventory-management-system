import e from "express";
const router = e.Router();
import {
    getAllCategories,
    createProductCategory,
    getCatWithoutPagination,
} from '../controllers/categoryController.js'

router.get("/paginate", getAllCategories);
router.post("/", createProductCategory);
router.get('/', getCatWithoutPagination)

export default router