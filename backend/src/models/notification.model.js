const { Schema, model } = require("mongoose");

const COLLECTION_NAME = "Notifications";
const DOCUMENT_NAME = "Notification";

const notificationSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    // notification's belongs to user'id
    userId: {
      type: String,
      required: true,
    },
    typeNotifi: {
      type: String,
      default: "normal",
    },
    action: {
      type: String,
      default: "normal",
    },
    sendTo: {
      type: String,
    },
    isAccepted: {
      type: Boolean,
      default: null,
    },
    expireAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, notificationSchema);
