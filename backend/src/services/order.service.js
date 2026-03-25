const Order = require("../models/Order");
const Product = require("../models/Product");
const Service = require("../models/Service");

const STATUS_FLOW = ["CONFIRMED", "PROCESSING", "DELIVERED"];

const resolveItem = async (itemType, itemId) => {
	if (itemType === "PRODUCT") {
		const product = await Product.findById(itemId);
		if (!product || !product.isActive) {
			const error = new Error("Product not found or inactive");
			error.statusCode = 404;
			throw error;
		}
		return {
			item: product,
			itemModel: "Product",
			itemType: "PRODUCT",
			seller: product.seller,
		};
	}

	if (itemType === "SERVICE") {
		const service = await Service.findById(itemId);
		if (!service || !service.isActive) {
			const error = new Error("Service not found or inactive");
			error.statusCode = 404;
			throw error;
		}
		return {
			item: service,
			itemModel: "Service",
			itemType: "SERVICE",
			seller: service.seller,
		};
	}

	const error = new Error("itemType must be PRODUCT or SERVICE");
	error.statusCode = 400;
	throw error;
};

const createOrder = async (userId, payload) => {
	if (!Array.isArray(payload.items) || payload.items.length === 0) {
		const error = new Error("Order items are required");
		error.statusCode = 400;
		throw error;
	}

	if (!payload.deliveryAddress || payload.deliveryAddress.trim().length < 5) {
		const error = new Error("Valid deliveryAddress is required");
		error.statusCode = 400;
		throw error;
	}

	const orderItems = [];
	let subtotal = 0;
	let sellerId = null;

	for (const row of payload.items) {
		const quantity = Number(row.quantity) || 1;
		if (quantity < 1) {
			const error = new Error("Quantity must be at least 1");
			error.statusCode = 400;
			throw error;
		}

		const resolved = await resolveItem(row.itemType, row.itemId);
		if (!sellerId) {
			sellerId = resolved.seller;
		}

		if (sellerId.toString() !== resolved.seller.toString()) {
			const error = new Error("All order items must belong to the same seller");
			error.statusCode = 400;
			throw error;
		}

		if (resolved.itemType === "PRODUCT" && resolved.item.stock < quantity) {
			const error = new Error(`Insufficient stock for ${resolved.item.title}`);
			error.statusCode = 400;
			throw error;
		}

		const unitPrice = resolved.item.price;
		const totalPrice = unitPrice * quantity;
		subtotal += totalPrice;

		orderItems.push({
			itemType: resolved.itemType,
			item: resolved.item._id,
			itemModel: resolved.itemModel,
			title: resolved.item.title,
			quantity,
			unitPrice,
			totalPrice,
		});

		if (resolved.itemType === "PRODUCT") {
			resolved.item.stock -= quantity;
			await resolved.item.save();
		}
	}

	return Order.create({
		user: userId,
		seller: sellerId,
		items: orderItems,
		subtotal,
		status: "CONFIRMED",
		deliveryAddress: payload.deliveryAddress.trim(),
		notes: payload.notes || "",
	});
};

const listOrders = async (actor, query) => {
	const filter = {};

	if (actor.role === "USER") {
		filter.user = actor._id;
	}
	if (actor.role === "SELLER") {
		filter.seller = actor._id;
	}
	if (query.status) {
		filter.status = query.status;
	}

	const page = Math.max(Number(query.page) || 1, 1);
	const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
	const skip = (page - 1) * limit;

	const [items, total] = await Promise.all([
		Order.find(filter)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate("user", "name email")
			.populate("seller", "name email"),
		Order.countDocuments(filter),
	]);

	return {
		items,
		meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
	};
};

const getOrderById = async (orderId, actor) => {
	const order = await Order.findById(orderId)
		.populate("user", "name email")
		.populate("seller", "name email");

	if (!order) {
		const error = new Error("Order not found");
		error.statusCode = 404;
		throw error;
	}

	const isOwner = order.user._id.toString() === actor._id.toString();
	const isSeller = order.seller._id.toString() === actor._id.toString();
	if (actor.role !== "ADMIN" && !isOwner && !isSeller) {
		const error = new Error("Forbidden");
		error.statusCode = 403;
		throw error;
	}

	return order;
};

const updateOrderStatus = async (orderId, actor, newStatus) => {
	if (!STATUS_FLOW.includes(newStatus)) {
		const error = new Error("Invalid status. Allowed: CONFIRMED, PROCESSING, DELIVERED");
		error.statusCode = 400;
		throw error;
	}

	const order = await Order.findById(orderId);
	if (!order) {
		const error = new Error("Order not found");
		error.statusCode = 404;
		throw error;
	}

	const isSeller = order.seller.toString() === actor._id.toString();
	if (actor.role !== "ADMIN" && !isSeller) {
		const error = new Error("Only seller or admin can update status");
		error.statusCode = 403;
		throw error;
	}

	const currentIndex = STATUS_FLOW.indexOf(order.status);
	const nextIndex = STATUS_FLOW.indexOf(newStatus);
	if (nextIndex < currentIndex) {
		const error = new Error("Order status cannot move backwards");
		error.statusCode = 400;
		throw error;
	}

	order.status = newStatus;
	await order.save();
	return order;
};

module.exports = {
	createOrder,
	listOrders,
	getOrderById,
	updateOrderStatus,
};
