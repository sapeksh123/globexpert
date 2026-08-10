const mongoose = require("mongoose");
const { sendSuccess } = require("../utils/response");
const { version } = require("../../package.json");

const check = (req, res, next) => {
	try {
		const dbConnected = mongoose.connection.readyState === 1;
		const timestamp = new Date().toISOString();
		const uptime = process.uptime();

		const healthStatus = {
			status: "ok",
			timestamp,
			uptime: Math.round(uptime),
			environment: process.env.NODE_ENV || "development",
			version,
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

const readiness = (req, res, next) => {
	try {
		const dbConnected = mongoose.connection.readyState === 1;
		const statusCode = dbConnected ? 200 : 503;
		const status = dbConnected ? "ready" : "not_ready";

		return sendSuccess(res, statusCode, "Readiness check completed", {
			status,
			timestamp: new Date().toISOString(),
			database: {
				connected: dbConnected,
				state: getMongooseState(mongoose.connection.readyState),
			},
		});
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
	readiness,
};
