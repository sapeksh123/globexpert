const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
	{
		itemType: {
			type: String,
			enum: ["PRODUCT", "SERVICE"],
			required: true,
		},
		item: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			refPath: "items.itemModel",
		},
		itemModel: {
			type: String,
			required: true,
			enum: ["Product", "Service"],
		},
		title: {
			type: String,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
			min: 1,
		},
		unitPrice: {
			type: Number,
			required: true,
			min: 0,
		},
		totalPrice: {
			type: Number,
			required: true,
			min: 0,
		},
	},
	{ _id: false }
);

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		seller: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		items: {
			type: [orderItemSchema],
			validate: {
				validator: (value) => Array.isArray(value) && value.length > 0,
				message: "At least one order item is required",
			},
		},
		subtotal: {
			type: Number,
			required: true,
			min: 0,
		},
		status: {
			type: String,
			enum: ["CONFIRMED", "PROCESSING", "DELIVERED"],
			default: "CONFIRMED",
			index: true,
		},
		deliveryAddress: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},
		notes: {
			type: String,
			trim: true,
			default: "",
			maxlength: 400,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
