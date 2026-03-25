const AuthService = require("../services/auth.service");
const { sendSuccess } = require("../utils/response");
const {
	validateRegisterPayload,
	validateLoginPayload,
	validateProfileUpdatePayload,
} = require("../validators/auth.validator");

const register = async (req, res, next) => {
	try {
		const errors = validateRegisterPayload(req.body);
		if (errors.length > 0) {
			return res.status(400).json({ success: false, message: "Validation failed", errors });
		}

		const result = await AuthService.register(req.body);
		return sendSuccess(res, 201, "User registered", result);
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	try {
		const errors = validateLoginPayload(req.body);
		if (errors.length > 0) {
			return res.status(400).json({ success: false, message: "Validation failed", errors });
		}

		const result = await AuthService.login(req.body);
		return sendSuccess(res, 200, "Login successful", result);
	} catch (error) {
		next(error);
	}
};

const me = async (req, res) => {
	return sendSuccess(res, 200, "Profile fetched", req.user);
};

const updateMe = async (req, res, next) => {
	try {
		const errors = validateProfileUpdatePayload(req.body);
		if (errors.length > 0) {
			return res.status(400).json({ success: false, message: "Validation failed", errors });
		}

		const user = await AuthService.updateMe(req.user._id, req.body);
		return sendSuccess(res, 200, "Profile updated", user);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	register,
	login,
	me,
	updateMe,
};
