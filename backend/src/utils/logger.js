const format = (level, message) => `[${new Date().toISOString()}] [${level}] ${message}`;

const info = (message) => {
	console.log(format("INFO", message));
};

const error = (message, err) => {
	console.error(format("ERROR", message));
	if (err) {
		console.error(err);
	}
};

module.exports = {
	info,
	error,
};
