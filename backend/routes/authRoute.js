import e from "express";
const  router = e.Router()
import {login} from '../controllers/authController.js'
router.post('/login', login)

export default router