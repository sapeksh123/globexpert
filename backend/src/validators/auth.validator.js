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
	if (payload.role && payload.role !== "USER") {
		errors.push("Self registration supports USER role only");
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

const validateProfileUpdatePayload = (payload) => {
	const errors = [];
	const allowed = ["name", "email", "phone", "address"];
	const keys = Object.keys(payload || {});

	if (keys.length === 0) {
		errors.push("At least one field is required to update profile");
		return errors;
	}

	for (const key of keys) {
		if (!allowed.includes(key)) {
			errors.push(`Field ${key} is not allowed`);
		}
	}

	if (payload.name !== undefined && payload.name.trim().length < 2) {
		errors.push("Name must be at least 2 characters");
	}
	if (payload.email !== undefined && !isEmail(payload.email)) {
		errors.push("Valid email is required");
	}

	return errors;
};

module.exports = {
	validateRegisterPayload,
	validateLoginPayload,
	validateProfileUpdatePayload,
};
