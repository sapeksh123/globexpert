const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, _res, next) => {
	try {
		const authHeader = req.headers.authorization || "";
		const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

		if (!token) {
			const error = new Error("Authentication token is required");
			error.statusCode = 401;
			throw error;
		}

		const payload = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(payload.userId).select("-password");
		if (!user || !user.isActive) {
			const error = new Error("Invalid or inactive user");
			error.statusCode = 401;
			throw error;
		}

		req.user = user;
		next();
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 401;
			error.message = "Unauthorized request";
		}
		next(error);
	}
};

module.exports = { authenticate };
