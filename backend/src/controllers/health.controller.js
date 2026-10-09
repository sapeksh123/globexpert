const mongoose = require("mongoose");
const { sendSuccess } = require("../utils/response");
const { version } = require("../../package.json");
const startedAt = new Date(Date.now() - process.uptime() * 1000).toISOString();

const setHealthHeaders = (res) => {
	res.set("Cache-Control", "no-store");
	res.set("Pragma", "no-cache");
};

const getMemoryUsage = () => {
	const memory = process.memoryUsage();
	return {
		heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
		heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
		rssMb: Math.round(memory.rss / 1024 / 1024),
	};
};

const check = (req, res, next) => {
	try {
		setHealthHeaders(res);
		const dbConnected = mongoose.connection.readyState === 1;
		const timestamp = new Date().toISOString();
		const uptime = process.uptime();

		const healthStatus = {
			service: "globexpert-api",
			status: "ok",
			timestamp,
			uptime: Math.round(uptime),
			startedAt,
			memory: getMemoryUsage(),
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
		setHealthHeaders(res);
		const dbConnected = mongoose.connection.readyState === 1;
		const statusCode = dbConnected ? 200 : 503;
		const status = dbConnected ? "ready" : "not_ready";

		return sendSuccess(res, statusCode, "Readiness check completed", {
			service: "globexpert-api",
			status,
			startedAt,
			uptime: Math.round(process.uptime()),
			memory: getMemoryUsage(),
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

const liveness = (_req, res) => {
	setHealthHeaders(res);

	return sendSuccess(res, 200, "Liveness check passed", {
		service: "globexpert-api",
		status: "alive",
		timestamp: new Date().toISOString(),
		startedAt,
		uptime: Math.round(process.uptime()),
		memory: getMemoryUsage(),
		version,
	});
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
	liveness,
};
