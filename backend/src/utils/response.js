const sendSuccess = (res, statusCode, message, data = null, meta = undefined) => {
	const payload = {
		success: true,
		message,
		data,
	};

	if (meta) {
		payload.meta = meta;
	}

	return res.status(statusCode).json(payload);
};

module.exports = {
	sendSuccess,
};
