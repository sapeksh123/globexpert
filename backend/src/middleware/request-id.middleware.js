const { randomUUID } = require("crypto");

const requestId = (req, res, next) => {
	const suppliedId = req.get("X-Request-Id")?.trim();
	const hasUnsafeCharacters = suppliedId && /[\r\n]/.test(suppliedId);
	const id = suppliedId && suppliedId.length <= 128 && !hasUnsafeCharacters
		? suppliedId
		: randomUUID();

	req.requestId = id;
	res.set("X-Request-Id", id);
	next();
};

module.exports = requestId;
