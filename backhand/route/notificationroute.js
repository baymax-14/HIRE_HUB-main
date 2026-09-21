import express from "express";
import isauthenticate from "../middleware/isAuthenticate.js";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../controller/notificationcontroller.js";

const router = express.Router();

router.get("/", isauthenticate, getNotifications);
router.get("/unread-count", isauthenticate, getUnreadCount);
router.patch("/:id/read", isauthenticate, markAsRead);
router.patch("/read-all", isauthenticate, markAllAsRead);

export default router;
