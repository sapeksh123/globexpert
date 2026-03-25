const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
			index: true,
		},
		businessName: {
			type: String,
			required: true,
			trim: true,
			minlength: 2,
			maxlength: 120,
		},
		businessDescription: {
			type: String,
			trim: true,
			default: "",
			maxlength: 1200,
		},
		status: {
			type: String,
			enum: ["PENDING", "APPROVED", "REJECTED"],
			default: "PENDING",
			index: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Seller", sellerSchema);
