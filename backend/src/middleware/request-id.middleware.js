const { randomUUID } = require("crypto");

const requestId = (req, res, next) => {
	const suppliedId = req.get("X-Request-Id")?.trim();
	const id = suppliedId && suppliedId.length <= 128 ? suppliedId : randomUUID();

	req.requestId = id;
	res.set("X-Request-Id", id);
	next();
};

module.exports = requestId;
