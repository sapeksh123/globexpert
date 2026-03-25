const ProductService = require("../services/product.service");
const { sendSuccess } = require("../utils/response");
const { uploadImageBuffer } = require("../utils/cloudinary");
const { validateCatalogPayload } = require("../validators/product.validator");

const ENTITY = "product";

const createProduct = async (req, res, next) => {
	try {
		if (req.body.price !== undefined) {
			req.body.price = Number(req.body.price);
		}
		if (req.body.stock !== undefined) {
			req.body.stock = Number(req.body.stock);
		}

		const errors = validateCatalogPayload(req.body, { requireStock: true });
		if (errors.length > 0) {
			return res.status(400).json({ success: false, message: "Validation failed", errors });
		}

		const payload = { ...req.body };
		if (req.file) {
			const uploaded = await uploadImageBuffer(req.file.buffer, "globexpert/products");
			payload.imageUrl = uploaded.secure_url;
		}

		const product = await ProductService.createEntity(ENTITY, payload, req.user);
		return sendSuccess(res, 201, "Product created", product);
	} catch (error) {
		next(error);
	}
};

const listProducts = async (req, res, next) => {
	try {
		const result = await ProductService.listEntities(ENTITY, req.query);
		return sendSuccess(res, 200, "Products fetched", result.items, result.meta);
	} catch (error) {
		next(error);
	}
};

const getProductById = async (req, res, next) => {
	try {
		const product = await ProductService.getEntityById(ENTITY, req.params.id);
		return sendSuccess(res, 200, "Product fetched", product);
	} catch (error) {
		next(error);
	}
};

const updateProduct = async (req, res, next) => {
	try {
		if (req.body.price !== undefined) {
			req.body.price = Number(req.body.price);
		}
		if (req.body.stock !== undefined) {
			req.body.stock = Number(req.body.stock);
		}

		const errors = validateCatalogPayload(req.body, { requireStock: true, partial: true });
		if (errors.length > 0) {
			return res.status(400).json({ success: false, message: "Validation failed", errors });
		}

		const payload = { ...req.body };
		if (req.file) {
			const uploaded = await uploadImageBuffer(req.file.buffer, "globexpert/products");
			payload.imageUrl = uploaded.secure_url;
		}

		const product = await ProductService.updateEntity(
			ENTITY,
			req.params.id,
			payload,
			req.user
		);

		return sendSuccess(res, 200, "Product updated", product);
	} catch (error) {
		next(error);
	}
};

const deleteProduct = async (req, res, next) => {
	try {
		await ProductService.deleteEntity(ENTITY, req.params.id, req.user);
		return sendSuccess(res, 200, "Product deleted", null);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createProduct,
	listProducts,
	getProductById,
	updateProduct,
	deleteProduct,
};
