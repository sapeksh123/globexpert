const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
	const startedAt = process.hrtime.bigint();
	let completed = false;

	res.on("finish", () => {
		completed = true;
		const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
		const responseLength = res.getHeader("content-length") || "-";
		logger.info(
			`${req.requestId} ${req.method} ${req.originalUrl} ${res.statusCode} ${responseLength}b ${durationMs.toFixed(1)}ms`,
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
