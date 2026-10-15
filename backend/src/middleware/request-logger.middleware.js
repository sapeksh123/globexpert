const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
	const startedAt = process.hrtime.bigint();
	let completed = false;

	res.on("finish", () => {
		completed = true;
		const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
		logger.info(
			`${req.requestId} ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(1)}ms`,
		);
	});

	res.on("close", () => {
		if (completed) return;
		const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
		logger.warn(
			`${req.requestId} ${req.method} ${req.originalUrl} aborted ${durationMs.toFixed(1)}ms`,
		);
	});

	next();
};

module.exports = requestLogger;
