const OrderService = require("../services/order.service");
const { sendSuccess } = require("../utils/response");

const createOrder = async (req, res, next) => {
	try {
		const order = await OrderService.createOrder(req.user._id, req.body);
		return sendSuccess(res, 201, "Order created", order);
	} catch (error) {
		next(error);
	}
};

const listOrders = async (req, res, next) => {
	try {
		const result = await OrderService.listOrders(req.user, req.query);
		return sendSuccess(res, 200, "Orders fetched", result.items, result.meta);
	} catch (error) {
		next(error);
	}
};

const getOrderById = async (req, res, next) => {
	try {
		const order = await OrderService.getOrderById(req.params.id, req.user);
		return sendSuccess(res, 200, "Order fetched", order);
	} catch (error) {
		next(error);
	}
};

const updateOrderStatus = async (req, res, next) => {
	try {
		const order = await OrderService.updateOrderStatus(req.params.id, req.user, req.body.status);
		return sendSuccess(res, 200, "Order status updated", order);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createOrder,
	listOrders,
	getOrderById,
	updateOrderStatus,
};
