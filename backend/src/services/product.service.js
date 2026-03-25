const Product = require("../models/Product");
const Service = require("../models/Service");
const Seller = require("../models/Seller");

const getModelByEntity = (entity) => {
	if (entity === "service") return Service;
	return Product;
};

const ensureApprovedSeller = async (actor) => {
	if (actor.role !== "SELLER") {
		return;
	}

	const sellerProfile = await Seller.findOne({ user: actor._id });
	if (!sellerProfile || sellerProfile.status !== "APPROVED") {
		const error = new Error("Seller profile is not approved");
		error.statusCode = 403;
		throw error;
	}
};

const createEntity = async (entity, payload, actor) => {
	const Model = getModelByEntity(entity);
	await ensureApprovedSeller(actor);
	return Model.create({ ...payload, seller: actor._id });
};

const listEntities = async (entity, query) => {
	const Model = getModelByEntity(entity);
	const page = Math.max(Number(query.page) || 1, 1);
	const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
	const skip = (page - 1) * limit;

	const filter = {};
	if (query.category) {
		filter.category = query.category;
	}
	if (query.search) {
		filter.$text = { $search: query.search };
	}
	if (query.isActive !== undefined) {
		filter.isActive = query.isActive === "true";
	}
	if (query.sellerId) {
		filter.seller = query.sellerId;
	}

	const [items, total] = await Promise.all([
		Model.find(filter)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate("seller", "name email role"),
		Model.countDocuments(filter),
	]);

	return {
		items,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit) || 1,
		},
	};
};

const getEntityById = async (entity, entityId) => {
	const Model = getModelByEntity(entity);
	const item = await Model.findById(entityId).populate("seller", "name email role");
	if (!item) {
		const error = new Error(`${entity} not found`);
		error.statusCode = 404;
		throw error;
	}
	return item;
};

const updateEntity = async (entity, entityId, payload, actor) => {
	const Model = getModelByEntity(entity);
	const existing = await Model.findById(entityId);
	if (!existing) {
		const error = new Error(`${entity} not found`);
		error.statusCode = 404;
		throw error;
	}

	const isOwner = existing.seller.toString() === actor._id.toString();
	if (actor.role !== "ADMIN" && !isOwner) {
		const error = new Error("Only owner seller or admin can update this item");
		error.statusCode = 403;
		throw error;
	}

	Object.assign(existing, payload);
	await existing.save();

	return existing;
};

const deleteEntity = async (entity, entityId, actor) => {
	const Model = getModelByEntity(entity);
	const existing = await Model.findById(entityId);
	if (!existing) {
		const error = new Error(`${entity} not found`);
		error.statusCode = 404;
		throw error;
	}

	const isOwner = existing.seller.toString() === actor._id.toString();
	if (actor.role !== "ADMIN" && !isOwner) {
		const error = new Error("Only owner seller or admin can delete this item");
		error.statusCode = 403;
		throw error;
	}

	await existing.deleteOne();
};

module.exports = {
	createEntity,
	listEntities,
	getEntityById,
	updateEntity,
	deleteEntity,
};
