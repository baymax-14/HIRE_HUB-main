import express from 'express'
import { login, register, updateProfile, logout, toggleSaveJob, getSavedJobs } from '../controller/usercontroller.js'
import isauthenticate from '../middleware/isAuthenticate.js';
import { singleUpload } from '../middleware/multer.js';
const router = express.Router();

router.post("/register", singleUpload, register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/profile/update", singleUpload, isauthenticate, updateProfile);
router.post("/saved-jobs/:jobId", isauthenticate, toggleSaveJob);
router.get("/saved-jobs", isauthenticate, getSavedJobs);

export default router;

