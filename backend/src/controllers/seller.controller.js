const Seller = require("../models/Seller");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { sendSuccess } = require("../utils/response");

const createSellerRequest = async (req, res, next) => {
	try {
		if (!req.body.businessName || req.body.businessName.trim().length < 2) {
			return res.status(400).json({
				success: false,
				message: "businessName is required and must be at least 2 characters",
			});
		}

		const existing = await Seller.findOne({ user: req.user._id });
		if (existing) {
			return res.status(409).json({ success: false, message: "Seller profile already exists" });
		}

		const seller = await Seller.create({
			user: req.user._id,
			businessName: req.body.businessName,
			businessDescription: req.body.businessDescription || "",
		});

		return sendSuccess(res, 201, "Seller request created", seller);
	} catch (error) {
		next(error);
	}
};

const listSellers = async (req, res, next) => {
	try {
		const filter = {};
		if (req.query.status) {
			filter.status = req.query.status;
		}

		const sellers = await Seller.find(filter)
			.sort({ createdAt: -1 })
			.populate("user", "name email role isActive");

		return sendSuccess(res, 200, "Sellers fetched", sellers);
	} catch (error) {
		next(error);
	}
};

const getMySellerProfile = async (req, res, next) => {
	try {
		const seller = await Seller.findOne({ user: req.user._id }).populate("user", "name email role");
		if (!seller) {
			return res.status(404).json({ success: false, message: "Seller profile not found" });
		}

		return sendSuccess(res, 200, "Seller profile fetched", seller);
	} catch (error) {
		next(error);
	}
};

const updateSellerStatus = async (req, res, next) => {
	try {
		const status = req.body.status;
		if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
			return res.status(400).json({
				success: false,
				message: "Invalid status. Allowed: PENDING, APPROVED, REJECTED",
			});
		}

		const seller = await Seller.findByIdAndUpdate(
			req.params.id,
			{ status },
			{ new: true }
		).populate("user", "name email role");

		if (!seller) {
			return res.status(404).json({ success: false, message: "Seller not found" });
		}

		if (status === "APPROVED") {
			await User.findByIdAndUpdate(seller.user._id, { role: "SELLER" });
		}

		if (status === "REJECTED") {
			await User.findByIdAndUpdate(seller.user._id, { role: "USER" });
		}

		return sendSuccess(res, 200, "Seller status updated", seller);
	} catch (error) {
		next(error);
	}
};

const createSellerByAdmin = async (req, res, next) => {
	try {
		const name = String(req.body.name || "").trim();
		const email = String(req.body.email || "").toLowerCase().trim();
		const password = String(req.body.password || "");
		const businessName = String(req.body.businessName || "").trim();

		if (name.length < 2) {
			return res.status(400).json({ success: false, message: "Name must be at least 2 characters" });
		}

		if (!/\S+@\S+\.\S+/.test(email)) {
			return res.status(400).json({ success: false, message: "Valid email is required" });
		}

		if (password.length < 6) {
			return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
		}

		if (businessName.length < 2) {
			return res.status(400).json({ success: false, message: "businessName is required and must be at least 2 characters" });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ success: false, message: "Email already registered" });
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			email,
			password: passwordHash,
			phone: req.body.phone || "",
			address: req.body.address || "",
			role: "SELLER",
			isActive: true,
		});

		const seller = await Seller.create({
			user: user._id,
			businessName,
			businessDescription: req.body.businessDescription || "",
			status: "APPROVED",
		});

		const populated = await Seller.findById(seller._id).populate("user", "name email role isActive");

		return sendSuccess(res, 201, "Seller created", populated);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createSellerRequest,
	listSellers,
	getMySellerProfile,
	updateSellerStatus,
	createSellerByAdmin,
};
