const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		seller: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
			minlength: 2,
			maxlength: 120,
		},
		description: {
			type: String,
			trim: true,
			maxlength: 2000,
			default: "",
		},
		category: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		stock: {
			type: Number,
			default: 0,
			min: 0,
		},
		imageUrl: {
			type: String,
			default: "",
		},
		isActive: {
			type: Boolean,
			default: true,
			index: true,
		},
	},
	{
		timestamps: true,
	}
);

productSchema.index({ title: "text", description: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);
