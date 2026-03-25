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
		role: payload.role || "USER",
	});

	if (user.role === "SELLER") {
		await Seller.create({
			user: user._id,
			businessName: payload.businessName || `${user.name}'s Store`,
			businessDescription: payload.businessDescription || "",
		});
	}

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

	const token = signToken(user);
	const safeUser = await User.findById(user._id).select("-password");

	return { user: safeUser, token };
};

module.exports = {
	register,
	login,
};
