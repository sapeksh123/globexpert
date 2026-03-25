const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

const validateRegisterPayload = (payload) => {
	const errors = [];

	if (!payload.name || payload.name.trim().length < 2) {
		errors.push("Name must be at least 2 characters");
	}
	if (!payload.email || !isEmail(payload.email)) {
		errors.push("Valid email is required");
	}
	if (!payload.password || payload.password.length < 6) {
		errors.push("Password must be at least 6 characters");
	}
	if (payload.role && !["ADMIN", "SELLER", "USER"].includes(payload.role)) {
		errors.push("Role must be one of ADMIN, SELLER, USER");
	}

	return errors;
};

const validateLoginPayload = (payload) => {
	const errors = [];

	if (!payload.email || !isEmail(payload.email)) {
		errors.push("Valid email is required");
	}
	if (!payload.password) {
		errors.push("Password is required");
	}

	return errors;
};

module.exports = {
	validateRegisterPayload,
	validateLoginPayload,
};
