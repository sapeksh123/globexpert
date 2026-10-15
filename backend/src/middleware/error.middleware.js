const logger = require("../utils/logger");

const notFound = (req, _res, next) => {
	const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
	error.statusCode = 404;
	next(error);
};

const resolveStatusCode = (error) => {
	if (error.statusCode) return error.statusCode;
	if (error.name === "CastError" || error.name === "ValidationError") return 400;
	if (error.name === "MulterError") return 400;
	if (error.code === 11000) return 409;
	return 500;
};

const errorHandler = (error, _req, res, _next) => {
	const statusCode = resolveStatusCode(error);
	const message =
		error.name === "CastError" ? "Invalid id" : error.message || "Something went wrong";

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
