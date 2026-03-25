const logger = require("../utils/logger");

const notFound = (req, _res, next) => {
	const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
	error.statusCode = 404;
	next(error);
};

const errorHandler = (error, _req, res, _next) => {
	const statusCode = error.statusCode || 500;
	const message = error.message || "Something went wrong";

	if (statusCode >= 500) {
		logger.error("Unhandled server error", error);
	}

	res.status(statusCode).json({
		success: false,
		message,
		errors: error.errors || [],
	});
};

module.exports = {
	notFound,
	errorHandler,
};
