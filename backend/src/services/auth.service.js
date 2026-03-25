const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Seller = require("../models/Seller");

const signToken = (user) => {
	const payload = {
		userId: user._id,
		role: user.role,
		email: user.email,
	};

	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN || "7d",
	});
};

const register = async (payload) => {
	if (payload.role && payload.role !== "USER") {
		const error = new Error("Self registration supports USER role only");
		error.statusCode = 403;
		throw error;
	}

	const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
	if (existingUser) {
		const error = new Error("Email already registered");
		error.statusCode = 409;
		throw error;
	}

	const passwordHash = await bcrypt.hash(payload.password, 10);

	const user = await User.create({
		name: payload.name,
		email: payload.email.toLowerCase(),
		password: passwordHash,
		phone: payload.phone || "",
		address: payload.address || "",
		role: "USER",
	});

	const token = signToken(user);
	const safeUser = await User.findById(user._id).select("-password");
	return { user: safeUser, token };
};

const login = async (payload) => {
	const user = await User.findOne({ email: payload.email.toLowerCase() }).select("+password");

	if (!user) {
		const error = new Error("Invalid email or password");
		error.statusCode = 401;
		throw error;
	}

	const isPasswordValid = await bcrypt.compare(payload.password, user.password);
	if (!isPasswordValid) {
		const error = new Error("Invalid email or password");
		error.statusCode = 401;
		throw error;
	}

	if (!user.isActive) {
		const error = new Error("User account is inactive");
		error.statusCode = 403;
		throw error;
	}

	if (user.role === "SELLER") {
		const seller = await Seller.findOne({ user: user._id });
		if (!seller || seller.status !== "APPROVED") {
			const error = new Error("your account is not approved please contact to admin");
			error.statusCode = 403;
			throw error;
		}
	}

	const token = signToken(user);
	const safeUser = await User.findById(user._id).select("-password");

	return { user: safeUser, token };
};

const updateMe = async (userId, payload) => {
	const user = await User.findById(userId);
	if (!user) {
		const error = new Error("User not found");
		error.statusCode = 404;
		throw error;
	}

	if (payload.email !== undefined) {
		const normalizedEmail = payload.email.toLowerCase();
		const existingUser = await User.findOne({
			email: normalizedEmail,
			_id: { $ne: userId },
		});
		if (existingUser) {
			const error = new Error("Email already in use");
			error.statusCode = 409;
			throw error;
		}
		user.email = normalizedEmail;
	}

	if (payload.name !== undefined) {
		user.name = payload.name;
	}
	if (payload.phone !== undefined) {
		user.phone = payload.phone;
	}
	if (payload.address !== undefined) {
		user.address = payload.address;
	}

	await user.save();

	return User.findById(userId).select("-password");
};

module.exports = {
	register,
	login,
	updateMe,
};
