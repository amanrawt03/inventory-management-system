import e from "express";
import { getSuppWithoutPagination, createSupplier, getAllSuppliers } from "../controllers/supplierController.js";
const router = e.Router();
router.get('/', getSuppWithoutPagination)
router.get('/paginate', getAllSuppliers)
router.post('/', createSupplier)
export default router