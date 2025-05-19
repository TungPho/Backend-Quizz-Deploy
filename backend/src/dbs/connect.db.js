const mongoose = require("mongoose");
const DB_CONFIG = {
  MONGO_LOCAL: process.env.CONNECTION_STRING_MONGO,
  MONGO_CLOUD: process.env.CONNECTION_STRING_MONGO_CLOUD,
};

class Database {
  constructor() {
    this.connect();
  }
  connect(type = "MONGO_LOCAL") {
    try {
      const connectString = DB_CONFIG[type];
      const db = mongoose.connect(connectString);
      if (db) console.log("Database connected");
    } catch (error) {
      console.log(error);
    }
  }
  static getDatabase() {
    if (!this.database) {
      this.database = new Database();
    }
    return this.database;
  }
}
const db = Database.getDatabase();
module.exports = db;
