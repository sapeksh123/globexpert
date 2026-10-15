const format = (level, message) => `[${new Date().toISOString()}] [${level}] ${message}`;

const info = (message) => {
	console.log(format("INFO", message));
};

const warn = (message) => {
	console.warn(format("WARN", message));
};

const debug = (message) => {
	if (process.env.NODE_ENV === "production") return;
	console.debug(format("DEBUG", message));
};

const error = (message, err) => {
	console.error(format("ERROR", message));
	if (err) {
		console.error(err);
	}
};

module.exports = {
	info,
	warn,
	debug,
	error,
};
