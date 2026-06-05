const mongoose = require("mongoose");
const { sendSuccess } = require("../utils/response");

const check = async (req, res, next) => {
	try {
		const dbConnected = mongoose.connection.readyState === 1;
		const timestamp = new Date().toISOString();
		const uptime = process.uptime();

		const healthStatus = {
			status: "ok",
			timestamp,
			uptime,
			database: {
				connected: dbConnected,
				state: getMongooseState(mongoose.connection.readyState),
			},
		};

		return sendSuccess(res, 200, "Health check passed", healthStatus);
	} catch (error) {
		next(error);
	}
};

const getMongooseState = (state) => {
	const states = {
		0: "disconnected",
		1: "connected",
		2: "connecting",
		3: "disconnecting",
	};
	return states[state] || "unknown";
};

module.exports = {
	check,
};
