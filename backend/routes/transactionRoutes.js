import e from 'express'
import {sellItems , purchaseItems, getSellingTransaction,getPurchaseTransaction, getSellingInsights, getPurchasedInsights} from '../controllers/transactionController.js'
const router = e.Router()

router.post('/sellItems', sellItems)
router.post('/purchaseItems', purchaseItems)

router.get('/sellingTransaction', getSellingTransaction)
router.get('/purchaseTransaction', getPurchaseTransaction)

router.get('/sellingInsights/:sell_transaction_id', getSellingInsights)
router.get('/purchaseInsights/:purchase_transaction_id', getPurchasedInsights)
export default router