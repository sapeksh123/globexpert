const dotenv = require("dotenv");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const logger = require("./src/utils/logger");

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  logger.error("Failed to start server", error);
  process.exit(1);
});