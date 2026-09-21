import { Notification } from "../models/notificationmodel.js";

/**
 * GET /api/v1/notifications
 * Fetch paginated notifications for the logged-in user
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("relatedJob", "title company")
      .lean();

    const total = await Notification.countDocuments({ recipient: userId });

    return res.status(200).json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      success: true,
    });
  } catch (error) {
    console.error("getNotifications error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

/**
 * GET /api/v1/notifications/unread-count
 * Returns unread notification count for the logged-in user
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.id;
    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    return res.status(200).json({ count, success: true });
  } catch (error) {
    console.error("getUnreadCount error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

/**
 * PATCH /api/v1/notifications/:id/read
 * Mark a single notification as read
 */
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Notification marked as read",
      notification,
      success: true,
    });
  } catch (error) {
    console.error("markAsRead error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

/**
 * PATCH /api/v1/notifications/read-all
 * Mark all notifications as read for the logged-in user
 */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.id, isRead: false },
      { isRead: true }
    );

    return res.status(200).json({
      message: "All notifications marked as read",
      success: true,
    });
  } catch (error) {
    console.error("markAllAsRead error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

/**
 * Helper: Create a notification (used internally by other controllers)
 */
export const createNotification = async ({ recipient, type, title, message, relatedJob, relatedApplication }) => {
  try {
    await Notification.create({
      recipient,
      type,
      title,
      message,
      relatedJob,
      relatedApplication,
    });
  } catch (error) {
    console.error("createNotification error:", error.message);
  }
};
