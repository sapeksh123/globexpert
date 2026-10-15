const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const logger = require("./src/utils/logger");

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });

  const shutdown = async (signal) => {
    logger.info(`${signal} received, shutting down server`);
    server.close(async () => {
      await mongoose.disconnect();
      logger.info("Server shut down cleanly");
      process.exit(0);
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
};

startServer().catch((error) => {
  logger.error("Failed to start server", error);
  process.exit(1);
});