// util/notificationsStore.js
let notifications = [];

// Function to add a notification
const addNotification = (notification) => {
  notifications.push(notification);
};

// Function to get all notifications
const getAllNotifications = () => {
  return notifications;
};

// Export the functions
module.exports = { addNotification, getAllNotifications };
