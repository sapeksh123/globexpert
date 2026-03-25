const ProductService = require("../services/product.service");
const { sendSuccess } = require("../utils/response");
const { validateCatalogPayload } = require("../validators/product.validator");

const ENTITY = "product";

const createProduct = async (req, res, next) => {
	try {
		const errors = validateCatalogPayload(req.body, { requireStock: true });
		if (errors.length > 0) {
			return res.status(400).json({ success: false, message: "Validation failed", errors });
		}

		const payload = { ...req.body };
		if (req.file) {
			payload.imageUrl = `/uploads/${req.file.filename}`;
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
		const errors = validateCatalogPayload(req.body, { requireStock: true, partial: true });
		if (errors.length > 0) {
			return res.status(400).json({ success: false, message: "Validation failed", errors });
		}

		const payload = { ...req.body };
		if (req.file) {
			payload.imageUrl = `/uploads/${req.file.filename}`;
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
