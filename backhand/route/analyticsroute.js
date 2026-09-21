import express from "express";
import isauthenticate from "../middleware/isAuthenticate.js";
import { getDashboardStats } from "../controller/analyticscontroller.js";

const router = express.Router();

router.get("/dashboard", isauthenticate, getDashboardStats);

export default router;
