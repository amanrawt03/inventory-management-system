import e from "express";
const router = e.Router();
import { login, signup, requestPasswordReset, resetPassword, updateProfile, getProfile, uploadProfileImage } from '../controllers/authController.js';
import authenticateToken from '../middlewares/authMiddleware.js';
import upload from "../middlewares/multerMiddleware.js";

router.get('/getProfile', authenticateToken, getProfile);
router.put('/update', authenticateToken, upload.single('file'), updateProfile); // Ensure 'file' matches the field name in your form

router.post('/login', login);
router.post('/signup', signup);
router.post('/request', requestPasswordReset);
router.post('/reset', resetPassword);
router.post('/upload-profile-image', upload.single('profileImage'), uploadProfileImage);

export default router;