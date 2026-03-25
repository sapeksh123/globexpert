const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 2,
			maxlength: 80,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			index: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
			select: false,
		},
		phone: {
			type: String,
			trim: true,
			default: "",
		},
		address: {
			type: String,
			trim: true,
			default: "",
		},
		role: {
			type: String,
			enum: ["ADMIN", "SELLER", "USER"],
			default: "USER",
			index: true,
		},
		isActive: {
			type: Boolean,
			default: true,
			index: true,
		},
	},
	{ timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(plainPassword) {
	return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
