import express from 'express';
import {
  login,
  register,
  updateProfile,
  logout,
  toggleSaveJob,
  getSavedJobs,
  sendTestNotificationEmail,
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback,
  getOAuthStatus,
  demoOAuthLogin,
  getMe,
} from '../controller/usercontroller.js'
import isauthenticate from '../middleware/isAuthenticate.js';
import { singleUpload } from '../middleware/multer.js';
const router = express.Router();

router.post("/register", singleUpload, register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isauthenticate, getMe);

// OAuth 2.0 endpoints
router.get("/auth/status", getOAuthStatus);
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleCallback);
router.get("/auth/github", githubAuth);
router.get("/auth/github/callback", githubCallback);
router.post("/auth/demo-login", demoOAuthLogin);

router.post("/profile/update", singleUpload, isauthenticate, updateProfile);
router.post("/saved-jobs/:jobId", isauthenticate, toggleSaveJob);
router.get("/saved-jobs", isauthenticate, getSavedJobs);
router.post("/send-test-email", isauthenticate, sendTestNotificationEmail);

export default router;

