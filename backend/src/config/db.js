const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
	const mongoUri = process.env.MONGODB_URI;
	if (!mongoUri) {
		throw new Error("MONGODB_URI is not configured in environment variables");
	}

	mongoose.set("strictQuery", true);
	await mongoose.connect(mongoUri);
	logger.info("MongoDB connected");
};

module.exports = connectDB;
