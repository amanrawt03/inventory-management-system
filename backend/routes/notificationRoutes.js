import e from 'express'
const router=  e.Router()
import {getAllNotifications, getAllUnreadNotifications, markNotificationsAsRead} from '../controllers/notificationController.js'
router.get('/', getAllNotifications)
router.post('/unread', getAllUnreadNotifications)
router.post('/mark-read', markNotificationsAsRead);
export default router