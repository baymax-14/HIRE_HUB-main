import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    setNotificationLoading: (state, action) => {
      state.loading = action.payload;
    },
    markNotificationRead: (state, action) => {
      const id = action.payload;
      const notification = state.notifications.find((n) => n._id === id);
      if (notification) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },
  },
});

export const {
  setNotifications,
  setUnreadCount,
  setNotificationLoading,
  markNotificationRead,
  markAllNotificationsRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;
