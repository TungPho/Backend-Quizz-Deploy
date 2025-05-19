const express = require("express");
const NotificationController = require("../../controllers/notification.controller");
const notificationRoute = express.Router();
notificationRoute.get(
  "/notification/:userId",
  NotificationController.getNotificationForUserId
);
notificationRoute.post(
  "/notification",
  NotificationController.createNotification
);
notificationRoute.patch(
  "/notification/:notificationId",
  NotificationController.updateStateNotification
);
module.exports = notificationRoute;
