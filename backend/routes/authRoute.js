import e from "express";
const router = e.Router();
import {
  login,
  logout,
  loginWithGoogle,
  signup,
  requestPasswordReset,
  resetPassword,
  updateProfile,
  getProfile,
  changePassword
} from "../controllers/authController.js";
import authenticateToken from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerMiddleware.js";

router.get("/getProfile", authenticateToken, getProfile);
router.put(
  "/update",
  authenticateToken,
  upload.single("profileImage"),
  updateProfile
);

router.post("/login", login);
router.post("/logout", logout);
router.post("/loginWithGoogle", loginWithGoogle);
router.post("/signup", signup);
router.post("/request", requestPasswordReset);
router.post("/reset", resetPassword);
router.post("/changePass", changePassword);


export default router;
