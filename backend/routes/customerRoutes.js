import e from "express";
const router = e.Router();
import {getCustWithoutPagination, createCustomer} from '../controllers/customerController.js'
router.get('/', getCustWithoutPagination)
router.post('/', createCustomer)

export default router