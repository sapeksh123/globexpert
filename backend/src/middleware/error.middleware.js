const logger = require("../utils/logger");

const notFound = (req, _res, next) => {
	const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
	error.statusCode = 404;
	next(error);
};

const resolveStatusCode = (error) => {
	if (error.statusCode) return error.statusCode;
	if (error.type === "entity.too.large") return 413;
	if (error.type === "entity.parse.failed") return 400;
	if (error.name === "CastError" || error.name === "ValidationError") return 400;
	if (error.name === "MulterError") return 400;
	if (error.code === 11000) return 409;
	return 500;
};

const errorHandler = (error, req, res, _next) => {
	const statusCode = resolveStatusCode(error);
	const message = error.name === "CastError"
		? "Invalid id"
		: error.type === "entity.too.large"
			? "Request body is too large"
			: error.type === "entity.parse.failed"
				? "Invalid request body"
				: error.message || "Something went wrong";

	if (statusCode >= 500) {
		logger.error("Unhandled server error", error);
	}

	const payload = {
		success: false,
		message,
		errors: error.errors || [],
		requestId: req.requestId,
	};

	if (process.env.NODE_ENV !== "production" && statusCode >= 500) {
		payload.stack = error.stack;
	}

	res.status(statusCode).json(payload);
};

module.exports = {
	notFound,
	errorHandler,
};
