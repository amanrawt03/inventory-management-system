import e from 'express'
const router=  e.Router()
import {getNetProfit} from '../controllers/graphController.js'
router.get('/netprofit', getNetProfit)
export default router