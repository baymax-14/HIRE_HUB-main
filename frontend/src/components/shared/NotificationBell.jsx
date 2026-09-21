import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bell, Check, CheckCheck, Briefcase, UserCheck, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import axios from "axios";
import { NOTIFICATION_API_END_POINT } from "@/util/const";
import {
  setNotifications,
  setUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/redux/notificationSlice";

export default function NotificationBell() {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((store) => store.notification);
  const { user } = useSelector((store) => store.auth);
  const [isOpen, setIsOpen] = useState(false);
  const intervalRef = useRef(null);

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(`${NOTIFICATION_API_END_POINT}/unread-count`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUnreadCount(res.data.count));
      }
    } catch (error) {
      // Silent fail
    }
  };

  // Fetch notifications list
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${NOTIFICATION_API_END_POINT}?limit=15`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setNotifications(res.data.notifications));
      }
    } catch (error) {
      console.error("Fetch notifications error:", error);
    }
  };

  // Poll for unread count every 30 seconds
  useEffect(() => {
    if (!user) return;

    fetchUnreadCount();
    intervalRef.current = setInterval(fetchUnreadCount, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user]);

  // Fetch full list when popover opens
  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Mark single as read
  const handleMarkRead = async (id) => {
    try {
      dispatch(markNotificationRead(id));
      await axios.patch(
        `${NOTIFICATION_API_END_POINT}/${id}/read`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Mark read error:", error);
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      dispatch(markAllNotificationsRead());
      await axios.patch(
        `${NOTIFICATION_API_END_POINT}/read-all`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Mark all read error:", error);
    }
  };

  // Icon by notification type
  const getIcon = (type) => {
    switch (type) {
      case "application_received":
        return <UserCheck className="w-4 h-4 text-blue-500" />;
      case "status_update":
        return <Briefcase className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  // Time ago helper
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (!user) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[380px] p-0 mr-4 max-h-[500px] overflow-hidden"
        align="end"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-600" />
            <h3 className="font-semibold text-sm text-gray-800">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-semibold text-purple-700 bg-purple-100 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notification list */}
        <div className="overflow-y-auto max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Bell className="w-10 h-10 mb-3 text-gray-300" />
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs mt-1">We'll notify you when something happens</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif._id}
                onClick={() => !notif.isRead && handleMarkRead(notif._id)}
                className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 transition-colors cursor-pointer ${
                  notif.isRead
                    ? "bg-white hover:bg-gray-50"
                    : "bg-blue-50/50 hover:bg-blue-50"
                }`}
              >
                {/* Icon */}
                <div
                  className={`flex-shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center ${
                    notif.isRead ? "bg-gray-100" : "bg-white shadow-sm"
                  }`}
                >
                  {getIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-snug ${
                      notif.isRead
                        ? "text-gray-600"
                        : "text-gray-800 font-medium"
                    }`}
                  >
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-[10px] text-gray-400">
                      {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Unread dot */}
                {!notif.isRead && (
                  <div className="flex-shrink-0 mt-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
