const Seller = require("../models/Seller");
const { sendSuccess } = require("../utils/response");

const createSellerRequest = async (req, res, next) => {
	try {
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

		return sendSuccess(res, 200, "Seller status updated", seller);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createSellerRequest,
	listSellers,
	getMySellerProfile,
	updateSellerStatus,
};
